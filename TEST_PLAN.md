# Test Plan: agent-cfml-linkage

> **Status: PROPOSED / M2–M4 IN PROGRESS.** This plan defines future verification; focused M1 and bounded M2–M4 parser/scanner/Fact/resolution suites exist.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Contract, determinism, safety, linkage, partial-result, and release verification |
| Source of truth | This plan for intended verification; actual test output and CI for evidence |
| Evidence | Initial commit `1b29c0b` contained only `.gitattributes`; current local source includes the verified foundation and bounded extractors |
| Verification | T-001–T-006 contract checks, produced Fact/Graph IR schema validation, and T-010–T-014/T-020–T-030 `npm test` (51/51) passed; broader project test suite does not exist |
| Limitations | Exact framework, parser fixtures, supported runtimes, and performance targets are not selected |

## 1. Verification principles

- Test the contract independently from implementation details.
- Prefer frozen golden Graph IR fixtures for expected relationships and evidence.
- Include negative cases and preserve unresolved/partial results rather than guessing.
- Repeat identical snapshots/configuration/version to check deterministic semantic JSON.
- Treat build, lint, type checks, and mocks as limited evidence; none alone proves linkage correctness.
- Verify security properties with read-only, out-of-root, symlink, secret-like, and no-execution cases.

## 2. Test layers

| Layer | Purpose | Evidence required |
| --- | --- | --- |
| Unit | IDs, paths, spans, normalization, confidence, limits, and serializers | Focused passing tests |
| Contract/schema | Graph IR, Fact IR, diagnostics, unresolved records, CLI envelope | Schema/fixture assertions; T-001–T-006 cover contracts and layout |
| Golden | End-to-end static linkage for frozen projects | Expected graph/evidence comparison |
| Adversarial | Ambiguity, malformed syntax, dynamic code, cycles, escapes, drift, caps | Explicit safe failure and `complete=false` where applicable |
| Integration | CLI/library boundary, cache, query engine | Public API/CLI tests and readback |
| Package smoke | Packed/installable artifact identity and imports | `pack`/install/import/CLI evidence |
| Engine matrix | Only if the analyzer has runtime-adjacent claims | Separate, reproducible environment evidence |

## 3. Golden fixture matrix

The current inert fixture set covers bounded cases; the full fixture matrix should cover:

1. ordered `cfinclude` with shared page/request/application scope;
2. CFC inheritance, implementation, instantiation, imports, and unique method calls;
3. ambiguous mappings, duplicate component names, and ambiguous receivers;
4. `cfmodule`/custom tags and Application governance/request hooks;
5. HTML forms, `cflocation`, client redirects, XMLHttpRequest, jQuery, `fetch`, and known wrappers;
6. `if`, `switch`, `cfcase`, ternary, and Globe3-style route conditions;
7. `cfquery`/`queryExecute` table reads/writes, datasource expressions, and dynamic identifiers;
8. repository/action calls with structural evidence and filename-only non-evidence;
9. CSS imports and statically visible assets;
10. dynamic `evaluate`, `isDefined`, generated names, dynamic paths, and variable-dependent URLs;
11. malformed CFML, embedded-language parse errors, comments/strings resembling syntax, and partial recovery.

Each fixture should assert nodes, edges, confidence, evidence spans, conditions, ordering, unresolved records, diagnostics, and completeness—not just edge counts.

## 4. Safety and robustness cases

- root traversal and symlink escape;
- out-of-root references;
- ignored dependency, generated, cache, and secret-like paths;
- unreadable or invalidly encoded files;
- include and graph cycles;
- snapshot mutation during analysis;
- corrupt, stale, or version-mismatched cache;
- file/byte/fact/edge/evidence/traversal/output/time limits;
- bounded evidence that does not copy full source files;
- proof that source constructs are parsed, never executed;
- deterministic ordering across worker concurrency settings.

## 5. Acceptance gates

A future release must satisfy all required gates:

- schema and public contract tests pass;
- golden and adversarial fixtures pass;
- stable-ID and repeatability assertions pass;
- safety and root-containment tests pass;
- incomplete and exit-code semantics are verified;
- cache invalidation tests pass or cache is disabled for that release;
- CLI stdout/stderr separation is verified;
- package/install/library smoke tests pass;
- documentation matches the released contract;
- engine claims are limited to environments with evidence.

## 6. Planned commands

The current focused command is `npm test`, using Node's built-in test runner. No full build, lint, type, package, browser, or engine command exists yet. Once those workflows are implemented, the repository must document exact commands; placeholder commands must not be reported as executed checks.

## 7. Current result

**T-001–T-006, T-010–T-014, and T-020–T-030 passed:** contract schemas/examples, identity/order, confidence/completeness, configuration, fixture-manifest, root-guard containment, deterministic discovery, snapshot fingerprint, symlink, limit, strict decoding, source maps, CLI envelope, stderr separation, cache invalidation/corruption, parser unavailable/partial/failure handling, bounded CFML scanning, structural Fact extraction, golden expectations, immutable index lookups, literal path resolution, bounded Graph IR construction/validation, reverse adjacency, bounded CFC mapping/inheritance/instantiation/invoke/method resolution, unsupported regions, and no-execution checks pass; `npm test` reports 51 passed and 0 failed, and the produced Fact/Graph IR validates against schema. This uses no project dependency beyond Node built-ins. Runtime producer repeatability beyond the current foundation tests, broader Graph linkage behavior, package smoke, browser, and engine checks remain unverified.
