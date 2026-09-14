import crypto from "node:crypto";
import path from "node:path";

const TOOL_NAME = "agent-cfml-linkage";
const DEFAULT_TOOL_VERSION = "0.1.0";
const FACT_SCHEMA_VERSION = "agent-cfml-linkage-fact/v0.1";
const MAX_DIAGNOSTIC_MESSAGE = 2048;
const MAX_FACTS = 500_000;

function isWhitespace(character) {
  if (character === undefined) return false;
  const code = character.charCodeAt(0);
  return code === 9 || code === 10 || code === 11 || code === 12 || code === 13 || code === 32;
}

function normalizeText(value) {
  if (typeof value !== "string") return "";
  let output = "";
  let pendingSpace = false;
  for (const character of value.trim()) {
    if (isWhitespace(character)) {
      pendingSpace = output.length > 0;
      continue;
    }
    if (pendingSpace) output += " ";
    output += character;
    pendingSpace = false;
  }
  return output;
}

function languageForPath(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".cfm" || extension === ".cfml" || extension === ".cfc") return "cfml";
  if (extension === ".html" || extension === ".htm") return "html";
  if (extension === ".js" || extension === ".mjs") return "javascript";
  if (extension === ".css") return "css";
  return "unknown";
}

function sha256(value) {
  return `sha256:${crypto.createHash("sha256").update(value, "utf8").digest("hex")}`;
}

function stableFactId(file, kind, node, rule, ordinal) {
  const span = node.span ?? { start_line: 1, start_col: 0, end_line: 1, end_col: 0 };
  const identity = [
    "v0.1",
    "fact",
    file,
    kind,
    rule,
    span.start_line,
    span.start_col,
    span.end_line,
    span.end_col,
    ordinal,
  ].join("\0");
  return `fact:${sha256(identity).slice("sha256:".length)}`;
}

function attribute(node, name) {
  return node.attributes?.find((item) => item.name === name) ?? null;
}

function literalAttribute(node, name) {
  const item = attribute(node, name);
  if (!item || typeof item.value !== "string" || item.value.trim() === "" || item.truncated === true || item.value.includes("#")) return null;
  return normalizeText(item.value);
}

function dynamicValue(node, names) {
  return names.some((name) => {
    const item = attribute(node, name);
    return item && (item.value === null || item.truncated === true || (typeof item.value === "string" && item.value.includes("#")));
  });
}

function splitList(value) {
  if (typeof value !== "string") return [];
  const values = [];
  let current = "";
  for (const character of value) {
    if (character === ",") {
      const normalized = normalizeText(current);
      if (normalized !== "") values.push(normalized);
      current = "";
    } else {
      current += character;
    }
  }
  const normalized = normalizeText(current);
  if (normalized !== "") values.push(normalized);
  return [...new Set(values)].sort();
}

function assignmentTarget(expression) {
  if (typeof expression !== "string") return null;
  let target = "";
  for (const character of expression) {
    if (character === "=") break;
    target += character;
  }
  target = normalizeText(target);
  if (target === "" || target.includes("#") || target.includes(" ")) return null;
  return target;
}

function conditionFor(node) {
  if (node.name !== "cfif" && node.name !== "cfelseif") return null;
  const expression = normalizeText(node.expression);
  if (expression === "") return null;
  return {
    expression_normalized: expression.slice(0, 2048),
    source_span: node.span,
    variables: [],
    branch_kind: "if",
    evaluation: "runtime",
  };
}

function makeFact({ file, language, node, kind, normalizedExpression, enclosingSymbol = null, condition = null, extractionRuleId, attributes: values, ordinal }) {
  return {
    fact_id: stableFactId(file, kind, node, extractionRuleId, ordinal),
    kind,
    file,
    language,
    span: node.span,
    normalized_expression: normalizeText(normalizedExpression).slice(0, 4096) || `${kind.toLowerCase()} ${file}`,
    enclosing_symbol: enclosingSymbol,
    condition,
    extraction_rule_id: extractionRuleId,
    attributes: values ?? {},
  };
}

function makeDynamicFact({ file, language, node, sourceKind, expression, enclosingSymbol, ordinal }) {
  return makeFact({
    file,
    language,
    node,
    kind: "DYNAMIC_REFERENCE",
    normalizedExpression: normalizeText(expression) || `${sourceKind.toLowerCase()} dynamic reference`,
    enclosingSymbol,
    extractionRuleId: `dynamic-${sourceKind.toLowerCase()}-v0.1`,
    attributes: { source_kind: sourceKind, dynamic: true },
    ordinal,
  });
}

