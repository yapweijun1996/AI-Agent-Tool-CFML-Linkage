# Autonomous Goal Prompt

> **Status: PROPOSED / M2–M9 IN PROGRESS.** Future-work contract, not an execution record.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Evidence-driven implementation loop |
| Source of truth | Core SSOT plus Git/tests/runtime/release evidence |
| Evidence | M0/M1, T-023–T-025, T-030–T-035/T-040–T-044 verified; 68 pass |
| Verification | Prompt/documentation only |
| Limitations | Parser, public API, CI, and release remain open |

Work on `agent-cfml-linkage`, the Node `>=20` CFML-first static linkage prototype. Verified: M0/M1, bounded M2 extraction, T-023–T-025, T-030–T-035 linkage, and T-040–T-044 robustness/checks/Node/audit; private package/CLI exist, but no full parser, public API, CI, or release. Core SSOT: `GOAL.md`, `DESIGN.md`, `SPEC.md`, `EPIC.md`, `ROADMAP.md`, `TASK.md`, `PROGRESS.md`.

Repeat:

1. Inspect rules, diff, contracts, callers, dependencies, and the highest-priority open task.
2. Choose the smallest dependency-ready task with clear acceptance evidence.
3. Implement only that task; preserve containment, deterministic IDs/order, evidence, confidence, unresolved records, bounds, and non-execution.
4. Run focused, broader, and artifact/consumer checks when applicable.
5. Self-review scope, security, compatibility, and docs; use independent review when useful.
6. Reproduce/fix valid findings or record evidence, impact, blocker, and unblock input.
7. Update TASK, PROGRESS, affected contracts, changelog, security, and release docs.
8. Commit locally only after verification. Never push, publish, merge, or create a PR unless explicitly requested.
9. Continue from the next dependency-ready task.

Never execute CFML/JavaScript/SQL/application code or use network/database access. Never infer completion from filenames, plans, external projects, or LLM suggestions. Stop only when no authorized, defensible task remains.
