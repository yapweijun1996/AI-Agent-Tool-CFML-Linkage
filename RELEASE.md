# Release Plan: agent-cfml-linkage

> **Status: PROPOSED / UNRELEASED.** No package or release artifact exists.

| Field | Value |
| --- | --- |
| Version | 0.1 planning baseline |
| Last updated | 2026-09-14 |
| Scope | Versioning, release gates, artifact traceability, and compatibility claims |
| Source of truth | Git commit, validated artifacts, tests, and this release policy |
| Evidence | `package.json` is private with Node `>=20`; no public package artifact, tag, workflow, or release exists |
| Verification | Root-guard/snapshot/decoder tests pass; no release candidate exists |
| Limitations | Public exports, runtime support matrix, registry, CI, and maintainer workflow are undecided |

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

The current repository has no release version. `0.1` is a design/documentation version only; the private `package.json` and root-guard/snapshot/decoder foundation are not a released package or linkage runtime.

## Release gates

A future release candidate requires:

1. reviewed `SPEC.md`, Graph IR schema, and public CLI/library contract;
2. focused unit, contract, golden, negative, safety, and determinism tests;
3. verified incomplete, ambiguity, path rejection, and exit-code semantics;
4. package, installation, library import, and CLI smoke checks from the packed artifact;
5. reproducible artifact metadata tied to the release source commit;
6. documentation, changelog, security, and limitation parity;
7. engine compatibility claims only for engines actually tested with recorded evidence.

## Compatibility claims

Do not claim full Lucee or Adobe ColdFusion compatibility from parser tests or from the existence of a related external tool. Engine claims require a defined fixture matrix, available environments, reproducible commands, and retained results. Browser, database, network, and runtime behavior are outside the analyzer's execution model.

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

## Current release state

**Unreleased.** A private foundation package manifest and root-guard/snapshot/decoder sources exist; there is no public artifact, CI, tag, or release to verify.
