import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { analyzeProject, serializeAnalysis } from "../src/index.js";
import { createMixedStructuralScannerBackend } from "../src/web-scanner.js";
import { validateGraph } from "../src/graph.js";

const scannerOptions = {
  parserBackend: createMixedStructuralScannerBackend(),
  parserVersion: "mixed-structural-scanner/v0.1",
  parserName: "mixed-structural-scanner",
  createdAt: "2026-09-14T00:00:00.000Z",
};

function analyze(fixture, options = {}) {
  return analyzeProject({
    rootPath: path.resolve("fixtures", fixture),
    ...scannerOptions,
    ...options,
  });
}

test("runs the bounded stages in order and exposes graph evidence", () => {
  const result = analyze("golden/sql-and-repository");
  assert.equal(result.schema_version, "agent-cfml-linkage-analysis/v0.1");
  assert.equal(result.complete, false);
  assert.equal(result.fact_bundle.source_files.length, 3);
  assert.equal(result.graph.stats.file_count, 3);
  assert.equal(result.graph.edges.some((edge) => edge.type === "CALLS_REPOSITORY"), true);
  assert.equal(result.graph.edges.some((edge) => edge.type === "QUERY_READS_TABLE"), true);
  assert.deepEqual(validateGraph(result.graph), []);
  assert.equal(Object.isFrozen(result.reverse_adjacency), true);
});

test("produces repeatable aggregate output and enforces the library serialization budget", () => {
  const first = analyze("golden/web-flow-and-conditions");
  const second = analyze("golden/web-flow-and-conditions");
  assert.deepEqual(first.fact_bundle, second.fact_bundle);
  assert.deepEqual(first.resolutions, second.resolutions);
  assert.deepEqual(first.graph, second.graph);
  assert.deepEqual(first.reverse_adjacency, second.reverse_adjacency);

  const serialized = serializeAnalysis(first);
  assert.equal(serialized.complete, true);
  assert.equal(serialized.json, JSON.stringify(first));
  assert.equal(serialized.bytes, Buffer.byteLength(serialized.json, "utf8"));

  const limited = serializeAnalysis(first, { config: { limits: { max_output_bytes: serialized.bytes - 1 } } });
  assert.equal(limited.complete, false);
  assert.equal(limited.json, null);
  assert.equal(limited.bytes, serialized.bytes);
  assert.equal(limited.diagnostics[0].code, "OUTPUT_LIMIT");
  assert.equal(limited.diagnostics[0].details.max_output_bytes, serialized.bytes - 1);
});

test("enforces the configured library evidence budget deterministically", () => {
  const first = analyze("golden/sql-and-repository", { config: { limits: { max_evidence: 1 } } });
  const second = analyze("golden/sql-and-repository", { config: { limits: { max_evidence: 1 } } });
  assert.equal(first.complete, false);
  assert.equal(first.graph.complete, false);
  assert.equal(first.graph.stats.evidence_count, 1);
  assert.equal(first.graph.diagnostics.some((item) => item.code === "RESOURCE_LIMIT" && item.details?.max_evidence === 1), true);
  assert.equal(first.graph.edges.length > 0, true);
  assert.equal(first.graph.edges.filter((edge) => edge.evidence.length > 0).length, 1);
  assert.equal(validateGraph(first.graph).length, 0);
  assert.deepEqual(first.graph, second.graph);
});

test("enforces the configured library graph-edge budget deterministically", () => {
  const first = analyze("golden/sql-and-repository", { config: { limits: { max_edges: 1 } } });
  const second = analyze("golden/sql-and-repository", { config: { limits: { max_edges: 1 } } });
  assert.equal(first.complete, false);
  assert.equal(first.graph.complete, false);
  assert.equal(first.graph.edges.length, 1);
  assert.equal(first.graph.stats.edge_count, 1);
  assert.equal(first.graph.nodes.length > 0, true);
  assert.equal(first.graph.unresolved.length > 0, true);
  assert.equal(first.graph.diagnostics.some((item) => item.code === "RESOURCE_LIMIT" && item.details?.max_edges === 1), true);
  assert.equal(validateGraph(first.graph).length, 0);
  assert.equal(Object.values(first.reverse_adjacency.outgoing).flat().length, 1);
  assert.deepEqual(first.graph, second.graph);
  assert.deepEqual(first.reverse_adjacency, second.reverse_adjacency);
});

test("forwards configured discovery policies to deterministic snapshot discovery", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agent-cfml-linkage-analyzer-ignore-"));
  try {
    fs.writeFileSync(path.join(root, "ignored.cfm"), "<cfset request.ignored = true>\n", "utf8");
    fs.writeFileSync(path.join(root, ".hidden.cfm"), "<cfset request.hidden = true>\n", "utf8");
    fs.writeFileSync(path.join(root, "kept.cfm"), "<cfset request.kept = true>\n", "utf8");
    const result = analyzeProject({
      rootPath: root,
      ...scannerOptions,
      config: { ignore: { globs: ["ignored.cfm"], hidden_files: "ignore" } },
    });
    assert.deepEqual(result.graph.snapshot.file_count, 1);
    assert.deepEqual(result.fact_bundle.source_files.map((file) => file.file), ["kept.cfm"]);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("keeps the parser boundary fail-closed when no backend is selected", () => {
  const result = analyzeProject({
    rootPath: path.resolve("fixtures/golden/core-cfml-web-surface"),
    createdAt: "2026-09-14T00:00:00.000Z",
  });
  assert.equal(result.complete, false);
  assert.equal(result.fact_bundle.parser.completeness, "unsupported");
  assert.equal(result.fact_bundle.diagnostics.some((item) => item.code === "PARSER_UNAVAILABLE"), true);
  assert.equal(result.graph.nodes.length > 0, true);
});

test("applies the configured language and fact limits without executing source", () => {
  const result = analyze("golden/web-surface", {
    config: { analysis: { languages: ["javascript"] } },
    maxFacts: 1,
  });
  assert.equal(result.graph.snapshot.file_count, 1);
  assert.equal(result.fact_bundle.facts.length, 1);
  assert.equal(result.complete, false);
  assert.equal(result.fact_bundle.diagnostics.some((item) => item.code === "RESOURCE_LIMIT"), true);
  assert.equal(fs.existsSync(path.resolve("fixtures/golden/web-surface/client.js")), true);
});

test("marks a source mutation during parsing incomplete", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agent-cfml-linkage-analyzer-"));
  const sourcePath = path.join(root, "page.cfm");
  fs.writeFileSync(sourcePath, "<cfset request.value = 1>\n", "utf8");
  let changed = false;
  try {
    const result = analyzeProject({
      rootPath: root,
      parserBackend: {
        version: "test-mutating-backend/v0.1",
        parse(text) {
          if (!changed) {
            changed = true;
            fs.writeFileSync(sourcePath, `${text}<cfset request.value = 2>\n`, "utf8");
          }
          return { tree: { kind: "TEST_DOCUMENT", nodes: [] }, complete: true, diagnostics: [] };
        },
      },
      parserVersion: "test-mutating-backend/v0.1",
      parserName: "test-mutating-backend",
      createdAt: "2026-09-14T00:00:00.000Z",
    });
    assert.equal(result.complete, false);
    assert.equal(result.fact_bundle.diagnostics.some((item) => item.code === "SNAPSHOT_DRIFT"), true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
