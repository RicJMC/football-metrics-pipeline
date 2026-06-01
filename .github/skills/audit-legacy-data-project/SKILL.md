---
name: audit-legacy-data-project
description: Perform a read-only audit of repository safety and modernization readiness. Use when reviewing a legacy data project for risks, generated artifacts, or phase readiness.
---

# Skill: audit-legacy-data-project

## Purpose

Perform a read-only audit of repository safety and modernization readiness.

## Inputs

- Repository root
- Optional target phase (`phase-1`, `phase-2`)

## Procedure

1. Inspect git status and branch.
2. Identify large files and generated artifacts.
3. Check `.env` and obvious secret-risk paths.
4. Classify files into `commit`, `ignore`, `review`.
5. Return prioritized blockers (P0/P1/P2).

## Output

- Executive summary
- Risk table
- Safe next commands
