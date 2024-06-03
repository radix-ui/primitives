import { globSync } from 'glob';
import * as esbuild from 'esbuild';
import * as tsup from 'tsup';

async function build(path) {
  const file = `${path}/src/index.ts`;
  const dist = `${path}/dist`;

  const esbuildConfig = {
    entryPoints: [file],
    external: ['@radix-ui/*'],
    packages: 'external',
    bundle: true,
    sourcemap: true,
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

  // tsup is used to emit d.ts files only (esbuild can't do that).
  //
  // Notes:
  // 1. Emitting d.ts files is super slow for whatever reason.
  // 2. It could have fully replaced esbuild (as it uses that internally),
  //    but at the moment its esbuild version is somewhat outdated.
  //    It’s also harder to configure and esbuild docs are more thorough.
  await tsup.build({
    entry: [file],
    format: ['cjs', 'esm'],
    dts: { only: true },
    outDir: dist,
    silent: true,
    external: [/@radix-ui\/.+/],
  });
  console.log(`Built ${path}/dist/index.d.ts`);
}

globSync('packages/*/*').forEach(build);
