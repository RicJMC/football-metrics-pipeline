---
name: to-prd
description: Synthesize current conversation and repository context into a concise PRD draft. Use when a feature idea needs clarified scope and acceptance criteria.
---

# to-prd

## Workflow

1. Invoke `safe-repo-change` before writing any files.
2. Gather context from conversation and repository docs.
3. Produce a concise PRD containing:
- problem statement
- goals and non-goals
- user impact
- acceptance criteria
- constraints, risks, and open questions
4. Store draft under `docs/prds/<slug>.md` when requested.
5. Ensure alignment with `GOVERNANCE.md` and relevant decisions.

## Rule

Do not include secrets or private operational data.
