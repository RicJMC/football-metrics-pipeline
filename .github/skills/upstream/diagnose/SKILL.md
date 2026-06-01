---
name: diagnose
description: "Run a disciplined diagnosis loop for bugs and regressions: reproduce, isolate, instrument, fix, and verify. Use when behavior is incorrect or unclear."
---

# diagnose

## Workflow

1. Clarify symptoms and reproduce reliably.
2. Minimize surface area to isolate the failing path.
3. Form hypotheses and add targeted instrumentation.
4. Identify root cause.
5. Apply minimal fix through `safe-repo-change`.
6. Add or update regression checks and run `scripts/verify.sh`.

## Notes

If the issue reveals an architectural gap, propose a follow-up note under `docs/decisions/`.
