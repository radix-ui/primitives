// @ts-check
import path from 'node:path';
import fs from 'node:fs';
import * as esbuild from 'esbuild';
import * as tsup from 'tsup';

/**
 * @param {string} relativePath
 */
export async function build(relativePath) {
  const packageJson = path.resolve(relativePath, 'package.json');
  if (!fs.existsSync(packageJson)) {
    return;
  }

  const tasks = [];
  const pkg = relativePath.split(path.sep).slice(2)[0];
  const files = ['index.ts'];
  if (pkg === 'radix-ui') {
    files.push('internal.ts');
  }

  const entryPoints = files.map((file) => `${relativePath || '.'}/src/${file}`);
  const dist = `${relativePath || '.'}/dist`;

  /** @type {esbuild.BuildOptions} */
  const esbuildConfig = {
    entryPoints: entryPoints,
    external: ['@radix-ui/*'],
    packages: 'external',
    bundle: true,
    sourcemap: true,
    format: 'cjs',
    target: 'es2022',
    outdir: dist,
  };

  tasks.push(esbuild.build(esbuildConfig).then(() => console.log(`CJS: Built ${relativePath}`)));
  tasks.push(
    esbuild
      .build({
        ...esbuildConfig,
        format: 'esm',
        outExtension: { '.js': '.mjs' },
      })
      .then(() => console.log(`ESM: Built ${relativePath}`))
  );

  // tsup is used to emit d.ts files only (esbuild can't do that).
  //
  // Notes:
  // 1. Emitting d.ts files is super slow for whatever reason.
  // 2. It could have fully replaced esbuild (as it uses that internally),
  //    but at the moment its esbuild version is somewhat outdated.
  //    It’s also harder to configure and esbuild docs are more thorough.
  tasks.push(
    tsup
      .build({
        entry: entryPoints,
        format: ['cjs', 'esm'],
        dts: { only: true },
        outDir: dist,
        silent: true,
        external: [/@radix-ui\/.+/],
      })
      .then(() => console.log(`TSC: Built ${relativePath}`))
  );

  await Promise.all(tasks);
}
