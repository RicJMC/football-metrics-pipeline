---
name: adr-decision-draft
description: Draft or update ADRs in MADR-lite format when a change introduces an architectural or process decision.
---

Use this skill when a task changes architecture, workflow policy, security boundaries, or irreversible project conventions.

## ADR format

Draft in MADR-lite sections:

1. Context
2. Decision
3. Alternatives considered
4. Consequences
5. References

## Rules

- Reference impacted files and existing ADRs by number.
- If contradicting an accepted ADR, propose a superseding ADR explicitly.
- Do not hide architectural decisions only in commit messages or PR comments.
