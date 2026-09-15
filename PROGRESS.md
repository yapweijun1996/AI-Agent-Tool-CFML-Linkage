# Progress: agent-cfml-linkage

> **Status: PROMPT-TO-ARTIFACT AUDIT COMPLETE / CLI CONFIGURATION + LIBRARY EVIDENCE/EDGE/WALL-TIME/CROSS-BUDGET CONTRACT + IGNORE/HIDDEN-FILE POLICY VERIFIED / M1 FOUNDATION VERIFIED / M2–M9 BOUNDED IMPLEMENTATION PARTIAL.** This report is evidence-based and intentionally separates plan from product state.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-15 |
| Scope | Current repository, implementation, verification, release, blockers, and next action |
| Source of truth | Git history/worktree, executable checks, and release readback; planning intent is in `GOAL.md`/`SPEC.md` |
| Evidence | Initial `HEAD` `1b29c0b`; the pre-refresh local source baseline was `3de60e2`; the current local tree includes the verified foundation, bounded extractors, fixtures, tests, package/CLI smoke evidence, and the prompt-to-artifact audit at `docs/audits/prompt-to-artifact-v0.1.json` |
| Verification | Prompt-to-artifact audit, contract/fixture checks, produced Fact/Graph IR/analysis schema validation, private-library serialization/wall-time, and retained `npm test` foundation/parser-adapter/scanner/Fact/index/resolution/Graph/CFC/scope/web-flow/dynamic-evidence/SQL-repository/query/orchestration/robustness/adversarial-fixture/evidence-budget/edge-budget/ignore-policy/hidden-file-policy evidence passed (79/79); broader implementation checks remain unavailable |
| Limitations | No full parser/broader resolver, public release API, hosted CI verification, runtime linkage, package artifact, tag, deployment, or release exists; a least-privilege CI workflow is implemented, and bounded analysis/library orchestration and query-command CLI remain private |

## Project classification

- **Type:** planned hybrid of NPM/library, CLI, and AI-agent evidence provider.
- **Lifecycle:** prototype / M1 foundation verified, M2 bounded parser/Fact extraction partial, M3 bounded literal resolution/Graph IR, M4 bounded CFC, M5 bounded scope/web-flow, M6 bounded dynamic/SQL/repository linkage, M7 bounded graph queries, T-036 bounded orchestration, and T-045 bounded query CLI, M8 bounded robustness/adversarial evidence plus T-037 bounded library serialization, T-038 wall-time, T-039 cross-budget regression, T-048 library evidence-budget, T-049 Graph edge-budget, T-050 ignore-policy, and T-051 hidden-file-policy enforcement, and M9 bounded verification/package smoke/Node compatibility plus T-046 bounded CLI configuration enforcement and T-047 CI workflow partial; broader resolver not started.
- **Current product boundary:** one planned static linkage analyzer with implemented root-guard, snapshot, decoder, bounded CLI, private library entries (`src/index.js`/`src/analyzer.js`), bounded `serializeAnalysis`, cache, bounded parser/scanners, Fact extractor, indexes, literal resolver, Graph builder/validator, reverse adjacency, CFC resolver, scope resolver, web-flow resolver, repository resolver, graph query engine, query-command CLI, and dynamic/generated/SQL-dynamic evidence handling; package publication remains private/unreleased.
- **Runtime/browser state:** not applicable yet. No product can be started or inspected, and no browser journey exists.

## Evidence-backed state

