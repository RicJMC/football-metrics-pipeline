const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs/promises');
const path = require('path');

const { runStage1Pipeline } = require('./stage1PipelineHarness');

const repoRoot = path.resolve(__dirname, '..', '..');
const stage1Root = path.join(repoRoot, 'sample-data', 'etl-stage1');
const dataDir = path.join(stage1Root, 'data');
const expectedPath = path.join(stage1Root, 'expected', 'playerStats01_Unicos.expected.json');

test('legacy ETL stage 1 produces stable playerStats01_Unicos output for the mocked data tree', async () => {
  const actual = await runStage1Pipeline(dataDir);
  const expected = JSON.parse(await fs.readFile(expectedPath, 'utf8'));
  assert.deepStrictEqual(actual, expected);
});
