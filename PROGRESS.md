# Progress: agent-cfml-linkage

> **Status: DOCUMENTATION SYNC VERIFIED / IMPLEMENTATION NOT STARTED.** This report is evidence-based and intentionally separates plan from product state.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Current repository, implementation, verification, release, blockers, and next action |
| Source of truth | Git history/worktree, executable checks, and release readback; planning intent is in `GOAL.md`/`SPEC.md` |
| Evidence | Starting `HEAD` `1b29c0b`; only `.gitattributes` tracked before this documentation pass |
| Verification | Documentation structure, character-limit, and local-link checks passed; implementation checks are unavailable |
| Limitations | No source, manifest, dependencies, tests, CI, runtime, package, tag, or deployment exists |

## Project classification

- **Type:** planned hybrid of NPM/library, CLI, and AI-agent evidence provider.
- **Lifecycle:** planning / pre-prototype.
- **Current product boundary:** one planned static linkage analyzer; no implemented package boundary exists.
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
| Parser/extractor/resolvers | Yes | No | No | No | No source files |
| CLI/library/API | Yes | No | No | No | No manifest or entry point |
| Fixture layout/manifest | Yes | Yes | Yes | No | `fixtures/manifest-v0.1.json`, category/case directories, invariant check |
| Tests/CI | Yes | No | No | No | No test or workflow files |
| Package/release | Yes | No | No | No | No package, tag, or release |

## Progress basis

The implementation roadmap has 10 milestones, M0–M9. **M0 contract gate: verified (T-001–T-006). Runtime milestones M1–M9: implemented 0/9, verified 0/9, released 0/9.** Contract and fixture artifacts are not counted as runtime implementation progress.

Core documentation coverage is now the current work product: goal, design, specification, epic, roadmap, task register, progress report, autonomous goal prompt, architecture, test plan, security, release policy, changelog, and ADR.

## Completed in this pass

- Inspected repository rules and found the repository `AGENTS.md`; no repository `CLAUDE.md` or `CONTRIBUTING.md` exists.
- Inspected tracked tree, Git status/history, configuration, manifests, dependencies, source, entry points, tests, scripts, CI, release files, and docs.
- Confirmed no runnable implementation or product runtime is available.
- Synchronized the Core SSOT documents without converting proposed runtime design into implementation claims.
- Added and validated the Graph IR v0.1, Fact IR v0.1, identity/order, confidence/completeness, root/configuration, and fixture-layout artifacts for T-001–T-006; these do not implement the analyzer runtime.
- Preserved the boundary with external `agent-cfml-check`, `agent-code-slice`, `agent-change-impact`, and `agent-test-scope` work.

## Blockers and unresolved decisions

1. **M1 implementation baseline:** no analyzer source exists; root guard, snapshot, decoding, source maps, CLI envelope, and cache skeleton are next. Parser choice remains an M2 decision.
2. **Parser strategy:** parser and supported syntax subset are not selected; choose behind the adapter using fixture evidence.
3. **Package/runtime contract:** package name, language/runtime versions, public exports, CLI commands, and CI matrix are unknown.
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
| Build/type/lint/unit/integration/E2E | Unrun | No manifest, source, tests, or runtime |
| Package/import/CLI smoke | Unrun | No artifact exists |
| Browser/accessibility/runtime/security probes | Unrun | No runnable product exists |

## Next task / resume point

**Next task: M1 / T-010 — implement canonical root guard and symlink/traversal rejection.** Continue with T-011–T-014 before parser/resolver implementation.
