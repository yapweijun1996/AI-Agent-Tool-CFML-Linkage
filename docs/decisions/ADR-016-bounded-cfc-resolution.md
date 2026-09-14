# ADR-016: Bounded CFC and Method Resolution

- **Status:** Accepted for the bounded T-030 scope
- **Date:** 2026-09-14
- **Decision owners:** Core analyzer boundary

## Context

The Fact IR records literal CFC component names, imports/mappings, inheritance declarations, instantiation, and `cfinvoke` calls. Project indexes provide immutable component and method candidates, but full CFML type inference and runtime dispatch are unavailable.

## Decision

Implement `src/cfc-resolver.js` as a read-only resolver over immutable project indexes:

1. Resolve a literal component name only when the component index has one candidate.
2. Apply only explicit `cfimport` path/prefix mappings; do not use filename similarity or directory guessing.
3. Emit `EXTENDS`, `IMPLEMENTS`, `INSTANTIATES`, `CFINVOKES`, and `CALLS_METHOD` resolutions with source/target Fact IDs and resolver identity.
4. Preserve missing and ambiguous component/method candidates as `MAPPING_UNKNOWN`, `AMBIGUOUS_COMPONENT`, or `AMBIGUOUS_METHOD` unresolved records.
5. Preserve dynamic component and method expressions as `DYNAMIC_EXPRESSION` records.
6. Resolve methods only through the unique component's explicitly indexed `component.method` symbol; no receiver-type inference is claimed.
7. Let Graph IR materialize semantic component/method target nodes from the returned Fact IDs.

The resolver never evaluates CFML, loads application/runtime metadata, follows arbitrary mappings, or selects an ambiguous candidate.

## Consequences

- Direct literal CFC relationships are available for the bounded Graph IR pass.
- Explicit mapping aliases are supported without weakening root or evidence policy.
- Runtime dispatch, inheritance-chain method fallback, properties, arguments, `new`, and `createObject` semantics remain open for later fixture-backed passes.

## Verification

- `test/cfc-resolver.test.js` covers unique inheritance, instantiation, `cfinvoke`, method linkage, explicit import mappings, dynamic expressions, and ambiguity preservation.
- `test/graph.test.js` verifies semantic CFC component/method targets are represented in Graph IR.
