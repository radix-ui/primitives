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
      'react/jsx-pascal-case': ['warn', { allowNamespace: true }],
      'prefer-const': ['warn', { destructuring: 'all' }],
      'jsx-a11y/label-has-associated-control': [
        'warn',
        {
          controlComponents: ['Checkbox'],
          depth: 3,
        },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.mjs', '**/*.ts', '**/*.tsx'],
    ignores: ['dist/**'],
  },
];
