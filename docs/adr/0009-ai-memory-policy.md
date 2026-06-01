# ADR-0009: Curated AI memory and approval-gated updates

- **Status:** Accepted
- **Date:** 2026-05-30
- **Deciders:** Repository owner

## Context

The repository already uses role-based agents and ADR-driven governance. Session history in VS Code `workspaceStorage` is useful as a recovery source, but it is internal state, not stable long-term documentation.

Raw session dumps are risky as an agent memory layer because they can include stale context, duplicated content, machine-local paths, and sensitive snippets. This project needs a repeatable approach that is auditable in Git, aligned with existing review workflow, and safe for legacy modernization.

Constraints:

- Keep Phase 1 changes small and reversible.
- Do not store secrets, credentials, tokens, or private data.
- Preserve human approval for durable repository knowledge.
- Avoid adding new runtime systems unless justified by a later ADR.

## Decision

Adopt a Markdown-first, curated memory workflow for AI-assisted work.

1. Source of truth for durable memory is repository Markdown, not `workspaceStorage`.
2. Memory updates are approval-gated: agents propose, human approves, then files are written.
3. Memory categories are:
   - incidents under `docs/incidents/`
   - handoffs under `.github/internal/handoffs/`
   - architecture decisions under `docs/adr/`
   - recurring signatures under `docs/recurring-errors.md`
   - stable project summary under `docs/ai-context.md`
4. A dedicated `memory-curator` agent proposes memory deltas and never auto-writes without explicit approval.
5. End-of-task Definition of Done includes: "propose memory or explicitly declare none needed".

## Alternatives considered

- **Directly index VS Code `workspaceStorage` for retrieval.** Rejected: unstable format, safety risk, poor signal quality.
- **Store raw conversation dumps in a local database first.** Rejected for now: higher complexity and lower reviewability than Git-tracked Markdown.
- **No persistent memory process.** Rejected: repeated incidents and fixes are relearned too often.

## Consequences

### Positive

- Durable memory is reviewable in PRs and searchable in-repo.
- Agents get higher-signal context with less contamination.
- Safety posture improves by default through explicit redaction rules.

### Negative

- Adds lightweight maintenance overhead for memory curation.
- Requires user approval steps to keep quality high.

### Neutral

- Does not change scraper/ETL behavior.
- Does not introduce a new database or framework in Phase 1.

## Adoption checklist

1. Add memory policy in `.github/copilot-instructions.md`.
2. Add `memory-curator` agent and reusable prompt files.
3. Create memory stub files and templates.
4. Add a local helper script to generate handoff templates.
5. Validate with `npm run verify` and `npm run memory:handoff`.

## Related

- [ADR-0006](0006-agentic-pr-workflow.md)
- [ADR-0007](0007-local-agent-pr-toolkit.md)
- [.github/copilot-instructions.md](../../.github/copilot-instructions.md)