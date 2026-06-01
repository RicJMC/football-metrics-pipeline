# Governance

- Propose agent, instruction, or skill changes via pull requests.
- Require at least one review for guardrail changes.
- Keep secrets out of repository files and examples.
- Run `./scripts/verify.sh` before merge.
- Treat destructive operations as opt-in only with explicit approval.
- Agent skills are defined under `.github/skills/`; modifications must not bypass `safe-repo-change`.
