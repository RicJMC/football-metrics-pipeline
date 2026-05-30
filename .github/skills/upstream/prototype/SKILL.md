---
name: prototype
description: Build throwaway experiments to validate design ideas quickly without destabilizing production code. Use when uncertainty is high and exploration is needed.
---

# prototype

## Workflow

1. Invoke `safe-repo-change` before starting modifications.
2. Define hypothesis and success signal.
3. Create isolated prototype code in a safe location.
4. Keep prototype intentionally minimal.
5. Decide: discard, iterate, or promote.
6. If promoting, re-implement cleanly with tests and run `scripts/verify.sh`.

## Constraint

Never overwrite stable production code with prototype artifacts.
