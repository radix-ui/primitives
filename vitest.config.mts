import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: ['./scripts/setup-tests.ts'],
    environment: 'jsdom',
    exclude: ['node_modules', 'dist'],
    include: ['**/*.test.?(c|m)[jt]s?(x)'],
    globals: true,
  },
  // moduleNameMapper: {
  //   '@radix-ui/react-(.+)$': '<rootDir>/packages/react/$1/src',
  //   '@radix-ui/(.+)$': '<rootDir>packages/core/$1/src',
  // },
  // resolve: {
  //   alias: {
  //     '@radix-ui/react-(.+)': '<rootDir>/packages/react/$1/src',
  //     '@radix-ui/(.+)': '<rootDir>/packages/core/$1/src',
  //   },
  // },
});
