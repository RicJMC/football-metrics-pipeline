const fs = require('fs');
const fsp = require('fs/promises');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..', '..');
const sampleRoot = path.join(repoRoot, 'sample-data', 'etl-phase2');
const fixtureFile = path.join(sampleRoot, 'input', 'playerStats01_Unicos.sample.json');
const expectedRoot = path.join(sampleRoot, 'expected');

const stageScripts = [
  'playerStats02_Numerical3games.js',
  'playerStats03_ZScores.js',
  'playerStats04_Metrics.js',
  'playerStats05_CSV.js'
];

async function ensureDir(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

async function copyStageScripts(tempScriptsDir) {
  for (const scriptName of stageScripts) {
    const source = path.join(repoRoot, 'scripts', scriptName);
    const target = path.join(tempScriptsDir, scriptName);
    await fsp.copyFile(source, target);
  }
}

function runNodeScript(scriptName, cwd) {
  const result = spawnSync(process.execPath, [scriptName], {
    cwd,
    env: { ...process.env },
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    const stdout = result.stdout || '';
    const stderr = result.stderr || '';
    throw new Error(`Script ${scriptName} failed.\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`);
  }
}

async function ensureStage4ChunkInputs(jsonDir) {
  for (const index of [1, 2, 3]) {
    const filePath = path.join(jsonDir, `playerStats03_ZScores_${index}.json`);
    try {
      await fsp.access(filePath);
    } catch {
      await fsp.writeFile(filePath, '{}\n');
    }
  }
}

async function readJson(filePath) {
  return JSON.parse(await fsp.readFile(filePath, 'utf8'));
}

async function runPhase2SamplePipeline() {
  const tempRoot = path.join(repoRoot, 'tmp');
  await ensureDir(tempRoot);

  const tempBase = await fsp.mkdtemp(path.join(tempRoot, 'characterization-'));
  const tempScriptsDir = path.join(tempBase, 'scripts');
  const tempJsonDir = path.join(tempBase, 'jsonfiles');
  const tempCsvDir = path.join(tempBase, 'csv');

  await ensureDir(tempScriptsDir);
  await ensureDir(tempJsonDir);
  await ensureDir(tempCsvDir);
  await copyStageScripts(tempScriptsDir);
  await fsp.copyFile(fixtureFile, path.join(tempJsonDir, 'playerStats01_Unicos.json'));

  runNodeScript('playerStats02_Numerical3games.js', tempScriptsDir);
  runNodeScript('playerStats03_ZScores.js', tempScriptsDir);
  await ensureStage4ChunkInputs(tempJsonDir);
  runNodeScript('playerStats04_Metrics.js', tempScriptsDir);
  runNodeScript('playerStats05_CSV.js', tempScriptsDir);

  const outputs = {
    filtered: await readJson(path.join(tempJsonDir, 'playerStats02_Filtered.JSON')),
    numerical: await readJson(path.join(tempJsonDir, 'playerStats02_Numerical.JSON')),
    zscores0: await readJson(path.join(tempJsonDir, 'playerStats03_ZScores_0.json')),
    metrics0: await readJson(path.join(tempJsonDir, 'playerStats03_ZScores_004_Metrics.json')),
    metrics1: await readJson(path.join(tempJsonDir, 'playerStats03_ZScores_104_Metrics.json')),
    metrics2: await readJson(path.join(tempJsonDir, 'playerStats03_ZScores_204_Metrics.json')),
    metrics3: await readJson(path.join(tempJsonDir, 'playerStats03_ZScores_304_Metrics.json')),
    csv: await fsp.readFile(path.join(tempCsvDir, 'playerStatstoCSV1-3.csv'), 'utf8')
  };

  await fsp.rm(tempBase, { recursive: true, force: true });
  return outputs;
}

async function readExpectedOutputs() {
  return {
    filtered: await readJson(path.join(expectedRoot, 'playerStats02_Filtered.expected.json')),
    numerical: await readJson(path.join(expectedRoot, 'playerStats02_Numerical.expected.json')),
    zscores0Hash: (await fsp.readFile(path.join(expectedRoot, 'playerStats03_ZScores_0.expected.sha256'), 'utf8')).trim(),
    metrics0Hash: (await fsp.readFile(path.join(expectedRoot, 'playerStats03_ZScores_004_Metrics.expected.sha256'), 'utf8')).trim(),
    metrics1: await readJson(path.join(expectedRoot, 'playerStats03_ZScores_104_Metrics.expected.json')),
    metrics2: await readJson(path.join(expectedRoot, 'playerStats03_ZScores_204_Metrics.expected.json')),
    metrics3: await readJson(path.join(expectedRoot, 'playerStats03_ZScores_304_Metrics.expected.json')),
    csv: await fsp.readFile(path.join(expectedRoot, 'playerStatstoCSV1-3.expected.csv'), 'utf8')
  };
}

module.exports = {
  runPhase2SamplePipeline,
  readExpectedOutputs
};

if (require.main === module) {
  runPhase2SamplePipeline()
    .then((outputs) => {
      process.stdout.write(JSON.stringify(outputs, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
