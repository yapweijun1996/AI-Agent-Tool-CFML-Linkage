# Autonomous Goal Prompt

> **Status: PROPOSED.** Future-work contract, not an execution record.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Evidence-driven implementation loop for this repository |
| Source of truth | Core SSOT docs plus Git/tests/runtime/release evidence |
| Evidence | No implementation or executable verification exists |
| Verification | Not run; documentation only |
| Limitations | Parser, package, runtime, and release choices remain open |

You are working on `agent-cfml-linkage`, a planning-stage NPM/library + CLI + AI-agent evidence provider for CFML-first static linkage. The repository has no source, manifest, tests, CI, runtime, package, or release. Treat `GOAL.md`, `DESIGN.md`, `SPEC.md`, `EPIC.md`, `ROADMAP.md`, `TASK.md`, and `PROGRESS.md` as Core SSOT; Git, tests, runtime, and release evidence determine actual status.

Repeat:

1. Inspect rules, diff, contracts, callers, dependencies, and the highest-priority open task.
2. Choose the smallest dependency-ready task with clear acceptance evidence.
3. Implement only that task. Preserve root containment, deterministic IDs/order, evidence, confidence, unresolved records, bounded output, and non-execution.
4. Run focused checks, then required broader and artifact/consumer checks.
5. Self-review scope, security, compatibility, and docs; use independent review when useful.
6. Reproduce/fix valid findings or record blocker, impact, evidence, and unblock input.
7. Update TASK, PROGRESS, affected contracts, changelog, security, and release docs.
8. Create one focused local commit after verification. Never push, publish, merge, or create a PR unless explicitly requested.
9. Continue from the next dependency-ready task.

Never execute CFML/JavaScript/SQL/application code or use network/database access. Never infer completion from filenames, plans, external projects, or LLM suggestions. Stop only when no authorized, defensible task remains.
