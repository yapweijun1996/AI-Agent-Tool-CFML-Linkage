# ADR-004: Make root safety and resource limits explicit configuration

> **Status: PROVISIONAL / BOUNDED.** The v0.1 configuration shape/value boundary, root guard, and private CLI output-limit boundary are implemented for bounded scopes; broader runtime policy enforcement remains open.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Analysis root, path safety, ignores, limits, output, prohibited actions, and exit codes |
| Source of truth | This ADR and `SPEC.md`; runtime enforcement must preserve the contract |
| Evidence | `schema/agent-cfml-linkage-config-v0.1.schema.json`, `examples/config-v0.1.json`, `src/cli.js`, `test/cli.test.js`, and local schema/policy check |
| Verification | Configuration schema, shape/value, and safety invariant checks pass; `test/cli.test.js` verifies invalid configuration is rejected before root admission/analysis and bounded CLI output-limit tests pass; broader runtime policy enforcement remains unverified |
| Limitations | Platform-specific permission behavior, glob semantics, and operational defaults require implementation tests |

## Context

The analyzer will inspect source that may contain executable-looking code, secret-like content, path escapes, or resource-exhaustion inputs. Hidden defaults make safety and incomplete output difficult to audit. The boundary must be explicit in a versioned configuration contract.

## Decision

The v0.1 configuration requires:

- an explicit local `root`;
- rejection of out-of-root references;
- no symlink following and no absolute reference acceptance;
- explicit ignore globs for dependency, generated, cache, and secret-like paths;
- an allowlist of analyzed languages, explicit mappings, and explicitly enabled plugins;
- hard positive limits for files, bytes, facts, edges, evidence, traversal depth, output, wall time, and workers; the stable CLI envelope requires `max_output_bytes >= 300` so an output-limit diagnostic can itself fit within the cap;
- JSON output with diagnostics on stderr and only bounded/optional raw evidence;
- immutable prohibited-action flags: source execution, network, database, shell, and browser are all false;
- fixed exit meanings `0` completed, `1` internal failure, `2` invalid input, `3` incomplete/unsupported/limited, and `4` path/access rejection.

The machine-readable contract is `schema/agent-cfml-linkage-config-v0.1.schema.json`; its example is `examples/config-v0.1.json`. `src/cli.js` now enforces the complete v0.1 object shape and bounded value contract, including query-request validation, before root admission/analysis. This validation does not imply that every configured library/runtime budget is implemented: the private CLI enforces the serialized output-byte limit, while other configured limits are delegated to bounded stages or remain open.

## Consequences

A caller can review the complete safety policy before analysis starts, and output can distinguish incomplete analysis from invalid or rejected input. Strict defaults may reduce coverage for unusual projects, but callers can make approved mappings and ignore behavior explicit rather than relying on hidden heuristics.

The implementation must freeze validated configuration before discovery. Any change in root, mapping, ignore policy, parser, resolver, or limits must invalidate affected derived state.
