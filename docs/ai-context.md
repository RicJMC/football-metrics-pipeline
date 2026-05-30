# AI Context

## Project status

- Legacy scraping + ETL pipeline under incremental modernization.
- Default rule: small, reversible changes that preserve behavior unless explicitly requested.

## Known constraints

- Do not commit generated data or sensitive artifacts.
- Characterization-first when touching legacy `scripts/playerStats*.js` logic.
- Human remains merge gate for PR workflow.

## Recurring problems

- Track in `docs/recurring-errors.md` and `docs/incidents/`.

## Safe commands

- `npm run verify`
- `npm run test:characterization`
- `git status --short`

## Dangerous commands

- `git reset --hard`
- `git checkout -- <path>`
- `git push --force`

## Definition of Done (AI-assisted)

- Changes are scoped and validated.
- Relevant memory update is proposed (or "no memory needed" is explicitly stated).
- Memory writes happen only after explicit approval.