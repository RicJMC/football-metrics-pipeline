# Agent docs alignment — issue backlog

Source: `docs/prds/agent-docs-alignment.md`

## Draft issues

| ID | Title | Summary | Acceptance criteria | Risks | Dependencies | Labels | Priority |
|---|---|---|---|---|---|---|---|
| D1 | Align ETL docs with global stage 03 behavior | Update README, modernization docs, and the lesson learned so they all describe stage 03 as global Z-score normalization. | No current-behavior doc says "per position/league"; docs explicitly state the global contract. | Missing a stray reference in a secondary doc. | None | docs, enhancement | P0 |
| D2 | Update agent guidance with source-of-truth and security boundary rules | Update `.github/copilot-instructions.md` and `.github/agents/designer.agent.md` so the agent reads code first and cites ADR-0012 for automation. | Designer instructions prefer code over stale prose; automation plans mention ADR-0012 and untrusted intake handling. | Instructions may become slightly more verbose. | D1 | docs, enhancement | P0 |
| D3 | Refresh ADR-0012 cross-links for agent-facing docs | Tighten ADR-0012 so its operational guidance points to the docs and agent instructions that must honor the trust boundary. | ADR-0012 explicitly references agent-facing docs and no longer reads as a standalone security note. | Risk of over-duplicating the same security rule. | D1, D2 | docs, adr-decision | P1 |

## Suggested delivery order

1. D1
2. D2
3. D3
