# Specification: agent-cfml-linkage

> **Status: PROPOSED.** This is a forward-looking contract, not evidence of implemented functionality.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Static cross-file linkage analysis for CFML-first mixed web projects |
| Source of truth | This document for the proposed contract; Git history for current code facts |
| Evidence | Initial repository commit `1b29c0b` contained only `.gitattributes`; no implementation exists |
| Verification | Not run; no implementation or test suite exists |
| Limitations | Parser coverage, resolver accuracy, performance, compatibility, and release status are unverified |

## 1. Objective

Given a local project root and explicit analysis policy, produce an evidence-first graph of statically recoverable relationships among CFML/CFC, HTML, JavaScript, CSS, SQL, and related web artifacts. The result must be useful to coding agents while remaining conservative about dynamic behavior.

The analyzer is a **read-only, deterministic, local-first, non-executing** static analysis tool. It is not an application runtime, security proof, database model validator, or general-purpose impact engine.

## 2. Terminology and status language

- **Implemented:** present in repository source and covered by a passing focused test.
- **Verified:** implemented behavior supported by reproducible local or CI evidence.
- **Proposed:** intended behavior described here but not yet implemented.
- **Candidate:** one or more statically plausible targets remain.
- **Unresolved:** available evidence is insufficient to identify a target.
- **Incomplete:** analysis could not safely cover the full requested input due to limits, unsupported syntax, parse problems, or snapshot drift.

In this version, the project itself is **proposed**. No requirement below is implemented or verified locally.

## 3. Inputs and policy

The future API accepts:

- an explicit local root directory;
- optional configuration for ignore rules, file limits, mappings, parser selection, and resolver policy;
- an optional target or query after graph construction.

The implementation MUST canonicalize the root, reject traversal and symlink escapes, enforce root containment, freeze policy before discovery, and report rejected paths explicitly. Project-specific mappings are configuration, not hardcoded Globe3 behavior.

The analyzer SHOULD discover `.cfm`, `.cfml`, `.cfc`, `.html`, `.htm`, `.js`, `.mjs`, `.css`, and statically relevant SQL regions. Exact extension and embedded-region coverage remains a design detail to validate during M0/M1.

### 3.1 Current repository contract evidence

No public entry point, caller, package manifest, dependency declaration, build command, runtime target, or configuration file exists in the current repository. The API, CLI names, language/runtime, parser dependency, and package metadata below are therefore proposed contracts, not existing interfaces.

## 4. Analysis contract

The proposed pipeline is:

`Root Guard → Snapshot/Discovery → Decode/Source Map → Parse → Fact Extraction → Project Index → Resolution Passes → Evidence/Confidence → Graph Build → Validate → Cache → Query → CLI/JSON`.

Each stage has typed boundaries and may emit diagnostics. Cross-file stages consume normalized Fact IR rather than parser-specific AST nodes. No stage mutates source files.

### 4.0 Fact IR contract

The parser-independent Fact IR bundle is defined by `schema/agent-cfml-linkage-fact-v0.1.schema.json` with a representative fixture at `examples/facts-v0.1.json`. It records source files, parser identity/completeness, normalized facts, source spans, enclosing symbols, conditions, extraction rule IDs, diagnostics, and counts. The schema and fixture validate locally; no parser or Fact IR producer is implemented.

### 4.1 Planned linkage families

| Family | Planned relationships |
| --- | --- |
| CFML structure | include, custom tag, Application governance, request hooks |
| CFC | extends, implements, instantiates, invokes, method calls |
| Web flow | form submit, redirect, AJAX, `fetch`, known wrappers |
| Shared state | scope produces, consumes, overrides |
| SQL | query reads/writes table, uses datasource |
| Repository | structurally evidenced repository/action calls |
| Styling/assets | CSS imports and statically visible asset references |
| Dynamic behavior | explicit candidate/unresolved records, never guessed edges |

