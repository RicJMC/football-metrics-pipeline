# Data Policy

## Goal

Keep the public repository focused on source code, documentation, and small reproducible samples.

## Must Be Versioned

- Source code (`scrappe/`, `scripts/`, utility code)
- Documentation (`README.md`, `docs/`)
- Configuration files (`package.json`, `.env.example`)
- Small sample datasets for tests/demos (`sample-data/`)

## Must NOT Be Versioned

- Generated raw datasets and intermediate outputs
- Large JSON/CSV/Parquet artifacts
- Runtime logs and temporary files
- Browser profiles/sessions/cookies
- Local secrets in `.env`

## Current Ignored Generated Paths

- `data/`
- `jsonfiles/`
- `csv/**/*.csv` and `*.csv`
- `scrappe/tmp/`
- `errorLog*.txt`, `*Log*.txt`, `*.log`

## Public Publishing Rule

Before any public push, validate:

1. `git add --dry-run .` does not include generated outputs.
2. No `.env` or secrets are staged.
3. No files over 100 MB are staged.

## Future Dataset Strategy

- Keep only small sample inputs/expected outputs in-repo.
- Publish large datasets externally when needed (release assets or data platform).
