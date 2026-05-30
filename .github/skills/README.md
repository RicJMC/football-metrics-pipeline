# Agent Skills Catalogue

This repository includes reusable skills for coding assistants (Copilot Chat, Claude, Codex, Cursor, and similar tools).

## Layout

- Top-level skills: repository-specific workflows (preflight + characterization + audit).
- `upstream/`: adapted external skills selected for this repository.

## Repository Skills

- `safe-repo-change`: required preflight before any file modification.
- `audit-legacy-data-project`: inventory + risk assessment for legacy scrapers/ETL.
- `characterize-etl-behavior`: capture current ETL behavior as snapshot tests before refactor.

## Upstream Skills (Adapted)

- `diagnose`
- `grill-with-docs`
- `triage`
- `improve-codebase-architecture`
- `tdd`
- `to-issues`
- `to-prd`
- `zoom-out`
- `prototype`
- `grill-me`
- `handoff` (writes to `.github/internal/handoffs/`, gitignored)
- `write-a-skill`

## Usage Contract

All modification-oriented skills must invoke `safe-repo-change` before editing files.

The two role-based agents in [.github/agents/](../agents/) (`@designer`, `@implementer`) may invoke any of these skills.
