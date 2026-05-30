/**
 * One-off helper that builds the stage-1 sample fixture (a mocked `data/`
 * tree) and captures its approved `playerStats01_Unicos.json` output.
 *
 * Source of truth: this script. The mocked tree under
 * `sample-data/etl-stage1/data/` is 100% synthetic.
 *
 * Run with:
 *   node scripts/internal/build-stage1-fixture.js
 *
 * Developer utility; not invoked by the main pipeline.
 */

const fs = require('fs');
const path = require('path');

const { runStage1Pipeline } = require('../../test/characterization/stage1PipelineHarness');

const repoRoot = path.resolve(__dirname, '..', '..');
const stage1Root = path.join(repoRoot, 'sample-data', 'etl-stage1');
const dataRoot = path.join(stage1Root, 'data');
const expectedRoot = path.join(stage1Root, 'expected');

// Two leagues × one season × four categories × ~3 players each.
// Field choices mirror the real FBref category layout so stage 1 produces a
// meaningful merged record per player.
const leagues = [
  {
    id: '24',
    name: 'Serie-A',
    season: '2024',
    players: [
      { player: 'Marco Synth', team: 'Roma FC', nationality: 'it ITA', birth_year: '1998', age: '26-100', position: 'MF', minutes_90s: '12.5' },
      { player: 'Luca Demo', team: 'Roma FC', nationality: 'it ITA', birth_year: '2001', age: '23-200', position: 'FW', minutes_90s: '9.2' },
      { player: 'Giulio Mock', team: 'Milan SC', nationality: 'it ITA', birth_year: '1995', age: '29-050', position: 'DF', minutes_90s: '14.8' }
    ]
  },
  {
    id: '32',
    name: 'Primeira-Liga',
    season: '2023-2024',
    players: [
      { player: 'Joao Sample', team: 'Lisboa FC', nationality: 'pt POR', birth_year: '1999', age: '24-300', position: 'MF', minutes_90s: '11.0' },
      { player: 'Tomas Fixture', team: 'Porto United', nationality: 'pt POR', birth_year: '2000', age: '23-150', position: 'FW', minutes_90s: '8.5' },
      { player: 'Rui Replica', team: 'Lisboa FC', nationality: 'pt POR', birth_year: '1997', age: '26-220', position: 'DF', minutes_90s: '13.4' }
    ]
  }
];

const categories = {
  standard: (p, i) => ({
    Rk: String(i),
    PlayerCode: null,
    player: p.player,
    nationality: p.nationality,
    position: p.position,
    team: p.team,
    age: p.age,
    birth_year: p.birth_year,
    minutes_90s: p.minutes_90s,
    games: '15',
    games_starts: '12',
    goals: String(0.10 + i * 0.05),
    assists: String(0.05 + i * 0.04),
    matches: 'Matches'
  }),
  shooting: (p, i) => ({
    Rk: String(i),
    PlayerCode: null,
    player: p.player,
    nationality: p.nationality,
    position: p.position,
    team: p.team,
    age: p.age,
    birth_year: p.birth_year,
    minutes_90s: p.minutes_90s,
    shots: String(1.2 + i * 0.3),
    shots_on_target: String(0.5 + i * 0.2),
    shots_on_target_pct: String(40 + i * 5),
    shots_per90: String(1.2 + i * 0.3),
    shots_on_target_per90: String(0.5 + i * 0.2),
    goals_per_shot: String(0.10 + i * 0.02),
    goals_per_shot_on_target: String(0.20 + i * 0.03),
    npxg: String(0.30 + i * 0.05),
    npxg_per_shot: String(0.15 + i * 0.01),
    matches: 'Matches'
  }),
  passing: (p, i) => ({
    Rk: String(i),
    PlayerCode: null,
    player: p.player,
    nationality: p.nationality,
    position: p.position,
    team: p.team,
    age: p.age,
    birth_year: p.birth_year,
    minutes_90s: p.minutes_90s,
    passes_completed: String(20 + i * 5),
    passes_pct: String(70 + i * 3),
    passes_into_final_third: String(2.5 + i * 0.5),
    passes_into_penalty_area: String(1.0 + i * 0.2),
    progressive_passes: String(3.0 + i * 0.4),
    passes_progressive_distance: String(80 + i * 10),
    pass_xa: String(0.08 + i * 0.02),
    assisted_shots: String(1.5 + i * 0.3),
    matches: 'Matches'
  }),
  misc: (p, i) => ({
    Rk: String(i),
    PlayerCode: null,
    player: p.player,
    nationality: p.nationality,
    position: p.position,
    team: p.team,
    age: p.age,
    birth_year: p.birth_year,
    minutes_90s: p.minutes_90s,
    fouled: String(1.0 + i * 0.2),
    aerials_won: String(0.8 + i * 0.3),
    aerials_won_pct: String(45 + i * 5),
    ball_recoveries: String(4.5 + i * 0.5),
    matches: 'Matches'
  })
};

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJson(p, obj) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
}

function buildDataTree() {
  for (const league of leagues) {
    for (const [category, builder] of Object.entries(categories)) {
      const rows = league.players.map((p, i) => builder(p, i));
      const outPath = path.join(
        dataRoot,
        `${league.id}-${league.name}`,
        league.season,
        category,
        `${league.season}-${league.name}-${category}.json`
      );
      writeJson(outPath, rows);
    }
  }
}

async function main() {
  // Reset the data tree so the generator is deterministic.
  if (fs.existsSync(dataRoot)) {
    fs.rmSync(dataRoot, { recursive: true, force: true });
  }
  buildDataTree();
  console.log(`Wrote mocked data tree under: ${path.relative(repoRoot, dataRoot)}`);

  const output = await runStage1Pipeline(dataRoot);

  ensureDir(expectedRoot);
  const expectedPath = path.join(expectedRoot, 'playerStats01_Unicos.expected.json');
  writeJson(expectedPath, output);
  console.log(`Wrote expected output: ${path.relative(repoRoot, expectedPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
