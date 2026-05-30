---
name: improve-codebase-architecture
description: Identify and execute focused architecture improvements grounded in existing decisions and constraints. Use when the codebase is hard to change or structure is degrading.
---

# improve-codebase-architecture

## Workflow

1. Invoke `safe-repo-change` before modifying files.
2. Identify pain points: coupling, unclear boundaries, duplicated logic, fragile workflows.
3. Propose one focused improvement with clear blast radius.
4. If design intent changes, add/update a record under `docs/decisions/`.
5. Implement in small steps and validate with `scripts/verify.sh`.

## Constraint

Prefer reversible, incremental changes over broad rewrites.
