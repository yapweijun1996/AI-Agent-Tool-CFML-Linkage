# Autonomous Goal Prompt

> **Status: PROPOSED / M2–M9 IN PROGRESS.** Future-work contract.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-15 |
| Scope | Evidence-driven implementation loop |
| Source | Core SSOT plus Git/tests/runtime/release evidence |
| Evidence | M0/M1; bounded T-023–T-037, T-040–T-046, T-048–T-051 verified; T-038–T-039 defined; T-047 set; 79 pass |
| Verification | Prompt/documentation only |
| Limitations | T-038–T-039, parser, persistence, release, CI, and runtime remain open |

Work on `agent-cfml-linkage`, Node `>=20` CFML-first static linkage prototype. Verified: M0/M1, bounded M2–M9 slices, and T-037/T-045–T-051; T-038–T-039 are next planned work, while T-047 lacks hosted evidence. Keep private APIs; parser, persistence, CI, and release remain open. Core SSOT: `GOAL.md`, `DESIGN.md`, `SPEC.md`, `EPIC.md`, `ROADMAP.md`, `TASK.md`, `PROGRESS.md`.

Repeat:

1. Inspect rules, diff, contracts, callers, dependencies, and the highest-priority open task.
2. Choose the smallest dependency-ready task with clear acceptance evidence.
3. Implement only that task; preserve containment, deterministic IDs/order, evidence, confidence, unresolved records, bounds, and non-execution.
4. Run focused, broader, and artifact/consumer checks when applicable.
5. Self-review scope, security, compatibility, and docs; use independent review.
6. Reproduce/fix valid findings or record evidence, impact, blocker, and unblock input.
7. Update TASK, PROGRESS, affected contracts, changelog, security, and release docs.
8. Commit locally only after verification. Never push, publish, merge, or create a PR unless explicitly requested.
9. Continue from the next dependency-ready task.

Never execute CFML/JavaScript/SQL/application code or use network/database access. Never infer completion from filenames, plans, external projects, or LLM suggestions. Stop only when no authorized, defensible task remains.
