# Skill: safe-repo-change

## Purpose

Apply small, reversible repository-safe changes with explicit boundaries.

## Rules

- Do not modify scraper/ETL logic in phase-1.
- Touch only approved files for each phase.
- Keep patches focused and explain exclusions.

## Checklist

- Verify scope
- Apply minimal patch
- Show validation commands
- Report residual risks
- Suggest semantic commit message
