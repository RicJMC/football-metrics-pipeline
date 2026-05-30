# `docs/plans/`

Reserved write-scope for tactical, per-task implementation plans produced by planning agents.

## Purpose

This folder holds short Markdown plans that translate a high-level modernization step (from [`docs/MODERNIZATION_PLAN.md`](../MODERNIZATION_PLAN.md) or an ADR) into an ordered, reviewable checklist for the `implementer`.

Plans here are **tactical**, not strategic:

- Strategic decisions → ADRs under [`docs/adr/`](../adr/).
- High-level sequencing → [`docs/MODERNIZATION_PLAN.md`](../MODERNIZATION_PLAN.md).
- Per-task checklists → this folder.

## Conventions

- Filename: `NNNN-short-slug.md` (4-digit zero-padded, monotonically increasing).
- One plan per task. Keep plans under ~150 lines; if larger, split.
- Each plan must include: **Intent**, **Scope (files touched / preserved)**, **Steps**, **Validation**, **Rollback**.
- Plans are disposable: once the task ships and the PR merges, the plan stays as a historical record but is not maintained.

## Write-scope policy

Per [ADR-0010](../adr/0010-awesome-copilot-pattern-adoption.md), any agent that writes here must declare this folder as its sole write-scope and must not modify source code, tests, data, or workflow files.

Currently no agent is wired to this folder. The optional `modernization-planner` agent (PR-C in ADR-0010) would be the first.
