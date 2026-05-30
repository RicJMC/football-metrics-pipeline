# ADR-0007: Local agent toolkit for PR operations via `gh`

- **Status:** Accepted
- **Date:** 2026-05-30
- **Deciders:** Repository owner

## Context

ADR-0006 established the three-layer agentic PR workflow (CI gate → AI reviewer → human merge gate) but did not specify **how** the local agents (`implementer`, `reviewer`) interact with a PR once it exists. Today each agent improvises:

- The implementer opens PRs with ad-hoc `gh pr create` invocations.
- The reviewer, when invoked from chat with a PR number, has no canonical way to fetch the full feedback already present on the PR.

GitHub stores PR feedback in **three separate places**:

1. **Conversation comments** — `gh pr view <n> --json comments`
2. **Inline review comments** (line-anchored) — `gh api repos/{owner}/{repo}/pulls/<n>/comments`
3. **Reviews** (approval state + summary body) — `gh pr view <n> --json reviews`

A reviewer agent that only reads (1) silently misses the bulk of what real reviewers (humans, Copilot Code Review, CodeRabbit) actually post — which are in (2) and (3). This is a correctness bug waiting to happen the first time a real bot reviews a PR.

The owner does not have GitHub Pro / Copilot Coding Agent, so the agents must run locally (inside VS Code Chat sessions) for the foreseeable future. Multi-session orchestration is human-driven (the owner advances the chat between agent invocations); this ADR does **not** try to remove that human-in-the-loop role — see ADR-0008 (proposed) for the optional Actions-side reviewer.

Constraints:

- No new runtime dependencies. The `gh` CLI is already authenticated and used by both agents.
- No third-party `gh` extensions (e.g. `gh-pr-review`) — extra supply-chain surface without ROI at current PR volume.
- Must work on Windows + PowerShell (primary dev environment).
- Must be testable: the helper that wraps `gh` should be characterizable like any other script in this repo.

## Decision

Adopt a thin Node helper plus a documented playbook for local PR operations.

1. **Helper script: `scripts/internal/pr-context.js`**
   - Single public function `fetchPrContext(prNumber, { repo })` that returns a normalized JSON object:

     ```
     {
       number, title, headSha, state, url, author,
       conversationComments: [{ id, author, body, createdAt }],
       inlineComments:       [{ id, author, path, line, body, createdAt }],
       reviews:              [{ id, author, state, body, submittedAt }],
       ciStatus:             { conclusion, checks: [{ name, conclusion }] }
     }
     ```

   - Shells out to `gh` and `gh api` (no `@octokit` dependency).
   - When invoked as a script (`node scripts/internal/pr-context.js <pr>`), prints the JSON to stdout.
   - Refuses to run if `gh auth status` fails — clear error, exit code 2.

