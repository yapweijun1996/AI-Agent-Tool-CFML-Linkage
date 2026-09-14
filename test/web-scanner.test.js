import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { extractFactBundle } from "../src/fact-extractor.js";
import { createParserAdapter } from "../src/parser-adapter.js";
import { createRootGuard } from "../src/root-guard.js";
import { createMixedStructuralScannerBackend, createWebScannerBackend } from "../src/web-scanner.js";
import { createSnapshot } from "../src/snapshot.js";

const fixtureRoot = path.resolve("fixtures", "golden", "web-surface");

function parseSnapshot(snapshot, root = fixtureRoot) {
  const guard = createRootGuard(root);
  const adapter = createParserAdapter({
    parserVersion: "mixed-structural-scanner/v0.1",
    backend: createMixedStructuralScannerBackend(),
  });
  return snapshot.files.map((file) => adapter.parse(
    fs.readFileSync(guard.resolve(file.path, { mustExist: true })),
    file.path,
  ));
}

test("scans inert mixed-language web fixtures without executing source", () => {
  const guard = createRootGuard(fixtureRoot);
  const snapshot = createSnapshot(guard);
  const parsed = parseSnapshot(snapshot);
  assert.equal(parsed.every((item) => item.complete), false);
  assert.deepEqual(parsed.flatMap((item) => item.tree.nodes).filter((node) => node.kind !== "HTML_TAG").map((node) => node.kind), [
    "JS_FETCH",
    "JS_AJAX",
    "JS_FETCH",
    "CSS_REFERENCE",
    "JS_ASSET",
    "HTML_FORM",
    "SQL_QUERY",
    "CSS_REFERENCE",
    "CSS_REFERENCE",
  ]);

  const bundle = extractFactBundle({
    snapshot,
    parsedFiles: parsed,
    parserName: "mixed-structural-scanner",
  });
  const expected = JSON.parse(fs.readFileSync(path.join(fixtureRoot, "expected-web-facts-v0.1.json"), "utf8"));
  assert.equal(bundle.complete, false);
  for (const expectedCase of expected.cases) {
    const actualFacts = bundle.facts
      .filter((fact) => fact.file === expectedCase.input)
      .map((fact) => ({ kind: fact.kind, normalized_expression: fact.normalized_expression }))
      .sort((left, right) => {
        const leftKey = `${left.kind}\0${left.normalized_expression}`;
        const rightKey = `${right.kind}\0${right.normalized_expression}`;
        return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
      });
    assert.deepEqual(actualFacts, expectedCase.expected_facts);
  }
  assert.equal(bundle.facts.some((fact) => fact.normalized_expression === "/ignored-comment"), false);
});

test("extracts bounded CFML redirect and visible query facts", () => {
  const root = path.resolve("web-cfml-fixture");
  fs.mkdirSync(root, { recursive: true });
  const source = Buffer.from('<cflocation url="/orders"><cfquery datasource="main">select * from orders</cfquery>', "utf8");
  fs.writeFileSync(path.join(root, "page.cfm"), source);
  try {
    const guard = createRootGuard(root);
    const snapshot = createSnapshot(guard);
    const adapter = createParserAdapter({
      parserVersion: "mixed-structural-scanner/v0.1",
      backend: createMixedStructuralScannerBackend(),
    });
    const parsed = [adapter.parse(source, "page.cfm")];
    const bundle = extractFactBundle({ snapshot, parsedFiles: parsed, parserName: "mixed-structural-scanner" });
    assert.equal(bundle.complete, false);
    assert.equal(bundle.facts.some((fact) => fact.kind === "REDIRECT" && fact.normalized_expression === "/orders"), true);
    assert.equal(bundle.facts.some((fact) => fact.kind === "QUERY" && fact.normalized_expression === "orders"), true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("retains dynamic web targets and bounds scanner output", () => {
  const root = path.resolve("web-scanner-limit-fixture");
  fs.mkdirSync(root, { recursive: true });
  const source = Buffer.from('fetch(dynamicUrl); fetch("/static");', "utf8");
  fs.writeFileSync(path.join(root, "client.js"), source);
  try {
    const guard = createRootGuard(root);
    const snapshot = createSnapshot(guard);
    const adapter = createParserAdapter({
      parserVersion: "web-structural-scanner/v0.1",
      backend: createWebScannerBackend({ maxNodes: 1 }),
    });
    const parsed = [adapter.parse(source, "client.js")];
    assert.equal(parsed[0].complete, false);
    assert.equal(parsed[0].diagnostics.some((item) => item.code === "RESOURCE_LIMIT"), true);
    const bundle = extractFactBundle({ snapshot, parsedFiles: parsed });
    assert.equal(bundle.complete, false);
    assert.equal(bundle.facts.some((fact) => fact.kind === "DYNAMIC_REFERENCE"), true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
