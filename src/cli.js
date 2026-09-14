import fs from "node:fs";
import path from "node:path";

import { analyzeProject } from "./analyzer.js";
import { createMixedStructuralScannerBackend } from "./web-scanner.js";
import { createRootGuard, RootGuardError } from "./root-guard.js";

const TOOL_NAME = "agent-cfml-linkage";
const TOOL_VERSION = "0.1.0";
const ENVELOPE_VERSION = "agent-cfml-linkage-result/v0.1";
const DEFAULT_EXIT_CODES = Object.freeze({
  completed: 0,
  internal_failure: 1,
  invalid_input: 2,
  incomplete: 3,
  path_rejected: 4,
});
const MAX_CONFIG_BYTES = 1024 * 1024;
const MIN_OUTPUT_BYTES = 300;
const QUERY_COMMANDS = Object.freeze(["related", "callers", "callees", "trace", "unresolved", "explain", "stats"]);
const COMMANDS = Object.freeze(["capabilities", "analyze", "index", ...QUERY_COMMANDS]);

function diagnostic(code, severity, message, details = {}) {
  return Object.freeze({ code, severity, message, ...details });
}

function envelope(command, status, diagnostics = [], data = null) {
  return {
    schema_version: ENVELOPE_VERSION,
    tool: { name: TOOL_NAME, version: TOOL_VERSION },
    command,
    status,
    data,
    diagnostics,
  };
}

function usageData() {
  return {
    usage: `${TOOL_NAME} <command> [--config <path>]`,
    commands: COMMANDS,
    implemented_commands: ["capabilities", "analyze", "index"],
    notes: [
      "analyze and index run the bounded, explicit mixed structural scanner pipeline; broader grammar coverage remains incomplete.",
      "Source is never executed; diagnostics are emitted on stderr and in the JSON envelope.",
    ],
  };
}

function parseArguments(argv) {
  let command = null;
  let configPath = null;
  let help = false;
  let version = false;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") {
      help = true;
      continue;
    }
    if (argument === "--version" || argument === "-v") {
      version = true;
      continue;
    }
    if (argument === "--config") {
      if (configPath !== null || index + 1 >= argv.length || argv[index + 1].startsWith("-")) {
        throw diagnostic("INVALID_INPUT", "error", "--config requires exactly one path.");
      }
      configPath = argv[index + 1];
      index += 1;
      continue;
    }
    if (argument.startsWith("-")) {
      throw diagnostic("INVALID_INPUT", "error", `Unknown option: ${argument}`);
    }
    if (command !== null) {
      throw diagnostic("INVALID_INPUT", "error", "Exactly one command is required.");
    }
    command = argument;
  }

  if (help || version) {
    if (command !== null || configPath !== null || (help && version)) {
      throw diagnostic("INVALID_INPUT", "error", "--help/--version cannot be combined with a command or --config.");
    }
    return { command: help ? "help" : "version", configPath: null };
  }
  if (command === null || !COMMANDS.includes(command)) {
    throw diagnostic("INVALID_INPUT", "error", command === null ? "A supported command is required." : `Unknown command: ${command}`);
  }
  if (configPath === null && command !== "capabilities") {
    throw diagnostic("INVALID_INPUT", "error", "--config is required for this command.");
  }
  if (configPath !== null && command === "capabilities") {
    throw diagnostic("INVALID_INPUT", "error", "capabilities does not accept --config.");
  }
  return { command, configPath };
}

function readConfig(configPath, cwd) {
  if (typeof configPath !== "string" || configPath.trim() === "" || configPath.includes("\0")) {
    throw diagnostic("INVALID_INPUT", "error", "Configuration path must be a non-empty path without null bytes.");
  }
  const resolvedPath = path.resolve(cwd, configPath);
  let stat;
  try {
    stat = fs.statSync(resolvedPath);
  } catch (error) {
    throw diagnostic("INVALID_INPUT", "error", `Configuration file cannot be inspected: ${error?.code ?? "unknown"}`, { path: configPath });
  }
  if (!stat.isFile()) {
    throw diagnostic("INVALID_INPUT", "error", "Configuration path is not a regular file.", { path: configPath });
  }
  if (stat.size > MAX_CONFIG_BYTES) {
    throw diagnostic("INVALID_INPUT", "error", `Configuration file exceeds ${MAX_CONFIG_BYTES} bytes.`, { path: configPath });
  }

  let text;
  try {
    text = fs.readFileSync(resolvedPath, "utf8");
  } catch (error) {
    throw diagnostic("INVALID_INPUT", "error", `Configuration file cannot be read: ${error?.code ?? "unknown"}`, { path: configPath });
  }
  try {
    return JSON.parse(text);
  } catch {
    throw diagnostic("INVALID_INPUT", "error", "Configuration must be valid JSON.", { path: configPath });
  }
}

