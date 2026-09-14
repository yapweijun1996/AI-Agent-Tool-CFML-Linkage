# agent-cfml-linkage

> **Status: PROPOSED.** This repository contains documentation for a planned tool. No analyzer implementation, package, CLI, test suite, or runtime verification is currently present.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Deterministic, read-only, local-first linkage analysis for CFML web applications |
| Repository evidence | Initial `main` commit `1b29c0b934129fcd005b0575d9b986159043fbc9` contained only `.gitattributes`; this pass adds documentation, not implementation |
| Source of truth | Core SSOT documents for intent; Git, tests, runtime checks, and release artifacts for actual state |
| Verification | No implementation, runtime, package, or release verification exists |
| Limitations | Public API, parser, dependencies, runtime matrix, and deployment model are not established |

## Classification

- **Project type:** planned hybrid NPM/library + CLI + AI-agent evidence provider.
- **Lifecycle:** planning / pre-prototype.
- **Current state:** documentation exists in the working tree; no product implementation exists in `HEAD`.

## Purpose

`agent-cfml-linkage` is planned as a CFML-first static analysis tool that builds an evidence-backed graph of relationships across a mixed web application:

- CFML pages (`.cfm`, `.cfml`) and components (`.cfc`)
- includes, custom tags, Application governance, CFC inheritance and method calls
- HTML forms, redirects, and endpoint references
- JavaScript functions, AJAX, `fetch`, and known client wrappers
- CSS imports and asset references where statically visible
- statically visible SQL, tables, datasources, and repository/action calls
- shared CFML scope production, consumption, and overrides

The intended output is a deterministic Graph IR/JSON document that agents can query without loading the entire source tree.

## What exists today

The repository is at contract-only inception. The Graph IR schema/example contract is implemented and locally validated; there is still no analyzer runtime code from which to claim linkage behavior. The following remain **planned**, not available:

- parser and normalized Fact IR
- project index and multi-pass resolvers
- Graph IR runtime implementation (the proposed JSON Schema contract and example now exist at `schema/agent-cfml-linkage-graph-v0.1.schema.json` and `examples/graph-v0.1.json`)
- CLI/library API
- incremental cache and query engine
- fixtures, golden outputs, tests, CI, or published artifacts

A related external project, `agent-cfml-check`, is separate bounded single-file CFML checking prior art. Its external status must not be read as implementation evidence for this repository.

## Design principles

1. **CFML-first:** CFML and CFC linkage is the core; browser-facing relations extend it.
2. **Evidence over guesses:** Every edge carries source evidence and confidence. Ambiguity remains candidate or unresolved.
3. **Read-only and non-executing:** The analyzer reads local source only. It does not execute CFML, access databases, or use networks.
4. **Deterministic:** Identical source snapshot, configuration, and tool version produce semantically stable output.
5. **Fail closed:** Dynamic expressions, unsupported syntax, path escapes, and snapshot drift are explicit limitations, not guessed relationships.
6. **Bounded:** File, size, fact, edge, evidence, traversal, output, and time limits are explicit in results.

## Documentation map

The eight Core SSOT files are `GOAL.md`, `DESIGN.md`, `SPEC.md`, `EPIC.md`, `ROADMAP.md`, `TASK.md`, `PROGRESS.md`, and `GOAL_PROMPT.md`.

- [`GOAL.md`](GOAL.md) — purpose, users, outcomes, constraints, and measurable success criteria
- [`PROGRESS.md`](PROGRESS.md) — evidence-based implementation, verification, release state, blockers, and resume point
- [`GOAL_PROMPT.md`](GOAL_PROMPT.md) — autonomous project-specific execution contract
- [`SPEC.md`](SPEC.md) — proposed functional and data contract
- [`DESIGN.md`](DESIGN.md) — staged analysis design and implementation sequence
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — component ownership and boundaries
- [`EPIC.md`](EPIC.md) — outcome, milestones, dependencies, and acceptance
- [`ROADMAP.md`](ROADMAP.md) — ordered delivery plan and current status
- [`TASK.md`](TASK.md) — actionable backlog and blockers
- [`TEST_PLAN.md`](TEST_PLAN.md) — proposed verification strategy
- [`SECURITY.md`](SECURITY.md) — threat boundaries and security requirements
- [`RELEASE.md`](RELEASE.md) — proposed release and compatibility gates
- [`CHANGELOG.md`](CHANGELOG.md) — documentation and implementation history
- [`docs/decisions/ADR-001-project-boundary.md`](docs/decisions/ADR-001-project-boundary.md) — product boundary decision
- [`AGENTS.md`](AGENTS.md) — repository-specific contribution rules

## Non-goals

The planned tool will not:

- execute CFML, JavaScript, SQL, or application code;
- connect to a database, HTTP service, browser, or remote repository;
- claim runtime behavior, authorization correctness, tenant safety, or business correctness from static syntax;
- use LLM-generated relationships as authoritative graph edges;
- infer dynamic endpoints, generated symbols, or mappings when evidence is insufficient;
- replace generic impact reasoning tools such as `agent-change-impact`.

## Verification and limitations

No implementation verification has been run. Verification begins only after source, contracts, and tests exist. Until then, all capabilities described in the documentation are proposals and all runtime, performance, compatibility, and release claims remain unknown.
