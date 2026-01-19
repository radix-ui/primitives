// @ts-check
import * as react from '@chance/eslint/react';
import reactRefresh from 'eslint-plugin-react-refresh';
import * as base from './index.js';

/** @type {import("eslint").Linter.Config[]} */
export const configs = [
  base.js,
  base.ts,
  react.config,
  base.overrides,
  {
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  { ignores: ['**/dist/**'] },
];
