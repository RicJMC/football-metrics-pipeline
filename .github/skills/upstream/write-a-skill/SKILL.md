---
name: write-a-skill
description: Create new repository skills with clear triggers, concise workflow, and maintainable structure. Use when adding or evolving skills.
---

# write-a-skill

## Quick Start

Use this skill when defining a new reusable workflow.

## Workflow

1. Invoke `safe-repo-change` before writing any files.
2. Gather requirements.
- What problem is being solved?
- Is it starter-specific or upstream-adapted?
3. Choose target location.
- Starter-specific: `.github/skills/starter/<skill-name>/SKILL.md`
- Upstream-adapted: `.github/skills/upstream/<skill-name>/SKILL.md`
4. Write concise frontmatter and instructions.
5. Add references to local policy and verification when relevant.
6. Update `.github/skills/README.md` inventory.
7. Run `scripts/verify.sh`.

## Quality Rules

- Keep scope explicit.
- Include clear trigger language in description.
- Keep instructions deterministic where possible.
