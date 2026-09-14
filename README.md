# agent-cfml-linkage

> **Status: PROPOSED / M2–M9 IN PROGRESS.** The repository contains verified M1 safety and bounded M2–M9 parser/scanner/Fact/resolution/query/robustness/adversarial/check slices; the full linkage analyzer, public API, and release are not complete.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Deterministic, read-only, local-first linkage analysis for CFML web applications |
| Repository evidence | Initial `main` commit `1b29c0b934129fcd005b0575d9b986159043fbc9` contained only `.gitattributes`; subsequent local commits add the verified foundation, bounded extractors, indexes, resolver, and graph builder |
| Source of truth | Core SSOT documents for intent; Git, tests, runtime checks, and release artifacts for actual state |
| Verification | `npm test` passes 68 focused foundation/parser/scanner/Fact/index/resolution/Graph/CFC/scope/web-flow/dynamic-evidence/SQL-repository/query/robustness/adversarial-fixture tests; bounded Fact/Graph IR validates against schema; broader linkage/runtime/package/release verification is absent |
| Limitations | Public API, parser, dependencies, runtime matrix, and deployment model are not established |

## Classification

- **Project type:** planned hybrid NPM/library + CLI + AI-agent evidence provider.
- **Lifecycle:** prototype / M1 foundation verified, M2 bounded parser/Fact extraction, M3 bounded resolution/Graph IR, M4 bounded CFC, M5 scope/web-flow, M6 bounded dynamic/SQL/repository linkage, M7 bounded graph queries, and M8 bounded robustness/adversarial evidence in progress; broader resolver not started.
- **Current state:** M0 contracts, the complete M1 foundation, bounded M2 parser/scanner/Fact extraction, bounded M3 resolution/Graph IR, bounded M4 CFC, M5 scope/web-flow, M6 dynamic/generated/SQL/repository linkage, M7 graph query/evidence slices, M8 robustness/adversarial safe-failure evidence, and M9 local checks/package smoke are implemented/verified; no full parser grammar, broader resolver, public API, or released package exists.

## Purpose

`agent-cfml-linkage` is planned as a CFML-first static analysis tool that builds an evidence-backed graph of relationships across a mixed web application:

- CFML pages (`.cfm`, `.cfml`) and components (`.cfc`)
- includes, custom tags, Application governance, CFC inheritance and method calls
- HTML forms, redirects, and endpoint references
- JavaScript functions, AJAX, `fetch`, and known client wrappers
- CSS imports and asset references where statically visible
- statically visible SQL, tables, datasources, and repository/action calls
- shared CFML scope production, consumption, and overrides

The intended output is a deterministic Graph IR/JSON document that agents can query without loading the entire source tree.

## What exists today

The repository has completed its verified M1 safety foundation and advanced M2 with bounded CFML/web scanners and Fact extraction behind the parser adapter. Graph IR/Fact IR/configuration contracts, the M1 foundation, bounded structural Fact extraction, immutable indexes, literal/CFC/scope/web-flow resolution, dynamic/generated/SQL evidence preservation, bounded SQL/queryExecute extraction, structural repository/action resolution, bounded Graph construction, and bounded graph queries/evidence explanations are implemented/verified; full grammar coverage and broader resolver runtime remain absent. The following remain **planned**, not available:

- full parser/extractor runtime beyond the fixture-backed bounded Fact IR subset
- broader multi-pass resolvers (bounded literal path/Application, CFC, scope, SQL, and repository resolution are now implemented internally)
- broader Graph IR linkage and analysis orchestration (bounded Graph construction/validation exists in `src/graph.js`, and bounded immutable queries/evidence explanations exist in `src/graph-query.js`; the proposed JSON Schema contract and example remain at `schema/agent-cfml-linkage-graph-v0.1.schema.json` and `examples/graph-v0.1.json`)
- public CLI/library API (the private package exposes only an un-released validation envelope)
- full incremental analysis orchestration/cache and public query integration
- broader golden resolver fixtures and the full CLI/library integration; the fixture layout, manifest, inert negative/adversarial source inputs, bounded expectations, T-034 SQL/repository fixture, and local package/CLI smoke exist, while CI and published artifacts remain unavailable

