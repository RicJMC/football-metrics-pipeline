---
applyTo: "**"
---

# Legacy Data Project Guidance

## Context

This project contains legacy JavaScript scrapers and ETL scripts that are functional but not yet standardized.

## Do

- Preserve behavior when modernizing.
- Document execution flow before refactoring.
- Add tests around existing behavior (characterization-first).
- Keep generated data out of source control.

## Do Not

- Perform broad rewrites in a single change.
- Introduce unrelated architecture changes.
- Couple refactor, migration, and behavior changes in one step.
