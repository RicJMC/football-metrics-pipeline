# Architecture Decision Records

This directory captures the engineering decisions that shape `football-metrics-pipeline`.
Each ADR records the context, the decision, the alternatives considered and the
consequences. ADRs are append-only: when a decision changes we add a new ADR
and mark the old one as `Superseded by ADR-XXXX`.

Template: [0000-template.md](0000-template.md) (lightweight [MADR](https://adr.github.io/madr/)).

## Index

| #                                                    | Title                                                        | Status   |
| ---------------------------------------------------- | ------------------------------------------------------------ | -------- |
| [0001](0001-fresh-history-rewrite.md)                | Fresh Git history before public release                      | Accepted |
| [0002](0002-quarantine-generated-data.md)            | Keep generated data and logs out of Git                      | Accepted |
| [0003](0003-characterization-first-modernization.md) | Characterization tests before any refactor                   | Accepted |
| [0004](0004-sample-data-scope.md)                    | Synthetic sample data only, no scraped data in Git           | Accepted |
| [0005](0005-lint-format-toolchain.md)                | Adopt ESLint flat config + Prettier as lint/format toolchain | Accepted |
| [0006](0006-agentic-pr-workflow.md)                  | Adopt an agentic PR workflow with a human merge gate         | Accepted |
| [0007](0007-local-agent-pr-toolkit.md)               | Local agent toolkit for PR operations via `gh`               | Accepted |
| [0008](0008-ci-side-ai-reviewer.md)                  | CI-side AI reviewer via GitHub Actions                       | Proposed |
| [0009](0009-ai-memory-policy.md)                     | Curated AI memory and approval-gated updates                 | Proposed |
| [0010](0010-awesome-copilot-pattern-adoption.md)     | Curated adoption of patterns from `github/awesome-copilot`   | Proposed |
| [0011](0011-multi-agent-orchestration.md)            | Multi-agent orchestration via GitHub Issues + Actions        | Proposed |

## Adding a new ADR

1. Copy `0000-template.md` to `NNNN-short-title.md` (next sequential number).
2. Fill in status (start with `Proposed`).
3. Open a PR. Mark as `Accepted` on merge.
4. Update the index above.
