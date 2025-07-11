// @ts-check
import path from 'node:path';
import fs from 'node:fs';
import * as esbuild from 'esbuild';
import * as tsup from 'tsup';

/**
 * @param {string} relativePath
 */
export async function build(relativePath) {
  const packageJsonPath = path.resolve(relativePath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  const packageJsonContents = await fs.promises.readFile(packageJsonPath, 'utf-8').catch(() => {
    console.error(`Failed to read package.json file at ${packageJsonPath}`);
    process.exit(1);
  });

  /** @type {PackageJson} */
  let packageJson;
  try {
    packageJson = JSON.parse(packageJsonContents);
  } catch {
    console.error(`Failed to parse package.json file at ${packageJsonPath}`);
    process.exit(1);
  }

  const tasks = [];
  const pkg = packageJson.name;
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

/**
 * @typedef {{ name: string }} PackageJson
 */
