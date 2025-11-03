// @ts-check
import { defineConfig, globalIgnores } from 'eslint/config';
import { configs } from '@repo/eslint-config/vite';

export default defineConfig([globalIgnores(['dist']), ...configs]);
