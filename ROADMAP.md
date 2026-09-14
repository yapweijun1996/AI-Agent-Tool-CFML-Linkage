# Roadmap: agent-cfml-linkage

> **Status: PROPOSED / NOT STARTED.** The roadmap describes intended delivery; it is not a report of completed code.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Ordered delivery of the planned linkage analyzer |
| Source of truth | This roadmap for sequencing; Git history and tests for completion evidence |
| Evidence | Initial commit `1b29c0b` contained only `.gitattributes`; no implementation exists |
| Verification | M0 contract gate and T-010–T-013 foundation tests are verified; later milestones have no evidence |
| Limitations | Dates, estimates, parser selection, and release targets are intentionally not committed |

## Current state

| Area | State | Evidence |
| --- | --- | --- |
| Repository | Initial implementation baseline plus documentation baseline | Git `main` at `1b29c0b` before this documentation commit |
| Source implementation | M1 root guard/snapshot/decoder/private CLI envelope implemented; linkage runtime not started | `src/`, `bin/`, focused tests |
| Contracts/schema | Graph IR, Fact IR, identity/order, confidence/completeness, and configuration artifacts implemented and validated; runtime producers still absent | `schema/`, `examples/`, `SPEC.md`, ADR-002–ADR-004 |
| Fixture layout/manifest | Implemented and validated | `fixtures/` and `fixtures/manifest-v0.1.json`; source/golden outputs still pending |
| Focused tests | T-010–T-013 verified | `npm test`: 21 passed |
| CI/package/release | Private package/CLI foundation only; CI/release not started | `package.json`, `bin/`; no workflow, tag, or release |
| Runtime compatibility | Unknown | No local analyzer exists |
| Core SSOT documentation | Synchronized planning baseline | `GOAL.md`, `DESIGN.md`, `SPEC.md`, `EPIC.md`, `ROADMAP.md`, `TASK.md`, `PROGRESS.md`, `GOAL_PROMPT.md` |

## Delivery sequence

The current pass advances M0 to a verified gate and M1/T-010–T-013 to verified, but does not complete M1 or advance M2–M9. It records the prototype foundation and makes T-014 the next safe-foundation task in `PROGRESS.md`.

### Phase 0 — Contract and safety foundation

**Goal:** make the boundary testable before implementing language behavior.

- M0: Graph IR, Fact IR, diagnostics, confidence, unresolved reasons, IDs, limits, and stable JSON envelope. T-001–T-005 contract slices are verified; remaining M0 contract work is open.
- M1: canonical root guard, path containment, ignore policy, deterministic snapshot/discovery, decoding, source maps, and CLI input validation.

**Exit evidence:** reviewed contracts, verified contract fixtures/manifest, T-010 containment tests, T-011 deterministic snapshot tests, T-012 strict decoding/source-map tests, T-013 CLI envelope tests, planned remaining negative safety tests, and no-execution proof at the process boundary.

### Phase 1 — CFML extraction and basic linkage

- M2: parser adapter and normalized facts for CFML/CFC, embedded HTML/JavaScript/SQL regions.
- M3: literal paths, includes, custom tags, Application governance, conditions, unresolved records, graph construction, validation, and reverse adjacency.

**Exit evidence:** golden fixtures for basic CFML flow, malformed/partial input, ambiguity, and stable IDs/order.

### Phase 2 — CFC and Globe3-critical relationships

- M4: component mappings, `extends`/`implements`, instantiation, `cfinvoke`, imports, and conservative method calls.
- M5: ordered include scope flow, form/AJAX/`fetch`/redirect relations, conditional routers, dynamic expressions, and generated symbols.

**Exit evidence:** unique and ambiguous type/method fixtures, include-order fixtures, browser-facing flow fixtures, and fail-closed dynamic cases.

### Phase 3 — SQL, repository, and query interface

- M6: statically visible SQL table read/write and datasource edges plus structural repository/action evidence.
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
