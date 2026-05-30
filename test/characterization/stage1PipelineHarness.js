const fsp = require('fs/promises');
const path = require('path');
const { spawnSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..', '..');
const stage1Script = 'playerStats01_unicos.js';

async function ensureDir(dirPath) {
  await fsp.mkdir(dirPath, { recursive: true });
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  for (const entry of await fsp.readdir(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fsp.copyFile(srcPath, destPath);
    }
  }
}

function runNodeScript(scriptName, cwd) {
  const result = spawnSync(process.execPath, [scriptName], {
    cwd,
    env: { ...process.env },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    const stdout = result.stdout || '';
    const stderr = result.stderr || '';
    throw new Error(`Script ${scriptName} failed.\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`);
  }
}

/**
 * Run the legacy stage-1 script against an arbitrary mocked data tree.
 *
 * @param {string} dataDir Absolute path to a directory shaped like
 *   `<id>-<league>/<season>/<category>/<season>-<league>-<category>.json`.
 * @returns {Promise<object>} The parsed `playerStats01_Unicos.json` output.
 */
async function runStage1Pipeline(dataDir) {
  const tempRoot = path.join(repoRoot, 'tmp');
  await ensureDir(tempRoot);

  const tempBase = await fsp.mkdtemp(path.join(tempRoot, 'stage1-'));
  const tempScriptsDir = path.join(tempBase, 'scripts');
  const tempDataDir = path.join(tempBase, 'data');
  const tempJsonDir = path.join(tempBase, 'jsonfiles');

  await ensureDir(tempScriptsDir);
  await ensureDir(tempJsonDir);
  await fsp.copyFile(
    path.join(repoRoot, 'scripts', stage1Script),
    path.join(tempScriptsDir, stage1Script),
  );
  await copyDir(dataDir, tempDataDir);

  runNodeScript(stage1Script, tempScriptsDir);

  const output = JSON.parse(
    await fsp.readFile(path.join(tempJsonDir, 'playerStats01_Unicos.json'), 'utf8'),
  );

  await fsp.rm(tempBase, { recursive: true, force: true });
  return output;
}

module.exports = { runStage1Pipeline };
