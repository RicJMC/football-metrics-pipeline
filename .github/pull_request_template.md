<!-- Conventional commit title required (e.g. `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`). -->

## Summary

<!-- One or two sentences. What and why. -->

## Checklist

- [ ] `npm run verify` is green locally.
- [ ] `npm run test:characterization` is green locally.
- [ ] No `.env`, `data/`, `jsonfiles/`, `csv/`, `errorLog*`, browser sessions, cookies, or tokens are staged.
- [ ] If this PR touches `scrappe/*` or `scripts/playerStats*.js`: behavior is preserved and characterization tests still pin the output.
- [ ] If this PR introduces an architectural decision: a new ADR is added under `docs/adr/` (status `Accepted` on merge).
- [ ] If this PR introduces new tracked artifacts: `scripts/verify.js` (`requiredPaths` / `jsonFiles`) is updated.
- [ ] Commit history is clean (single intent per commit; squash on merge).

## Review notes for AI reviewers

- Verify the changes respect [.github/instructions/safe-change.instructions.md](.github/instructions/safe-change.instructions.md) and [.github/instructions/legacy-data-project.instructions.md](.github/instructions/legacy-data-project.instructions.md).
- Verify ADRs under [docs/adr/](docs/adr/) are not contradicted.
- Flag missing tests, missing ADR, or scope creep.

## Risks / rollback

<!-- What could break. How to undo (revert SHA, etc.). -->