function validateConfig(config) {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    throw diagnostic("INVALID_CONFIG", "error", "Configuration must be a JSON object.");
  }
  if (config.schema_version !== "agent-cfml-linkage-config/v0.1") {
    throw diagnostic("INVALID_CONFIG", "error", "Unsupported or missing configuration schema_version.");
  }
  if (typeof config.root !== "string" || config.root.trim() === "") {
    throw diagnostic("INVALID_CONFIG", "error", "Configuration root must be a non-empty path.");
  }
  const requiredObjects = ["path_policy", "ignore", "analysis", "limits", "output", "prohibited_actions", "exit_codes"];
  for (const key of requiredObjects) {
    if (!config[key] || typeof config[key] !== "object" || Array.isArray(config[key])) {
      throw diagnostic("INVALID_CONFIG", "error", `Configuration object is missing: ${key}.`);
    }
  }
  const prohibited = config.prohibited_actions;
  for (const key of ["execute_source", "network", "database", "shell", "browser"]) {
    if (prohibited[key] !== false) {
      throw diagnostic("INVALID_CONFIG", "error", `prohibited_actions.${key} must be false.`);
    }
  }
  if (config.path_policy.follow_symlinks !== false || config.path_policy.allow_absolute_references !== false || config.path_policy.reject_outside_root !== true) {
    throw diagnostic("INVALID_CONFIG", "error", "Unsafe path policy flags do not satisfy the v0.1 contract.");
  }
  if (config.output.format !== "json" || config.output.diagnostics_stream !== "stderr") {
    throw diagnostic("INVALID_CONFIG", "error", "Output must be JSON with diagnostics on stderr.");
  }
  for (const key of Object.keys(DEFAULT_EXIT_CODES)) {
    if (!Number.isSafeInteger(config.exit_codes[key]) || config.exit_codes[key] < 0) {
      throw diagnostic("INVALID_CONFIG", "error", `exit_codes.${key} must be a non-negative safe integer.`);
    }
  }
  if (!Number.isSafeInteger(config.limits.max_output_bytes) || config.limits.max_output_bytes < MIN_OUTPUT_BYTES) {
    throw diagnostic("INVALID_CONFIG", "error", `limits.max_output_bytes must be at least ${MIN_OUTPUT_BYTES} bytes.`);
  }
  return config;
}

function stderrFor(diagnostics) {
  return diagnostics.map((item) => {
    const location = item.path ? ` [${item.path}]` : "";
    return `${item.severity.toUpperCase()} ${item.code}${location}: ${item.message}\n`;
  }).join("");
}

function result(command, status, diagnostics, data, exitCode, { maxOutputBytes = null, incompleteExitCode = exitCode } = {}) {
  let output = envelope(command, status, diagnostics, data);
  let stdout = `${JSON.stringify(output)}\n`;
  let outputDiagnostics = diagnostics;
  let finalExitCode = exitCode;
  if (maxOutputBytes !== null && Buffer.byteLength(stdout, "utf8") > maxOutputBytes) {
    outputDiagnostics = [diagnostic("OUTPUT_LIMIT", "error", `JSON output exceeded configured maximum of ${maxOutputBytes} bytes.`)];
    output = envelope(command, "incomplete", outputDiagnostics, null);
    stdout = `${JSON.stringify(output)}\n`;
    finalExitCode = incompleteExitCode;
  }
  return { exitCode: finalExitCode, envelope: output, stdout, stderr: stderrFor(outputDiagnostics) };
}

