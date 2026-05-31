# ADR-0010: Curated adoption of patterns from `github/awesome-copilot`

- **Status:** Accepted
- **Date:** 2026-05-30
- **Deciders:** Repository owner

## Context

The repository already uses role-based agents under `.github/agents/` (`designer`, `implementer`, `reviewer`, `memory-curator`) and ADR-driven governance (see ADR-0006, ADR-0007, ADR-0009).

The community catalog [`github/awesome-copilot`](https://github.com/github/awesome-copilot) publishes a large set of custom agents, instructions, skills, hooks, and workflows. Some of those patterns are directly relevant to this project (least-privilege tool lists, write-scope guardrails, planning agents that only emit Markdown). Others target stacks and workflows this project does not use (cloud IaC, MCP servers, browser automation, large skills bundles).

Two failure modes must be avoided:

1. **Copy-paste drift** — importing entire agent files inherits tools and scopes that do not match this project, inflates the YAML frontmatter, and weakens auditability.
2. **Hidden coupling** — adding a submodule or runtime dependency on an external catalog couples release cadence and complicates review.

Constraints:

- Keep changes small and reversible (Phase 1 discipline, see ADR-0003).
- Do not introduce broad tool grants to agents (least privilege).
- Do not redistribute third-party files inside this repo without curation.
- Do not modify scraper/ETL behavior in this ADR.

## Decision

Treat `github/awesome-copilot` as a **reference catalog**, not a dependency or template.

1. The catalog is cloned **outside** this repository (e.g. `../_reference/awesome-copilot`, sparse checkout of `agents/`, `instructions/`, `skills/`). It is never vendored, submoduled, or copied wholesale.
2. Any pattern adopted into this repo must be **adapted and minimized** to fit the project's domain (Node.js scraping + ETL, Markdown-first docs, characterization-first refactor).
3. Every new or modified agent in `.github/agents/` must:
   - declare an explicit, minimal `tools:` list (never omit `tools`, never use `["*"]`),
   - include a `## Write-scope guardrail` section listing exactly which paths it may create or modify,
   - state in its description whether it is read-only or write-capable.
4. Adoption decisions are recorded as short entries in this ADR (see "Patterns evaluated" below) or, when non-trivial, as a new ADR that references this one.

### The 5 adoption filters

A pattern from the catalog may be adopted only if it passes **all** of the following:

1. **Relevance** — directly useful for Node.js, scraping, ETL, docs, CI, ADRs, or review workflow in this repo.
2. **Low risk** — does not require network, git-write, terminal, or browser tools unless the agent's function strictly needs them.
3. **Clear write-scope** — the agent's allowed output paths are explicit and narrow.
4. **Auditable output** — produces Markdown, diffs, or PR-reviewable artifacts.
5. **Reversible** — removing the file restores prior behavior with no residual state.

## Alternatives considered

- **Git submodule of `awesome-copilot`.** Rejected: couples release cadence, pollutes history, encourages wholesale imports instead of curation.
- **Direct copy of selected agent files as-is.** Rejected: inherits tool lists and scopes that do not match this project; weakens least-privilege posture.
- **Do nothing; only shrink current agent tool lists.** Partially adopted (see ADR follow-up "PR-B"), but rejected as the full answer because it loses the learning value of explicit filters and a documented adoption process.
- **Build a parallel internal catalog from scratch.** Rejected for now: premature; the external catalog is already a sufficient reference.

## Consequences

### Positive

- Clear, auditable rule for what may enter `.github/agents/` and `.github/prompts/`.
- Least-privilege posture is enforced by policy, not by habit.
- Learning is preserved: each adopted pattern is justified against the 5 filters.

### Negative

- Adds a small review step before importing any external pattern.
- Requires periodic re-evaluation when the external catalog changes.

### Neutral

- No change to scraper/ETL behavior.
- No new runtime dependency, no new CI job.

## Adoption checklist

Sequenced as small, independent PRs. Each PR must pass `git status --short` review before commit.

- [ ] **PR-A (this ADR + docs)** — add this ADR and `docs/plans/README.md`. Docs only.
- [ ] **PR-B (least privilege)** — shrink `tools:` lists of `designer` and `implementer`, add a `## Write-scope guardrail` section to both, and audit `reviewer` plus `memory-curator` for consistency only. `reviewer` and `memory-curator` are already curated in `main`, so they should not be expanded or reformatted without a concrete reason. Use one commit per touched agent for granular revert.
- [ ] **PR-C (optional)** — introduce `modernization-planner` agent only if `@designer` proves to conflate strategic and tactical planning. Write-scope limited to `docs/plans/`.
- [ ] **PR-D (optional)** — add `.github/prompts/evaluate-copilot-pattern.prompt.md` that applies the 5 filters and returns `ADOPT / ADAPT / REJECT` for a given external pattern.

## Operational note: VS Code agent editor UI may regress curated tool lists

Editing a `.agent.md` file through the VS Code custom-agent UI can regenerate the `tools:` block with every tool available in the local environment, silently undoing a previously curated least-privilege list. Observed on 2026-05-30 against `memory-curator.agent.md` and `reviewer.agent.md`, whose curated lists (12 and 27 tools) were replaced by the full ~100-tool list in the working tree.

Mitigation:

- Prefer editing `.agent.md` files as plain Markdown (text editor), not through the agent UI.
- Always run `git diff -- .github/agents/` before committing changes to any agent file.
- Treat a sudden +80-line diff on `tools:` as a regression signal, not a feature.

## Patterns evaluated

This section is appended to over time. Each entry: source path in the external catalog, verdict (`ADOPT` / `ADAPT` / `REJECT`), and one-line justification.

- _(none yet — entries added when PR-D is exercised)_

## References

- ADR-0003: Characterization-first modernization.
- ADR-0006: Agentic PR workflow.
- ADR-0007: Local agent PR toolkit.
- ADR-0009: Curated AI memory and approval-gated updates.
- External catalog: [`github/awesome-copilot`](https://github.com/github/awesome-copilot).
- VS Code docs: custom chat agents and least-privilege tool configuration.
- GitHub Copilot docs: `.github/agents/<name>.agent.md` convention; omitting `tools` grants all tools.
