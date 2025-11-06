import { defineConfig } from 'vitest/config';
import { alias } from './scripts/test-alias';

export default defineConfig({
  test: {
    setupFiles: ['./scripts/setup-tests.ts'],
    environment: 'jsdom',
    include: ['**/*.test.?(c|m)[jt]s?(x)'],
    retry: 1,
    alias,
  },
});
