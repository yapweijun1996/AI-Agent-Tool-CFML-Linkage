import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { extractFactBundle } from "../src/fact-extractor.js";
import { createCfmlScannerBackend } from "../src/cfml-scanner.js";
import { createParserAdapter } from "../src/parser-adapter.js";
import { createRootGuard } from "../src/root-guard.js";
import { createSnapshot } from "../src/snapshot.js";

const fixtureRoot = path.resolve("fixtures", "golden");

function parseSnapshot(snapshot, root = fixtureRoot) {
  const guard = createRootGuard(root);
  const adapter = createParserAdapter({
    parserVersion: "cfml-structural-scanner/v0.1",
    backend: createCfmlScannerBackend(),
  });
  return snapshot.files.map((file) => adapter.parse(
    fs.readFileSync(guard.resolve(file.path, { mustExist: true })),

    file.path,
  ));
}

test("extracts deterministic structural Fact IR from inert golden inputs", () => {
  const guard = createRootGuard(fixtureRoot);
  const snapshot = createSnapshot(guard, { ignoreDirectoryNames: [".git", "node_modules", "vendor", "generated", "cache", "secrets", ".agent-cfml-linkage-cache", "web-surface"] });
  const parsed = parseSnapshot(snapshot);
  const first = extractFactBundle({ snapshot, parsedFiles: parsed, parserVersion: "cfml-structural-scanner/v0.1" });
  const second = extractFactBundle({ snapshot, parsedFiles: parseSnapshot(snapshot), parserVersion: "cfml-structural-scanner/v0.1" });
  const expected = JSON.parse(fs.readFileSync(path.resolve("fixtures", "golden", "expected-facts-v0.1.json"), "utf8"));

  assert.equal(first.schema_version, "agent-cfml-linkage-fact/v0.1");
  assert.equal(first.complete, true);
  assert.equal(first.stats.source_file_count, 2);
  assert.equal(first.stats.fact_count, first.facts.length);
  assert.equal(first.stats.diagnostic_count, 0);
  assert.deepEqual(first, second);
  assert.deepEqual(first.source_files.map((file) => file.file), [
    "cfc-inheritance-and-scope/OrderHandler.cfc",
    "core-cfml-web-surface/index.cfm",
  ]);
  for (const expectedCase of expected.cases) {
    const actualFacts = first.facts
      .filter((fact) => fact.file === expectedCase.input)
      .map((fact) => ({ kind: fact.kind, normalized_expression: fact.normalized_expression }))
      .sort((left, right) => {
        const leftKey = `${left.kind}\0${left.normalized_expression}`;
        const rightKey = `${right.kind}\0${right.normalized_expression}`;
        return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
      });
    assert.equal(first.complete, expectedCase.expected_complete);
    assert.deepEqual(actualFacts, expectedCase.expected_facts);
  }
  assert.equal(first.facts.find((fact) => fact.kind === "INCLUDE").attributes.template, "shared/header.cfm");
  assert.equal(first.facts.find((fact) => fact.kind === "INVOKE").normalized_expression, "handlers.OrderHandler.submit");
  assert.deepEqual(first.facts.find((fact) => fact.kind === "COMPONENT").attributes.implements, ["IAudited", "IOrderHandler"]);
  assert.equal(first.facts.find((fact) => fact.kind === "METHOD").enclosing_symbol, "handlers.OrderHandler");
});

test("preserves dynamic references and parser incompleteness without guessing targets", () => {
  const root = path.resolve("dynamic-fixture");
  fs.mkdirSync(root, { recursive: true });
  const guard = createRootGuard(root);
  const source = Buffer.from([
    "<cfinclude template=\"#url.template#\">",
    "<cfscript>throw new Error('opaque');</cfscript>",
  ].join("\n"), "utf8");
  fs.writeFileSync(path.join(root, "page.cfm"), source);
  try {
    const snapshot = createSnapshot(guard);
    const adapter = createParserAdapter({
      parserVersion: "cfml-structural-scanner/v0.1",
      backend: createCfmlScannerBackend(),
    });
    const parsed = [adapter.parse(source, "page.cfm")];
    const bundle = extractFactBundle({ snapshot, parsedFiles: parsed, parserVersion: "cfml-structural-scanner/v0.1" });
    assert.equal(bundle.complete, false);
    assert.equal(bundle.facts.some((fact) => fact.kind === "DYNAMIC_REFERENCE"), true);
    assert.equal(bundle.facts.some((fact) => fact.kind === "INCLUDE"), false);
    assert.equal(bundle.diagnostics.some((item) => item.code === "UNSUPPORTED_SYNTAX"), true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("reports missing parser results and fact limits as incomplete evidence", () => {
  const root = path.resolve("minimal-fact-fixture");
  fs.mkdirSync(root, { recursive: true });
  const guard = createRootGuard(root);
  fs.writeFileSync(path.join(root, "one.cfm"), "<cfset x = 1>\n", "utf8");
  try {
    const snapshot = createSnapshot(guard);
    const missing = extractFactBundle({ snapshot, parsedFiles: [] });
    assert.equal(missing.complete, false);
    assert.equal(missing.diagnostics[0].code, "PARSER_RESULT_MISSING");

    const parsed = parseSnapshot(snapshot, root);
    const limited = extractFactBundle({ snapshot, parsedFiles: parsed, maxFacts: 1 });
    assert.equal(limited.complete, false);
    assert.equal(limited.facts.length, 1);
    assert.equal(limited.diagnostics.some((item) => item.code === "RESOURCE_LIMIT"), true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
