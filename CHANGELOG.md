# Changelog

> **Status: PROPOSED / UNRELEASED.** This changelog records repository changes, not external project releases.

| Field | Value |
| --- | --- |
| Version | 0.1 documentation baseline |
| Last updated | 2026-09-14 |
| Scope | Changes in this repository |
| Source of truth | Git history and this changelog |
| Evidence | Initial commit `1b29c0b`; documentation baseline and M1 foundation commits follow |
| Verification | Documentation consistency checks and `npm test` foundation checks are run during this pass |
| Limitations | No parser/resolver release runtime, public package, CI, or release exists |

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

### Not claimed

- No complete analyzer implementation has been added.
- No full parser backend, resolver, full CLI orchestration/public library API, query engine, CI workflow, public package, or release has been added; the private root-guard/snapshot/decoder/CLI/cache/parser-adapter/scanner/Fact foundation and focused tests are the only runtime slice.
- No Lucee, Adobe ColdFusion, browser, database, or network verification has been performed.
