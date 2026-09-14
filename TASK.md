# Task Register: agent-cfml-linkage

> **Status: PROPOSED / BACKLOG.** No implementation task below is recorded as completed by the current repository.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Executable work required to implement and verify the planned analyzer |
| Source of truth | This register for planned work; repository source, tests, runtime checks, and release evidence for actual status |
| Evidence | Initial `HEAD` `1b29c0b`; only `.gitattributes` is tracked before the documentation commit |
| Verification | No implementation task verification has run |
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

**BLOCKED — no implementation baseline or contract freeze exists.** M0 must establish the Graph IR/Fact IR schema, supported syntax boundary, configuration, parser selection criteria, limits, and golden fixtures before feature implementation can be accepted.

This blocks implementation tasks, not documentation maintenance.

## Execution ledger

| ID | Executable work | Priority | Status | Dependencies | Done/evidence |
| --- | --- | --- | --- | --- | --- |
| T-001 | Define Graph IR JSON Schema and examples | P0 | Planned | None | Schema review + validation fixtures |
| T-002 | Define normalized Fact IR and source-span rules | P0 | Planned | T-001 | Reviewed types + fixture assertions |
| T-003 | Define stable IDs, ordering, freshness, and deduplication | P0 | Planned | T-001/T-002 | Repeatability and identity tests |
| T-004 | Define confidence, unresolved reasons, diagnostics, completeness | P0 | Planned | T-001/T-002 | Contract and negative tests |
| T-005 | Define root policy, ignores, limits, configuration, and exit codes | P0 | Planned | T-001 | Safety and CLI contract tests |
| T-006 | Create golden, negative, and adversarial fixture layout | P0 | Planned | T-001–T-005 | Versioned fixture baseline |
| T-010 | Implement canonical root guard and symlink/traversal rejection | P0 | Planned | T-005 | Passing containment tests |
| T-011 | Implement deterministic discovery and snapshot fingerprint | P0 | Planned | T-005 | Snapshot/drift tests |
| T-012 | Implement safe decoding and source maps | P1 | Planned | T-005 | Encoding/span tests |
| T-013 | Implement stable CLI JSON envelope and stderr diagnostics | P1 | Planned | T-001/T-005 | Public CLI contract tests |
| T-014 | Add disposable cache skeleton and invalidation fingerprints | P1 | Planned | T-003/T-011 | Corruption/staleness tests |
| T-020 | Add parser adapter with partial/unsupported diagnostics | P0 | Planned | T-006/T-012 | Parser fixtures and diagnostics |
| T-021 | Extract CFML/CFC structural and mapping facts | P0 | Planned | T-020 | Golden Fact IR fixtures |
| T-022 | Extract forms, redirects, JS, CSS, and visible SQL facts | P1 | Planned | T-020 | Mixed-language fixtures |
| T-023 | Build immutable project indexes | P0 | Planned | T-021 | Index determinism tests |
| T-024 | Resolve literal paths, includes, custom tags, Application governance/hooks | P0 | Planned | T-023 | Basic linkage golden suite |
| T-025 | Build/validate graph, unresolved records, reverse adjacency, statistics | P0 | Planned | T-001–T-004/T-024 | Schema, referential-integrity, and golden tests |
| T-030 | Resolve CFC mappings, imports, inheritance, instantiation, invokes, methods | P0 | Planned | T-025 | Unique/ambiguous type fixtures |
| T-031 | Resolve ordered shared-scope produces/consumes/overrides | P0 | Planned | T-024/T-025 | Include-order and scope fixtures |
| T-032 | Resolve form, AJAX, fetch, wrappers, redirects, and conditions | P1 | Planned | T-022/T-025 | Web-flow and route fixtures |
| T-033 | Preserve dynamic/generated/SQL-dynamic relationships as unresolved/candidate | P0 | Planned | T-025 | Fail-closed negative fixtures |
| T-034 | Resolve SQL table/datasource and structural repository/action edges | P1 | Planned | T-022/T-025 | SQL limitation fixtures |
| T-035 | Implement bounded graph queries and evidence explanations | P1 | Planned | T-025/T-030–T-034 | Public query contract tests |
| T-040 | Add repeat, drift, cache, cycle, and resource-limit tests | P0 | Planned | T-014/T-025 | Determinism and robustness evidence |
| T-041 | Add adversarial strings/comments, malformed, ambiguity, escape, and dynamic fixtures | P0 | Planned | T-020–T-033 | Safe failure evidence |
| T-042 | Run focused/full tests, contract checks, lint/type checks, and package smoke | P0 | Planned | T-040/T-041 | Reproducible command output |
| T-043 | Verify only documented engine/platform compatibility | P1 | Planned | T-042 | Environment-specific retained results |
| T-044 | Complete release traceability, security review, and documentation parity | P0 | Planned | T-042/T-043 | Release checklist + exact source/artifact identity |

## Milestone mapping

- **M0:** T-001–T-006 — contracts, policy, and fixtures.
- **M1:** T-010–T-014 — safe foundation.
- **M2–M3:** T-020–T-025 — extraction and basic linkage.
- **M4–M7:** T-030–T-035 — linkage depth and queries.
- **M8–M9:** T-040–T-044 — verification and release.

All tasks are currently Planned. The next task is T-001, subject to the M0 contract-freeze review.
