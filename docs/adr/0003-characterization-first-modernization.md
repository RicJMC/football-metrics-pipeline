# ADR-0003: Characterization tests before any refactor

- **Status:** Accepted
- **Date:** 2026-05-30
- **Deciders:** Repository owner

## Context

The ETL chain (`playerStats01_unicos.js` → `playerStats05_CSV.js`) is legacy
code: CommonJS, hard-coded paths, mixed concerns, no tests. It works in
production and produces a CSV that downstream Google Sheets dashboards
depend on.

Modernization options (modularization, TypeScript, ESM, lint cleanups) are
all risky in the absence of a safety net: any of them can silently change
the output and break the downstream consumer.

## Decision

Adopt **characterization-first** modernization: before changing any stage,
add a snapshot test that pins the current output of that stage for a known
input. No refactor lands without the corresponding test going green both
before and after the change.

Mechanics:

- Tests live under `test/characterization/` and run with `node --test`
  (built-in, no extra dependency).
- A harness (`phase2PipelineHarness.js`) copies the legacy scripts and a
  fixture into a temp workspace, runs them, and returns the outputs. This
  isolates each test run from the user's real `data/` and `jsonfiles/`.
- For deterministic outputs, compare JSON or CSV directly.
- For outputs that are too large to commit as fixtures, compare a SHA-256
  hash of `JSON.stringify(value)` against an approved digest.
- Fixtures and expected outputs live under `sample-data/`
  (see [ADR-0004](0004-sample-data-scope.md)).

## Alternatives considered

- **Rewrite then verify against production manually.** Rejected: slow,
  non-reproducible, and any regression risks the Google Sheets pipeline.
- **Use Jest or Vitest.** Both work, but pull in a dependency tree that has
  no other purpose in this repository. `node --test` is sufficient.
- **Property-based tests.** Useful eventually but overkill before the basic
  snapshot net exists.

## Consequences

- Positive: Every stage from 02 onwards is pinned. The happy path plus three
  edge cases (`missing-fields`, `multi-team`, `filtered-out`) currently
  cover the chain.
- Positive: Future refactor PRs have an objective pass/fail signal.
- Negative: Updating expected outputs after an intentional behavior change
  requires regenerating fixtures via `scripts/internal/build-edge-case-fixtures.js`
  (or an equivalent generator). The provenance of changes must be explained
  in the PR.
- Follow-up: Stage 1 (`playerStats01_unicos.js`) requires a mocked `data/`
  tree to be exercised; see backlog.

## References

- `test/characterization/phase2PipelineHarness.js`
- `test/characterization/phase2Pipeline.test.js`
- `test/characterization/edgeCases.test.js`
- `scripts/internal/build-edge-case-fixtures.js`
- Related ADRs: [0004](0004-sample-data-scope.md).
