// @ts-check
import * as react from '@chance/eslint/react';
import storybook from 'eslint-plugin-storybook';
import * as base from './index.js';

/** @type {import("eslint").Linter.Config[]} */
export const configs = [
  base.js,
  base.ts,
  react.config,
  base.overrides,
  {
    rules: {
      'react/jsx-pascal-case': ['warn', { allowNamespace: true }],
      // TODO: enable this and fix all the errors
      'react/display-name': 'off',
      'jsx-a11y/label-has-associated-control': [
        'warn',
        {
          controlComponents: ['Checkbox'],
          depth: 3,
        },
      ],
    },
  },
  ...storybook.configs['flat/recommended'],
  { ignores: ['**/dist/**'] },
];
