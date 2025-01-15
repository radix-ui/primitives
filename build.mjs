import path from 'node:path';
import { globSync } from 'glob';
import * as esbuild from 'esbuild';
import * as tsup from 'tsup';
import { execa } from 'execa';

async function build(relativePath) {
  const pkg = relativePath.split(path.sep).slice(2)[0];
  if (pkg === 'radix-ui') {
    // TODO: This package will be built using tsc directly to preserve separate
    // entry points for better code splitting. Skipping for now.
    return;
  }

  const file = `${relativePath}/src/index.ts`;
  const dist = `${relativePath}/dist`;

  const esbuildConfig = {
    entryPoints: [file],
    external: ['@radix-ui/*'],
    packages: 'external',
    bundle: true,
    sourcemap: true,
    format: 'cjs',
    target: 'es2022',
    outdir: dist,
  };

  await esbuild.build(esbuildConfig);
  console.log(`Built ${relativePath}/dist/index.js`);

  await esbuild.build({
    ...esbuildConfig,
    format: 'esm',
    outExtension: { '.js': '.mjs' },
  });
  console.log(`Built ${relativePath}/dist/index.mjs`);

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
  console.log(`Built ${relativePath}/dist/index.d.ts`);
}

globSync('packages/*/*').forEach(build);
