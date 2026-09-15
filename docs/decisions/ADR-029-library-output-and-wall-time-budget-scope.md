# ADR-029: Define the bounded library output and wall-time budget scope

- **Status:** Accepted for bounded T-037; T-038–T-039 remain planned
- **Date:** 2026-09-15
- **Scope:** Private-library serialization, wall-time enforcement, and budget-contract regression coverage
- **Dependencies:** ADR-004, ADR-024, ADR-025, and ADR-026
- **Verification:** `src/output.js`, `src/cli.js`, `src/index.js`, and the bounded analyzer/CLI regression tests verify T-037; wall-time and cross-budget enforcement remain unverified

## Context

The v0.1 configuration already requires `limits.max_output_bytes` and `limits.max_wall_time_ms`. The private CLI and private library now share a bounded serialized-output helper, and the library enforces the Graph edge and evidence caps. Library wall-time enforcement and a unified cross-budget regression gate remain open, while T-037–T-039 now have executable scope.

## Decision

Define the reserved work as three bounded tasks:

- **T-037 — Library serialized-output budget:** implemented a named private-library `serializeAnalysis` boundary for analysis/query results. It counts UTF-8 bytes of the exact serialized JSON, shares the byte-counting helper with the CLI, and never truncates JSON arbitrarily. A cap hit returns an explicit `OUTPUT_LIMIT` incomplete result with bounded diagnostics; the structured `analyzeProject` object remains separate from its serialized form.
- **T-038 — Library wall-time budget:** enforce `limits.max_wall_time_ms` through a monotonic deadline with checks at stage boundaries and bounded per-file/per-record loops. A deadline returns preserved partial evidence, `complete=false`, and a deterministic `TIME_LIMIT` diagnostic identifying the limit and stage. Synchronous parser calls are not claimed to be preemptively cancellable; any non-cooperative backend limitation must remain explicit.
- **T-039 — Budget contract regression gate:** verify ownership, diagnostic codes/details, incomplete-result semantics, deterministic ordering, interaction of multiple limits, schema validity, and CLI/library parity for all configured budgets. The gate must prove that budget handling does not execute source or weaken root, network, database, shell, browser, or secret-boundary controls.

T-038–T-039 remain planned implementation work. T-037 is implemented for the bounded private-library serialization scope. This ADR does not claim library wall-time enforcement, and it does not expand parser grammar, resolver coverage, graph persistence, or release scope.

## Acceptance boundary

A task may move to **Verified** only when its source, focused tests, relevant contract updates, and reproducible evidence are present. A time cap that cannot interrupt a synchronous backend must not be reported as a hard runtime kill; the result must identify the limitation or the backend must provide a bounded cancellation checkpoint.

## Consequences

The next executable tranche is explicit without changing the current private/unreleased boundary. Existing Graph edge/evidence limits and the shared private library/CLI output helper are authoritative for their bounded scopes; wall-time and cross-budget work remain open. Public compatibility and release claims remain blocked by the broader gaps recorded in `PROGRESS.md`.
