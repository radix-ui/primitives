// @ts-check
import * as react from '@chance/eslint/react';
import * as js from '@chance/eslint';
import * as typescript from '@chance/eslint/typescript';
import { globals } from '@chance/eslint/globals';
import pluginCypress from 'eslint-plugin-cypress/flat';

/** @type {import("eslint").Linter.Config[]} */
export default [
  { ...js.getConfig({ ...globals.node, ...globals.browser }) },
  typescript.config,
  {
    ...react.config,
    rules: {
      ...react.rules,
      'react/jsx-pascal-case': ['warn', { allowNamespace: true }],
      // TODO: enable this and fix all the errors
      'react/display-name': 'off',
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
  { ...pluginCypress.configs.recommended, files: ['cypress/**/*.{ts,js}'] },
  {
    ignores: ['dist/**', '.next/**'],
    rules: {
      'prefer-const': ['warn', { destructuring: 'all' }],
    },
  },
];
