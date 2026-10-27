import js from '@eslint/js';
import globals from 'globals';
import house from '../eslint-rules/brace-on-new-line.mjs';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { house },
    rules: {
      // House rule: functions and components stay small — at most 10 lines including blank lines.
      'max-lines-per-function': ['error', { max: 10, skipBlankLines: false, skipComments: true }],
      // House rule: every statement ends with a semicolon.
      semi: ['error', 'always'],
      // House rule: class and function bodies open their brace on a new line.
      'house/brace-on-new-line': 'error',
    },
  },
]);