| Area | Planned | Implemented | Verified | Released | Evidence |
| --- | --- | --- | --- | --- | --- |
| Goal and product boundary | Yes | No | No | No | `GOAL.md`, ADR-001 |
| Graph IR JSON Schema/example | Yes | Yes | Yes | No | `schema/agent-cfml-linkage-graph-v0.1.schema.json`, `examples/graph-v0.1.json`, `src/graph.js`, local schema/reference/count validation |
| Fact IR JSON Schema/example | Yes | Yes | Yes | No | `schema/agent-cfml-linkage-fact-v0.1.schema.json`, `examples/facts-v0.1.json`, local validation |
| Identity/order contract | Yes | Yes | Yes | No | ADR-002, `examples/identity-order-v0.1.json`, deterministic reference check |
| Confidence/completeness policy | Yes | Yes | Yes | No | ADR-003, `examples/confidence-v0.1.json`, policy invariant check |
| Root/configuration/limits contract | Yes | Yes | Yes | No | ADR-004, config schema/example, `src/cli.js`, `test/cli.test.js`, and policy invariant check; the private CLI rejects schema-shape, value, and unsafe ignore-pattern violations before root admission, while configured hidden-file policy and library evidence/Graph edge/wall-time budgets and bounded cross-budget behavior are enforced |
| Staged architecture | Yes | Partial | Partial | No | `DESIGN.md`, `ARCHITECTURE.md`, ADR-024, `src/analyzer.js`; bounded composition and query-command execution are implemented, while full parser/release stages remain open |
| Root guard | Yes | Yes | Yes | No | `src/root-guard.js`, `test/root-guard.test.js`, 6 focused cases; suite 79/79 |
| Snapshot/discovery | Yes | Yes | Yes | No | `src/snapshot.js`, `test/snapshot.test.js`, deterministic ignore-glob/hidden-file policy, drift/limit, symlink, and no-execution checks |
| Decoder/source maps | Yes | Yes | Yes | No | `src/source-map.js`, `test/source-map.test.js`, strict UTF-8/BOM/coordinate checks |
| Parser adapter | Yes | Yes | Yes | No | `src/parser-adapter.js`, `src/cfml-scanner.js`, `src/web-scanner.js`, `test/parser-adapter.test.js`, `test/web-scanner.test.js`, ADR-010/ADR-012; bounded backend explicit, default unselected |
| Parser/extractor/resolvers | Yes | Partial | Partial | No | Explicit parser adapters, bounded CFML/web scanners, Fact extractor, indexes, literal/CFC/scope/web-flow/repository resolvers, and bounded query engine exist; full parser backend and broader resolver source remain absent |
| Project indexes | Yes | Yes | Yes | No | `src/project-index.js`, `test/project-index.test.js`, ADR-013; deterministic immutable lookup tests pass |
| Literal resolver | Yes | Partial | Partial | No | `src/path-resolver.js`, `test/path-resolver.test.js`, ADR-014; path/Application, vanished-snapshot-target, and unresolved-state tests pass |
| Graph builder/validator | Yes | Partial | Partial | No | `src/graph.js`, `test/graph.test.js`, ADR-015; bounded Graph IR, schema, validation, statistics, and reverse-adjacency tests pass |
| CFC resolver | Yes | Partial | Partial | No | `src/cfc-resolver.js`, `test/cfc-resolver.test.js`, ADR-016; literal mapping/inheritance/instantiation/invoke/method and ambiguity tests pass |
| Scope resolver | Yes | Partial | Partial | No | `src/scope-resolver.js`, `test/scope-resolver.test.js`, ADR-017; ordered include scope production/consumption/override, incomplete-coverage, and resource-limit tests pass |
| Web-flow resolver | Yes | Partial | Partial | No | `src/web-flow-resolver.js`, `test/web-flow-resolver.test.js`, ADR-018; literal flow targets, known wrappers, explicit condition edges, unresolved sources, and output-limit tests pass |
| Dynamic/generated/SQL evidence | Yes | Partial | Partial | No | `src/cfml-scanner.js`, `src/web-scanner.js`, `src/fact-extractor.js`, `src/graph.js`, `test/dynamic-evidence.test.js`, ADR-019; dynamic/generated facts, interpolated SQL identifiers/datasources, deterministic unresolved reasons, and no-guessed-target checks pass |
| SQL/repository linkage | Yes | Partial | Partial | No | `src/web-scanner.js`, `src/fact-extractor.js`, `src/repository-resolver.js`, `src/graph.js`, `test/repository-resolver.test.js`, `fixtures/golden/sql-and-repository/`, ADR-020; literal SQL/queryExecute table/datasource nodes and structural repository/action edges pass; broader SQL semantics remain open |
| Graph queries/evidence explanations | Yes | Partial | Partial | No | `src/graph-query.js`, `test/graph-query.test.js`, ADR-021; validated/copied immutable snapshots, exact selectors, declared bounded operations, deterministic explanations, traversal limits, and ambiguity behavior pass; query-command CLI wiring is verified |
| Determinism/cache/cycle/limit robustness | Yes | Partial | Partial | No | `test/snapshot.test.js`, `test/cache.test.js`, `test/graph-query.test.js`, `test/analyzer.test.js`, `test/cli.test.js`, and resolver/scanner limit cases; repeatability, content drift, configured ignore/hidden-file policies, cache invalidation/corruption, parser-time drift, cycle safety, bounded CLI/library output, bounded-result evidence, final Graph edge caps, configured monotonic wall-time partial results, and bounded cross-budget behavior pass; the configured library evidence, Graph edge, private-library serialization, and wall-time budgets are enforced |
| CLI/library/API | Yes | Partial | Partial | No | `src/analyzer.js`, `src/index.js`, `src/output.js`, package `exports`, `src/cli.js`, `test/analyzer.test.js`, and `test/cli.test.js`; bounded private `analyzeProject`/`serializeAnalysis`/`analyze`/`index` composition passes and recognized query commands execute over fresh bounded graphs, while public release and full grammar remain open |
| Disposable cache | Yes | Yes | Yes | No | `src/cache.js`, `test/cache.test.js`, invalidation/corruption/path checks |
| Fixture layout/manifest | Yes | Yes | Yes | No | `fixtures/manifest-v0.1.json`, category/case directories, inert web/negative/adversarial inputs and expectations, manifest/source-execution invariant check |
| Focused tests | Yes | Yes | Yes | No | Node foundation/parser-adapter/scanner/Fact/index/resolution/Graph/CFC/scope/web-flow/dynamic-evidence/SQL-repository/query/orchestration/serialization/wall-time/robustness/adversarial-fixture/evidence-budget/edge-budget/ignore-policy/hidden-file-policy suite: 79 passed on Node `v25.2.1`; `.github/workflows/ci.yml` is implemented but has no hosted run |
| Package/release | Yes | Partial | Partial | No | Private package metadata/export, CLI capabilities/version/analyze smoke, offline packed-artifact consumer smoke, `npm pack --dry-run`, bounded Node host evidence, and prompt-to-artifact audit pass for their recorded scopes; CI workflow is present but has no hosted run, and no published package, tag, or release exists |

