---
name: handoff
description: Create a concise handoff document for the next agent session and save it in the repository. Use when pausing work or transferring context.
argument-hint: What should the next session focus on?
---

# handoff

## Quick Start

Use this skill when ending a session or handing work to another agent.

## Workflow

1. Invoke `safe-repo-change` before writing any files.
2. Summarize current status and what is done versus pending.
3. Reference existing artifacts instead of duplicating them: plans, ADRs, issues, commits, diffs.
4. Add a `Suggested Skills` section for the next session.
5. Save as `.github/internal/handoffs/YYYY-MM-DD-handoff.md` (gitignored, internal-only).
6. Redact secrets and sensitive data.

## Output

Persistent path: `.github/internal/handoffs/` (gitignored via `.github/internal/`).
