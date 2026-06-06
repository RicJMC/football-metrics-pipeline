---
name: fixture-synthetic-data
description: Safe workflow for adding or updating sample fixtures while preserving synthetic-only data policy.
---

Use this skill when touching `sample-data/` or expected outputs used by characterization tests.

## Policy

- Fixtures must be synthetic only (ADR-0004).
- Do not commit scraped FBref data.
- Keep fixtures small and deterministic.

## Workflow

1. Identify which stage/edge case the fixture supports.
2. Regenerate deterministically from scripts under `scripts/internal/` when available.
3. Update corresponding expected outputs/hashes.
4. Run `npm run test:characterization` and `npm run verify`.
5. Document fixture purpose in the nearest `sample-data/*/README.md` when introducing new fixture families.
