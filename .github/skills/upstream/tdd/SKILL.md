---
name: tdd
description: Execute red-green-refactor loops in small vertical slices with reliable feedback. Use when building or fixing behavior where tests can define expected outcomes.
---

# tdd

## Workflow

1. Invoke `safe-repo-change` before making edits.
2. Define a small behavior slice.
3. Write a failing test first.
4. Implement the minimum change to pass.
5. Refactor while keeping tests green.
6. Run `scripts/verify.sh` at logical checkpoints.

## Rule

Do not batch unrelated behaviors in a single loop.
