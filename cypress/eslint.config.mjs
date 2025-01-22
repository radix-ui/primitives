import * as js from '@chance/eslint';
import * as typescript from '@chance/eslint/typescript';
import pluginCypress from 'eslint-plugin-cypress/flat';

/** @type {import("eslint").Linter.Config[]} */
const config = [
  js.config,
  typescript.config,
  pluginCypress.configs.recommended, //
];

export default config;
