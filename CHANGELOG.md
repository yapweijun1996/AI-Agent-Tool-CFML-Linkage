# Changelog

> **Status: PROPOSED / UNRELEASED.** This changelog records repository changes, not external project releases.

| Field | Value |
| --- | --- |
| Version | 0.1 documentation baseline |
| Last updated | 2026-09-14 |
| Scope | Changes in this repository |
| Source of truth | Git history and this changelog |
| Evidence | Initial commit `1b29c0b`; documentation baseline and M1 foundation commits follow |
| Verification | Documentation consistency checks, bounded query/robustness/adversarial-fixture/evidence/edge-budget/ignore-policy/hidden-file-policy checks, and `npm test` (79/79) are run during this pass |
| Limitations | No parser/resolver release runtime, public package, hosted CI run, or release exists; the read-only CI workflow is present |

## Unreleased

### Added

- Project classification and status boundaries in `README.md`.
- Goal, progress state, and autonomous execution contract in `GOAL.md`, `PROGRESS.md`, and `GOAL_PROMPT.md`.
- Proposed functional contract in `SPEC.md` plus validated Graph IR and Fact IR schema/example contracts in `schema/` and `examples/`.
- Proposed staged pipeline in `DESIGN.md`; T-001–T-003 schema, identity, reference, count, source, span, and ordering validation passed using existing local Python modules and a deterministic reference check.
- Proposed component ownership and data flow in `ARCHITECTURE.md`.
- Proposed epic, roadmap, task register, and test plan.
- Repository guidance and Core SSOT rules in `AGENTS.md`.
- Proposed security, release, project-boundary, deterministic identity/order, and confidence/completeness ADR documents.
- Identity/order fixture in `examples/identity-order-v0.1.json`.
- Confidence/completeness fixture in `examples/confidence-v0.1.json`.
- Root/configuration/limits contract in `schema/agent-cfml-linkage-config-v0.1.schema.json`, `examples/config-v0.1.json`, and ADR-004.
- Versioned golden/negative/adversarial fixture layout and manifest under `fixtures/` for T-006.
- Node `>=20` private foundation, root guard, focused tests, and ADR-005 for T-010.
- Deterministic byte snapshot/discovery, focused tests, and ADR-006 for T-011.
- Strict UTF-8 decoding, byte/line/column source maps, focused tests, and ADR-007 for T-012.
- Private CLI JSON envelope, stderr diagnostics, exit-code handling, focused tests, and ADR-008 for T-013.
- Disposable metadata cache, invalidation fingerprints, corruption handling, focused tests, and ADR-009 for T-014.
- Fail-closed parser adapter boundary, bounded dependency-free CFML scanner, partial/unsupported diagnostics, focused tests, and ADR-010 for T-020.
- Fixture-backed bounded CFML/CFC Fact IR extraction, golden expectations, schema validation, focused tests, and ADR-011 for T-021.
- Bounded mixed-language web scanners/facts for forms, redirects, fetch/AJAX, CSS, visible SQL, inert fixtures, focused tests, and ADR-012 for T-022.
- Immutable project indexes with deterministic unique/ambiguous/missing lookup states, focused tests, and ADR-013 for T-023.
- Conservative literal path and Application governance resolution with explicit unresolved states, focused tests, and ADR-014 for T-024.
- Bounded Graph IR construction/validation, SQL evidence nodes, unresolved preservation, immutable reverse adjacency, focused tests, and ADR-015 for T-025.
- Bounded CFC/method mapping, inheritance, instantiation, invoke resolution, ambiguity preservation, focused tests, and ADR-016 for T-030.
- Bounded ordered shared-scope produces/consumes/overrides resolution, Fact scope references, Graph scope-flow edges, focused tests, and ADR-017 for T-031.
- Bounded web-flow/condition resolution for forms, redirects, fetch, known AJAX wrappers, numeric mixed-node ordering, focused fixtures/tests, and ADR-018 for T-032.
- Bounded dynamic/generated/SQL-dynamic evidence preservation for `evaluate`, generated names, interpolated SQL identifiers, dynamic datasources, focused adversarial fixtures/tests, and ADR-019 for T-033.
- Bounded `cfquery`/literal-`queryExecute` table and datasource extraction plus structural repository/action Facts, resolutions, Graph edges, filename-only negative evidence, fixtures/tests, and ADR-020 for T-034.
- Bounded immutable GraphSnapshot queries, exact selector handling, deterministic evidence explanations, traversal/result limits, focused tests, and ADR-021 for T-035.
- Consolidated bounded repeatability, content-drift, cache invalidation/corruption, cycle-safety, and resource-limit evidence for T-040; no full orchestration or in-read mutation proof is claimed.
- Added inert negative/adversarial fixtures and tests for ambiguity, path escape, malformed/unsupported syntax, comment/string filtering, and include cycles for T-041; no parser execution or full grammar coverage is claimed.
- Completed bounded T-042 verification: 68 tests, contract/example checks, CLI/package smoke, syntax/fixture/document checks, and conservative credential scan pass; lint/type scripts and Secretlint are unavailable locally.
- Recorded bounded T-043 compatibility evidence for Node `v25.2.1` on `win32`/`x64`; no Lucee, Adobe ColdFusion, cross-version, cross-platform, browser, database, network, or public-package claim is made.
- Completed the bounded T-044 release/security/parity audit with exact pre-release package metadata, source commit identity, local security checks, and explicit remaining gates; nothing was published.
- Implemented bounded T-036 analysis orchestration, private library exports, composed-analysis schema, CLI `analyze`/`index` wiring, parser-time drift checks, and offline packed-artifact consumer smoke; full grammar and query-command integration remained open at that point.
- Implemented bounded T-045 CLI query commands over fresh analysis graphs; recognized commands map to the immutable query engine, preserve bounded results/diagnostics, reject unsupported query options, and retain the serialized output cap.
- Added private CLI serialized-output enforcement for `limits.max_output_bytes`, with an explicit `OUTPUT_LIMIT` incomplete result and a documented minimum envelope size.
- Hardened literal path resolution to require current root-contained target existence, preserving vanished snapshot targets as unresolved evidence.
- Hardened `createGraphSnapshot` to validate and deep-copy snapshot-shaped input instead of trusting caller mutability.
- Synchronized ADR verification-count and bounded-status references with the then-current 74-test suite after T-045; no broader compatibility or release claim was added.
- Implemented bounded T-046 CLI configuration validation: the complete v0.1 object shape/value contract and query-request options are rejected before root admission/analysis; library-wide budget enforcement remains open.
- Added T-047 `.github/workflows/ci.yml`, a least-privilege Node 20.x/22.x/24.x test matrix with no publish/deploy step; hosted workflow execution remains unverified.
- Implemented T-048 bounded library evidence-budget enforcement through `max_evidence`, with deterministic partial evidence, explicit `RESOURCE_LIMIT` incomplete results, focused coverage, and ADR-025; library output/time budgets remain open.
- Implemented T-049 bounded library Graph edge-budget enforcement through `max_edges`, retaining the deterministic edge prefix, rebuilding valid reverse adjacency, marking capped results incomplete, and recording `RESOURCE_LIMIT` details in ADR-026; library serialized-output/time budgets remain open.
- Implemented T-050 bounded configured ignore-glob discovery through `ignoreGlobs`, with root-relative `*`/`?`/`**` matching before reads and hashing, analyzer/CLI forwarding and validation, focused coverage, and ADR-027; broader glob semantics and library output/time budgets remain open.
- Implemented T-051 bounded hidden-file discovery policy through `hiddenFilePolicy`, applying `ignore.hidden_files` to dot-prefixed entries before reads and hashing, with analyzer/CLI forwarding, focused coverage, and ADR-028; generated-file detection and library output/time budgets remain open.
- Refreshed the retained T-043 Node host evidence and ADR-023 to the current 79-test run; the historical T-044 audit remains tied to its original source commit.
- Corrected the EPIC lifecycle metadata to reflect the current bounded M9 implementation state; full parser, broader linkage, and release work remain open.

### Not claimed

- No complete analyzer implementation has been added.
- No full parser backend, broad resolver, graph persistence, public package, or release has been added; the private root-guard/snapshot/decoder/CLI/cache/parser-adapter/scanner/Fact foundation, bounded resolvers/Graph, internal query engine, bounded analysis composition, and read-only CI workflow are the only implemented runtime or automation slices.
- No Lucee, Adobe ColdFusion, browser, database, or network verification has been performed.
