/**
 * Runs the legacy ETL against a bundled sample fixture and writes the final
 * CSV plus intermediate JSON to `tmp/sample-output/`. The repository ships
 * with enough synthetic data that a fresh clone can produce a visible artifact
 * without any scraping.
 *
 * Modes:
 *   npm run pipeline:sample                  # stages 02-05 from etl-phase2 fixture (full CSV demo)
 *   npm run pipeline:sample:stage1           # stage 01 only, from etl-stage1 mocked data tree
 *   npm run pipeline:sample -- --fixture <path>   # stages 02-05 from a custom stage-1 output
 *
 * Note: stages 02-05 require enough players to compute meaningful z-scores and
 * normalized metrics; the etl-stage1 synthetic fixture is intentionally small
 * (6 players, 2 leagues) and is not large enough to drive the full CSV stage.
 * Use the etl-phase2 fixture (default) for an end-to-end CSV demo.
 */

const fs = require('fs');
const path = require('path');

const { runPhase2SamplePipeline } = require('../test/characterization/phase2PipelineHarness');
const { runStage1Pipeline } = require('../test/characterization/stage1PipelineHarness');

const repoRoot = path.resolve(__dirname, '..');
const stage1DataDir = path.join(repoRoot, 'sample-data', 'etl-stage1', 'data');

function parseArgs(argv) {
  const args = { fixture: undefined, stage1Only: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--fixture' && argv[i + 1]) {
      args.fixture = path.resolve(argv[i + 1]);
      i++;
    } else if (argv[i] === '--stage1') {
      args.stage1Only = true;
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = path.join(repoRoot, 'tmp', 'sample-output');
  fs.mkdirSync(outDir, { recursive: true });

  if (args.stage1Only) {
    console.log('Running stage 01 against mocked data tree:', path.relative(repoRoot, stage1DataDir));
    const stage1Output = await runStage1Pipeline(stage1DataDir);
    const stage1OutFile = path.join(outDir, 'playerStats01_Unicos.sample.json');
    fs.writeFileSync(stage1OutFile, JSON.stringify(stage1Output, null, 2));
    console.log(`Stage 01 output written to: ${path.relative(repoRoot, stage1OutFile)}`);
    console.log(`Players: ${Object.keys(stage1Output).length}`);
    return;
  }

  const fixtureFile = args.fixture;
  const modeLabel = fixtureFile
    ? `stages 02-05 against fixture: ${path.relative(repoRoot, fixtureFile)}`
    : 'stages 02-05 against default fixture (sample-data/etl-phase2/input/playerStats01_Unicos.sample.json)';

  console.log(`Running ${modeLabel}`);
  const outputs = await runPhase2SamplePipeline(fixtureFile);

  fs.writeFileSync(path.join(outDir, 'playerStatstoCSV1-3.sample.csv'), outputs.csv);
  fs.writeFileSync(
    path.join(outDir, 'playerStats02_Filtered.sample.json'),
    JSON.stringify(outputs.filtered, null, 2)
  );
  fs.writeFileSync(
    path.join(outDir, 'playerStats02_Numerical.sample.json'),
    JSON.stringify(outputs.numerical, null, 2)
  );

  console.log(`Wrote CSV + intermediate JSON to: ${path.relative(repoRoot, outDir)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
