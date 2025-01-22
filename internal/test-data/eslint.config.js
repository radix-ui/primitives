import * as js from '@chance/eslint';
import * as typescript from '@chance/eslint/typescript';

/** @type {import("eslint").Linter.Config[]} */
const config = [
  //
  js.getConfig(),
  typescript.config,
];

export default config;
