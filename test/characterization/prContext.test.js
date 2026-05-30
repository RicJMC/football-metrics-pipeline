const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const { fetchPrContextFromRaw } = require('../../scripts/internal/pr-context');

const fixturePath = path.join(__dirname, 'fixtures', 'pr-context.fixture.json');

test('pr-context: fetchPrContextFromRaw normalizes the four gh shapes', () => {
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const actual = fetchPrContextFromRaw(fixture.raw);
  assert.deepStrictEqual(actual, fixture.expected);
});
