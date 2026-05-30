// ESLint flat config — see ADR-0005.
//
// Strategy:
// - Strict rules on NEW code (verify.js, pipeline-sample.js, scripts/internal/**, test/**).
// - Warn-only baseline on LEGACY code (scripts/playerStats*.js, scrappe/*.js, root index.js)
//   until each file is reached by the Phase 4 module-by-module refactor.
// - Generated and sample data fully ignored.

const js = require('@eslint/js');
const n = require('eslint-plugin-n');
const prettier = require('eslint-config-prettier');
const globals = require('globals');

const nodeLanguageOptions = {
  ecmaVersion: 2022,
  sourceType: 'commonjs',
  globals: { ...globals.node },
};

const newCodeFiles = [
  'scripts/verify.js',
  'scripts/pipeline-sample.js',
  'scripts/internal/**/*.js',
  'test/**/*.js',
  'eslint.config.js',
];

const legacyCodeFiles = [
  'index.js',
  'scripts/index.js',
  'scripts/playerStats*.js',
  'scrappe/**/*.js',
];

module.exports = [
  {
    ignores: [
      'node_modules/**',
      'data/**',
      'jsonfiles/**',
      'csv/**',
      'tmp/**',
      'scrappe/tmp/**',
      'scripts/old/**',
      'sample-data/**',
      'scriptgpt/**',
      '**/*.log',
      '**/errorLog*',
    ],
  },
  // New code — full ruleset.
  {
    files: newCodeFiles,
    languageOptions: nodeLanguageOptions,
    plugins: { n },
    rules: {
      ...js.configs.recommended.rules,
      ...n.configs['flat/recommended-script'].rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-shadow': 'error',
      'no-console': 'off',
      'n/no-process-exit': 'off',
      'n/no-unpublished-require': 'off',
    },
  },
  // Legacy code — warn-only baseline. Style/correctness only, no n/* rules.
  {
    files: legacyCodeFiles,
    languageOptions: nodeLanguageOptions,
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-undef': 'warn',
      'no-empty': 'warn',
      'no-constant-condition': 'warn',
      'no-redeclare': 'warn',
    },
  },
  // Disable rules that conflict with Prettier (applies last).
  prettier,
];