## Progress basis

The implementation roadmap has 10 milestones, M0–M9. **M0 contract gate: verified (T-001–T-006). M1: T-010–T-014 verified. M2: T-020–T-022 bounded parser/scanner/Fact subset verified; M3: T-023–T-025 bounded indexes, literal resolution, and Graph IR verified; M4: T-030 bounded CFC resolution verified; M5: T-031/T-032 bounded scope and web-flow/condition resolution verified; M6: T-033 bounded dynamic/generated/SQL-dynamic evidence preservation and T-034 bounded SQL/repository linkage verified; M7: T-035 bounded graph queries/evidence explanations, T-036 bounded analysis orchestration/private library/CLI entry points, and T-045 bounded query-command CLI verified; M8: T-037/T-040/T-041 bounded library serialization, determinism/cache/cycle/limit robustness, and inert adversarial safe-failure fixtures plus T-038 wall-time, T-039 cross-budget, T-048 library evidence-budget, T-049 Graph edge-budget, T-050 configured ignore-glob, and T-051 hidden-file policy enforcement verified; M9: T-042 bounded checks/package-CLI smoke, T-043 bounded Node host compatibility, and T-044 bounded release/security/parity audit plus T-046 bounded CLI configuration enforcement verified; T-047 adds an implemented but host-unverified CI workflow. M3 started at T-023; M4 started at T-030; M5 started at T-031; M6 started at T-033; M7 started at T-035; M8 started at T-040; M9 started at T-042.** Runtime milestone completion is 1/9 (M1); M2–M9 remain partial and the bounded implementation is not a full linkage resolver.

Core documentation coverage is now the current work product: goal, design, specification, epic, roadmap, task register, progress report, autonomous goal prompt, architecture, test plan, security, release policy, changelog, and ADRs including ADR-026–ADR-029.

## Completed in this pass

- Completed the required prompt-to-artifact audit in `docs/audits/prompt-to-artifact-v0.1.json`; it maps the explicit loop, Core SSOT files, named deliverables, checks, gates, success criteria, and blockers, and deliberately records `goal_achieved: false` because full product and release requirements remain unmet.
- Refreshed the prompt-to-artifact audit against the clean pre-refresh source baseline `3de60e2` and the observed local branch distance of 26 commits; the refresh changes audit metadata only and does not alter product or release status.

