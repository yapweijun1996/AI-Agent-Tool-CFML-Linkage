# Task Register: agent-cfml-linkage

> **Status: PROPOSED / M2–M9 IN PROGRESS.** T-001–T-006, T-010–T-014, T-020–T-036, and T-040–T-044 have bounded implementation and verification evidence; T-037–T-039 are reserved and undefined, and broader linkage remains open.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Executable work required to implement and verify the planned analyzer |
| Source of truth | This register for planned work; repository source, tests, runtime checks, and release evidence for actual status |
| Evidence | Initial `HEAD` `1b29c0b`; current local HEAD includes the foundation, bounded extractors, fixtures, tests, and bounded package/compatibility evidence |
| Verification | T-001–T-006 contract checks, produced Fact/Graph/analysis IR schema validation, T-010–T-014/T-020–T-036/T-040/T-041 foundation/scanner/Fact/index/resolution/Graph/CFC/scope/web-flow/dynamic-evidence/SQL-repository/query/orchestration/robustness/adversarial-fixture tests (73/73), and bounded Node host compatibility evidence pass locally |
| Limitations | Owners, dates, package/runtime choices, and estimates are not assigned |

## Status and completion rules

- **Planned:** task is defined but has no implementation evidence.
- **In progress:** source work exists and the task remains open; verification is incomplete.
- **Implemented:** scoped source and contract changes exist.
- **Verified:** required focused checks pass and evidence is recorded.
- **Released:** verified behavior is present in the published/tagged artifact.
- **Blocked:** a concrete dependency or unresolved decision prevents safe progress.

`Done` means the scoped source exists, the relevant contract is synchronized, focused checks pass, the final diff is reviewed, and evidence is linked in `PROGRESS.md`. A design proposal, filename, external project, or passing unrelated check is not Done evidence.

## Immediate blocker

**M0 contract gate verified.** T-001–T-006 provide validated contracts/fixtures. T-010–T-014 complete the M1 foundation, and T-020–T-022 verify the fail-closed parser-adapter/bounded-scanner and bounded Fact IR boundary; T-023 verifies immutable project indexes; T-024 verifies conservative literal resolution; T-025 verifies bounded Graph IR; T-030 verifies bounded CFC resolution; T-031/T-032 verify bounded scope and web-flow/condition resolution; T-033 verifies dynamic/generated/SQL-dynamic evidence preservation; T-034 verifies bounded SQL/queryExecute and structural repository/action resolution; T-035 verifies bounded immutable graph queries and deterministic evidence explanations; T-036 verifies bounded stage orchestration and private library/CLI analysis entry points; T-040/T-041 verify bounded robustness and inert adversarial safe-failure fixtures; full grammar and broader language coverage remain open.

This blocks full-grammar and cross-file resolution tasks; bounded extraction and documentation maintenance may proceed.

## Execution ledger

