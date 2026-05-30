# Publishing Checklist (Public GitHub)

## Safety

- [ ] `.env` is ignored and not staged
- [ ] `.env` history reviewed and handled if needed
- [ ] No credentials/tokens/cookies in tracked files
- [ ] No browser session/profile data tracked

## Repository Hygiene

- [ ] `git status --short` reviewed
- [ ] `git add --dry-run .` reviewed
- [ ] Generated data/log outputs are ignored
- [ ] No staged files above 100 MB

## Documentation

- [ ] `README.md` explains current legacy status clearly
- [ ] `docs/PIPELINE.md` reflects real execution path
- [ ] `docs/DATA_POLICY.md` defines in/out-of-git data policy
- [ ] `docs/MODERNIZATION_PLAN.md` has phased roadmap

## Release Readiness

- [ ] Branch for bootstrap changes is clean and reviewable
- [ ] Commit message is clear (`chore: safe bootstrap and quarantine`)
- [ ] Final manual review completed before first public push
