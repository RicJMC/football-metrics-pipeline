# Handoff: 2026-06-01

> **STATUS: snapshot - DO NOT MERGE AS-IS**
> This branch (`wip/handoff-2026-06-01`) is a cross-machine transport snapshot.
> It bundles multiple unrelated themes in a single commit and must be split
> into focused PRs before any merge into `main`.
> See `Next steps` below for the split plan.

## Context
- Source branch synced and pushed: docs/lessons-learned-retroactive-rule
- Cross-machine snapshot branch: wip/handoff-2026-06-01
- Goal: move current local WIP safely to another machine without losing in-progress work.

## What changed
- Synced local docs/lessons-learned-retroactive-rule with origin via pull --rebase and pushed commit f91a27d.
- Created branch wip/handoff-2026-06-01 from synced HEAD.
- Restored pre-existing local WIP (9 modified + 14 untracked files).

Tracked modified files:
- .github/agents/designer.agent.md
- .github/copilot-instructions.md
- .github/skills/audit-legacy-data-project/SKILL.md
- .github/skills/characterize-etl-behavior/SKILL.md
- .github/skills/safe-repo-change/SKILL.md
- .github/skills/upstream/diagnose/SKILL.md
- .github/skills/upstream/tdd/SKILL.md
- README.md
- docs/adr/0012-agentic-automation-threat-model.md

Untracked files/folders:
- .github/skills/upstream/tdd/deep-modules.md
- .github/skills/upstream/tdd/interface-design.md
- .github/skills/upstream/tdd/mocking.md
- .github/skills/upstream/tdd/refactoring.md
- .github/skills/upstream/tdd/tests.md
- AGENTS.md
- DOCUMENTATION.md
- GOVERNANCE.md
- SECURITY.md
- TEMPLATE_USAGE.md
- TROUBLESHOOTING.md
- docs/backlog/agent-governance-consistency.md
- docs/lessons-learned/2026-05-two-phase-stage-modernization.md
- docs/prds/

## Commands run
- git stash push -u -m "wip-handoff-2026-06-01"
- git pull --rebase origin docs/lessons-learned-retroactive-rule
- git push origin docs/lessons-learned-retroactive-rule
- git checkout -b wip/handoff-2026-06-01
- git stash pop

## Current state
- Branch: wip/handoff-2026-06-01
- Working tree contains restored WIP changes intended for snapshot commit.

## Problems found
- None blocking.
- No overlap found between files changed in remote-only commits and local modified files when branch sync was prepared.

## Next steps
- Snapshot has already been committed and pushed:
  - `46a0c13` wip(handoff): snapshot 2026-06-01 for cross-machine sync
  - `3cbdd69` docs(handoff): add 2026-06-01 cross-machine handoff note
- On the receiving machine:
  1. `git fetch origin`
  2. `git switch -c wip/handoff-2026-06-01 origin/wip/handoff-2026-06-01`
  3. Confirm both commits above are present: `git log --oneline main..HEAD`
  4. Inspect scope: `git diff --name-status main...wip/handoff-2026-06-01`
  5. Verify no forbidden paths leaked:
	  `git diff --name-only main...HEAD | grep -E '^(data/|jsonfiles/|csv/|scrappe/tmp/|\.env)'`
	  (must return empty)
  6. Split the snapshot into focused PR branches (cherry-pick per file, from `main`):
	  - PR-B: docs governance + lessons learned + backlog + PRDs + top-level docs
	  - PR-C: agents + copilot-instructions tightening
	  - PR-D: skills upstream TDD + safety updates
	  - ADR-0012 threat model is already merged via `docs/adr-0012-threat-model`; no PR needed
  7. Decide the fate of any local untracked plan files (for example,
	  `docs/plans/awesome-copilot-adoption.md`) - either include in a dedicated
	  `docs(plans)` PR or drop
  8. After all derived PRs are merged, delete the WIP branch:
	  - `git push origin --delete wip/handoff-2026-06-01`
	  - `git branch -D wip/handoff-2026-06-01`

## Risks / warnings
- WIP commit intentionally bundles multiple themes; split before opening final PR(s).
- Keep generated data/secrets out of commits (.env, data/, jsonfiles/, csv/, scrappe/tmp/, logs).

## Memory candidates
- [ ] Incident?
- [ ] ADR?
- [ ] Recurring error?
- [ ] Lesson learned?
