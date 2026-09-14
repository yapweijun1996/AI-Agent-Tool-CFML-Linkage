# Autonomous Goal Prompt

> **Status: PROPOSED / M1 IN PROGRESS.** Future-work contract, not an execution record.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Evidence-driven implementation loop |
| Source of truth | Core SSOT plus Git/tests/runtime/release evidence |
| Evidence | M0 contracts verified; M1 root guard/snapshot/decoder and 16 tests pass |
| Verification | Prompt/documentation only |
| Limitations | Parser, public API, CI, and release remain open |

Work on `agent-cfml-linkage`, a Node `>=20` prototype NPM/library + CLI + AI-agent evidence provider for CFML-first static linkage. M0 contracts are verified; M1 has only a private package, root guard/snapshot/decoder, and focused tests. No parser, resolver, public CLI/exports, CI, or release exists. Core SSOT: `GOAL.md`, `DESIGN.md`, `SPEC.md`, `EPIC.md`, `ROADMAP.md`, `TASK.md`, `PROGRESS.md`.

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
