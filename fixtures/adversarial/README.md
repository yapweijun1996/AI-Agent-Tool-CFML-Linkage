# Adversarial fixtures

> **Status: VERIFIED / LAYOUT BASELINE.** These cases exercise trust, resource, and dynamic-expression boundaries; no input is executed.

| Case | Coverage | Expected state |
| --- | --- | --- |
| `dynamic-and-generated` | `evaluate`, generated names, dynamic URLs, dynamic SQL identifiers, runtime mappings | Verified bounded unresolved records with preserved expressions; no guessed target |
| `misleading-and-limits` | Syntax-like text in comments/strings, include cycles, oversized files, graph/output budgets, snapshot drift | No false syntax facts; bounded incomplete result with explicit diagnostics |

The `dynamic-and-generated` case now has an inert source and expected bounded output for T-033. The misleading/cycle/limit case remains a future fixture.
