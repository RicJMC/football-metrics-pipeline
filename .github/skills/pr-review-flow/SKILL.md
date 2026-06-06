---
name: pr-review-flow
description: Canonical local PR operations for implementer/reviewer, including pr-context helper and audit headers.
---

Use this skill for any PR creation, review, or review-response action.

## Canonical commands

1. Read full PR context:
   - `node scripts/internal/pr-context.js <pr-number>`
2. Open PR:
   - `gh pr create --title "<title>" --body-file <file> --base main`
3. Reviewer verdict:
   - `gh pr review <pr> --approve --body-file <file>`
   - `gh pr review <pr> --request-changes --body-file <file>`
   - `gh pr review <pr> --comment --body-file <file>`
4. Implementer feedback reply:
   - `gh pr review <pr> --comment --body-file <file>`

## Mandatory headers

Reviewer body starts with:

```html
<!-- ai-reviewer:v1 -->
Verdict: APPROVE | REQUEST_CHANGES | COMMENT
Head SHA: <full sha>
```

Implementer reply starts with:

```html
<!-- ai-implementer:v1 -->
Head SHA: <full sha>
```

## Hard rules

- Implementer never self-approves its own PR.
- No agent runs `gh pr merge`.
- No agent runs `gh pr close` without explicit human instruction.
