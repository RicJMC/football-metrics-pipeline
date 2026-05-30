// PR-context helper for the local agentic workflow (ADR-0007).
//
// Exposes:
//   - fetchPrContextFromRaw(raw) — pure, synchronous normalizer (testable seam).
//   - fetchPrContext(prNumber, opts) — async; shells out to `gh` and `gh api`.
//
// CLI: `node scripts/internal/pr-context.js <prNumber> [--repo owner/name]`
//   Prints the normalized JSON. Exit codes:
//     0 success
//     1 generic error
//     2 `gh` not authenticated

'use strict';

const { execFileSync } = require('child_process');

function pickAuthor(value) {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value.login === 'string') return value.login;
  return null;
}

function normalizeConversationComments(comments) {
  if (!Array.isArray(comments)) return [];
  return comments.map((c) => ({
    id: c.id,
    author: pickAuthor(c.author || c.user),
    body: c.body || '',
    createdAt: c.createdAt || c.created_at || null,
  }));
}

function normalizeInlineComments(comments) {
  if (!Array.isArray(comments)) return [];
  return comments.map((c) => ({
    id: c.id,
    author: pickAuthor(c.user || c.author),
    path: c.path,
    line: c.line,
    body: c.body || '',
    createdAt: c.created_at || c.createdAt || null,
  }));
}

function normalizeReviews(reviews) {
  if (!Array.isArray(reviews)) return [];
  return reviews.map((r) => ({
    id: r.id,
    author: pickAuthor(r.author || r.user),
    state: r.state,
    body: r.body || '',
    submittedAt: r.submittedAt || r.submitted_at || null,
  }));
}

function deriveCiConclusion(checks) {
  if (!Array.isArray(checks) || checks.length === 0) return 'unknown';
  const conclusions = checks.map((c) => (c.conclusion || '').toLowerCase());
  if (conclusions.some((c) => c === 'failure' || c === 'cancelled' || c === 'timed_out')) {
    return 'failure';
  }
  if (conclusions.every((c) => c === 'success' || c === 'skipped' || c === 'neutral')) {
    return 'success';
  }
  return 'pending';
}

function normalizeChecks(checks) {
  if (!Array.isArray(checks)) return { conclusion: 'unknown', checks: [] };
  const normalized = checks.map((c) => ({
    name: c.name,
    conclusion: c.conclusion || null,
  }));
  return { conclusion: deriveCiConclusion(normalized), checks: normalized };
}

function fetchPrContextFromRaw(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new TypeError('fetchPrContextFromRaw: raw must be an object');
  }
  const { prView, inlineComments, reviews, checks } = raw;
  if (!prView || typeof prView !== 'object') {
    throw new TypeError('fetchPrContextFromRaw: raw.prView is required');
  }

  return {
    number: prView.number,
    title: prView.title,
    headSha: prView.headRefOid,
    state: prView.state,
    url: prView.url,
    author: pickAuthor(prView.author),
    conversationComments: normalizeConversationComments(prView.comments),
    inlineComments: normalizeInlineComments(inlineComments),
    reviews: normalizeReviews(reviews),
    ciStatus: normalizeChecks(checks),
  };
}

function ghJson(args) {
  const out = execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  return JSON.parse(out);
}

function ensureGhAuth() {
  try {
    execFileSync('gh', ['auth', 'status'], { stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (err) {
    const error = new Error('gh CLI is not authenticated. Run `gh auth login` and retry.');
    error.code = 'GH_NOT_AUTHENTICATED';
    error.cause = err;
    throw error;
  }
}

function resolveRepo(repo) {
  if (repo) return repo;
  const view = ghJson(['repo', 'view', '--json', 'nameWithOwner']);
  return view.nameWithOwner;
}

async function fetchPrContext(prNumber, options = {}) {
  if (prNumber === undefined || prNumber === null || prNumber === '') {
    throw new TypeError('fetchPrContext: prNumber is required');
  }
  ensureGhAuth();
  const prStr = String(prNumber);
  const repo = resolveRepo(options.repo);

  const prView = ghJson([
    'pr',
    'view',
    prStr,
    '--repo',
    repo,
    '--json',
    'number,title,headRefOid,state,url,author,comments',
  ]);
  const reviewsPayload = ghJson(['pr', 'view', prStr, '--repo', repo, '--json', 'reviews']);
  const inlineComments = ghJson([
    'api',
    `repos/${repo}/pulls/${prStr}/comments`,
  ]);
  const checksPayload = ghJson([
    'pr',
    'checks',
    prStr,
    '--repo',
    repo,
    '--json',
    'name,conclusion',
  ]);

  return fetchPrContextFromRaw({
    prView,
    inlineComments,
    reviews: reviewsPayload.reviews,
    checks: checksPayload,
  });
}

function parseArgv(argv) {
  const args = argv.slice(2);
  let prNumber;
  let repo;
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    if (a === '--repo') {
      repo = args[i + 1];
      i += 1;
    } else if (a.startsWith('--repo=')) {
      repo = a.slice('--repo='.length);
    } else if (!prNumber) {
      prNumber = a;
    }
  }
  return { prNumber, repo };
}

async function main() {
  const { prNumber, repo } = parseArgv(process.argv);
  if (!prNumber) {
    process.stderr.write('Usage: node scripts/internal/pr-context.js <prNumber> [--repo owner/name]\n');
    process.exit(1);
  }
  try {
    const result = await fetchPrContext(prNumber, { repo });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (err) {
    if (err && err.code === 'GH_NOT_AUTHENTICATED') {
      process.stderr.write(`${err.message}\n`);
      process.exit(2);
    }
    process.stderr.write(`pr-context failed: ${err && err.message ? err.message : err}\n`);
    process.exit(1);
  }
}

module.exports = { fetchPrContextFromRaw, fetchPrContext };

if (require.main === module) {
  main();
}
