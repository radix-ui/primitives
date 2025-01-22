// @ts-check
import * as react from '@chance/eslint/react';
import * as js from '@chance/eslint';
import * as typescript from '@chance/eslint/typescript';

/** @type {import("eslint").Linter.Config[]} */
export default [
  js.config,
  typescript.config,
  react.config,
  {
    rules: {
      'react/jsx-pascal-case': 'off',
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.tsx'],
    ignores: ['dist/**'],
  },
];