function fileSpan(parsed) {
  if (parsed?.sourceMap) {
    try {
      return parsed.sourceMap.spanFromByteOffsets(0, 0);
    } catch {
      // Fall through to the bounded unknown span.
    }
  }
  return {
    start_line: 1,
    start_col: 0,
    end_line: 1,
    end_col: 0,
  };
}

function fullSourceSpan(parsed, fileBytes) {
  try {
    return parsed?.sourceMap?.spanFromByteOffsets(0, fileBytes) ?? fileSpan(parsed);
  } catch {
    return fileSpan(parsed);
  }
}

function normalizeDiagnostic(item, file, index) {
  const code = typeof item?.code === "string" && item.code !== "" ? item.code : "PARSER_DIAGNOSTIC";
  const severity = item?.severity === "error" || item?.severity === "info" ? item.severity : "warning";
  const message = typeof item?.message === "string" && item.message !== "" ? item.message : "Parser reported an unspecified diagnostic.";
  const normalized = {
    id: `diagnostic:${sha256([file, code, severity, message, index].join("\0")).slice("sha256:".length)}`,
    severity,
    code,
    message: message.slice(0, MAX_DIAGNOSTIC_MESSAGE),
  };
  if (item?.span && Number.isSafeInteger(item.span.start_line) && Number.isSafeInteger(item.span.start_col) && Number.isSafeInteger(item.span.end_line) && Number.isSafeInteger(item.span.end_col)) {
    normalized.span = {
      start_line: item.span.start_line,
      start_col: item.span.start_col,
      end_line: item.span.end_line,
      end_col: item.span.end_col,
    };
  }
  return normalized;
}

function parserSummary(parsedFiles, expectedCount, parserName, parserVersion) {
  const values = parsedFiles.filter(Boolean);
  const allComplete = values.length === expectedCount && values.length > 0 && values.every((item) => item.complete === true);
  const anyTree = values.some((item) => item.tree !== null && item.tree !== undefined);
  return {
    name: parserName,
    version: parserVersion || "unselected",
    completeness: allComplete ? "complete" : (anyTree ? "partial" : "unsupported"),
  };
}

/**
 * Extract bounded structural facts from parser-adapter results. This does not
 * resolve paths, symbols, mappings, or graph edges across files.
 */
