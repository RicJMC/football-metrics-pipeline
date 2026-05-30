# ADR-0005: Adopt ESLint flat config + Prettier as the lint/format toolchain

- **Status:** Proposed
- **Date:** 2026-05-30
- **Deciders:** Repository owner

## Context

The codebase currently has no lint and no formatter. Style is informally
consistent in the new code (`scripts/verify.js`, `scripts/pipeline-sample.js`,
characterization tests) but drifts in the legacy ETL stages (`scripts/playerStats*.js`)
and scrapers (`scrappe/*.js`). Phase 4 of [docs/MODERNIZATION_PLAN.md](../MODERNIZATION_PLAN.md)
calls out a lint/format toolchain as the first step.

Two concrete needs:

1. A pre-merge gate that fails CI when committed code violates baseline
   style/correctness rules — independent of human review.
2. An auto-fixer that removes style debates from PRs (especially relevant
   once an agentic PR workflow is in place; see [ADR-0006](0006-agentic-pr-workflow.md)).

Constraints:

- Must run on Windows, macOS and Linux (already a project invariant; see
  `scripts/verify.js`).
- Must not require a transpilation step (the project is plain ES2020 CommonJS
  with no build).
- Must not destabilise legacy scrapers/ETL stages — characterization tests
  ([ADR-0003](0003-characterization-first-modernization.md)) are the
  contract there.
- Should match what JavaScript shops use in 2026 so the skill is portable.

## Decision

Adopt **ESLint v9 flat config + Prettier** as the lint/format toolchain.

Mechanics:

- `eslint.config.js` (flat config) at the repo root. Plugins kept to a minimum:
  `@eslint/js` (recommended ruleset), `eslint-plugin-n` (Node.js best practices),
  `eslint-config-prettier` (turns off rules that conflict with Prettier).
- `.prettierrc.json` with conservative defaults (`printWidth: 100`, `singleQuote: true`,
  `semi: true`, `trailingComma: 'all'`).
- `.prettierignore` and `.eslintignore` (or `ignores` in flat config) exclude
  generated artefacts: `data/`, `jsonfiles/`, `csv/`, `tmp/`, `scrappe/tmp/`,
  `node_modules/`, `sample-data/**/*.json`, `sample-data/**/*.csv`.
- npm scripts: `lint`, `lint:fix`, `format`, `format:check`.
- `npm run verify` gains a `lint` step (fail-fast).
- CI workflow (`.github/workflows/verify.yml`) already runs `npm run verify`,
  so no separate CI step is needed.

Scope of first adoption:

- **Auto-fix and pin** new code: `scripts/verify.js`, `scripts/pipeline-sample.js`,
  `scripts/internal/**`, `test/**`.
- **Lint but do not auto-fix** legacy code: `scripts/playerStats*.js`,
  `scrappe/*.js`. Use an `ignores` override with a TODO comment so the
  legacy files participate as warnings only until a stage-by-stage refactor
  reaches them (Phase 4 module extractions).
- The root `index.js` shim stays untouched (backwards-compat surface).

## Alternatives considered

- **Biome.** Single binary, fast, all-in-one lint+format. Rejected for now:
  ecosystem is younger, plugin coverage for Node.js patterns thinner, and the
  goal here is to learn the toolchain most JavaScript employers use in 2026.
  Reconsider in a future ADR once Biome reaches feature parity with the
  `eslint-plugin-n` ruleset.
- **ESLint legacy `.eslintrc` format.** Rejected: ESLint 9 deprecated it;
  flat config is the present and the future.
- **Prettier only, no ESLint.** Rejected: formatting alone does not catch
  `no-unused-vars`, `no-undef`, `no-shadow`, or Node-specific footguns.
- **StandardJS.** Rejected: opinionated style with limited room for project
  conventions; not portable as a "career skill".
- **dprint.** Same reasoning as Biome — interesting, but not yet industry default.

## Consequences

- Positive: Every commit acquires an objective style/correctness baseline.
- Positive: Future agentic PRs (see [ADR-0006](0006-agentic-pr-workflow.md))
  start lint-clean, removing style nitpicks from AI/human review.
- Positive: Onboarding contributors (or future you) gets `npm run lint:fix`
  as a one-command answer to "is this acceptable".
- Negative: One-off pain of the first auto-fix pass on new code (expected to
  be small — under 50 lines touched).
- Negative: Legacy files generate warnings forever until refactored. This is
  intentional pressure to drive Phase 4.
- Follow-up: When ESLint flags a legacy file that the user wants to refactor,
  the refactor follows the characterization-first protocol from
  [ADR-0003](0003-characterization-first-modernization.md).
- Follow-up: Optional pre-commit hook via `simple-git-hooks` + `lint-staged`
  in a later, separate ADR — kept out of this one to limit scope.

## References

- [docs/MODERNIZATION_PLAN.md](../MODERNIZATION_PLAN.md) — Phase 4.
- [ADR-0003](0003-characterization-first-modernization.md) — refactor safety net.
- [ADR-0006](0006-agentic-pr-workflow.md) — downstream consumer of the lint gate.
- ESLint flat config docs: <https://eslint.org/docs/latest/use/configure/configuration-files>
- `eslint-plugin-n`: <https://github.com/eslint-community/eslint-plugin-n>
