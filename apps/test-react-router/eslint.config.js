// @ts-check
import { defineConfig, globalIgnores } from 'eslint/config';
import { configs } from '@repo/eslint-config/vite';

export default defineConfig([
  globalIgnores(['dist']),
  ...configs,
  {
    rules: {
      'react-refresh/only-export-components': [
        'error',
        {
          allowExportNames: [
            // https://reactrouter.com/start/framework/route-module
            'middleware',
            'clientMiddleware',
            'loader',
            'clientLoader',
            'action',
            'clientAction',
            'headers',
            'handle',
            'links',
            'meta',
            'shouldRevalidate',
          ],
        },
      ],
    },
  },
]);
