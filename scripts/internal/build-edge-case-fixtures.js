/**
 * One-off helper that builds edge-case fixtures and their approved outputs.
 *
 * Source of truth: `sample-data/etl-phase2/input/playerStats01_Unicos.sample.json`.
 * Mutations are described in `sample-data/edge-cases/README.md`.
 *
 * Run with:
 *   node scripts/internal/build-edge-case-fixtures.js
 *
 * This is a developer utility; it is not invoked by the main pipeline.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { runPhase2SamplePipeline } = require('../../test/characterization/phase2PipelineHarness');

const repoRoot = path.resolve(__dirname, '..', '..');
const baseFixture = path.join(
  repoRoot,
  'sample-data',
  'etl-phase2',
  'input',
  'playerStats01_Unicos.sample.json'
);
const edgeCasesDir = path.join(repoRoot, 'sample-data', 'edge-cases');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function buildMissingFields(base) {
  // Take Player Alpha and Player Beta. Remove some metric fields from Alpha,
  // set a few to null on Beta. Both keep minutes_90s above the stage-2 threshold.
  const fixture = {};
  fixture['Player Alpha'] = clone(base['Player Alpha']);
  fixture['Player Beta'] = clone(base['Player Beta']);

  const alphaTeam = fixture['Player Alpha'].Seasons['2023-2024'].Teams['Team A'];
  for (const field of ['aerials_won_pct', 'aerials_won', 'gk_psxg', 'gk_passes']) {
    delete alphaTeam[field];
  }

  const betaTeam = fixture['Player Beta'].Seasons['2023-2024'].Teams['Team B'];
  for (const field of ['tackles_won', 'tackles', 'progressive_passes']) {
    betaTeam[field] = null;
  }

  return fixture;
}

function buildMultiTeam(base) {
  // Player Delta appears in two teams in the same season (mid-season transfer).
  // Values are derived from Player Beta to keep the schema complete.
  const template = clone(base['Player Beta'].Seasons['2023-2024'].Teams['Team B']);

  const teamD = clone(template);
  teamD.minutes_90s = '4.5';
  teamD.games = '6';
  teamD.games_starts = '5';

  const teamE = clone(template);
  teamE.minutes_90s = '3.8';
  teamE.games = '5';
  teamE.games_starts = '4';
  teamE.position = 'MF';

  return {
    'Player Delta': {
      Seasons: {
        '2023-2024': {
          Teams: {
            'Team D': teamD,
            'Team E': teamE
          }
        }
      }
    }
  };
}

function buildFilteredOut(base) {
  // Player Echo has minutes_90s below the stage-2 threshold (< 3) and must be
  // dropped from the filtered output. Player Alpha is kept as a control so the
  // pipeline has something to operate on.
  const fixture = {};
  fixture['Player Alpha'] = clone(base['Player Alpha']);

  const echoTeam = clone(base['Player Gamma'].Seasons['2023-2024'].Teams['Team C']);
  echoTeam.minutes_90s = '1.5';
  echoTeam.games = '3';
  echoTeam.games_starts = '1';

  fixture['Player Echo'] = {
    Seasons: {
      '2023-2024': {
        Teams: {
          'Team F': echoTeam
        }
      }
    }
  };

  return fixture;
}

function hashJson(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

async function writeExpected(caseName, fixturePath) {
  const expectedDir = path.join(edgeCasesDir, caseName, 'expected');
  fs.mkdirSync(expectedDir, { recursive: true });

  const outputs = await runPhase2SamplePipeline(fixturePath);

  writeJson(path.join(expectedDir, 'playerStats02_Filtered.expected.json'), outputs.filtered);
  writeJson(path.join(expectedDir, 'playerStats02_Numerical.expected.json'), outputs.numerical);
  fs.writeFileSync(
    path.join(expectedDir, 'playerStats03_ZScores_0.expected.sha256'),
    hashJson(outputs.zscores0) + '\n'
  );
  fs.writeFileSync(
    path.join(expectedDir, 'playerStats03_ZScores_004_Metrics.expected.sha256'),
    hashJson(outputs.metrics0) + '\n'
  );
  writeJson(path.join(expectedDir, 'playerStats03_ZScores_104_Metrics.expected.json'), outputs.metrics1);
  writeJson(path.join(expectedDir, 'playerStats03_ZScores_204_Metrics.expected.json'), outputs.metrics2);
  writeJson(path.join(expectedDir, 'playerStats03_ZScores_304_Metrics.expected.json'), outputs.metrics3);
  fs.writeFileSync(
    path.join(expectedDir, 'playerStatstoCSV1-3.expected.csv'),
    outputs.csv
  );
}

async function main() {
  const base = readJson(baseFixture);

  const cases = [
    { name: 'missing-fields', build: () => buildMissingFields(base) },
    { name: 'multi-team', build: () => buildMultiTeam(base) },
    { name: 'filtered-out', build: () => buildFilteredOut(base) }
  ];

  for (const { name, build } of cases) {
    const fixturePath = path.join(edgeCasesDir, name, 'input', 'playerStats01_Unicos.sample.json');
    writeJson(fixturePath, build());
    console.log(`Wrote fixture: ${fixturePath}`);

    await writeExpected(name, fixturePath);
    console.log(`Wrote expected outputs for: ${name}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
