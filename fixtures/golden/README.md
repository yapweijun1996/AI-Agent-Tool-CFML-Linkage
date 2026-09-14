# Golden fixtures

> **Status: VERIFIED / LAYOUT + M2 INPUT BASELINE.** These cases contain inert CFML inputs for the bounded scanner; no full parser or linkage output exists yet.

| Case | Coverage | Expected state |
| --- | --- | --- |
| `core-cfml-web-surface` | CFML page, include, Application governance, form, redirect, JavaScript fetch, CSS asset, visible SQL | Complete when all declared syntax is supported |
| `cfc-inheritance-and-scope` | CFC component/method, instantiation, method call, ordered include scope flow, conditions | Complete with confirmed/strong edges and evidence |

The current inputs support M2 structural Fact extraction. Add checked-in golden Fact/Graph outputs only after the corresponding producer and resolver contracts are verified.
