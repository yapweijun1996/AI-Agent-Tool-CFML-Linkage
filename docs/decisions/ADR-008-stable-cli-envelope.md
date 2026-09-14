# ADR-008: Keep the CLI envelope stable and fail closed

> **Status: PROVISIONAL / M1 PARTIAL.** The private CLI boundary is implemented and tested; analysis commands and release/public API remain open.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | CLI arguments, JSON stdout, stderr diagnostics, exit codes, and current capability reporting |
| Source of truth | `src/cli.js`, `bin/agent-cfml-linkage.js`, `test/cli.test.js`, this ADR, and `SPEC.md` |
| Evidence | `npm test`: 62 passed, including capabilities, invalid input, config, root rejection, incomplete command, and no-execution cases |
| Verification | Local Node subprocess tests pass; package-install, cross-platform, and released CLI checks remain unverified |
| Limitations | The CLI does not yet orchestrate snapshot, parser, resolver, Graph IR, queries, or cache stages |

## Decision

The private CLI accepts one command and an optional `--config <path>`. `capabilities`, `--help`, and `--version` are available without a configuration. Analysis and query commands require JSON configuration; the current implementation validates the safety-critical contract and root, then returns an explicit incomplete result because later stages do not exist.

Every invocation writes exactly one JSON object to stdout with this stable top-level shape:

```text
{ schema_version, tool, command, status, data, diagnostics }
```

Machine-readable diagnostics remain bounded in the envelope. Human-readable equivalents go to stderr. Exit meanings follow the v0.1 contract: `0` completed, `1` internal failure, `2` invalid input/configuration, `3` incomplete/unimplemented/limited, and `4` root/path/access rejection. No command executes analyzed source or accesses a network, database, shell, or browser.

The CLI resolves a configured relative root against the invocation working directory, admits it through the root guard, and does not claim analysis completion merely because input validation succeeded.

## Consequences

Agents can parse stdout without handling human log noise, while operators still receive actionable stderr. Incomplete implementation is observable and non-zero. The envelope and command names can evolve only through a versioned contract; public package/export and full orchestration remain deferred.
