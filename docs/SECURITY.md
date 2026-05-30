# Security Notes (Bootstrap Phase)

## Scope

This is a legacy data pipeline project under modernization. Security focus in this phase is repository hygiene and secret/artifact containment.

## Rules

- Never commit `.env` or real secrets.
- Never commit browser sessions/cookies/profiles.
- Keep generated data outputs out of Git history.
- Prefer small, reversible changes.

## Immediate Controls

- Strong `.gitignore` for generated assets/logs/tmp files.
- `.env.example` for safe configuration sharing.
- Pre-push checks via manual audit commands.

## Known Risk Areas

- Legacy folders may contain historical scripts with hardcoded values.
- Old large logs/data can accidentally re-enter tracking if ignore rules are bypassed.

## Recommended Next Security Step

Run a dedicated secret scan (e.g., gitleaks) before first public push and remediate findings.
