# ADR-010: Keep parser selection behind a fail-closed adapter

> **Status: PROVISIONAL / M2 PARTIAL.** The parser adapter boundary and diagnostics are implemented and tested; no CFML parser backend or supported syntax claim exists.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Parser backend injection, strict decoding handoff, partial/unsupported diagnostics, and diagnostic bounds |
| Source of truth | `src/parser-adapter.js`, `test/parser-adapter.test.js`, this ADR, and `SPEC.md` |
| Evidence | `npm test`: 32 passed, including unavailable backend, invalid encoding, partial output, backend failure, bounded diagnostics, and no-execution cases |
| Verification | Adapter behavior passes locally; parser grammar feasibility, syntax coverage, and engine compatibility remain unverified |
| Limitations | The default backend is deliberately unselected; no AST, Fact IR, or CFML linkage evidence is produced |

## Decision

Define a parser-neutral adapter that accepts source bytes, delegates only to an explicitly injected synchronous backend, and returns `{file, parser_version, tree, complete, diagnostics, sourceMap}`. The adapter always performs strict UTF-8 decoding first. Invalid bytes stop before backend invocation. With no selected backend it returns `PARSER_UNAVAILABLE` and `complete=false`; a backend that returns no tree receives `UNSUPPORTED_SYNTAX`; backend errors become bounded `PARSER_FAILURE` diagnostics; partial or diagnostic-limited output remains incomplete.

Backend diagnostics are normalized to known severity/code/message/span fields and capped by `maxDiagnostics`. No raw backend object is treated as Graph IR, no cross-file resolution occurs, and no parser can promote confidence. Parser selection, grammar/runtime dependency, syntax subset, and compatibility environment remain M2 decisions requiring fixture-backed evidence.

## Consequences

The rest of the pipeline can depend on one source-coordinate and failure contract without coupling to Tree-sitter, a CFML engine, or an unverified grammar. Until a backend is selected, valid source produces explicit incomplete evidence rather than a guessed parse. The adapter contract also makes parser replacement and negative testing reversible.
