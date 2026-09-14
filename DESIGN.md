# Design: agent-cfml-linkage Analysis Pipeline

> **Status: PROPOSED / M2 NOT STARTED.** This document describes the intended architecture; the M1 root-guard, byte-snapshot, strict-decoder, private CLI, and cache foundation has runtime evidence.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | A deterministic staged compiler-like pipeline for CFML-first web linkage |
| Source of truth | This document for design intent; Git history for current implementation facts |
| Evidence | Initial `main` commit `1b29c0b` contained only `.gitattributes`; no implementation exists |
| Verification | Graph/Fact/config contract checks and 26 root-guard/snapshot/decoder/CLI/cache tests pass locally; runtime stages below remain unimplemented proposals |
| Limitations | Parser choice, language coverage, performance, and engine compatibility remain unknown |

## 1. Design goals

The analyzer should give coding agents a small, queryable, evidence-backed view of cross-file relationships without executing the application or guessing dynamic behavior. The design favors narrow stages, immutable intermediate data, explicit incompleteness, and stable output.

**Evidence boundary:** most components and flows remain proposed runtime modules. The repository contains root-guard, snapshot, decoder, and private CLI-envelope modules with focused tests, a private `package.json`, and validated contracts; parser, resolver, graph, query orchestration, caller, CI, and release architecture remain unimplemented.

It is CFML-first: CFM/CFC structure, Application governance, includes, CFC typing, and shared scopes receive priority. HTML, JavaScript, CSS, SQL, and repository relations extend that model where static evidence is available.

## 2. Pipeline

```text
Root Guard / Policy
  -> Snapshot / Discovery
  -> Decode / Source Map
  -> Parser Adapter
  -> Normalized Fact Extraction
  -> Project Index
  -> Multi-pass Resolution
  -> Evidence / Confidence
  -> Graph Builder
  -> Graph Validation
  -> Incremental Cache
  -> Query Engine
  -> CLI / Library / JSON
```

Every stage has a typed input/output boundary. Stages may emit diagnostics but never mutate analyzed source. Downstream stages consume normalized facts, not parser-specific AST nodes.

## 3. Stages

### Stage 0 — Root guard and policy

The planned stage resolves the canonical root, rejects traversal and symlink escapes, loads the explicit v0.1 configuration (`schema/agent-cfml-linkage-config-v0.1.schema.json`), applies mappings and limits, and freezes the `AnalysisContext`. The implemented M1 root-guard slice covers canonicalization and containment in `src/root-guard.js`; adjacent snapshot and decoder slices are covered by focused tests. Configuration loading, policy freezing, and mapping application remain open. No database, network, or CFML execution is permitted. Globe3-specific mappings are configuration rather than hardcoded rules.

### Stage 1 — Snapshot and discovery

The implemented M1 snapshot walks supported source files deterministically, records root-relative POSIX path, canonical path, bytes, mtime, and content SHA-256, and sorts before later stages. It skips symlinks, reports drift/limits explicitly, and calculates a content-based project fingerprint. The disposable M1 cache consumes that fingerprint with configuration/parser/extractor/resolver fingerprints and never becomes source of truth. A changed file will later invalidate its facts and dependent resolution products; root, configuration, or parser changes invalidate wider scopes.

### Stage 2 — Decode and source map

The implemented M1 decoder accepts strict UTF-8, preserves BOM byte alignment, and maps byte offsets to one-based lines and zero-based UTF-16 columns. Invalid encoding is explicit incomplete evidence, never silently repaired. One source-map owner ensures all resolvers report consistent coordinates.

### Stage 3 — Parser adapter

Expose a parser-neutral contract such as:

```text
parse(source, path) -> ParseUnit {
  tree,
  diagnostics,
  completeness,
  parserVersion
}
```

A CFML Tree-sitter grammar may be used as the preferred foundation, but parser choice stays behind the adapter. The adapter must cover tag CFML, CFScript, and embedded HTML/JavaScript/SQL regions sufficiently for extraction. Recoverable syntax errors yield partial units; unsupported or catastrophic regions yield explicit `PARSE_PARTIAL` diagnostics. Whole-language regex parsing is prohibited.

### Stage 4 — normalized Fact IR

