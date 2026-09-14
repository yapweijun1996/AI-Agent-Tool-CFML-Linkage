# Fixture baseline

> **Status: VERIFIED / LAYOUT BASELINE.** This directory defines inert inputs and expected-behavior categories for future parser/resolver tests. Nothing here is executed.

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Last updated | 2026-09-14 |
| Scope | Golden, negative, and adversarial fixture organization |
| Source of truth | `manifest-v0.1.json` and each fixture's README |
| Evidence | T-006 layout/manifest invariant check |
| Verification | Layout and manifest consistency checked; parser/runtime behavior unverified |
| Limitations | Fixture source and golden outputs will be populated after parser/Fact IR implementation |

## Layout

```text
fixtures/
  golden/       expected supported static relationships
  negative/     safe handling of malformed, ambiguous, or rejected input
  adversarial/  dynamic, misleading, resource, and boundary cases
  manifest-v0.1.json
```

Each case has a stable ID, category, input directory, expected analysis state, and covered contract requirements. Expected results must assert evidence, confidence, unresolved records, diagnostics, ordering, and completeness—not only edge counts.

The fixture corpus is inert test data. Future test runners must parse it as data and must never execute CFML, JavaScript, SQL, application hooks, or browser behavior.
