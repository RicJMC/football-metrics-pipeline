---
applyTo: "**"
---

# Safe Change Protocol

For each change:

1. State the target scope.
2. Confirm no sensitive/generated files are included.
3. Keep patch small and reversible.
4. Provide local validation commands.
5. Report known risks and rollback path.

High-risk files/folders require extra caution:

- `.env`
- `data/`, `jsonfiles/`, `csv/*.csv`
- `scrappe/tmp/`
- `*log*`, `errorLog*.txt`