/**
 * Run the stable CLI boundary without invoking any analysis stage.
 *
 * @param {string[]} argv command-line arguments excluding the Node/script prefixes
 * @param {{cwd?: string}} options process-independent test options
 */
export function runCli(argv, { cwd = process.cwd() } = {}) {
  let parsed;
  try {
    parsed = parseArguments(argv);
  } catch (error) {
    const item = error?.code ? error : diagnostic("INVALID_INPUT", "error", "Invalid command-line input.");
    return result("unknown", "error", [item], null, DEFAULT_EXIT_CODES.invalid_input);
  }

  if (parsed.command === "help") {
    return result(parsed.command, "completed", [], usageData(), DEFAULT_EXIT_CODES.completed);
  }
  if (parsed.command === "version") {
    return result(parsed.command, "completed", [], { name: TOOL_NAME, version: TOOL_VERSION }, DEFAULT_EXIT_CODES.completed);
  }
  if (parsed.command === "capabilities") {
    return result(parsed.command, "completed", [], {
      commands: { capabilities: "implemented", analyze: "bounded", index: "bounded", queries: "planned" },
      source_extensions: [".cfm", ".cfml", ".cfc", ".html", ".htm", ".js", ".mjs", ".css", ".sql"],
      foundation: ["root_guard", "deterministic_snapshot", "strict_utf8_decoder", "source_map"],
      safety: { source_execution: false, network: false, database: false, shell: false, browser: false },
    }, DEFAULT_EXIT_CODES.completed);
  }

  let config;
  try {
    config = validateConfig(readConfig(parsed.configPath, cwd));
  } catch (error) {
    const item = error?.code ? error : diagnostic("INVALID_INPUT", "error", "Configuration validation failed.");
    const code = item.code === "ROOT_NOT_FOUND" || item.code === "ROOT_NOT_DIRECTORY" || item.code === "ROOT_ACCESS_ERROR" ? DEFAULT_EXIT_CODES.path_rejected : DEFAULT_EXIT_CODES.invalid_input;
    return result(parsed.command, "error", [item], null, code);
  }

  try {
    createRootGuard(path.resolve(cwd, config.root));
  } catch (error) {
    const item = error instanceof RootGuardError
      ? diagnostic(error.code, "error", error.message, error.details)
      : diagnostic("ROOT_ACCESS_ERROR", "error", "Analysis root could not be admitted.");
    return result(parsed.command, "error", [item], null, config.exit_codes.path_rejected);
  }

  if (QUERY_COMMANDS.includes(parsed.command)) {
    const item = diagnostic("UNIMPLEMENTED_COMMAND", "warning", `The ${parsed.command} query command is recognized but not implemented.`);
    return result(parsed.command, "incomplete", [item], null, config.exit_codes.incomplete, { maxOutputBytes: config.limits.max_output_bytes });
  }

  try {
    const analysis = analyzeProject({
      rootPath: path.resolve(cwd, config.root),
      config,
      parserBackend: createMixedStructuralScannerBackend(),
      parserVersion: "mixed-structural-scanner/v0.1",
      parserName: "mixed-structural-scanner",
      maxFacts: config.limits.max_facts,
      maxResolverRecords: config.limits.max_edges,
      maxTraversalDepth: config.limits.max_traversal_depth,
    });
    const status = analysis.complete ? "completed" : "incomplete";
    const exitCode = analysis.complete ? config.exit_codes.completed : config.exit_codes.incomplete;
    return result(parsed.command, status, analysis.diagnostics, {
      graph: analysis.graph,
      fact_bundle: analysis.fact_bundle,
      resolutions: analysis.resolutions,
      stats: analysis.stats,
    }, exitCode, { maxOutputBytes: config.limits.max_output_bytes, incompleteExitCode: config.exit_codes.incomplete });
  } catch (error) {
    if (error?.code === "NO_SOURCE_FILES") {
      const item = diagnostic("NO_SOURCE_FILES", "warning", error.message);
      return result(parsed.command, "incomplete", [item], null, config.exit_codes.incomplete);
    }
    const item = diagnostic("ANALYSIS_FAILURE", "error", `Analysis failed: ${error?.code ?? "unknown"}.`);
    return result(parsed.command, "error", [item], null, config.exit_codes.internal_failure);
  }
}
