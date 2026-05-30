# Copilot Instructions for football-metrics-pipeline

This repository is a legacy football scraping + ETL pipeline under incremental modernization.

## Core Operating Principles

- Do not rewrite from scratch.
- Do not change scraper/ETL logic in Phase 1 unless explicitly requested.
- Prefer small, reversible, reviewable changes.
- Separate source code from generated outputs.
- Add tests before deep refactors.

## Mandatory Safety Rules

- Never commit `.env`, credentials, cookies, browser sessions, or tokens.
- Never stage generated bulk data, logs, or temporary artifacts.
- Before edits: inspect `git status --short`.
- Before proposing commit: show validation commands and residual risks.

## Preferred Modernization Order

1. Audit and quarantine
2. Documentation of current behavior
3. Sample-data fixtures
4. Characterization tests
5. Lint/format
6. CI
7. Incremental modular refactor
8. Optional TypeScript migration

## Repo Areas

- `scrappe/`: scraping scripts and orchestrator
- `scripts/`: ETL transformation chain
- `docs/`: policy, runbooks, modernization plan

## Response Style for Changes

- Explain scope before making edits.
- Keep diffs minimal and focused.
- Explicitly list what is _not_ changed.

## Agents

Two role-based agents are defined under [.github/agents/](agents/):

- `@designer` — plans modernization steps, drafts ADRs, proposes fixture layouts. Read-only.
- `@implementer` — executes approved changes with characterization-first discipline. Edits and runs validation.

Invoke from Copilot Chat with `@designer` or `@implementer`. Both inherit the safety rules above.

## AI Memory and Handoff Policy

- Follow [docs/adr/0009-ai-memory-policy.md](../docs/adr/0009-ai-memory-policy.md) for memory curation.
- Before making changes, read `docs/ai-context.md` when present.
- Check `docs/recurring-errors.md`, `docs/incidents/`, and the latest `.github/internal/handoffs/` note for similar issues.
- Do not use VS Code `workspaceStorage` as a source of truth.
- Never store secrets, tokens, `.env` values, credentials, private URLs, or personal data in memory files.

At the end of every task:

- Propose one of: incident, handoff, ADR, lesson learned, or "no memory needed".
- Summarize the proposed memory first.
- Only write/update memory files after explicit user approval.
