# Adversarial fixtures

> **Status: VERIFIED / LAYOUT BASELINE.** These cases exercise trust, resource, and dynamic-expression boundaries; no input is executed.

| Case | Coverage | Expected state |
| --- | --- | --- |
| `dynamic-and-generated` | `evaluate`, generated names, dynamic URLs, dynamic SQL identifiers, runtime mappings | Candidate/unresolved records with preserved expressions; no guessed target |
| `misleading-and-limits` | Syntax-like text in comments/strings, include cycles, oversized files, graph/output budgets, snapshot drift | No false syntax facts; bounded incomplete result with explicit diagnostics |

Add inert source inputs and expected bounded outputs after the safe foundation and parser tasks exist.
