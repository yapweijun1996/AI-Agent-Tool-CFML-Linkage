# Negative fixtures

> **Status: VERIFIED / LAYOUT BASELINE.** These cases must demonstrate explicit safe failure or unresolved output; no source is executed.

| Case | Coverage | Expected state |
| --- | --- | --- |
| `ambiguity-and-out-of-root` | Duplicate component names, ambiguous mappings, and path escape attempts | Candidate/unresolved records or path rejection; never guessed confirmed edges |
| `malformed-and-partial` | Malformed CFML and recoverable embedded-language syntax errors | `PARSE_PARTIAL`/unsupported diagnostics and `complete=false` where coverage is incomplete |

Add source inputs and expected diagnostics/Graph IR after parser, root guard, and validator tasks exist.
