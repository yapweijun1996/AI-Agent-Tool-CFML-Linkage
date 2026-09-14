# Release Plan: agent-cfml-linkage

> **Status: PROPOSED / UNRELEASED.** No package or release artifact exists.

| Field | Value |
| --- | --- |
| Version | 0.1 planning baseline |
| Last updated | 2026-09-14 |
| Scope | Versioning, release gates, artifact traceability, and compatibility claims |
| Source of truth | Git commit, validated artifacts, tests, and this release policy |
| Evidence | `package.json` is private with Node `>=20`; `.github/workflows/ci.yml` defines a read-only test matrix, but no hosted run, public package artifact, tag, or release exists |
| Verification | Root-guard/snapshot/configured-ignore/decoder/CLI/cache/parser-adapter/scanner/Fact/index/resolution/Graph/CFC/scope/web-flow/dynamic-evidence/SQL-repository/query/orchestration/robustness/adversarial-fixture/configuration/evidence/edge-budget tests (79/79), validated/copied query snapshots, vanished-snapshot-target rejection, serialized CLI output-bound evidence, produced Fact/Graph/analysis schema validation, package self-import, offline packed-artifact consumer smoke, and bounded Node host evidence pass; the CI workflow is structurally reviewed but has no hosted run, and no release candidate exists |
| Limitations | Graph persistence, library serialized-output/time budgets, public release contract, runtime support matrix, registry, hosted CI verification, and maintainer workflow are undecided; query commands remain bounded/private and the package remains private |

## Release principles

- Do not publish implementation or compatibility claims before required evidence exists.
- Every artifact must identify the exact source commit and contract/schema version.
- A release is not complete because a build passes; focused behavior, safety, determinism, package, and documentation checks must also pass.
- Partial or unsupported analysis remains explicit in the release contract.
- Release operations must not include secrets or depend on unauthorized production changes.

## Proposed versioning

Use semantic versioning after the package and public contract are established:

- `0.x`: experimental contract; breaking changes may occur with documented migration notes.
- `1.0`: Graph IR, CLI, library, safety, and completeness contracts are reviewed and stable.
- Patch releases must preserve the documented contract and correct defects without weakening safety.

The current repository has no release version. `0.1` is a design/documentation version only; the private `package.json`, package export, bounded CLI/library analysis entry, CLI envelope, cache, and root-guard/snapshot/decoder foundation are not a released package or complete linkage runtime.

## Release gates

A future release candidate requires:

1. reviewed `SPEC.md`, Graph IR schema, and public CLI/library contract;
2. focused unit, contract, golden, negative, safety, determinism, and bounded query tests;
3. verified incomplete, ambiguity, path rejection, and exit-code semantics;
4. package, installation, library import, query API, and CLI smoke checks from the packed artifact;
5. reproducible artifact metadata tied to the release source commit;
6. documentation, changelog, security, and limitation parity;
7. engine compatibility claims only for engines actually tested with recorded evidence.

## Compatibility claims

Do not claim full Lucee or Adobe ColdFusion compatibility from parser tests or from the existence of a related external tool. Engine claims require a defined fixture matrix, available environments, reproducible commands, and retained results. Current retained evidence is limited to Node `v25.2.1` on `win32`/`x64`; Lucee/Adobe ColdFusion remain unverified. Browser, database, network, and runtime behavior are outside the analyzer's execution model.

## Release checklist

- [ ] Contract/schema version recorded
- [ ] Source commit and working tree verified
- [ ] Required tests and static checks passed
- [ ] Security checks passed
- [ ] Packed artifact inspected and smoke-tested
- [ ] Public API/CLI behavior verified
- [ ] README/spec/changelog parity checked
- [ ] Known limitations and unresolved coverage documented
- [ ] Tag/release metadata points to the verified source commit
- [ ] No secrets or temporary artifacts included

## Bounded pre-release audit

T-044 has a bounded local audit of the product source at baseline commit `428feb76c77bec1c865bf6963d67f7cb932e8e9f`; the audit-only documentation commit is separate. A single `npm pack --dry-run --json` invocation identified `agent-cfml-linkage-0.1.0.tgz` with shasum `4862072d2bbb9c72c2cea36f5570f2b999f64fe9`; the tarball was not retained or published, and reproducibility is not claimed. Later packaging of the post-audit tree is not the same artifact input because the audit document is included. Security, documentation-parity, test, fixture, and static checks pass within their recorded scope. The post-T-046 package smoke was run from source commit `b608b66`; the temporary tarball was removed and hosted CI remains unverified. The complete audit record is [`docs/audits/release-security-parity-v0.1.json`](docs/audits/release-security-parity-v0.1.json).

## Current release state

**Unreleased.** A private package manifest/export, bounded `analyzeProject` library entry, bounded CLI `analyze`/`index` commands, bounded query commands over fresh analysis graphs, complete v0.1 CLI configuration shape/value validation, configured ignore-glob discovery, bounded library edge/evidence budgets, and a least-privilege Node test workflow exist; graph persistence remains absent. Local package self-import, offline packed-artifact consumer smoke, `npm pack --dry-run`, CLI smoke, and bounded Node host evidence pass, but there is no public artifact, hosted CI run, tag, or release to verify.