- Inspected repository rules and found the repository `AGENTS.md`; no repository `CLAUDE.md` or `CONTRIBUTING.md` exists.
- Inspected tracked tree, Git status/history, configuration, manifests, dependencies, source, entry points, tests, scripts, CI, release files, and docs.
- Confirmed no complete linkage implementation or product runtime is available; the root-guard/snapshot/decoder/bounded CLI/library/cache/scanner/Fact foundation is runnable.
- Synchronized the Core SSOT documents while retaining proposed status for unimplemented runtime stages.
- Added and validated the Graph IR v0.1, Fact IR v0.1, identity/order, confidence/completeness, root/configuration, and fixture-layout artifacts for T-001–T-006.
- Implemented and verified the Node root guard, deterministic snapshot/discovery, strict decoder/source map, bounded CLI envelope and `analyze`/`index` composition, private library entry, disposable cache, fail-closed parser adapter, bounded CFML/web scanners, fixture-backed Fact extractor, immutable indexes, bounded literal/CFC/scope/web-flow/repository resolvers, dynamic/generated/SQL-dynamic evidence handling, bounded Graph IR builder/validator/reverse adjacency, immutable graph query/evidence explanation engine, inert adversarial safe-failure fixtures, vanished-snapshot-target rejection, bounded CLI output enforcement, complete v0.1 CLI configuration validation, bounded check/package smoke evidence, and Node host compatibility evidence for T-010–T-014/T-020–T-036/T-040–T-046; no full parser grammar or broad linkage resolution exists.
- Preserved the boundary with external `agent-cfml-check`, `agent-code-slice`, `agent-change-impact`, and `agent-test-scope` work.
- Audited ADR verification counts and bounded-status statements after T-045; synchronized the remaining historical suite references to the then-current 74-test evidence without changing runtime scope; T-048 then added the library evidence-budget test.
- Implemented T-046: the private CLI now enforces the complete v0.1 configuration object shape and bounded value contract, including query-request validation, before root admission/analysis; library-wide budget enforcement remains open.
- Implemented T-047: `.github/workflows/ci.yml` defines a read-only Node 20.x/22.x/24.x `npm test` matrix without publish/deploy steps; hosted execution remains unverified.
- Implemented and locally verified T-048: `analyzeProject` and `buildGraph` enforce the configured global `max_evidence` budget with deterministic partial evidence and an explicit `RESOURCE_LIMIT` diagnostic; T-037 covers bounded private-library serialization, T-038 covers bounded wall-time, and T-039 covers bounded cross-budget enforcement.
- Implemented and locally verified T-049: `analyzeProject`, `buildGraph`, and the private CLI wiring enforce the configured final Graph `max_edges` budget with deterministic edge-prefix retention, valid reverse adjacency, and an explicit incomplete `RESOURCE_LIMIT` diagnostic; T-037 covers bounded private-library serialization, T-038 covers bounded wall-time, and T-039 covers bounded cross-budget enforcement.
- Implemented and locally verified T-050: snapshot discovery applies configured root-relative ignore globs with bounded `*`/`?`/`**` matching before source admission, and the analyzer/private CLI forward and validate the policy; default ignored directories and symlink safety diagnostics remain intact.
- Implemented and locally verified T-051: snapshot discovery applies the explicit `hidden_files` policy to dot-prefixed files and directories before source admission, and the analyzer/private CLI forward the policy without weakening symlink safety.
- Implemented and locally verified T-037 in ADR-029: `serializeAnalysis` enforces the private-library serialized-output budget with exact UTF-8 accounting, shared CLI semantics, explicit `OUTPUT_LIMIT` evidence, and no arbitrary truncation.
- Implemented and locally verified T-038 in ADR-029: `analyzeProject` enforces configured `max_wall_time_ms` with a monotonic clock, cooperative discovery/parse/Fact checkpoints, resolver stage checkpoints, preserved partial evidence, and deterministic `TIME_LIMIT` details; synchronous parser calls remain non-preemptive.
- Implemented and locally verified T-039 in ADR-029: analyzer and CLI regression coverage exercises combined edge/evidence/serialization budgets, deterministic partial results, explicit diagnostic ownership/details, JSON round-trip shape, Graph validation, CLI/library boundary behavior, and no-execution evidence.
- Refreshed the retained T-043 Node host evidence and ADR-023 from the prior 68-test observation to the current 79-test run, while preserving the historical T-044 audit record.
- Corrected stale documentation parity: ADR-022 now references the current 79-test bounded suite, CHANGELOG.md now distinguishes the implemented read-only CI workflow from its unverified hosted execution, and EPIC.md reflects the current bounded M9 implementation state.

## Blockers and unresolved decisions

