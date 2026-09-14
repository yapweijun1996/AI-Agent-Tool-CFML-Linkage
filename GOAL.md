# Goal: agent-cfml-linkage

> **Status: PROPOSED / PLANNING.** This goal describes the intended product outcome. The repository has no implementation evidence.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Project type | Planned NPM/library + CLI + AI-agent evidence provider; CFML-first static analyzer |
| Lifecycle | Planning / pre-prototype |
| Source of truth | This repository's Core SSOT documents for intent; Git, tests, runtime checks, and release artifacts for state |
| Evidence | Initial `main` commit `1b29c0b` contained only `.gitattributes`; this pass adds documentation, not implementation |
| Verification | No implementation, tests, runtime, package, or release verification exists |
| Limitations | Public API, package name, parser, runtime matrix, and deployment model are not yet established |

## Purpose

Enable a coding agent to inspect a CFML-first web project through a small, deterministic, evidence-backed linkage graph instead of loading or executing the whole application.

## Users and problem

Primary users are coding agents and maintainers of legacy or mixed CFML web applications. Their problem is that relationships are distributed across CFM/CFML pages, CFCs, Application files, includes, HTML forms, JavaScript requests, CSS assets, SQL, and shared scopes. Filename guesses and single-file checks are insufficient and can create unsafe false links.

## Desired outcome

Produce a versioned local library/CLI that accepts an explicitly authorized project root and returns a queryable Graph IR/JSON document. It should answer related-file, caller/callee, include, route, scope-flow, table, unresolved, and evidence-explanation questions while preserving ambiguity and incomplete coverage.

## Constraints

- Read-only, local-first, deterministic, bounded, and non-executing.
- No CFML, JavaScript, SQL, shell, browser, database, or application execution.
- No network access, guessed dynamic targets, filename-authority, or LLM-authoritative edges.
- Enforce root containment, bounded evidence, explicit confidence, unresolved records, and `complete=false` when coverage is incomplete.
- Keep generic impact reasoning and test selection in separate owning tools.

## Scope and non-goals

Scope is CFML/CFC linkage first, followed by bounded HTML forms/redirects, JavaScript AJAX/fetch, CSS imports/assets, visible SQL, Application governance, shared scope, conditions, and query operations.

Non-goals are runtime tracing, browser automation, business/security correctness proofs, unconstrained dynamic resolution, and replacement of `agent-change-impact` or `agent-test-scope`.

## Measurable success criteria

The goal is achieved only when a release has:

1. reviewed and versioned Graph IR, Fact IR, CLI/library, diagnostics, and configuration contracts;
2. deterministic golden output for the priority CFML/CFC, web-flow, scope, SQL, CSS, ambiguity, dynamic, malformed, and safety fixtures;
3. stable IDs/order across repeat runs and explicit partial/unresolved behavior;
4. verified root containment, no-execution, no-network/database, resource-limit, cache, and bounded-output behavior;
5. package/library/CLI artifact smoke evidence tied to the exact source commit;
6. compatibility claims limited to tested engines/platforms.

## State model

The project must track **Planned → Implemented → Verified → Released** independently. Current state is planned only; the documentation baseline does not advance implementation state.
