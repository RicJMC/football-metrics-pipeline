---
name: characterize-etl-behavior
description: Capture current ETL behavior with snapshot tests before refactoring. Use when adding characterization tests to legacy scripts/playerStats*.js logic.
---

# Skill: characterize-etl-behavior

## Purpose

Capture current ETL behavior with tests before refactoring.

## Approach

1. Select a small fixture dataset.
2. Run a single ETL stage or full chain on fixture.
3. Record expected output snapshots.
4. Add characterization tests against expected output.
5. Prevent behavior drift during modernization.

## Guardrails

- Keep fixtures small and deterministic.
- Avoid dependence on live scraping for tests.
- Fail tests on schema/field regressions.
