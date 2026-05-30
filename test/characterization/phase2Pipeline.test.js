const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');

const {
  runPhase2SamplePipeline,
  readExpectedOutputs
} = require('./phase2PipelineHarness');

function hashJson(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

test('legacy ETL phase-2 sample pipeline remains stable', async () => {
  const actual = await runPhase2SamplePipeline();
  const expected = await readExpectedOutputs();

  assert.deepStrictEqual(actual.filtered, expected.filtered);
  assert.deepStrictEqual(actual.numerical, expected.numerical);
  assert.strictEqual(hashJson(actual.zscores0), expected.zscores0Hash);
  assert.strictEqual(hashJson(actual.metrics0), expected.metrics0Hash);
  assert.deepStrictEqual(actual.metrics1, expected.metrics1);
  assert.deepStrictEqual(actual.metrics2, expected.metrics2);
  assert.deepStrictEqual(actual.metrics3, expected.metrics3);
  assert.strictEqual(actual.csv.trim(), expected.csv.trim());
});
