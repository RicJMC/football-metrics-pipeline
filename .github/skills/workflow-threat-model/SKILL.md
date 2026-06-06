---
name: workflow-threat-model
description: Security checklist for GitHub Actions and agentic automation changes using ADR-0012 as guidance.
---

Use this skill when editing `.github/workflows/*`, issue-driven automation, or label-gated agent flows.

## Checklist

1. Default top-level workflow permissions to `permissions: {}`.
2. Grant per-job least-privilege permissions only where needed.
3. Avoid write-capable automation on untrusted intake events.
4. Prefer `issues.labeled` + trusted association gate for agentic write actions.
5. Treat `agent-approved` as a human authorization signal only (never auto-applied by templates).
6. Pin third-party actions to full commit SHA where practical.
7. Keep human merge gate intact (no autonomous merge path).

ADR-0012 is currently Proposed; cite it explicitly when applying these controls.