2. **Reviewer agent contract**
   - `reviewer.agent.md` is updated to require that any review begins with a call to `pr-context.js` (or equivalent invocation of the same three endpoints). No more partial reads.
   - The reviewer agent posts feedback with `gh pr review <n>` using `--approve`, `--request-changes`, or `--comment` — whichever honestly reflects the verdict. **Never `gh pr merge`.** The human merge gate from ADR-0006 is what keeps the loop safe; the reviewer's verb is just a signal.
   - Every review body **must** begin with a machine-readable marker `<!-- ai-reviewer:v1 -->` on its own line, followed by `Verdict: APPROVE | REQUEST_CHANGES | COMMENT`, followed by the head SHA reviewed. This makes agent reviews trivially distinguishable from manual human reviews in the GitHub audit trail (locally the review is authored by the human owner's `gh` identity).

3. **Implementer agent contract**
   - When opening a PR: `gh pr create --title <conventional-commit> --body <from-template> --base main --head <branch>`.
   - When responding to reviewer feedback: fetch via `pr-context.js`, address inline comments by commit, post a summary reply via `gh pr review <n> --comment` (also prefixed with the `<!-- ai-implementer:v1 -->` marker).
   - **Never `gh pr review --approve` on its own PR** (self-approve is dishonest and would be misleading in the audit trail).
   - **Never `gh pr merge`.** Merge is a human action. Documented as a hard rule in the agent file.

4. **Human contract**
   - Merge is performed by the human, either through the GitHub UI or `gh pr merge <n> --squash --delete-branch`. The PR title (conventional commit) becomes the squash subject.

5. **Documentation**
   - `docs/CONTRIBUTING.md` gains a section "Local agentic playbook" with the exact happy-path commands and the failure-path commands (e.g. when reviewer requests changes).
   - The two agent files are updated to reference the helper.

6. **Characterization test**
   - A small test under `test/characterization/prContext.test.js` validates `pr-context.js` against a recorded fixture (JSON snapshot of a real PR's three endpoints), ensuring the normalization layer doesn't drift silently when the `gh` schema changes.

## Alternatives considered

- **Inline the three `gh` calls in each agent file as prose.** Rejected: prose is not testable; agents drift; no audit when `gh` JSON shape changes.
- **Install `gh-pr-review` extension.** Rejected at current volume: extra dependency for features (thread resolution, review IDs) not yet needed. Revisit when there are real threaded discussions to manage.
- **Use `@octokit/rest` instead of `gh` shell-outs.** Rejected: adds a runtime dependency and a token-management surface (`GH_TOKEN`) that `gh` already handles via its keychain integration. Reconsider if/when a CI-side reviewer (ADR-0008) needs the same code, since GitHub Actions doesn't ship `gh` configured by default… actually it does (`gh` is pre-installed on `ubuntu-latest`), so this remains valid for Actions too.
- **Allow the reviewer agent to use `--approve` / `--request-changes`.** **Accepted.** The merge gate is enforced by humans-only-merge (no agent has `gh pr merge`), so the reviewer's verb is a signal, not a gate. Forcing `--comment` only would lose useful information. Audit-trail concern (local reviews authored by the owner's `gh` identity) is mitigated by the mandatory `<!-- ai-reviewer:v1 -->` marker in every review body.
- **Allow the implementer to `gh pr review --approve` on its own PR.** Rejected: self-approval on a PR you authored is dishonest signalling. The implementer may only `--comment` (as a reply to reviewer feedback).
- **Allow the implementer to `gh pr merge`.** Rejected: removes the only remaining human checkpoint defined by ADR-0006.

## Consequences

### Positive

- Reviewer agent reads the full PR state, not a fragment.
- Behavior is reproducible across sessions because the helper is the single source of truth.
- One characterization test pins the `gh` integration; schema drift is detected.
- CONTRIBUTING.md becomes operational, not aspirational.

### Negative

- One new file under `scripts/internal/` to maintain.
- Reviewer/implementer agent files grow slightly with the new contract clauses.
- If `gh` ships a breaking change to its JSON shape, the test breaks (expected and desired).

### Neutral

- Does not change branch protection.
- Does not change the verify pipeline.
- Does not introduce LLM API costs.

## Adoption checklist

1. Write `test/characterization/fixtures/pr-context.fixture.json` from a real PR snapshot (or hand-crafted synthetic shape).
2. Write `test/characterization/prContext.test.js` against the fixture — red.
3. Implement `scripts/internal/pr-context.js` — green.
4. Update `.github/agents/reviewer.agent.md` with the new contract clauses (marker, allowed verbs, no merge).
5. Update `.github/agents/implementer.agent.md` with the `gh pr create` / `gh pr review --comment` / no-self-approve / no-merge clauses.
6. Add the "Local agentic playbook" section to `docs/CONTRIBUTING.md`.
7. Flip this ADR to Accepted in the same PR; update `docs/adr/README.md` index.
8. Validate end-to-end with one throwaway PR (`test/agentic-loop` branch) before declaring done.

## Related

- Builds on [ADR-0006](0006-agentic-pr-workflow.md).
- May be superseded in part by [ADR-0008](0008-ci-side-ai-reviewer.md) when/if the reviewer moves to GitHub Actions.