Convert parser output into parser-independent facts. Planned facts include `FileFact`, `IncludeFact`, `CustomTagFact`, `ComponentFact`, `MethodFact`, `InstantiateFact`, `InvokeFact`, `FormFact`, `RedirectFact`, `AjaxFact`, `FetchFact`, `QueryFact`, `ScopeReadFact`, `ScopeWriteFact`, `ConditionFact`, `MappingFact`, `ApplicationHookFact`, `DynamicReferenceFact`, and `CssAssetFact`.

Each fact has a stable local `fact_id`, source span, normalized expression, enclosing symbol or condition, and extraction rule ID. The machine-readable Fact IR contract and fixture are `schema/agent-cfml-linkage-fact-v0.1.schema.json` and `examples/facts-v0.1.json`; both validate locally. Fact extraction does not resolve across files.

### Stage 5 — immutable project index

Build indexes before resolution so file order cannot affect output:

- `pathIndex`
- `componentIndex`
- `methodIndex`
- `applicationIndex`
- `mappingIndex`
- `customTagIndex`
- `symbolIndex`
- `queryIndex`
- `factByFile`

Indexes retain unique, ambiguous, and unresolved states. `Application.cfc` mappings are indexed only when statically recoverable; runtime-computed mappings remain unknown.

### Stage 6 — multi-pass resolvers

Resolvers implement a contract like:

```text
resolve(fact, indexes, context) -> Resolution[] | UnresolvedRecord[]
```

They do not mutate indexes. Planned order:

1. **Path:** includes, custom tags, form actions, redirects, AJAX, and `fetch`; normalize relative paths, roots, and explicit mappings.
2. **Application:** find nearest governing `Application.cfc`/`Application.cfm` and statically applicable request hooks.
3. **CFC type:** resolve `extends`, `implements`, `new`, `createObject`, `cfobject`, `cfinvoke`, imports, and component mappings.
4. **Method:** infer receiver types from explicit types, instantiated locals, properties, arguments, and unique inheritance chains.
5. **Shared scope:** preserve ordered include context and emit conservative scope-flow relations.
6. **Web flow:** connect forms, JavaScript functions, XMLHttpRequest, jQuery, `fetch`, known wrappers, and redirects.
7. **SQL:** parse visible `cfquery`/`queryExecute` SQL; separate table and datasource relations.
8. **Conditional routing:** attach `if`, `switch`, `cfcase`, ternary, and mapping conditions without flattening runtime branches.
9. **Repository:** identify repository/action calls only from structural evidence.
10. **CSS/assets:** record visible imports and asset references without claiming build or browser resolution.

Dynamic URL expressions, `evaluate`, `isDefined`, generated names, dynamic SQL identifiers, ambiguous mappings, and uncertain receivers retain candidates or unresolved records. They are never converted into authoritative edges by filename similarity or LLM inference.

### Stage 7 — evidence and confidence

A central policy combines resolver evidence and assigns `confirmed`, `strong`, `candidate`, or `unresolved`. Confirmed requires exact syntax and a unique deterministic target. Strong permits bounded deterministic mapping or type inference. Numeric scores are telemetry only and cannot upgrade a class. Plugins cannot directly promote confidence. The policy and fixture are [`ADR-003`](docs/decisions/ADR-003-confidence-and-completeness.md) and `examples/confidence-v0.1.json`.

### Stage 8 — graph builder

Transform facts and resolutions into Graph IR nodes, edges, unresolved records, diagnostics, and statistics. Node identity derives from project-relative canonical path plus semantic identity, not source hash. Edge identity derives from relation type, endpoints, source fact, and condition. The exact SHA-256 identity and canonical ordering rules are defined in [`ADR-002`](docs/decisions/ADR-002-deterministic-identity-and-ordering.md) and exercised by `examples/identity-order-v0.1.json`. Deduplication must preserve multiple evidence records, include order, condition, dynamic flags, resolver version, and source fingerprint. Reverse adjacency is built with the forward graph.

### Stage 9 — graph validation

Validate schema, referential integrity, unique IDs, deterministic ordering, confidence invariants, root containment, evidence spans, unresolved reason codes, and completeness accounting. A validator failure is an internal error; partial parser/resolver evidence is not. Set `complete=false` when limits, unsupported syntax, snapshot drift, or missing required resolver coverage prevents full analysis.

### Stage 10 — incremental cache

