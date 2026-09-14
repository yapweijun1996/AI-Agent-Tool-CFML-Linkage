# Epic: Build the CFML-first linkage evidence provider

> **Status: PROPOSED / M2 IN PROGRESS.** This epic is planning material; the M1 foundation and M2 parser-adapter boundary are verified.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | A local, deterministic static linkage graph for mixed CFML web projects |
| Project type | Planned NPM/library + CLI + AI-agent evidence provider |
| Lifecycle | Planning / pre-prototype |
| Source of truth | This epic for outcome and milestones; `SPEC.md` for the contract; Git history for actual completion |
| Evidence | Initial `main` commit `1b29c0b` contained only `.gitattributes`; no implementation exists |
| Verification | M0 contract checks, produced Fact IR schema validation, and 37 foundation/parser-adapter/scanner/Fact tests pass; no CI or linkage verification exists |
| Limitations | Estimates, sequencing, parser choice, and compatibility are not validated |

## 1. Problem

This epic is the product-level outcome for one planned package boundary. It does not imply that the package, CLI, or downstream integrations already exist.

CFML applications often spread behavior across includes, CFCs, Application files, HTML forms, JavaScript requests, CSS assets, SQL, and shared scopes. A coding agent cannot safely infer those relationships from a single file or from filename similarity. The project needs a bounded, inspectable evidence provider that exposes relationships without running the application or pretending to know dynamic runtime behavior.

## 2. Desired outcome

Deliver a versioned CLI/library that accepts a local project root and emits a deterministic Graph IR document plus bounded queries. It should help an agent answer questions such as:

- Which files include or call this component or method?
- Which form, AJAX, fetch, redirect, or route condition reaches this page?
- Which shared-scope values are produced or consumed across ordered includes?
- Which statically visible tables and datasources are used?
- Which relationships remain ambiguous or unresolved, and what evidence explains that state?

Success means the result is useful, conservative, reproducible, and separately verified—not merely that a parser returns nodes.

## 3. Scope

In scope: CFML/CFC structure and resolution first; HTML forms; JavaScript AJAX/fetch flows; CSS imports/assets; visible SQL; Application governance; shared scope; explicit conditions; evidence/confidence; deterministic graph output; query operations.

Out of scope: source execution, runtime network/database access, browser automation, application semantics, permission or tenant-safety proof, LLM-authoritative edges, unconstrained dynamic resolution, and generic impact/test prioritization.

## 4. Milestones

| Milestone | Outcome | Dependencies | Status |
| --- | --- | --- | --- |
| M0 Contracts | Freeze Graph IR, Fact IR, diagnostics, IDs, limits, and fixture rules | None | Verified — T-001–T-006 |
| M1 Safe foundation | Root guard, snapshot, decoding/source maps, discovery, CLI envelope, cache skeleton | M0 | Verified — T-010–T-014 |
| M2 Parser/extractor | Adapter and normalized facts for priority syntax | M1 | Not started |
| M3 Basic linkage | Paths, includes, Application governance, unresolved model, graph validator, reverse callers | M2 | Not started |
| M4 CFC linkage | Mappings, inheritance, instantiation, `cfinvoke`, and conservative method resolution | M3 | Not started |
| M5 Globe3-critical flows | Ordered scope flow, AJAX/fetch, conditions, dynamic/generated evidence | M3 | Not started |
| M6 SQL/repository | Query/table/datasource and structurally evidenced repository edges | M3, M5 | Not started |
| M7 Query interface | Related/callers/callees/trace/unresolved/explain/stats/impact-evidence | M3–M6 | Not started |
| M8 Incremental performance | Dependency-aware invalidation, bounded workers, budgets, repeatability | M7 | Not started |
| M9 Release verification | Golden/adversarial suite, package/import/CLI smoke, engine evidence | M8 | Not started |

## 5. Epic acceptance criteria

The epic is complete only when all of the following are evidenced:

- the public contract and machine-readable schema are reviewed and versioned;
- the analyzer is read-only, non-executing, root-contained, and network/database-free;
- repeated analysis of the same snapshot/config/version produces stable semantic JSON;
- ambiguous, dynamic, malformed, unsupported, out-of-root, and budget-limited cases fail closed with explicit records;
- priority CFML/CFC, web-flow, scope, SQL, and CSS fixtures have expected golden results;
- CLI and library contracts are tested independently from internals;
- package/install/release evidence matches the source commit;
- engine compatibility claims are published only for environments actually tested.

## 6. Risks and blockers

Current status: M0/M1 work and T-010–T-014/T-020/T-021 bounded parser/scanner/Fact extraction are verified. The root-guard/snapshot/decoder/private CLI/cache/parser/Fact foundation is the only runtime slice; full grammar, broader language coverage, and resolution remain open.

Known technical risks include runtime-computed Application mappings, dynamic `evaluate` and generated names, ambiguous components/method receivers, shared-scope semantics, embedded JavaScript/SQL parsing, and resource exhaustion. These are release risks, not reasons to guess.

## 7. Related work

`agent-cfml-check` is separate external prior art for bounded single-file CFML structural checking. Its publication and tests do not demonstrate this epic. `agent-code-slice`, `agent-change-impact`, and `agent-test-scope` may become integrations later, but each retains its own contract and ownership.
