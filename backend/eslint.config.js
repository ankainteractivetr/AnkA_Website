import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import house from '../eslint-rules/brace-on-new-line.mjs';

export default defineConfig([
  globalIgnores(['node_modules', 'uploads']),
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
    plugins: { house },
    rules: {
      // House rule: functions stay small — at most 10 lines including blank lines.
      'max-lines-per-function': ['error', { max: 10, skipBlankLines: false, skipComments: true }],
      // House rule: every statement ends with a semicolon.
      semi: ['error', 'always'],
      // House rule: class and function bodies open their brace on a new line.
      'house/brace-on-new-line': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
]);