CSS support is intentionally bounded and secondary to CFML/CFC linkage. It must not expand into browser rendering or runtime asset resolution.

### 4.2 Graph document

A future graph document SHOULD contain:

```text
schema_version
 tool { name, version }
 project { root_id, root_name }
 snapshot { created_at, source_fingerprint, file_count }
 capabilities
 nodes[]
 edges[]
 unresolved[]
 diagnostics[]
 stats
```

Required planned node kinds include `FILE`, `CFM_PAGE`, `CFC_COMPONENT`, `CFC_METHOD`, `CUSTOM_TAG`, `APPLICATION`, `FORM`, `JS_FUNCTION`, `QUERY`, `DATABASE_TABLE`, `DATASOURCE`, `REPOSITORY_ACTION`, `SCOPE_VARIABLE`, `ROUTE_CONDITION`, `EXTERNAL_TARGET`, and `UNRESOLVED_TARGET`.

Required planned edge families include `INCLUDES`, `CUSTOM_TAG_CALL`, `EXTENDS`, `IMPLEMENTS`, `INSTANTIATES`, `CFINVOKES`, `CALLS_METHOD`, `FORM_SUBMITS_TO`, `REDIRECTS_TO`, `AJAX_CALLS`, `FETCHES`, `QUERY_READS_TABLE`, `QUERY_WRITES_TABLE`, `QUERY_USES_DATASOURCE`, `CALLS_REPOSITORY`, `APPLICATION_GOVERNS`, `REQUEST_HOOK_APPLIES_TO`, `ROUTES_WHEN`, `SCOPE_PRODUCES`, `SCOPE_CONSUMES`, `SCOPE_OVERRIDES`, and `DYNAMIC_REFERENCE`.

This list is the proposed v0.1 contract. The machine-readable Graph IR schema and representative example are now present at `schema/agent-cfml-linkage-graph-v0.1.schema.json` and `examples/graph-v0.1.json`; the runtime graph builder and Fact IR remain unimplemented.

### 4.3 Identity and evidence

Node identity MUST be independent of source content changes and derive from project-relative canonical path plus semantic symbol identity. Source hashes and revisions are freshness fields, not identity. The exact canonical path, node ID, edge ID, duplicate-evidence merge, and output ordering rules are defined in [`ADR-002`](docs/decisions/ADR-002-deterministic-identity-and-ordering.md) and exercised by `examples/identity-order-v0.1.json`.

For v0.1, node IDs use the versioned SHA-256 identity tuple `(kind, canonical_path, canonical_symbol_or_semantic_name)`. Edge IDs use `(type, from, to, sorted source_fact_ids, condition_key)` after semantic duplicate grouping. Arrays and evidence use specified canonical sort keys; volatile snapshot time is excluded from canonical comparison.

Evidence SHOULD include:

- evidence kind (`syntax`, `path_resolution`, `symbol_resolution`, `scope_flow`, `sql_parse`, `mapping`, `condition`, or `corroboration`);
- project-relative file and bounded source span;
- bounded raw text only where necessary;
- normalized expression and extractor rule ID.

Every graph relationship must be explainable by bounded source evidence. Full source bodies MUST NOT be placed in graph output.

### 4.4 Confidence and unresolved results

The central policy, not individual plugins, assigns confidence:

- `confirmed`: exact syntax and a unique deterministic target;
- `strong`: deterministic target with bounded mapping or type inference;
- `candidate`: plausible static target but ambiguity remains;
- `unresolved`: insufficient evidence.

Numeric scores are optional telemetry and never promote a confidence class. Filename similarity, LLM output, and intuition cannot create a confirmed edge.

Unresolved records are successful analysis output, not internal errors. Planned reason codes include `DYNAMIC_EXPRESSION`, `AMBIGUOUS_PATH`, `AMBIGUOUS_COMPONENT`, `AMBIGUOUS_METHOD`, `MAPPING_UNKNOWN`, `OUTSIDE_ROOT`, `GENERATED_SYMBOL`, `SQL_DYNAMIC_IDENTIFIER`, `UNSUPPORTED_SYNTAX`, and `PARSE_PARTIAL`.