1. **M2 partial:** T-020–T-022 bounded parser/scanner/Fact extraction is verified; the default adapter still returns `PARSER_UNAVAILABLE` until an orchestrator explicitly selects a backend.
2. **M3 partial:** T-023–T-025 bounded indexes, conservative literal resolution, Graph IR validation, and immutable reverse adjacency are verified; broader resolvers remain open.
3. **M4 partial:** T-030 bounded CFC mapping/inheritance/instantiation/invoke/method resolution is verified; runtime type inference and broader linkage remain open.
4. **M5 partial:** T-031/T-032 bounded ordered scope and web-flow/condition resolution are verified; full CFML scope, browser routing, and broader flow semantics remain open.
5. **M6 partial:** T-033 preserves dynamic/generated/SQL-dynamic evidence and T-034 resolves bounded visible SQL/repository structure; SQL semantics, runtime mappings, and target inference remain open.
6. **M7 partial:** T-035 provides bounded immutable graph queries and deterministic evidence explanations, T-036 composes the bounded stages behind a private library/CLI analysis entry, and T-045 wires recognized query commands to fresh bounded analysis graphs; graph persistence, public release, and full parser coverage remain open.
7. **M8 partial:** T-040/T-041 verify bounded repeatability, content drift, cache invalidation/corruption, cycle safety, resource limits, and inert adversarial safe-failure fixtures; T-036 adds parser-time drift evidence, T-037 enforces the private-library serialization budget, T-038 enforces the cooperative library wall-time budget, T-048 enforces the library evidence budget, T-049 enforces the final Graph edge budget, T-050 enforces configured ignore-glob discovery policy, T-051 enforces the configured hidden-file policy, and the CLI enforces a bounded output budget; T-039 covers bounded cross-budget behavior.
8. **M9 partial:** T-042 verifies local checks and package/CLI smoke; T-043 verifies only Node `v25.2.1` on `win32`/`x64`; no configured lint/type scripts, hosted CI run, published artifact, CFML-engine/runtime compatibility, or release exists.
9. **T-031/T-032/T-033/T-034 boundary:** Scope uses bounded literal include order and lexical references; web-flow uses supplied literal targets and explicit conditions; dynamic evidence preserves bounded expressions; repository actions require query evidence inside a uniquely resolved CFC method. Do not claim runtime behavior.
10. **Public package/runtime contract:** Node `>=20`, a private package manifest, package `exports`, private `analyzeProject`, and bounded CLI `analyze`/`index` entries and query commands are established; the CI matrix is defined but has no hosted run; public release metadata and runtime compatibility remain unknown.
11. **Compatibility evidence:** Lucee/Adobe/browser/runtime claims cannot be made until environments and fixtures exist.

These are documented planning blockers, not reasons to claim failure. No external credential, permission, or production dependency blocks this local implementation pass.

## Verification

| Check | Result | Limitation |
| --- | --- | --- |
| Git status/history/tree inspection | Passed | Read-only repository evidence only |
| Rule/document/config discovery | Passed | M1–M9 bounded implementation and contract files were inspected |
| Markdown metadata/trailing-whitespace check | Passed | Documentation-only check |
| GOAL_PROMPT character limit | Passed (under 2,000 characters) | Enforced at 2,000 characters |
| Local Markdown link check | Passed | Does not validate external links |
| Build/type/lint/unit/integration/E2E | Partial: retained `npm test` evidence records 79 foundation/parser-adapter/scanner/Fact/index/resolution/Graph/CFC/scope/web-flow/dynamic-evidence/SQL-repository/query/orchestration/serialization/wall-time/robustness/adversarial-fixture/CLI-query/configuration/evidence-budget/edge-budget/ignore-policy/hidden-file-policy tests; T-047 workflow is structurally reviewed but not hosted-run | No broader Graph linkage build/type/lint/integration/E2E suite exists; this pass did not execute project source |
| Package/import/CLI smoke | Passed (bounded) | Private package self-reference/import, offline packed-artifact consumer analysis, CLI capabilities/version/analyze, and `npm pack --dry-run` pass; package remains private and unpublished |
| Node host compatibility | Passed (bounded) | `docs/compatibility/node-v25.2.1-win32-x64.json`; only Node `v25.2.1` on `win32`/`x64` is evidenced |
| Browser/accessibility/runtime linkage/security probes | Unrun | No user-facing product or complete analyzer exists |

## Next task / resume point

**Next executable tranche:** no additional dependency-ready budget task remains. T-037–T-039, T-050, and T-051 are complete for their bounded scopes; T-052 records the incomplete prompt-to-artifact audit. Full parser/broader resolver work remains blocked by the unselected full parser/runtime scope; preserve the private/unreleased boundary and do not publish or claim broader compatibility.

**Scoped progress:** product milestones 11% (1/9 runtime milestones); executable task evidence 97.5% (39/40 tracked tasks verified, with T-047 host-unverified).
