import { globSync } from 'glob';
import * as esbuild from 'esbuild';
import * as tsup from 'tsup';

async function build(path) {
  const file = `${path}/src/index.ts`;
  const dist = `${path}/dist`;

  const esbuildConfig = {
    bundle: true,
    entryPoints: [file],
    external: ['@radix-ui/*', 'react-dom', 'react'],
    packages: 'external',
    splitting: false,
    target: 'es2022',
    outdir: dist,
  };

  await esbuild.build(esbuildConfig);
  console.log(`Built ${path}/dist/index.js`);

  await esbuild.build({
    ...esbuildConfig,
    format: 'esm',
    outExtension: { '.js': '.mjs' },
  });
  console.log(`Built ${path}/dist/index.mjs`);

  // Note: tsup is quite slow when emitting d.ts files
  await tsup.build({
    dts: { only: true },
    entry: [file],
    format: ['cjs'],
    outDir: dist,
    silent: true,
    external: [/@radix-ui\/.+/],
  });
  console.log(`Built ${path}/dist/index.d.ts`);
}

globSync('packages/*/*').forEach(build);
