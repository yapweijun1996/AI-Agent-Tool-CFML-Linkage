# ADR-008: Keep the CLI envelope stable and fail closed

> **Status: PROVISIONAL / M1/T-036 BOUNDED.** The private CLI boundary is implemented and tested; bounded `analyze`/`index` commands exist, while query commands and release/public API remain open.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | CLI arguments, JSON stdout, stderr diagnostics, exit codes, and current capability reporting |
| Source of truth | `src/cli.js`, `bin/agent-cfml-linkage.js`, `test/cli.test.js`, this ADR, and `SPEC.md` |
| Evidence | `npm test`: 73 passed, including capabilities, invalid input, config, root rejection, bounded analysis, explicitly unavailable parser/query command, and no-execution cases |
| Verification | Local Node subprocess tests pass; package-install, cross-platform, and released CLI checks remain unverified |
| Limitations | The CLI does not yet expose query execution; bounded `analyze`/`index` orchestration uses the explicit mixed structural scanner and remains private/unreleased |

## Decision

The private CLI accepts one command and an optional `--config <path>`. `capabilities`, `--help`, and `--version` are available without a configuration. Analysis and recognized query commands require JSON configuration. `analyze` and `index` run the bounded private pipeline; recognized query commands fail closed with `UNIMPLEMENTED_COMMAND` and exit code `3` until query-command orchestration is explicitly implemented. Serialized analysis output is capped by `limits.max_output_bytes`; an exceeded cap returns `OUTPUT_LIMIT`, `data: null`, and exit code `3`.

Every invocation writes exactly one JSON object to stdout with this stable top-level shape:

```text
{ schema_version, tool, command, status, data, diagnostics }
```

Machine-readable diagnostics remain bounded in the envelope. Human-readable equivalents go to stderr. Exit meanings follow the v0.1 contract: `0` completed, `1` internal failure, `2` invalid input/configuration, `3` incomplete/unimplemented/limited, and `4` root/path/access rejection. No command executes analyzed source or accesses a network, database, shell, or browser.

The CLI resolves a configured relative root against the invocation working directory, admits it through the root guard, rejects recognized-but-unimplemented query commands before analysis, and does not claim analysis completion merely because input validation succeeded.

## Consequences

Agents can parse stdout without handling human log noise, while operators still receive actionable stderr. Incomplete implementation is observable and non-zero. The envelope and command names can evolve only through a versioned contract; public package/export and full orchestration remain deferred.