Cache is optional performance state and never the source of truth. Store per-file source hash, parser/extractor versions, and Fact IR, plus project-level index/resolution fingerprints. Reparse changed files and invalidate outgoing edges and reverse dependents whose candidate sets may change. Mapping, Application, or component-identity changes may cause bounded project-wide re-resolution. Corrupt or stale cache is discarded and rebuilt.

### Stage 11 — query engine

The query engine operates on an immutable `GraphSnapshot` and returns bounded evidence slices, not model-written explanations. Planned operations:

`related`, `callers`, `callees`, `includes`, `included-by`, `trace`, `scope-flow`, `tables`, `routes`, `unresolved`, `explain-edge`, `impact-evidence`, and `stats`.

Traversal is bounded, cycle-safe, and deterministic. `agent-change-impact` may later consume linkage evidence, while generic impact reasoning remains its owner.

### Stage 12 — CLI and library boundary

The implemented private CLI boundary emits one stable JSON envelope on stdout and human diagnostics on stderr; it currently exposes `capabilities`, help, version, input validation, and explicit incomplete responses for unimplemented analysis commands. Full orchestration remains planned. The library should expose `analyzeProject`, `analyzeTarget`, `queryGraph`, `capabilities`, and Graph IR types. Proposed commands are `capabilities`, `index`/`analyze`, `related`, `callers`, `callees`, `trace`, `unresolved`, `explain`, and `stats`.

Proposed exit semantics: `0` completed, `1` internal failure, `2` invalid input, `3` incomplete/unsupported/resource limit, and `4` root/path/access rejection. Exit `3` is not a clean result.

## 4. Extension points

Plugins remain narrow and deterministic: `ParserAdapter`, `FactExtractor`, `Resolver`, `SqlAdapter`, `IgnorePolicy`, and `MappingProvider`. Core owns Graph IR, IDs, confidence, safety, validation, and the CLI envelope. V1 should ship built-in CFML resolvers only; third-party plugins require explicit enablement and version fingerprints.

## 5. Performance strategy

Correctness comes first. Parse with bounded worker concurrency and merge facts in sorted path order. Use map/set indexes instead of all-pairs symbol comparison. Cache source hashes and Fact IR. Enforce hard caps for files, bytes, facts, edges, evidence, traversal depth, output bytes, and wall time. A cap hit returns partial evidence and identifies the exhausted budget; it never silently truncates.

## 6. Boundary with related tools

- `agent-cfml-check` remains a separate bounded single-file structural checker. Reuse safety and contract lessons only; do not claim its external implementation as local code.
- `agent-code-slice` may later provide precise source slices; it does not own linkage.
- `agent-change-impact` may consume this tool as an evidence provider; this tool does not own generic impact prioritization.
- `agent-test-scope` may consume later impact evidence; it does not belong in the linkage resolver.

## 7. Proposed implementation sequence

The sequence is dependency-aware but not a schedule. M0's contract gate and T-010–T-014 are verified; parser and resolver implementation remain open.

| Milestone | Content | Current status |
| --- | --- | --- |
| M0 | Freeze Graph IR, Fact IR, diagnostics, IDs, limits, and golden-fixture contract | Verified — T-001–T-006 |
| M1 | Safe root guard, snapshot, decoder, discovery, cache skeleton, CLI envelope | Verified — T-010–T-014 |
| M2 | Parser adapter and normalized extraction | Not started |
| M3 | Basic path/Application/include linkage and graph validation | Not started |
| M4 | CFC mappings, inheritance, instantiation, and method linkage | Not started |
| M5 | Shared scope, AJAX/fetch, conditional routers, dynamic evidence | Not started |
| M6 | SQL, datasource, and repository linkage | Not started |
| M7 | Query engine and bounded impact evidence | Not started |
| M8 | Incremental invalidation, workers, budgets, repeatability | Not started |
| M9 | Golden suite, adversarial tests, package/CLI smoke, and separately evidenced engine checks | Not started |

## 8. Design risks

The principal risks are incomplete CFML grammar coverage, runtime-dependent mappings, dynamic code and URLs, ambiguous component names, shared-scope semantics, embedded language boundaries, and accidental claims of runtime correctness. The design addresses these with adapter boundaries, explicit evidence, conservative resolution, first-class unresolved records, and deterministic verification. These mitigations remain unverified until implementation exists.
