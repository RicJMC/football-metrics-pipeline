const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const tmpDir = path.join(rootDir, 'tmp');
const secretScanFile = path.join(tmpDir, 'verify-secret-scan.txt');
let failed = false;

function ok(message) {
  console.log(`[ok] ${message}`);
}

function fail(message) {
  console.log(`[fail] ${message}`);
  failed = true;
}

function skip(message) {
  console.log(`[skip] ${message}`);
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: options.captureOutput ? 'pipe' : 'inherit',
    shell: false,
    ...options
  });
}

function npmCommand() {
  return process.platform === 'win32' ? 'npm.cmd' : 'npm';
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function checkPaths() {
  const requiredPaths = [
    'package.json',
    'package-lock.json',
    'scripts/index.js',
    'scripts/playerStats02_Numerical3games.js',
    'scripts/playerStats03_ZScores.js',
    'scripts/playerStats04_Metrics.js',
    'scripts/playerStats05_CSV.js',
    'scripts/verify.sh',
    'scripts/verify.js',
    'sample-data/etl-phase2/input/playerStats01_Unicos.sample.json',
    'sample-data/etl-phase2/expected/playerStats02_Filtered.expected.json',
    'sample-data/etl-phase2/expected/playerStats02_Numerical.expected.json',
    'sample-data/etl-phase2/expected/playerStats03_ZScores_0.expected.sha256',
    'sample-data/etl-phase2/expected/playerStats03_ZScores_004_Metrics.expected.sha256',
    'sample-data/etl-phase2/expected/playerStats03_ZScores_104_Metrics.expected.json',
    'sample-data/etl-phase2/expected/playerStats03_ZScores_204_Metrics.expected.json',
    'sample-data/etl-phase2/expected/playerStats03_ZScores_304_Metrics.expected.json',
    'sample-data/etl-phase2/expected/playerStatstoCSV1-3.expected.csv',
    '.github/workflows/verify.yml',
    'test/characterization/phase2PipelineHarness.js',
    'test/characterization/phase2Pipeline.test.js'
  ];

  for (const relativePath of requiredPaths) {
    if (fs.existsSync(path.join(rootDir, relativePath))) {
      ok(`exists: ${relativePath}`);
    } else {
      fail(`missing: ${relativePath}`);
    }
  }
}

function checkPackageMetadata() {
  try {
    JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
    JSON.parse(fs.readFileSync(path.join(rootDir, 'package-lock.json'), 'utf8'));
    ok('package.json and package-lock.json parse');
  } catch (error) {
    fail(`package metadata parse: ${error.message}`);
  }
}

function checkJsonFixtures() {
  const jsonFiles = [
    'sample-data/etl-phase2/input/playerStats01_Unicos.sample.json',
    'sample-data/etl-phase2/expected/playerStats02_Filtered.expected.json',
    'sample-data/etl-phase2/expected/playerStats02_Numerical.expected.json',
    'sample-data/etl-phase2/expected/playerStats03_ZScores_104_Metrics.expected.json',
    'sample-data/etl-phase2/expected/playerStats03_ZScores_204_Metrics.expected.json',
    'sample-data/etl-phase2/expected/playerStats03_ZScores_304_Metrics.expected.json'
  ];

  for (const relativePath of jsonFiles) {
    try {
      JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
      ok(`json: ${relativePath}`);
    } catch (error) {
      fail(`json: ${relativePath} (${error.message})`);
    }
  }
}

function checkShellSyntax() {
  if (process.platform === 'win32') {
    skip('bash -n scripts/verify.sh on Windows host');
    return;
  }

  const bashCheck = run('bash', ['-n', path.join(rootDir, 'scripts', 'verify.sh')], { captureOutput: true });

  if (bashCheck.error) {
    skip('bash not available; skipped bash -n scripts/verify.sh');
    return;
  }

  if (bashCheck.status === 0) {
    ok('bash -n scripts/verify.sh');
  } else {
    fail(`bash -n scripts/verify.sh (${(bashCheck.stderr || '').trim()})`);
  }
}

function runCharacterizationTests() {
  const result = run(process.execPath, ['--test', 'test/characterization/phase2Pipeline.test.js'], { captureOutput: true });

  if (result.status === 0) {
    ok('characterization tests');
  } else {
    fail('characterization tests');
    if (result.stdout) {
      process.stdout.write(result.stdout);
    }
    if (result.stderr) {
      process.stderr.write(result.stderr);
    }
  }
}

function runSecretScan() {
  const args = [
    '-C',
    rootDir,
    'grep',
    '-I',
    '-n',
    '-E',
    '(api[_-]?key\\s*[:=]|token\\s*[:=]|password\\s*[:=]|secret\\s*[:=])',
    '--',
    '.',
    ':(exclude)scripts/old/**',
    ':(exclude)copilot-ai-starter/**',
    ':(exclude)docs/**',
    ':(exclude)sample-data/**',
    ':(exclude)csv/**',
    ':(exclude)data/**',
    ':(exclude)jsonfiles/**',
    ':(exclude)tmp/**'
  ];

  const result = run('git', args, { captureOutput: true });

  if (result.error) {
    skip('git not available; skipped secret-pattern scan');
    return;
  }

  if (result.status === 0) {
    fs.writeFileSync(secretScanFile, result.stdout || '', 'utf8');
    fail('secret-like patterns found; see tmp/verify-secret-scan.txt');
    return;
  }

  if (result.status === 1) {
    if (fs.existsSync(secretScanFile)) {
      fs.rmSync(secretScanFile, { force: true });
    }
    ok('no secret-like patterns found in tracked-source scan');
    return;
  }

  fail(`secret-pattern scan failed (${(result.stderr || '').trim()})`);
}

function main() {
  console.log(`[verify] root: ${rootDir}`);
  ensureDir(tmpDir);

  checkPaths();
  console.log('[verify] package metadata');
  checkPackageMetadata();
  console.log('[verify] sample JSON fixtures');
  checkJsonFixtures();
  console.log('[verify] shell syntax');
  checkShellSyntax();
  console.log('[verify] characterization tests');
  runCharacterizationTests();
  console.log('[verify] secret-pattern scan');
  runSecretScan();

  if (failed) {
    console.log('[verify] failed');
    process.exit(1);
  }

  console.log('[verify] success');
}

main();
