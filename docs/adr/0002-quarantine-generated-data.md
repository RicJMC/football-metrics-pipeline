# ADR-0002: Keep generated data and logs out of Git

- **Status:** Accepted
- **Date:** 2026-05-30
- **Deciders:** Repository owner

## Context

The pipeline produces large, frequently-changing artifacts:

- `data/<id>-<league>/<season>/<category>/*.json` — raw FBref tables fetched
  by the Puppeteer scrapers.
- `jsonfiles/playerStats0*.json` — intermediate ETL outputs (some over 300 MB).
- `csv/*.csv` — final exports.
- `*.log`, `errorLog*.txt` — runtime diagnostics.

Versioning these has three problems:

1. **Repository bloat.** Single JSON outputs exceed GitHub's 100 MB blob
   limit; even the smaller ones make `git clone` painful.
2. **Legal / redistribution.** Sports Reference's terms of use allow personal
   research but do not authorize bulk redistribution of FBref tables. Pushing
   raw scraped data to a public repository is a legal risk.
3. **Noise.** Every pipeline run produces a diff that has nothing to do with
   code changes.

## Decision

Quarantine all generated artifacts via `.gitignore`:

- `data/`, `jsonfiles/`, `csv/**/*.csv`
- `*log*`, `errorLog*.txt`
- `scrappe/tmp/`, `tmp/`
- `.env*` (always)

Only synthetic sample data lives in the repository, scoped under
`sample-data/` (see [ADR-0004](0004-sample-data-scope.md)). CSV files under
`sample-data/` are explicitly allowlisted with `!sample-data/**/*.csv`.

## Alternatives considered

- **Git LFS for large outputs.** Solves the size problem but not the legal
  one, and adds operational complexity (LFS bandwidth quotas, lock contention)
  for no analytical benefit.
- **Separate `*-data` repository.** Same legal problem, and forks of the code
  would lose the data link. Not worth the maintenance.
- **DVC or similar data-versioning tool.** Overkill for a portfolio project
  where the canonical inputs are public, freshly scrapeable web pages.

## Consequences

- Positive: `git clone` of `football-metrics-pipeline` is small and fast.
- Positive: No FBref redistribution exposure on the public remote.
- Positive: Pipeline runs do not pollute commit history.
- Negative: Reproducing a real run requires the user to scrape data
  themselves. Documented in `README.md` and `docs/QUICKSTART.md`.
- Follow-up: The `sample-data/` directory must remain the only path inside
  the repository that contains structured player data.

## References

- `.gitignore`
- `docs/DATA_POLICY.md`
- Related ADRs: [0001](0001-fresh-history-rewrite.md),
  [0004](0004-sample-data-scope.md).
