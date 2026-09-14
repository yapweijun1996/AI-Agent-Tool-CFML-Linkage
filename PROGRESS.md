# Progress: agent-cfml-linkage

> **Status: DOCUMENTATION SYNC VERIFIED / IMPLEMENTATION NOT STARTED.** This report is evidence-based and intentionally separates plan from product state.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Current repository, implementation, verification, release, blockers, and next action |
| Source of truth | Git history/worktree, executable checks, and release readback; planning intent is in `GOAL.md`/`SPEC.md` |
| Evidence | Starting `HEAD` `1b29c0b`; only `.gitattributes` tracked before this documentation pass |
| Verification | Contract/fixture checks and `npm test` root-guard tests passed; broader implementation checks remain unavailable |
| Limitations | No parser/resolver/CLI, third-party dependencies, CI, runtime linkage, package artifact, tag, or deployment exists |

## Project classification

- **Type:** planned hybrid of NPM/library, CLI, and AI-agent evidence provider.
- **Lifecycle:** prototype / safe-foundation implementation.
- **Current product boundary:** one planned static linkage analyzer with an implemented internal root-guard slice; no public package boundary exists.
- **Runtime/browser state:** not applicable yet. No product can be started or inspected, and no browser journey exists.

## Evidence-backed state

| Area | Planned | Implemented | Verified | Released | Evidence |
| --- | --- | --- | --- | --- | --- |
| Goal and product boundary | Yes | No | No | No | `GOAL.md`, ADR-001 |
| Graph IR JSON Schema/example | Yes | Yes | Yes | No | `schema/agent-cfml-linkage-graph-v0.1.schema.json`, `examples/graph-v0.1.json`, local `jsonschema`/reference/count validation |
| Fact IR JSON Schema/example | Yes | Yes | Yes | No | `schema/agent-cfml-linkage-fact-v0.1.schema.json`, `examples/facts-v0.1.json`, local validation |
| Identity/order contract | Yes | Yes | Yes | No | ADR-002, `examples/identity-order-v0.1.json`, deterministic reference check |
| Confidence/completeness policy | Yes | Yes | Yes | No | ADR-003, `examples/confidence-v0.1.json`, policy invariant check |
| Root/configuration/limits contract | Yes | Yes | Yes | No | ADR-004, config schema/example, policy invariant check |
| Staged architecture | Yes | No | No | No | `DESIGN.md`, `ARCHITECTURE.md` |
| Root guard | Yes | Yes | Yes | No | `src/root-guard.js`, `test/root-guard.test.js`, `npm test` 6/6 |
| Parser/extractor/resolvers | Yes | No | No | No | No linkage source files |
| CLI/library/API | Yes | No | No | No | Private `package.json` test script only; no public entry point |
| Fixture layout/manifest | Yes | Yes | Yes | No | `fixtures/manifest-v0.1.json`, category/case directories, invariant check |
| Focused tests | Yes | Yes | Yes | No | Node root-guard suite: 6 passed; no CI workflow |
| Package/release | Yes | No | No | No | No package, tag, or release |

## Progress basis

The implementation roadmap has 10 milestones, M0–M9. **M0 contract gate: verified (T-001–T-006). M1: T-010 verified, T-011–T-014 open; M2–M9 not started.** Runtime milestone completion remains 0/9; the root-guard slice is not a completed linkage milestone.

Core documentation coverage is now the current work product: goal, design, specification, epic, roadmap, task register, progress report, autonomous goal prompt, architecture, test plan, security, release policy, changelog, and ADR.

## Completed in this pass

- Inspected repository rules and found the repository `AGENTS.md`; no repository `CLAUDE.md` or `CONTRIBUTING.md` exists.
- Inspected tracked tree, Git status/history, configuration, manifests, dependencies, source, entry points, tests, scripts, CI, release files, and docs.
- Confirmed no complete linkage implementation or product runtime is available; the root-guard foundation is runnable.
- Synchronized the Core SSOT documents without converting proposed runtime design into implementation claims.
- Added and validated the Graph IR v0.1, Fact IR v0.1, identity/order, confidence/completeness, root/configuration, and fixture-layout artifacts for T-001–T-006.
- Implemented and verified the Node root guard for T-010; it does not implement linkage parsing, resolution, or graph generation.
- Preserved the boundary with external `agent-cfml-check`, `agent-code-slice`, `agent-change-impact`, and `agent-test-scope` work.

## Blockers and unresolved decisions

1. **M1 continuation:** root guard is verified; deterministic discovery/snapshot, decoding/source maps, CLI envelope, and cache skeleton remain. Parser choice remains an M2 decision.
2. **Parser strategy:** parser and supported syntax subset are not selected; choose behind the adapter using fixture evidence.
3. **Public package/runtime contract:** Node `>=20` and a private package manifest are established for the foundation; public exports, CLI commands, CI matrix, and release metadata remain unknown.
4. **Compatibility evidence:** Lucee/Adobe/browser/runtime claims cannot be made until environments and fixtures exist.

These are documented planning blockers, not reasons to claim failure. No external credential, permission, or production dependency blocks this documentation pass.

## Verification

| Check | Result | Limitation |
| --- | --- | --- |
| Git status/history/tree inspection | Passed | Read-only repository evidence only |
| Rule/document/config discovery | Passed | No implementation files were available |
| Markdown metadata/trailing-whitespace check | Passed | Documentation-only check |
| GOAL_PROMPT character limit | Passed (1,987 characters) | Enforced at 2,000 characters |
| Local Markdown link check | Passed | Does not validate external links |
| Build/type/lint/unit/integration/E2E | Partial: `npm test` passed 6 root-guard tests | No linkage build/type/lint/integration/E2E suite exists |
| Package/import/CLI smoke | Unrun | Private manifest only; no public artifact or CLI |
| Browser/accessibility/runtime linkage/security probes | Unrun | No user-facing product or complete analyzer exists |

## Next task / resume point

**Next task: M1 / T-011 — implement deterministic discovery and snapshot fingerprinting.** Continue with T-012–T-014 before parser/resolver implementation.