| ID | Executable work | Priority | Status | Dependencies | Done/evidence |
| --- | --- | --- | --- | --- | --- |
| T-001 | Define Graph IR JSON Schema and examples | P0 | Verified | None | `schema/agent-cfml-linkage-graph-v0.1.schema.json` and `examples/graph-v0.1.json`; local schema/reference/count validation passed |
| T-002 | Define normalized Fact IR and source-span rules | P0 | Verified | T-001 | `schema/agent-cfml-linkage-fact-v0.1.schema.json` and `examples/facts-v0.1.json`; local schema/source/count/span validation passed |
| T-003 | Define stable IDs, ordering, freshness, and deduplication | P0 | Verified | T-001/T-002 | ADR-002 + `examples/identity-order-v0.1.json`; deterministic identity/order reference check passed |
| T-004 | Define confidence, unresolved reasons, diagnostics, completeness | P0 | Verified | T-001/T-002 | ADR-003 + `examples/confidence-v0.1.json`; policy invariant check passed |
| T-005 | Define root policy, ignores, limits, configuration, and exit codes | P0 | Verified | T-001 | `schema/agent-cfml-linkage-config-v0.1.schema.json`, `examples/config-v0.1.json`, ADR-004; local policy invariant check passed |
| T-006 | Create golden, negative, and adversarial fixture layout | P0 | Verified | T-001–T-005 | `fixtures/manifest-v0.1.json` and category/case directories; manifest/path/source-execution check passed |
| T-010 | Implement canonical root guard and symlink/traversal rejection | P0 | Verified | T-005 | `src/root-guard.js`, `test/root-guard.test.js`; focused root-guard cases pass within `npm test` 65/65 |
| T-011 | Implement deterministic discovery and snapshot fingerprint | P0 | Verified | T-005 | `src/snapshot.js`, `test/snapshot.test.js`; `npm test` 65/65 passed |
| T-012 | Implement safe decoding and source maps | P1 | Verified | T-005 | `src/source-map.js`, `test/source-map.test.js`; `npm test` 65/65 passed |
| T-013 | Implement stable CLI JSON envelope and stderr diagnostics | P1 | Verified | T-001/T-005 | `src/cli.js`, `bin/agent-cfml-linkage.js`, `test/cli.test.js`; `npm test` 65/65 passed |
| T-014 | Add disposable cache skeleton and invalidation fingerprints | P1 | Verified | T-003/T-011 | `src/cache.js`, `test/cache.test.js`, `docs/decisions/ADR-009-disposable-cache-invalidation.md`; `npm test` 65/65 passed |
| T-020 | Add parser adapter with partial/unsupported diagnostics | P0 | Verified | T-006/T-012 | `src/parser-adapter.js`, `src/cfml-scanner.js`, `test/parser-adapter.test.js`, ADR-010; `npm test` 65/65 passed; bounded backend explicit, default unselected |
| T-021 | Extract CFML/CFC structural and mapping facts | P0 | Verified | T-020 | `src/fact-extractor.js`, `test/fact-extractor.test.js`, `fixtures/golden/expected-facts-v0.1.json`, ADR-011; `npm test` 65/65 and produced Fact IR schema validation passed |
| T-022 | Extract forms, redirects, JS, CSS, and visible SQL facts | P1 | Verified (bounded) | T-020 | `src/web-scanner.js`, `test/web-scanner.test.js`, `fixtures/golden/web-surface/`; `npm test` 65/65 and produced Fact IR schema validation passed |
| T-023 | Build immutable project indexes | P0 | Verified | T-021 | `src/project-index.js`, `test/project-index.test.js`, ADR-013; deterministic immutable, ambiguity, missing-source, and lookup tests pass within `npm test` 65/65 |
| T-024 | Resolve literal paths, includes, custom tags, Application governance/hooks | P0 | Verified (bounded) | T-023 | `src/path-resolver.js`, `test/path-resolver.test.js`, ADR-014; literal, application, ambiguity, external, missing, dynamic, and traversal cases pass within `npm test` 65/65 |
| T-025 | Build/validate graph, unresolved records, reverse adjacency, statistics | P0 | Verified (bounded) | T-001–T-004/T-024 | `src/graph.js`, `test/graph.test.js`, ADR-015; deterministic Graph IR, unresolved preservation, schema, referential-integrity, statistics, and immutable reverse-adjacency checks pass within `npm test` 65/65 |
| T-030 | Resolve CFC mappings, imports, inheritance, instantiation, invokes, methods | P0 | Verified (bounded) | T-025 | `src/cfc-resolver.js`, `test/cfc-resolver.test.js`, ADR-016; unique, mapped, dynamic, ambiguous, inheritance, instantiation, invoke, and method cases pass within `npm test` 65/65 |
| T-031 | Resolve ordered shared-scope produces/consumes/overrides | P0 | Verified (bounded) | T-024/T-025 | `src/scope-resolver.js`, `test/scope-resolver.test.js`, ADR-017; ordered include, scope production/consumption/override, dynamic, incomplete-coverage, limits, and Graph edge cases pass within `npm test` 65/65 |
| T-032 | Resolve form, AJAX, fetch, wrappers, redirects, and conditions | P1 | Verified (bounded) | T-022/T-025 | `src/web-flow-resolver.js`, `test/web-flow-resolver.test.js`, `fixtures/golden/web-flow-and-conditions/`, ADR-018; literal flow targets, known wrappers, explicit conditions, unresolved sources, and output limits pass within `npm test` 65/65 |
| T-033 | Preserve dynamic/generated/SQL-dynamic relationships as unresolved/candidate | P0 | Verified (bounded) | T-025 | `src/cfml-scanner.js`, `src/web-scanner.js`, `src/fact-extractor.js`, `src/graph.js`, `test/dynamic-evidence.test.js`, `fixtures/adversarial/dynamic-and-generated/`, ADR-019; generated/dynamic facts, interpolated SQL identifiers/datasources, deterministic unresolved reasons, no guessed SQL edges, and comment/string filtering pass within `npm test` 65/65 |
| T-034 | Resolve SQL table/datasource and structural repository/action edges | P1 | Verified (bounded) | T-022/T-025/T-030 | `src/web-scanner.js`, `src/fact-extractor.js`, `src/repository-resolver.js`, `src/graph.js`, `schema/agent-cfml-linkage-fact-v0.1.schema.json`, `test/repository-resolver.test.js`, `fixtures/golden/sql-and-repository/`, ADR-020; literal `cfquery`/`queryExecute` tables and datasources, structural CFC-method repository actions, repeatability, bounds, and filename-only non-evidence pass within `npm test` 65/65 |
| T-035 | Implement bounded graph queries and evidence explanations | P1 | Verified (bounded) | T-025/T-030–T-034 | `src/graph-query.js`, `test/graph-query.test.js`, ADR-021; exact selectors, all declared query operations, immutable snapshots, evidence explanations, traversal bounds, ambiguity, and invalid-input behavior pass within `npm test` 65/65 |
| T-036 | Wire bounded analysis orchestration and private library surface | P0 | Verified (bounded) | T-020–T-035 | `src/analyzer.js`, `src/index.js`, package `exports`, `schema/agent-cfml-linkage-analysis-v0.1.schema.json`, `src/cli.js`, ADR-024, and `test/analyzer.test.js`; deterministic stage order, explicit parser injection, merged evidence, reverse adjacency, source-drift failure, bounded CLI `analyze`/`index`, and fail-closed unavailable-parser behavior pass |
| T-037–T-039 | Reserved post-M7 work; definitions and acceptance criteria required | P0 | Planned / unspecified | T-036 | No executable scope is registered; do not infer work from the reserved identifiers |
| T-040 | Add repeat, drift, cache, cycle, and resource-limit tests | P0 | Verified (bounded) | T-014/T-025 | `test/snapshot.test.js` repeat/content-drift/file-limit cases, `test/cache.test.js` source/config/parser/cache invalidation and corruption cases, `test/graph-query.test.js` repeat/cycle/query-limit cases, and resolver/scanner limit tests; bounded determinism and robustness evidence passes within `npm test` 65/65 |
| T-041 | Add adversarial strings/comments, malformed, ambiguity, escape, and dynamic fixtures | P0 | Verified (bounded) | T-020–T-033 | Inert negative/adversarial fixtures under `fixtures/negative/` and `fixtures/adversarial/misleading-and-limits/`, expected bounded outputs, `test/adversarial-fixtures.test.js`, and the CFML script-region guard in `src/web-scanner.js`; ambiguity, path escape, malformed/unsupported, comment/string, and include-cycle evidence passes within `npm test` |
| T-042 | Run focused/full tests, contract checks, lint/type checks, and package smoke | P0 | Verified (bounded) | T-040/T-041 | `npm test` 73/73; JavaScript syntax, JSON parse, fixture manifest/path/source-execution, Markdown-link, prompt-length, conservative credential, contract/example structural, CLI capabilities/version/analyze, package self-import, offline packed-artifact consumer smoke, `npm pack --dry-run`, and `git diff --check` checks pass. No lint/type scripts or Secretlint installation exist locally; no source execution, network, database, browser, or runtime access occurred. |
| T-043 | Verify only documented engine/platform compatibility | P1 | Verified (bounded) | T-042 | `docs/compatibility/node-v25.2.1-win32-x64.json` and ADR-023 retain Node `v25.2.1`/`win32`/`x64` evidence with `npm test` 73/73; Node versions other than the observed host, Lucee, Adobe ColdFusion, browser, database, network, application-runtime, and public-package compatibility remain unclaimed |
| T-044 | Complete release traceability, security review, and documentation parity | P0 | Verified (bounded) | T-042/T-043 | `docs/audits/release-security-parity-v0.1.json` and `RELEASE.md`; source commit, dry-run package identity, security/file checks, documentation parity, and remaining release gates are retained. No publication, CI, packed-artifact install, or public release is claimed.

## Milestone mapping

- **M0:** T-001–T-006 — contracts, policy, and fixtures.
- **M1:** T-010–T-014 — safe foundation.
- **M2–M3:** T-020–T-025 — extraction and basic linkage.
- **M4–M7:** T-030–T-035 — linkage depth and queries.
- **M8–M9:** T-040–T-044 — verification and release.

T-001–T-006, T-010–T-014, T-020–T-036, and T-040–T-044 are Verified for their bounded scopes. T-037–T-039 remain Planned / unspecified; full grammar coverage, broader cross-file resolution, CI, and public release remain open.