A related external project, `agent-cfml-check`, is separate bounded single-file CFML checking prior art. Its external status must not be read as implementation evidence for this repository.

## Design principles

1. **CFML-first:** CFML and CFC linkage is the core; browser-facing relations extend it.
2. **Evidence over guesses:** Every edge carries source evidence and confidence. Ambiguity remains candidate or unresolved.
3. **Read-only and non-executing:** The analyzer reads local source only. It does not execute CFML, access databases, or use networks.
4. **Deterministic:** Identical source snapshot, configuration, and tool version produce semantically stable output.
5. **Fail closed:** Dynamic expressions, unsupported syntax, path escapes, and snapshot drift are explicit limitations, not guessed relationships.
6. **Bounded:** File, size, fact, edge, evidence, traversal, output, and time limits are explicit in results.

## Documentation map

The eight Core SSOT files are `GOAL.md`, `DESIGN.md`, `SPEC.md`, `EPIC.md`, `ROADMAP.md`, `TASK.md`, `PROGRESS.md`, and `GOAL_PROMPT.md`.

- [`GOAL.md`](GOAL.md) — purpose, users, outcomes, constraints, and measurable success criteria
- [`PROGRESS.md`](PROGRESS.md) — evidence-based implementation, verification, release state, blockers, and resume point
- [`GOAL_PROMPT.md`](GOAL_PROMPT.md) — autonomous project-specific execution contract
- [`SPEC.md`](SPEC.md) — proposed functional and data contract
- [`DESIGN.md`](DESIGN.md) — staged analysis design and implementation sequence
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — component ownership and boundaries
- [`EPIC.md`](EPIC.md) — outcome, milestones, dependencies, and acceptance
- [`ROADMAP.md`](ROADMAP.md) — ordered delivery plan and current status
- [`TASK.md`](TASK.md) — actionable backlog and blockers
- [`TEST_PLAN.md`](TEST_PLAN.md) — proposed verification strategy
- [`SECURITY.md`](SECURITY.md) — threat boundaries and security requirements
- [`RELEASE.md`](RELEASE.md) — proposed release and compatibility gates
- [`CHANGELOG.md`](CHANGELOG.md) — documentation and implementation history
- [`docs/decisions/ADR-001-project-boundary.md`](docs/decisions/ADR-001-project-boundary.md) — product boundary decision
- [`docs/decisions/ADR-002-deterministic-identity-and-ordering.md`](docs/decisions/ADR-002-deterministic-identity-and-ordering.md) — identity, freshness, deduplication, and ordering decision
- [`docs/decisions/ADR-003-confidence-and-completeness.md`](docs/decisions/ADR-003-confidence-and-completeness.md) — confidence, unresolved, diagnostics, and completeness decision
- [`docs/decisions/ADR-004-root-policy-and-limits.md`](docs/decisions/ADR-004-root-policy-and-limits.md) — root safety, limits, output, and exit-code decision
- [`docs/decisions/ADR-005-node-foundation-runtime.md`](docs/decisions/ADR-005-node-foundation-runtime.md) — Node foundation and zero-dependency decision
- [`docs/decisions/ADR-006-deterministic-source-snapshot.md`](docs/decisions/ADR-006-deterministic-source-snapshot.md) — deterministic discovery and snapshot decision
- [`docs/decisions/ADR-007-strict-decoding-and-source-maps.md`](docs/decisions/ADR-007-strict-decoding-and-source-maps.md) — strict UTF-8 and coordinate decision
- [`docs/decisions/ADR-008-stable-cli-envelope.md`](docs/decisions/ADR-008-stable-cli-envelope.md) — stable JSON envelope and CLI safety decision
- [`docs/decisions/ADR-009-disposable-cache-invalidation.md`](docs/decisions/ADR-009-disposable-cache-invalidation.md) — disposable cache and invalidation decision
- [`docs/decisions/ADR-010-parser-adapter-boundary.md`](docs/decisions/ADR-010-parser-adapter-boundary.md) — fail-closed parser boundary decision
- [`docs/decisions/ADR-011-bounded-fact-extraction.md`](docs/decisions/ADR-011-bounded-fact-extraction.md) — fixture-backed Fact extraction decision
- [`docs/decisions/ADR-012-bounded-web-fact-extraction.md`](docs/decisions/ADR-012-bounded-web-fact-extraction.md) — bounded mixed-language Fact extraction decision
- [`docs/decisions/ADR-013-immutable-project-indexes.md`](docs/decisions/ADR-013-immutable-project-indexes.md) — immutable index boundary decision
- [`docs/decisions/ADR-014-conservative-literal-path-resolution.md`](docs/decisions/ADR-014-conservative-literal-path-resolution.md) — conservative literal path resolution decision
- [`docs/decisions/ADR-015-bounded-graph-construction.md`](docs/decisions/ADR-015-bounded-graph-construction.md) — bounded Graph IR and reverse adjacency decision
- [`docs/decisions/ADR-016-bounded-cfc-resolution.md`](docs/decisions/ADR-016-bounded-cfc-resolution.md) — bounded CFC/method resolution decision
- [`docs/decisions/ADR-017-bounded-shared-scope-resolution.md`](docs/decisions/ADR-017-bounded-shared-scope-resolution.md) — bounded shared-scope resolution decision
- [`docs/decisions/ADR-018-bounded-web-flow-and-condition-resolution.md`](docs/decisions/ADR-018-bounded-web-flow-and-condition-resolution.md) — bounded web-flow and condition resolution decision
- [`docs/decisions/ADR-019-bounded-dynamic-generated-and-sql-evidence.md`](docs/decisions/ADR-019-bounded-dynamic-generated-and-sql-evidence.md) — bounded dynamic, generated, and SQL evidence decision
- [`docs/decisions/ADR-020-bounded-sql-and-repository-linkage.md`](docs/decisions/ADR-020-bounded-sql-and-repository-linkage.md) — bounded SQL and repository linkage decision
- [`docs/decisions/ADR-021-bounded-graph-queries-and-evidence.md`](docs/decisions/ADR-021-bounded-graph-queries-and-evidence.md) — bounded graph queries and evidence explanation decision
- [`docs/decisions/ADR-022-adversarial-fixture-safe-failure.md`](docs/decisions/ADR-022-adversarial-fixture-safe-failure.md) — adversarial fixture and safe-failure boundary decision
- [`AGENTS.md`](AGENTS.md) — repository-specific contribution rules

## Non-goals

The planned tool will not:

- execute CFML, JavaScript, SQL, or application code;
- connect to a database, HTTP service, browser, or remote repository;
- claim runtime behavior, authorization correctness, tenant safety, or business correctness from static syntax;
- use LLM-generated relationships as authoritative graph edges;
- infer dynamic endpoints, generated symbols, or mappings when evidence is insufficient;
- replace generic impact reasoning tools such as `agent-change-impact`.

## Verification and limitations

Foundation, bounded extraction, immutable-index, literal-resolution, bounded CFC/scope/web-flow/dynamic-evidence/SQL-repository resolution, bounded Graph IR, bounded graph-query verification, and inert adversarial safe-failure fixture checks have been run with `npm test` (68/68 passed). The private CLI envelope, cache foundation, bounded scanner, fixture-backed Fact extractor, immutable indexes, literal/CFC/scope/web-flow/repository resolvers, and Graph builder are tested, but no full parser grammar, broader resolver, full CLI orchestration, browser, engine compatibility, deployment, or release verification exists; all linkage capabilities and compatibility claims remain proposed.