## 5. Resolution rules

1. **Path resolver:** resolve literal normalized paths for includes, custom tags, form actions, redirects, AJAX, and `fetch`; enforce root containment.
2. **Application resolver:** identify the nearest governing `Application.cfc`/`Application.cfm` when statically recoverable; preserve conditional filename exceptions.
3. **CFC resolver:** resolve imports, mappings, component paths, `extends`, `implements`, `new`, `createObject`, `cfobject`, and `cfinvoke` conservatively.
4. **Method resolver:** infer receiver types only from bounded evidence such as explicit types, instantiation, properties, arguments, and unique inheritance chains.
5. **Scope resolver:** preserve ordered `cfinclude` context and emit scope-flow edges only when variable identity and order are supported. `evaluate`, `isDefined`, generated names, and unscoped page variables remain dynamic unless exactly foldable.
6. **Web-flow resolver:** retain normalized dynamic URL expressions and variable dependencies rather than guessing endpoints.
7. **SQL resolver:** parse statically visible SQL and keep datasource expressions separate. SQL edges describe syntax only.
8. **Conditional router resolver:** attach `if`, `switch`, `cfcase`, ternary, and mapping conditions; do not flatten runtime branches into unconditional calls.
9. **Repository resolver:** require structural evidence for repository/action relationships; filename-only inference is insufficient.
10. **CSS resolver:** record statically visible imports/assets without claiming browser or build-tool resolution.

## 6. Determinism, limits, and failure

The future implementation MUST:

- sort discovered files and merged facts before resolution;
- use deterministic IDs, ordering, serialization, and resolver versions;
- detect source snapshot drift before final output;
- enforce file count/size, fact, edge, evidence, traversal-depth, output-size, and wall-time limits;
- return `complete=false` with the exact exhausted budget when a limit prevents complete coverage;
- treat cache corruption or version mismatch as a rebuild condition;
- emit machine-readable JSON on stdout and human diagnostics on stderr.

Proposed CLI exit meanings are:

| Code | Meaning |
| ---: | --- |
| 0 | Analysis completed, including findings or unresolved records |
| 1 | Internal failure |
| 2 | Invalid input or configuration |
| 3 | Incomplete, unsupported, or resource-limited analysis |
| 4 | Root/path/access rejection |

Exit code `3` must never be interpreted as clean or fully verified.

## 7. Safety and non-goals

The analyzer MUST NOT execute CFML, JavaScript, SQL, shell commands, or application code. It MUST NOT access databases or networks. It MUST not expose secrets in diagnostics or output and SHOULD ignore dependency, generated, secret, and cache paths by policy.

Static SQL does not establish tenant isolation, authorization, transaction correctness, joins, or business intent. Static web-flow edges do not prove that an endpoint exists or is reachable at runtime.

## 8. Acceptance criteria for the first implementation

The first releasable implementation must have:

- a frozen Graph IR and Fact IR contract;
- deterministic root guard, discovery, parsing, extraction, resolution, graph validation, and JSON output;
- golden fixtures for ordered includes/shared scope, CFC inheritance and calls, custom tags, forms, AJAX/fetch, redirects, SQL, Application governance, conditional routers, dynamic/generated symbols, ambiguous mappings, out-of-root paths, and malformed CFML;
- negative tests for strings/comments resembling syntax, cycles, cache corruption, snapshot mutation, and every resource limit;
- reproducible package, library-import, and CLI smoke checks;
- separately evidenced engine compatibility claims before any Lucee or Adobe ColdFusion claim is published.

## 9. Traceability

The proposed contract is derived from the project Graph IR / node-edge design and the staged pipeline design recorded in the project knowledge base on 2026-09-14. Those records are design inputs, not implementation evidence. This repository becomes the authoritative maintained copy once contracts are implemented and reviewed.
