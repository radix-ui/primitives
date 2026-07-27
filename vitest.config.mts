import { configDefaults, defineConfig } from 'vitest/config';
import { rscClientBoundaryStub } from './scripts/rsc-client-boundary-stub.mts';

const RSC_TEST_GLOB = '**/*.rsc.test.?(c|m)[jt]s?(x)';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          setupFiles: ['./scripts/setup-tests.ts'],
          environment: 'jsdom',
          include: ['**/*.test.?(c|m)[jt]s?(x)'],
          exclude: [...configDefaults.exclude, RSC_TEST_GLOB],
          retry: 1,
        },
      },
      {
        // Runs under React's `react-server` build so that any module-scope use
        // of client-only APIs throws on import
        plugins: [rscClientBoundaryStub()],
        resolve: {
          conditions: ['react-server', 'module', 'node', 'import', 'default'],
        },
        ssr: {
          resolve: {
            conditions: ['react-server', 'module', 'node', 'import', 'default'],
          },
        },
        test: {
          name: 'rsc',
          environment: 'node',
          include: [RSC_TEST_GLOB],
          // Inline React so Vite resolves it, honoring the `react-server`
          // export condition above and giving us React's Server Components
          // build.
          server: {
            deps: {
              inline: [/^react$/, /^react-dom$/, /^react\//, /^react-dom\//],
            },
          },
        },
      },
    ],
  },
});
