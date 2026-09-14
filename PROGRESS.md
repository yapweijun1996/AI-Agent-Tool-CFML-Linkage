# Progress: agent-cfml-linkage

> **Status: DOCUMENTATION SYNC VERIFIED / M1 FOUNDATION VERIFIED / M2 BOUNDED EXTRACTION PARTIAL.** This report is evidence-based and intentionally separates plan from product state.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Current repository, implementation, verification, release, blockers, and next action |
| Source of truth | Git history/worktree, executable checks, and release readback; planning intent is in `GOAL.md`/`SPEC.md` |
| Evidence | Initial `HEAD` `1b29c0b`; current local HEAD includes the verified foundation, bounded extractors, fixtures, and tests |
| Verification | Contract/fixture checks, produced Fact IR schema validation, and `npm test` foundation/parser-adapter/scanner/Fact tests passed (43/43); broader implementation checks remain unavailable |
| Limitations | No parser/resolver/full CLI orchestration/public API, third-party dependencies, CI, runtime linkage, package artifact, tag, or deployment exists |

## Project classification

- **Type:** planned hybrid of NPM/library, CLI, and AI-agent evidence provider.
- **Lifecycle:** prototype / M1 foundation verified, M2 bounded parser/Fact extraction partial; resolver not started.
- **Current product boundary:** one planned static linkage analyzer with implemented internal root-guard, snapshot, decoder, private CLI, cache, bounded parser, scanner, and Fact slices; no public package boundary exists.
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
| Root guard | Yes | Yes | Yes | No | `src/root-guard.js`, `test/root-guard.test.js`, 6 focused cases; suite 43/43 |
| Snapshot/discovery | Yes | Yes | Yes | No | `src/snapshot.js`, `test/snapshot.test.js`, deterministic/drift/limit/symlink checks |
| Decoder/source maps | Yes | Yes | Yes | No | `src/source-map.js`, `test/source-map.test.js`, strict UTF-8/BOM/coordinate checks |
| Parser adapter | Yes | Yes | Yes | No | `src/parser-adapter.js`, `src/cfml-scanner.js`, `src/web-scanner.js`, `test/parser-adapter.test.js`, `test/web-scanner.test.js`, ADR-010/ADR-012; bounded backend explicit, default unselected |
| Parser/extractor/resolvers | Yes | Partial | Partial | No | Explicit parser adapters, bounded CFML/web scanners, and Fact extractor exist; full parser backend and resolver source remain absent |
| Project indexes | Yes | Yes | Yes | No | `src/project-index.js`, `test/project-index.test.js`, ADR-013; deterministic immutable lookup tests pass |
| CLI/library/API | Yes | Yes | Yes | No | Private CLI envelope/capabilities entry; no public API or released artifact |
| Disposable cache | Yes | Yes | Yes | No | `src/cache.js`, `test/cache.test.js`, invalidation/corruption/path checks |
| Fixture layout/manifest | Yes | Yes | Yes | No | `fixtures/manifest-v0.1.json`, category/case directories, inert web inputs/expectations, invariant check |
| Focused tests | Yes | Yes | Yes | No | Node foundation/parser-adapter/scanner/Fact suite: 43 passed; no CI workflow |
| Package/release | Yes | No | No | No | No package, tag, or release |

## Progress basis

The implementation roadmap has 10 milestones, M0–M9. **M0 contract gate: verified (T-001–T-006). M1: T-010–T-014 verified. M2: T-020–T-022 bounded parser/scanner/Fact subset verified; T-023 immutable indexes verified; T-024+ remain open. M3 started at T-023; M4–M9 not started.** Runtime milestone completion is 1/9 (M1); M2 is partial and the bounded extractor is not a linkage resolver.

Core documentation coverage is now the current work product: goal, design, specification, epic, roadmap, task register, progress report, autonomous goal prompt, architecture, test plan, security, release policy, changelog, and ADR.

## Completed in this pass

- Inspected repository rules and found the repository `AGENTS.md`; no repository `CLAUDE.md` or `CONTRIBUTING.md` exists.
- Inspected tracked tree, Git status/history, configuration, manifests, dependencies, source, entry points, tests, scripts, CI, release files, and docs.
- Confirmed no complete linkage implementation or product runtime is available; the root-guard/snapshot/decoder/private CLI/cache/scanner/Fact foundation is runnable.
- Synchronized the Core SSOT documents while retaining proposed status for unimplemented runtime stages.
- Added and validated the Graph IR v0.1, Fact IR v0.1, identity/order, confidence/completeness, root/configuration, and fixture-layout artifacts for T-001–T-006.
- Implemented and verified the Node root guard, deterministic snapshot/discovery, strict decoder/source map, private CLI envelope, disposable cache, fail-closed parser adapter, bounded CFML/web scanners, and fixture-backed Fact extractor for T-010–T-014/T-020–T-023; no full parser grammar, linkage resolution, or graph generation exists.
- Preserved the boundary with external `agent-cfml-check`, `agent-code-slice`, `agent-change-impact`, and `agent-test-scope` work.

## Blockers and unresolved decisions

1. **M2 partial:** T-020–T-022 bounded parser/scanner/Fact extraction is verified; the default adapter still returns `PARSER_UNAVAILABLE` until an orchestrator explicitly selects a backend.
2. **T-024 boundary:** resolve only literal in-root paths and statically recoverable Application/custom-tag relationships; retain ambiguity and unsupported regions as evidence. Full grammar selection remains open and whole-language regex parsing is prohibited.
3. **Public package/runtime contract:** Node `>=20`, a private package manifest, and a private CLI entry are established for the foundation; public exports, full CLI commands, CI matrix, and release metadata remain unknown.
4. **Compatibility evidence:** Lucee/Adobe/browser/runtime claims cannot be made until environments and fixtures exist.

These are documented planning blockers, not reasons to claim failure. No external credential, permission, or production dependency blocks this documentation pass.

## Verification

| Check | Result | Limitation |
| --- | --- | --- |
| Git status/history/tree inspection | Passed | Read-only repository evidence only |
| Rule/document/config discovery | Passed | M1/M2 implementation and contract files were inspected |
| Markdown metadata/trailing-whitespace check | Passed | Documentation-only check |
| GOAL_PROMPT character limit | Passed (under 2,000 characters) | Enforced at 2,000 characters |
| Local Markdown link check | Passed | Does not validate external links |
| Build/type/lint/unit/integration/E2E | Partial: `npm test` passed 43 foundation/parser-adapter/scanner/Fact tests | No linkage build/type/lint/integration/E2E suite exists |
| Package/import/CLI smoke | Partial | Private CLI subprocess tests pass; no packed/public artifact |
| Browser/accessibility/runtime linkage/security probes | Unrun | No user-facing product or complete analyzer exists |

## Next task / resume point

**Next task: M3 / T-024 — resolve literal paths, includes, custom tags, and Application governance conservatively.** Preserve ambiguity and do not claim graph completion.
