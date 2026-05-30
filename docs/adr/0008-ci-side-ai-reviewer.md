# ADR-0008: CI-side AI reviewer via GitHub Actions

- **Status:** Proposed
- **Date:** 2026-05-30
- **Deciders:** Repository owner

## Context

ADR-0006 defined the role of the AI reviewer. ADR-0007 (proposed) standardized how the **local** reviewer agent talks to a PR. Both still require a human to advance the chat: open `@reviewer`, paste the PR number, wait, read the verdict.

The owner's stated goal is to reduce human involvement to the merge decision only. The local agentic loop has an unavoidable hand-off step (the human is the only thing that can re-trigger a chat session). To remove that step, the reviewer must run **outside** the chat.

The repository does not have GitHub Pro and therefore no access to the GitHub Copilot Coding Agent or to first-party Copilot Code Review on private repos. The remaining option is a self-hosted automation: a GitHub Actions workflow that invokes an LLM API directly, posts a comment on the PR, and exits.

This carries costs the local flow does not have: an API key (paid), a secret stored in GitHub, additional CI minutes, and the operational risk of an LLM posting incorrect feedback automatically.

This ADR is **opt-in**. The owner can adopt ADR-0007 and stop there. ADR-0008 only makes sense after ADR-0007 is stable and PR volume justifies the recurring cost.

Constraints:

- Must not approve or merge PRs — only comment. ADR-0006's human merge gate stands.
- Must not run on every push if cost is a concern — must be gated.
- Must reuse the `reviewer.agent.md` ruleset; the CI reviewer is the same persona, different runtime.
- Must not leak the API key in logs or in cached artifacts.
- Must not run on PRs from forks (untrusted code, exfiltration risk).

## Decision

Add a manually-triggered GitHub Actions workflow that runs the reviewer persona against the head SHA of a PR and posts a single comment with the verdict.

1. **Workflow: `.github/workflows/ai-review.yml`**
   - Trigger: `workflow_dispatch` with input `pr_number`, **and** `issue_comment` with body equal to `/ai-review` posted by a maintainer. No `pull_request` trigger — prevents accidental fan-out and fork abuse.
   - Concurrency: one run per PR; new request cancels in-flight run for the same PR.
   - Permissions: `contents: read`, `pull-requests: write`. Nothing else.
   - Steps:
     1. Checkout PR head.
     2. `npm ci`.
     3. Run `node scripts/internal/ai-review.js --pr <n>` — see below.
     4. The script posts the comment via `gh pr review <n> --comment --body-file <out>`.

2. **Driver: `scripts/internal/ai-review.js`**
   - Reads `reviewer.agent.md` (system prompt) and `.github/instructions/*.md` and the ADR index.
   - Fetches PR context via `scripts/internal/pr-context.js` (from ADR-0007).
   - Fetches the diff via `gh pr diff <n>`.
   - Calls the LLM API (Anthropic or OpenAI — provider is a config knob, default Anthropic).
   - Truncates the diff to a fixed token budget (e.g. 60k chars); on overflow, posts a comment that says "diff too large — request human review" and exits 0.
   - Writes the LLM response to `tmp/ai-review.md` (gitignored), the workflow uploads no artifact by default.

3. **Comment format**
   - Always prefixed with `<!-- ai-reviewer:v1 -->` (same marker as ADR-0007 — the persona is the same; only the runtime differs). Second line: `Verdict: APPROVE | REQUEST_CHANGES | COMMENT`. Last line: head SHA reviewed.
   - The CI reviewer **may** use `gh pr review --approve` / `--request-changes` / `--comment` just like the local reviewer (ADR-0007); merge remains human-only.
   - The marker also enables idempotency: re-runs on the same head SHA find the previous comment and skip or update instead of posting a duplicate.

4. **Secrets**
   - One repository secret: `LLM_API_KEY`. Used only inside the workflow; never logged.
   - A `LLM_PROVIDER` repository variable (`anthropic` | `openai`).

5. **Cost control**
   - Manual trigger only (no automatic runs).
   - Token budget enforced in the driver.
   - One run per PR head SHA (idempotency check before calling the API).
   - Documented monthly budget in CONTRIBUTING.md; if exceeded, the human disables the workflow.

6. **Audit trail**
   - The comment is authored by `github-actions[bot]` — clearly distinct from human or local-agent comments.
   - The `<!-- ai-reviewer:v1 -->` marker makes filtering trivial.

## Alternatives considered

- **`pull_request` trigger (automatic on every PR).** Rejected for now: cost, fork-PR security, and noise. Could be revisited when PR volume justifies the spend.
- **Run reviewer locally via cron/Task Scheduler on the owner's machine.** Rejected: requires the machine to be on; no audit trail in GitHub; couples reviewer availability to a single device.
- **Use a third-party reviewer (CodeRabbit, Greptile, etc.).** Rejected at this stage: another vendor, another billing relationship, opinions not aligned with the project's ADRs. Worth re-evaluating before paying for own LLM keys.
- **Have the workflow `--request-changes` to block merge.** Rejected: an LLM hallucination would block the human; comment-only is the safer default. Re-evaluate once empirical accuracy is known.
- **Use `octokit` JS client instead of `gh`.** Possible; `gh` is pre-installed on `ubuntu-latest` and consistent with ADR-0007, so keep `gh`.

## Consequences

### Positive

- Reviewer runs without a chat session; the owner only needs to read the comment and decide to merge.
- Same persona file (`reviewer.agent.md`) is the source of truth for both local and CI reviewer — no behavioral fork.
- Idempotent: re-triggering doesn't spam.

### Negative

- Real money. Per-PR cost ≈ token budget × current provider rate; needs monitoring.
- Adds a secret to manage.
- Adds a workflow file that must be kept secure (no `pull_request_target`, no script-injection vectors).
- Quality of reviews bounded by the LLM; bad calls will happen.

### Neutral

- Does not change branch protection.
- Does not change `verify.yml`.
- Does not change the human merge gate.

## Adoption checklist

1. Confirm ADR-0007 is Accepted and stable (≥ 3 PRs using it cleanly).
2. Pick LLM provider; budget; create the API key.
3. Add `LLM_API_KEY` secret and `LLM_PROVIDER` variable on the repo.
4. Implement `scripts/internal/ai-review.js` behind a feature flag — runnable locally first.
5. Add `.github/workflows/ai-review.yml` with `workflow_dispatch` only.
6. Test on a throwaway PR; iterate the prompt template.
7. Enable the `/ai-review` comment trigger if needed.
8. Document cost ceiling and disable path in `docs/CONTRIBUTING.md`.
9. Flip this ADR to Accepted; update `docs/adr/README.md` index.

## Related

- Depends on [ADR-0006](0006-agentic-pr-workflow.md) (workflow shape) and [ADR-0007](0007-local-agent-pr-toolkit.md) (`pr-context.js`, reviewer persona).
- Does **not** supersede ADR-0007 — local reviewer remains available for ad-hoc deeper reviews.
