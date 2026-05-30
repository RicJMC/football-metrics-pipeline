# Update AI Memory

Review the current conversation, terminal output, changed files, errors, and decisions.

Decide whether this session produced reusable project knowledge.

Classify as one or more:

1. Incident
2. Handoff
3. ADR
4. Lesson learned
5. No memory needed

Rules:

- Never store secrets, tokens, passwords, private `.env` values, or personal data.
- Prefer short, factual notes.
- Include safe and useful commands only.
- Include verification steps.
- Mark uncertainty when not fully confirmed.
- Do not invent context.
- Propose the file path before writing.

Output format:

## Memory recommendation

Type:
Path:
Reason:

## Proposed content

```md
...
```