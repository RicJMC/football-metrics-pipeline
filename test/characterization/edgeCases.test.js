const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const path = require('path');

const {
  runPhase2SamplePipeline,
  readExpectedOutputs
} = require('./phase2PipelineHarness');

const repoRoot = path.resolve(__dirname, '..', '..');
const edgeCasesRoot = path.join(repoRoot, 'sample-data', 'edge-cases');

function hashJson(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

const cases = ['missing-fields', 'multi-team', 'filtered-out'];

for (const caseName of cases) {
  test(`legacy ETL phase-2 edge case: ${caseName}`, async () => {
    const fixturePath = path.join(edgeCasesRoot, caseName, 'input', 'playerStats01_Unicos.sample.json');
    const expectedRoot = path.join(edgeCasesRoot, caseName, 'expected');

    const actual = await runPhase2SamplePipeline(fixturePath);
    const expected = await readExpectedOutputs(expectedRoot);

    assert.deepStrictEqual(actual.filtered, expected.filtered);
    assert.deepStrictEqual(actual.numerical, expected.numerical);
    assert.strictEqual(hashJson(actual.zscores0), expected.zscores0Hash);
    assert.strictEqual(hashJson(actual.metrics0), expected.metrics0Hash);
    assert.deepStrictEqual(actual.metrics1, expected.metrics1);
    assert.deepStrictEqual(actual.metrics2, expected.metrics2);
    assert.deepStrictEqual(actual.metrics3, expected.metrics3);
    assert.strictEqual(actual.csv.trim(), expected.csv.trim());
  });
}
