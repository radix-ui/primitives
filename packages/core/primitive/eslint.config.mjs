// @ts-check
import { configs } from '@repo/eslint-config/react-package';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...configs,
  {
    linterOptions: { reportUnusedDisableDirectives: false },
  },
];
