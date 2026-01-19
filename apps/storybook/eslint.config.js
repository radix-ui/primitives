// @ts-check
import storybook from 'eslint-plugin-storybook';
import { configs } from '@repo/eslint-config/vite';

/** @type {import("eslint").Linter.Config[]} */
export default [...configs, ...storybook.configs['flat/recommended']];
