# Roadmap: agent-cfml-linkage

> **Status: PROPOSED / M2–M6 IN PROGRESS.** The roadmap describes intended delivery and records verified bounded slices; it is not a release plan.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Ordered delivery of the planned linkage analyzer |
| Source of truth | This roadmap for sequencing; Git history and tests for completion evidence |
| Evidence | Initial commit `1b29c0b` contained only `.gitattributes`; current local commits contain the verified foundation, bounded extractors, indexes, resolvers, and Graph builder |
| Verification | M0 contract gate, T-010–T-014/T-020–T-034 foundation/scanner/Fact/index/resolution/Graph/CFC/scope/web-flow/dynamic-evidence/SQL-repository tests, and produced Fact/Graph IR schema validation are verified; later milestones have no evidence |
| Limitations | Dates, estimates, parser selection, and release targets are intentionally not committed |

## Current state

| Area | State | Evidence |
| --- | --- | --- |
| Repository | Private prototype with verified foundation and bounded extractors | Git `main` at the current local commit; no remote publication |
| Source implementation | M1 foundation, M2 parser-adapter/bounded CFML/web scanner/Fact extractors, M3 immutable indexes/literal resolver/bounded Graph builder, M4 bounded CFC resolver, M5 bounded scope/web-flow resolvers, and M6 bounded dynamic/SQL/repository linkage implemented; broader Graph runtime not started | `src/`, `bin/`, focused tests |
| Contracts/schema | Graph IR, Fact IR, identity/order, confidence/completeness, and configuration artifacts implemented and validated; broader runtime producers remain absent | `schema/`, `examples/`, `SPEC.md`, ADR-002–ADR-004 |
| Fixture layout/manifest | Implemented and validated | `fixtures/`, `fixtures/manifest-v0.1.json`, inert golden inputs, and bounded Fact expectations |
| Focused tests | T-010–T-014/T-020–T-034 verified | `npm test`: 62 passed |
| CI/package/release | Private package/CLI foundation only; CI/release not started | `package.json`, `bin/`; no workflow, tag, or release |
| Runtime compatibility | Unknown | No local analyzer exists |
| Core SSOT documentation | Synchronized planning baseline | `GOAL.md`, `DESIGN.md`, `SPEC.md`, `EPIC.md`, `ROADMAP.md`, `TASK.md`, `PROGRESS.md`, `GOAL_PROMPT.md` |

## Delivery sequence

The current pass advances M0 to a verified gate, completes M1/T-010–T-014, verifies bounded M2 parser/scanner/Fact extraction at T-020–T-022, M3 index/literal resolution/Graph IR boundaries at T-023–T-025, bounded M4 CFC resolution at T-030, M5 scope/web-flow resolution at T-031–T-032, M6 dynamic-evidence preservation at T-033, and bounded SQL/repository linkage at T-034; it does not establish full grammar coverage or advance broader M7–M9 work. T-035+ remain open.

### Phase 0 — Contract and safety foundation

**Goal:** make the boundary testable before implementing language behavior.

- M0: Graph IR, Fact IR, diagnostics, confidence, unresolved reasons, IDs, limits, and stable JSON envelope. T-001–T-006 contract slices are verified; remaining M0 contract extensions are open.
- M1: canonical root guard, path containment, ignore policy, deterministic snapshot/discovery, decoding, source maps, and CLI input validation.

**Exit evidence:** reviewed contracts, verified contract fixtures/manifest, T-010 containment tests, T-011 deterministic snapshot tests, T-012 strict decoding/source-map tests, T-013 CLI envelope tests, planned remaining negative safety tests, and no-execution proof at the process boundary.

### Phase 1 — CFML extraction and basic linkage

- M2: parser adapter/bounded CFML/web scanners and normalized CFML/CFC/web facts (T-020–T-022 verified); full grammar and resolution remain open.
- M3: immutable indexes, bounded literal paths, includes, custom tags, Application governance, conditions, unresolved records, Graph construction/validation, and reverse adjacency (T-023–T-025 verified); broader linkage remains open.

**Exit evidence:** golden fixtures for basic CFML flow, malformed/partial input, ambiguity, and stable IDs/order.

### Phase 2 — CFC and Globe3-critical relationships

- M4: component mappings, `extends`/`implements`, instantiation, `cfinvoke`, imports, and conservative method calls (T-030 bounded resolver verified; broader type inference remains open).
- M5: ordered include scope flow, form/AJAX/`fetch`/redirect relations, and conditional routers (T-031–T-032 bounded scope/web-flow resolver verified; broader flow remains open).
- M6: preserve dynamic/generated/SQL-dynamic relationships as explicit unresolved evidence, then add bounded SQL/queryExecute and structural repository/action resolution (T-033/T-034 verified; broader SQL semantics remain open).

**Exit evidence:** unique and ambiguous type/method fixtures, include-order fixtures, browser-facing flow fixtures, and fail-closed dynamic cases.

### Phase 3 — SQL, repository, and query interface

- M6: preserve dynamic/generated/SQL-dynamic evidence first, then add statically visible `cfquery`/`queryExecute` table/datasource and structural repository/action edges (T-033/T-034 verified; broader SQL semantics remain open).
- M7: bounded `related`, `callers`, `callees`, `includes`, `included-by`, `trace`, `scope-flow`, `tables`, `routes`, `unresolved`, `explain-edge`, `impact-evidence`, and `stats` queries.

**Exit evidence:** query contract tests, evidence explanations backed by spans, traversal bounds, cycles, and SQL limitation tests.

### Phase 4 — Incremental operation and release

- M8: cache invalidation, bounded concurrency, hard resource limits, repeatability, and snapshot drift handling.
- M9: package/library/CLI smoke, golden and adversarial suites, documentation synchronization, and separately evidenced Lucee/Adobe compatibility.

**Exit evidence:** release checklist in `RELEASE.md`, reproducible artifact readback, CI results, and a versioned release note.

## Ordering constraints

- Do not implement resolver logic before the Fact IR and Graph IR contracts are frozen.
- Do not add runtime-dependent resolution to compensate for static uncertainty.
- Do not claim a language or engine as supported without fixtures and runtime evidence where applicable.
- Do not make downstream impact/test tools a dependency of the core analyzer.
- Do not publish a package until source, schema, tests, and artifact identity are traceable.

## Status policy

A milestone changes from **Not started** only when its source changes are present and its owning verification evidence passes. A design note, similar external project, or planned task is not completion evidence. Partial coverage must remain visible as partial.
