# ADR-0001: Fresh Git history before public release

- **Status:** Accepted
- **Date:** 2026-05-30
- **Deciders:** Repository owner

## Context

The pre-publication audit of the local repository surfaced two hard blockers
for making `football-metrics-pipeline` public on GitHub:

1. **Large generated artifacts in history.** Ten or more blobs above 100 MB
   were reachable from older commits (largest 439 MB, several around 300 MB).
   GitHub rejects any push that contains a blob larger than 100 MB.
2. **Legacy API key literal in history.** A hardcoded scraper API key
   (`044260e14de301a3192b0c6eca55bbf2`) was committed inside
   `scripts/old/scripts_old/indexold.js` in commit `0c3d1fc`. The working tree
   was sanitized to `REDACTED_LEGACY_EXAMPLE_KEY` but the literal remained in
   the historical commit.

The repository had never been pushed to a remote, so no third party depended
on the existing commit hashes.

## Decision

Replace the existing Git history with a single orphan commit
(`883bd04 chore: initial public version (fresh history)`) that contains only
the sanitized, quarantined working tree. The old branches and tags are kept
locally as `backup/pre-fresh-history-*` so the previous history is recoverable
until the public release is validated.

## Alternatives considered

- **`git-filter-repo` to surgically remove large blobs and the API key.**
  Equivalent end state (smaller `.git`, no secret), but requires installing
  `git-filter-repo`, more complex command surface, and still rewrites history.
  Not chosen because the orphan approach is simpler and the repository had no
  external consumers.
- **Publish history as-is and rely on GitHub's secret scanning to flag the
  key.** Rejected outright: the 100 MB blob limit alone makes the push fail,
  and shipping a real (even legacy) credential to a public repository is not
  acceptable regardless of detection tooling.
- **Quarantine the large blobs with `bfg-repo-cleaner`.** Same trade-off as
  `git-filter-repo`; no practical advantage over the orphan approach for a
  pre-publication repository.

## Consequences

- Positive: Public `main` is 1.12 MB, contains zero secrets, contains no blobs
  above 0.5 MB, and passes `npm run verify`.
- Positive: Force-pushing to `origin/main` is safe because the remote is still
  on its initial commit and no clones exist.
- Negative: Original commit history is no longer visible on the public
  remote. Authored timestamps and per-stage commit messages are lost.
- Negative: Local `.git` remains at 1.77 GB until the backup tags and old
  branches are deleted and `git gc --prune=now --aggressive` is run. This is
  intentional: backups are kept until the public release is validated.
- Follow-up: After CI is green and a smoke test passes, delete the
  `backup/pre-fresh-history-*` tags, delete the legacy local branches, run GC,
  and the local `.git` should shrink to under 20 MB.

## References

- Pre-rewrite handoffs: archived in `.github/internal/handoffs/` (gitignored).
- Fresh history commit: `883bd04`.
- Related ADRs: [0002](0002-quarantine-generated-data.md).
