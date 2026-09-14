import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const cliPath = path.resolve("bin/agent-cfml-linkage.js");

function runCli(args, cwd) {
  const processResult = spawnSync(process.execPath, [cliPath, ...args], {
    cwd,
    encoding: "utf8",
    windowsHide: true,
  });
  assert.equal(processResult.error, undefined, processResult.error?.message);
  return {
    exitCode: processResult.status,
    stdout: JSON.parse(processResult.stdout),
    stderr: processResult.stderr,
  };
}

function temporaryDirectory() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "agent-cfml-linkage-cli-"));
}

function writeConfig(root, overrides = {}) {
  const config = JSON.parse(fs.readFileSync(path.resolve("examples/config-v0.1.json"), "utf8"));
  config.root = ".";
  Object.assign(config, overrides);
  fs.writeFileSync(path.join(root, "config.json"), JSON.stringify(config), "utf8");
}

test("emits a stable JSON capabilities envelope without stderr noise", () => {
  const root = temporaryDirectory();
  try {
    const result = runCli(["capabilities"], root);
    assert.equal(result.exitCode, 0);
    assert.equal(result.stderr, "");
    assert.equal(result.stdout.schema_version, "agent-cfml-linkage-result/v0.1");
    assert.equal(result.stdout.command, "capabilities");
    assert.equal(result.stdout.status, "completed");
    assert.deepEqual(result.stdout.diagnostics, []);
    assert.equal(result.stdout.data.safety.source_execution, false);
    assert.deepEqual(Object.keys(result.stdout), ["schema_version", "tool", "command", "status", "data", "diagnostics"]);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("returns machine-readable invalid-input diagnostics and human stderr diagnostics", () => {
  const root = temporaryDirectory();
  try {
    const result = runCli([], root);
    assert.equal(result.exitCode, 2);
    assert.equal(result.stdout.status, "error");
    assert.equal(result.stdout.diagnostics[0].code, "INVALID_INPUT");
    assert.match(result.stderr, /^ERROR INVALID_INPUT: /u);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("validates the root before returning an incomplete analysis command", () => {
  const root = temporaryDirectory();
  try {
    fs.writeFileSync(path.join(root, "inert.js"), "throw new Error('must not execute');\n", "utf8");
    writeConfig(root);
    const result = runCli(["analyze", "--config", "config.json"], root);
    assert.equal(result.exitCode, 3);
    assert.equal(result.stdout.status, "incomplete");
    assert.equal(result.stdout.diagnostics[0].code, "COMMAND_NOT_IMPLEMENTED");
    assert.match(result.stderr, /^WARNING COMMAND_NOT_IMPLEMENTED: /u);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("maps a rejected analysis root to the configured path-rejected exit code", () => {
  const root = temporaryDirectory();
  try {
    writeConfig(root, { root: "missing-root" });
    const result = runCli(["index", "--config", "config.json"], root);
    assert.equal(result.exitCode, 4);
    assert.equal(result.stdout.status, "error");
    assert.equal(result.stdout.diagnostics[0].code, "ROOT_NOT_FOUND");
    assert.match(result.stderr, /^ERROR ROOT_NOT_FOUND /u);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("rejects malformed JSON and unsafe configuration before analysis", () => {
  const root = temporaryDirectory();
  try {
    fs.writeFileSync(path.join(root, "bad.json"), "{", "utf8");
    let result = runCli(["analyze", "--config", "bad.json"], root);
    assert.equal(result.exitCode, 2);
    assert.equal(result.stdout.diagnostics[0].code, "INVALID_INPUT");

    writeConfig(root, { prohibited_actions: {
      execute_source: true,
      network: false,
      database: false,
      shell: false,
      browser: false,
    } });
    result = runCli(["analyze", "--config", "config.json"], root);
    assert.equal(result.exitCode, 2);
    assert.equal(result.stdout.diagnostics[0].code, "INVALID_CONFIG");
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
