/**
 * Runs the legacy ETL (stages 02-05) against the bundled sample fixture and
 * writes the final CSV to `tmp/sample-output/` so a fresh clone can produce a
 * visible artifact without any scraped data.
 *
 * Usage:
 *   npm run pipeline:sample
 *
 * Default fixture: `sample-data/etl-phase2/input/playerStats01_Unicos.sample.json`.
 * Pass `--fixture <path>` to point at a different one (e.g. an edge case under
 * `sample-data/edge-cases/<name>/input/...`).
 */

const fs = require('fs');
const path = require('path');

const { runPhase2SamplePipeline } = require('../test/characterization/phase2PipelineHarness');

function parseArgs(argv) {
  const args = { fixture: undefined };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--fixture' && argv[i + 1]) {
      args.fixture = path.resolve(argv[i + 1]);
      i++;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(__dirname, '..');
  const outDir = path.join(repoRoot, 'tmp', 'sample-output');
  fs.mkdirSync(outDir, { recursive: true });

  const fixtureLabel = args.fixture
    ? path.relative(repoRoot, args.fixture)
    : 'sample-data/etl-phase2/input/playerStats01_Unicos.sample.json (default)';

  console.log(`Running ETL stages 02-05 against fixture: ${fixtureLabel}`);
  const outputs = await runPhase2SamplePipeline(args.fixture);

  const csvPath = path.join(outDir, 'playerStatstoCSV1-3.sample.csv');
  fs.writeFileSync(csvPath, outputs.csv);
  console.log(`Wrote CSV: ${path.relative(repoRoot, csvPath)}`);

  fs.writeFileSync(
    path.join(outDir, 'playerStats02_Filtered.sample.json'),
    JSON.stringify(outputs.filtered, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, 'playerStats02_Numerical.sample.json'),
    JSON.stringify(outputs.numerical, null, 2)
  );
  console.log(`Wrote intermediate JSON outputs to: ${path.relative(repoRoot, outDir)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
