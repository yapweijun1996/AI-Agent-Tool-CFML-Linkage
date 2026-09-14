# Changelog

> **Status: PROPOSED / UNRELEASED.** This changelog records repository changes, not external project releases.

| Field | Value |
| --- | --- |
| Version | 0.1 documentation baseline |
| Last updated | 2026-09-14 |
| Scope | Changes in this repository |
| Source of truth | Git history and this changelog |
| Evidence | Initial commit `1b29c0b`; documentation baseline added after that commit |
| Verification | Documentation consistency checks are run during this pass; no runtime checks exist |
| Limitations | No implementation, package, test suite, CI, or release exists |

## Unreleased

### Added

- Project classification and status boundaries in `README.md`.
- Goal, progress state, and autonomous execution contract in `GOAL.md`, `PROGRESS.md`, and `GOAL_PROMPT.md`.
- Proposed functional contract in `SPEC.md` plus the validated Graph IR schema/example contract in `schema/agent-cfml-linkage-graph-v0.1.schema.json` and `examples/graph-v0.1.json`.
- Proposed staged pipeline in `DESIGN.md`; T-001 schema/reference/count validation passed using the existing local Python `jsonschema` module.
- Proposed component ownership and data flow in `ARCHITECTURE.md`.
- Proposed epic, roadmap, task register, and test plan.
- Repository guidance and Core SSOT rules in `AGENTS.md`.
- Proposed security, release, and project-boundary ADR documents.

### Not claimed

- No analyzer implementation has been added.
- No parser, resolver, schema artifact, CLI, library API, cache, query engine, test, CI workflow, package, or release has been added.
- No Lucee, Adobe ColdFusion, browser, database, or network verification has been performed.