export function extractFactBundle({ snapshot, parsedFiles, toolVersion = DEFAULT_TOOL_VERSION, parserName = "cfml-parser-adapter", maxFacts = MAX_FACTS } = {}) {
  if (!snapshot || !Array.isArray(snapshot.files) || snapshot.files.length === 0) {
    throw new TypeError("snapshot must contain at least one source file");
  }
  if (!Array.isArray(parsedFiles)) throw new TypeError("parsedFiles must be an array");
  if (typeof toolVersion !== "string" || toolVersion.trim() === "") throw new TypeError("toolVersion must be a non-empty string");
  if (!Number.isSafeInteger(maxFacts) || maxFacts <= 0) throw new TypeError("maxFacts must be a positive safe integer");

  const files = [...snapshot.files].sort((left, right) => left.path < right.path ? -1 : left.path > right.path ? 1 : 0);
  const parsedByFile = new Map();
  for (const parsed of parsedFiles) {
    if (parsed?.file && !parsedByFile.has(parsed.file)) parsedByFile.set(parsed.file, parsed);
  }

  const facts = [];
  const diagnostics = [];
  let complete = snapshot.complete !== false;
  let factOrdinal = 0;
  const parserResults = [];

  function addDiagnostic(item, file) {
    diagnostics.push(normalizeDiagnostic(item, file, diagnostics.length));
  }

  function addFact(fact) {
    if (facts.length >= maxFacts) {
      complete = false;
      if (!diagnostics.some((item) => item.code === "RESOURCE_LIMIT")) {
        addDiagnostic({ code: "RESOURCE_LIMIT", severity: "error", message: `Fact limit exceeded: ${maxFacts}.` }, fact.file);
      }
      return false;
    }
    facts.push(fact);
    return true;
  }

  for (const sourceFile of files) {
    const file = sourceFile.path;
    const language = languageForPath(file);
    const parsed = parsedByFile.get(file);
    if (!parsed) {
      complete = false;
      addDiagnostic({ code: "PARSER_RESULT_MISSING", severity: "error", message: "No parser result was supplied for the discovered source file." }, file);
    } else {
      parserResults.push(parsed);
      for (const item of parsed.diagnostics ?? []) addDiagnostic(item, file);
      if (parsed.complete !== true) complete = false;
    }

    const fileNode = {
      span: fullSourceSpan(parsed, sourceFile.bytes ?? 0),
    };
    addFact(makeFact({
      file,
      language,
      node: fileNode,
      kind: "FILE",
      normalizedExpression: `${language === "cfml" && file.toLowerCase().endsWith(".cfc") ? "cfc_component" : language === "cfml" ? "cfm_page" : "source_file"} ${file}`,
      extractionRuleId: "file-kind-v0.1",
      attributes: { file_kind: language === "cfml" && file.toLowerCase().endsWith(".cfc") ? "cfc_component" : language === "cfml" ? "cfm_page" : "source_file" },
      ordinal: factOrdinal++,
    }));

    const nodes = parsed?.tree?.nodes;
    if (!Array.isArray(nodes)) continue;
    let componentName = null;
    let methodName = null;

    for (const node of nodes) {
      if (!node || node.kind !== "CFML_TAG") continue;
      const enclosingSymbol = methodName ?? componentName;
      const nodeExpression = normalizeText(node.expression);
      const nodeAttributes = {};
      for (const item of node.attributes ?? []) {
        if (item.value !== null && item.truncated !== true) nodeAttributes[item.name] = item.value;
      }

      if (node.closing) {
        if (node.name === "cffunction") methodName = null;
        if (node.name === "cfcomponent") componentName = null;
        continue;
      }

      if (node.name === "cfcomponent") {
        const name = literalAttribute(node, "name");
        const extendsName = literalAttribute(node, "extends");
        const implementsNames = splitList(literalAttribute(node, "implements"));
        if (name === null) {
          addFact(makeDynamicFact({ file, language, node, sourceKind: "COMPONENT", expression: nodeAttributes.name ?? "component name", enclosingSymbol, ordinal: factOrdinal++ }));
        } else {
          componentName = name;
          addFact(makeFact({ file, language, node, kind: "COMPONENT", normalizedExpression: `component ${name}`, enclosingSymbol: null, extractionRuleId: "cfc-component-v0.1", attributes: { component_name: name, extends: extendsName, implements: implementsNames }, ordinal: factOrdinal++ }));
        }
        continue;
      }
      if (node.name === "cffunction") {
        const name = literalAttribute(node, "name");
        if (name === null) {
          addFact(makeDynamicFact({ file, language, node, sourceKind: "METHOD", expression: nodeAttributes.name ?? "method name", enclosingSymbol, ordinal: factOrdinal++ }));
        } else {
          methodName = componentName ? `${componentName}.${name}` : name;
          addFact(makeFact({ file, language, node, kind: "METHOD", normalizedExpression: `method ${methodName}`, enclosingSymbol: componentName, extractionRuleId: "cfc-method-v0.1", attributes: { method_name: name, access: literalAttribute(node, "access") }, ordinal: factOrdinal++ }));
        }
        continue;
      }
      if (node.name === "cfinclude") {
        const template = literalAttribute(node, "template");
        if (template === null || dynamicValue(node, ["template"])) {
          addFact(makeDynamicFact({ file, language, node, sourceKind: "INCLUDE", expression: nodeAttributes.template ?? "cfinclude template", enclosingSymbol, ordinal: factOrdinal++ }));
        } else {
          addFact(makeFact({ file, language, node, kind: "INCLUDE", normalizedExpression: template, enclosingSymbol, extractionRuleId: "cfinclude-path-v0.1", attributes: { template, include_phase: "page", order_index: facts.filter((item) => item.kind === "INCLUDE" && item.file === file).length + 1 }, ordinal: factOrdinal++ }));
        }
        continue;
      }
      if (node.name === "cfmodule") {
        const name = literalAttribute(node, "name") ?? literalAttribute(node, "template");
        if (name === null || dynamicValue(node, ["name", "template"])) {
          addFact(makeDynamicFact({ file, language, node, sourceKind: "CUSTOM_TAG", expression: nodeAttributes.name ?? nodeAttributes.template ?? "custom tag", enclosingSymbol, ordinal: factOrdinal++ }));
        } else {
          addFact(makeFact({ file, language, node, kind: "CUSTOM_TAG", normalizedExpression: `custom tag ${name}`, enclosingSymbol, extractionRuleId: "cfmodule-name-v0.1", attributes: { name }, ordinal: factOrdinal++ }));
        }
        continue;
      }
      if (node.name === "cfobject") {
        const component = literalAttribute(node, "component");
        if (component === null || dynamicValue(node, ["component"])) addFact(makeDynamicFact({ file, language, node, sourceKind: "INSTANTIATE", expression: nodeAttributes.component ?? "component", enclosingSymbol, ordinal: factOrdinal++ }));
        else addFact(makeFact({ file, language, node, kind: "INSTANTIATE", normalizedExpression: component, enclosingSymbol, extractionRuleId: "cfobject-component-v0.1", attributes: { component }, ordinal: factOrdinal++ }));
        continue;
      }
      if (node.name === "cfinvoke") {
        const component = literalAttribute(node, "component");
        const method = literalAttribute(node, "method");
        if (component === null || method === null || dynamicValue(node, ["component", "method"])) addFact(makeDynamicFact({ file, language, node, sourceKind: "INVOKE", expression: `${nodeAttributes.component ?? "component"}.${nodeAttributes.method ?? "method"}`, enclosingSymbol, ordinal: factOrdinal++ }));
        else addFact(makeFact({ file, language, node, kind: "INVOKE", normalizedExpression: `${component}.${method}`, enclosingSymbol, extractionRuleId: "cfinvoke-component-method-v0.1", attributes: { component, method }, ordinal: factOrdinal++ }));
        continue;
      }
      if (node.name === "cfimport") {
        const importPath = literalAttribute(node, "path");
        const prefix = literalAttribute(node, "prefix");
        if (importPath === null || dynamicValue(node, ["path"])) addFact(makeDynamicFact({ file, language, node, sourceKind: "MAPPING", expression: nodeAttributes.path ?? "mapping path", enclosingSymbol, ordinal: factOrdinal++ }));
        else addFact(makeFact({ file, language, node, kind: "MAPPING", normalizedExpression: importPath, enclosingSymbol, extractionRuleId: "cfimport-path-v0.1", attributes: { path: importPath, prefix }, ordinal: factOrdinal++ }));
        continue;
      }
      if (node.name === "cfset") {
        const target = assignmentTarget(node.expression);
        if (target !== null) addFact(makeFact({ file, language, node, kind: "SCOPE_WRITE", normalizedExpression: target, enclosingSymbol, extractionRuleId: "cfset-scope-write-v0.1", attributes: { target }, ordinal: factOrdinal++ }));
        else addFact(makeDynamicFact({ file, language, node, sourceKind: "SCOPE_WRITE", expression: node.expression ?? "cfset", enclosingSymbol, ordinal: factOrdinal++ }));
        continue;
      }
      if (node.name === "cfif" || node.name === "cfelseif") {
        const condition = conditionFor(node);
        if (condition) addFact(makeFact({ file, language, node, kind: "CONDITION", normalizedExpression: condition.expression_normalized, enclosingSymbol, condition, extractionRuleId: "condition-if-v0.1", attributes: { branch_id: `${file}:${node.span.start_line}:${node.span.start_col}` }, ordinal: factOrdinal++ }));
        else addFact(makeDynamicFact({ file, language, node, sourceKind: "CONDITION", expression: node.expression ?? "condition", enclosingSymbol, ordinal: factOrdinal++ }));
        continue;
      }
    }
  }

  facts.sort((left, right) => {
    const leftKey = [left.file, left.span.start_line, left.span.start_col, left.span.end_line, left.span.end_col, left.kind, left.fact_id].join("\0");
    const rightKey = [right.file, right.span.start_line, right.span.start_col, right.span.end_line, right.span.end_col, right.kind, right.fact_id].join("\0");
    return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
  });
  diagnostics.sort((left, right) => {
    const leftKey = [left.severity === "info" ? 0 : left.severity === "warning" ? 1 : 2, left.code, left.id].join("\0");
    const rightKey = [right.severity === "info" ? 0 : right.severity === "warning" ? 1 : 2, right.code, right.id].join("\0");
    return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
  });

  const parserVersions = [...new Set(parserResults.map((item) => item.parser_version).filter((value) => typeof value === "string"))].sort();
  const parser = parserSummary(parserResults, files.length, parserName, parserVersions.length === 1 ? parserVersions[0] : "mixed");
  if (parser.completeness !== "complete") complete = false;

  return {
    schema_version: FACT_SCHEMA_VERSION,
    tool: { name: TOOL_NAME, version: toolVersion },
    source_files: files.map((file) => ({ file: file.path, language: languageForPath(file.path), fingerprint: file.content_sha256, ...(Number.isSafeInteger(file.bytes) ? { bytes: file.bytes } : {}) })),
    parser,
    complete,
    facts,
    diagnostics,
    stats: {
      source_file_count: files.length,
      fact_count: facts.length,
      diagnostic_count: diagnostics.length,
    },
  };
}
