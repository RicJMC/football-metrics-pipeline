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

## AI memory workflow baseline (2026-05-30)

- Durable memory lives in repository Markdown files, not editor session storage.
- Memory updates are proposal-first and require explicit human approval before any write.
- End-of-task completion includes one explicit memory outcome: incident, handoff, ADR, lesson learned, or no memory needed.
- Operational supports in place: memory-curator agent contract, update-ai-memory prompt, and handoff template generator script.
- Never store secrets, credentials, tokens, `.env` values, cookies, private URLs, or personal data in memory artifacts.
