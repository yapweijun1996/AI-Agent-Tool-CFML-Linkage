# Security: agent-cfml-linkage

> **Status: PROPOSED.** These are security requirements for a future implementation, not evidence of current controls.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Threat boundaries for local static analysis |
| Source of truth | This document for proposed security requirements; implementation and tests for actual controls |
| Evidence | Initial commit `1b29c0b`; no analyzer code exists |
| Verification | Root-guard containment/symlink, snapshot no-execution, strict-decoding, CLI safety, cache path/corruption, parser no-execution, and diagnostic-bound tests pass; broader security test suite does not exist |
| Limitations | Threat model, platform sandbox, dependency policy, and disclosure process require implementation-specific review |

## Security objectives

The future analyzer must minimize risk while inspecting untrusted or legacy source:

- read only explicitly authorized local paths beneath a canonical root;
- never execute application source or embedded code;
- never access databases, browsers, remote repositories, or networks;
- prevent traversal and symlink escape;
- bound CPU, memory, file count, output, evidence, and wall-clock use;
- avoid exposing secrets through logs, diagnostics, graph evidence, cache, or fixtures;
- make uncertainty and incomplete coverage visible rather than hiding it.

## Threat boundaries

### Source is input, not instructions

CFML, JavaScript, CSS, SQL, comments, strings, and generated content must be treated as data. The analyzer must not evaluate expressions, spawn commands, honor embedded instructions, or load runtime configuration as executable policy.

### Filesystem containment

Canonicalize the requested root and every discovered/reference path. Reject traversal, symlink escapes, and out-of-root targets. Ignore dependency, generated, cache, and secret-like paths by explicit policy. Path rejection must be distinguishable from an unresolved dynamic relationship.

### Resource exhaustion

Use hard limits for file size/count, bytes, facts, edges, evidence, traversal depth, output bytes, concurrency, and wall time. On exhaustion, return an explicit incomplete result and budget diagnostic; never silently truncate or continue with an implied complete graph.

### Sensitive data

Evidence must be bounded and preferably normalized. Do not include full source bodies, credentials, tokens, private keys, database passwords, or unrelated personal data in JSON, logs, fixtures, caches, documentation, or releases. Secret-like matches should be redacted or represented only by location and reason.

### Dependency and plugin risk

V1 should avoid third-party plugins. Any future plugin must be explicitly enabled, versioned, bounded, and unable to override root safety, stable identity, schema validation, or confidence policy. Dependencies require review before adoption.

## Static-analysis limitations

Static SQL relationships do not prove authorization, tenant isolation, transaction correctness, or business semantics. Static routes do not prove runtime reachability. Candidate and unresolved edges must remain visibly non-authoritative. LLM-generated suggestions may assist investigation outside the graph contract but cannot create confirmed relationships.

## Required security verification

Before release, test:

- traversal, absolute path, and symlink escape attempts;
- unreadable files and invalid encodings;
- secret-like source and bounded/redacted diagnostics;
- maliciously large files and graph explosions;
- dynamic expressions and embedded code that must not execute;
- network/database/process instrumentation showing no prohibited access;
- cache isolation, corruption handling, and stale-data invalidation;
- plugin rejection or containment if plugins exist.

The root-admission boundary is verified by the focused Node tests. No complete analyzer security review, dependency audit, runtime instrumentation, or release security verification exists.

## Reporting

Security issues should be reported privately to the repository owner before public disclosure. Do not include secrets or exploit payloads in ordinary issues, tests, or documentation.
