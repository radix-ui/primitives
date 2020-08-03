import { DEFAULT_EXTENSIONS } from '@babel/core';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import * as fs from 'fs-extra';
import { loadPackages, iter } from 'lerna-script';
import path from 'path';
import { rollup, RollupOptions } from 'rollup';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import typescriptRollup from 'rollup-plugin-typescript2';
import typescript from 'typescript';
import babelConfig from './config/babel';
import { paths } from './constants';
import { ScriptOpts, NormalizedOpts, TSConfigJSON } from './types';
import {
  external,
  normalizeOpts,
  logBuildStepCompletion,
  logError,
  cleanDistDirectories,
  parseArgs,
  timeFromStart,
  warn,
  buildDelineatedFilename,
} from './utils';

const rootTsConfig: TSConfigJSON = fs.readJSONSync(path.join(paths.projectRoot, 'tsconfig.json'));

// https://github.com/formium/tsdx/blob/3c65bdf90860c45a619b8a23720e41f8e251a4ef/src/createRollupConfig.ts#L24
const shebang: any = {};

/**
 * Instead of running `lerna run` we can speed up the build process quite a bit by running a single
 * script in from the root, but we still want to leverage the lerna dependency map to make sure
 * packages that can be built concurrently are properly batched per lerna's algo. Thankfully,
 * `lerna-script` lets us do exactly that!
 *
 * This function iterates through each batchable group of packages and executes our build in the
 * correct order, concurrently building where possible. It gives us the power of `lerna run` with a
 * little more speed.
 */
export async function buildAllPackages() {
  let start = Date.now();
  let packages = (await loadPackages()).filter((pkg) => pkg.name !== '@interop-ui/docs');
  let topoPackageMap = await getPackageDirectoryMap();

  // Clean up old dist files before starting.
  await cleanDistDirectories();
  logBuildStepCompletion('interop-ui', 'Cleaned up old files');

  await iter.batched(packages)(async ({ name: packageName }) => {
    let packagePath = topoPackageMap[packageName];
    if (!packagePath) return;
    return await buildPackage(packageName, packagePath);
  });

  logBuildStepCompletion('interop-ui', `Whew! Finished build in ${timeFromStart(start)}`, '⏰');
}

export async function buildPackage(packageName: string, packagePath: string) {
  let inputDir = path.join(paths.projectRoot, packagePath);
  let packageRoot = path.resolve(paths.projectRoot, packagePath, '..');
  let input = [
    fs.existsSync(path.join(inputDir, 'index.ts'))
      ? path.join(inputDir, 'index.ts')
      : path.join(inputDir, 'index.tsx'),
  ];
  let name = packageName.split('/')[1];
  return await build({ name, input, packageRoot });
}

export async function build(packageDetails: {
  name: string;
  input: string[];
  packageRoot: string;
}) {
  let opts = normalizeOpts({ ...packageDetails, ...parseArgs() });
  let buildConfigs = await createBuildConfigs(opts);

  try {
    await writeCjsEntryFile(opts.name, opts.packageDist);
    logBuildStepCompletion(opts.name, 'Created CJS entry file');

    let start = Date.now();

    await new Promise((done) => {
      buildConfigs.forEach(async (inputOptions, index, src) => {
        let outputOptions = Array.isArray(inputOptions.output)
          ? inputOptions.output!
          : [inputOptions.output!].filter(Boolean);
        let bundle = await rollup(inputOptions);
        await Promise.all(outputOptions.map(bundle.write));

        // After the last package is built, resolve the promise to move on.
        if (index === src.length - 1) done();
      });
    });

    logBuildStepCompletion(opts.name, `Built modules in ${timeFromStart(start)}`, '⏰');

    // The Typescript rollup plugin let's tsc handle dumping the declaration file. Ocassionally its
    // methods for determining where to dump it results in it ending up in a sub-directory rather
    // than adjacent to the bundled code, which we don't want. Unclear exactly why, but this script
    // moves it back after rollup is done.
    // https://github.com/ezolenko/rollup-plugin-typescript2/issues/136
    moveDeclarationFilesToDistTypes(opts.name, opts.packageRoot, opts.packageDistTypes);

    logBuildStepCompletion(opts.name, 'Building complete', '🍻');
  } catch (error) {
    logError(error);
    process.exit(1);
  }
}

async function createRollupConfig(opts: ScriptOpts, buildCount: number): Promise<RollupOptions> {
  let { input, format, name, packageRoot, env, tsconfig, target } = opts;

  // Minify if explicitly directed, or if we're bundling for production CJS.
  let shouldMinify = opts.minify ?? (env === 'production' && format !== 'esm');

  let outDir = path.join(packageRoot, 'dist');

  let outputFilename = buildDelineatedFilename(
    outDir,
    name,
    format,
    // Only writing esm once for prod, no need for the env suffix
    format !== 'esm' && env,
    shouldMinify && 'min',
    'js'
  );

  // Look for local tsconfig if passed to options
  let tsconfigJSON = rootTsConfig;
  if (tsconfig) {
    try {
      tsconfigJSON = fs.readJSONSync(tsconfig);
      if (!tsconfigJSON) throw Error('oh no');
    } catch (e) {
      warn(name, 'Local tsconfig JSON not found. Using the root project config instead.');
    }
  }

  let mainFields = ['module', 'main'];
  if (target !== 'node') {
    mainFields.push('browser');
  }

  return {
    input,
    external(id: string) {
      return external(id);
    },
    output: {
      file: outputFilename,
      name,
      format,
      exports: 'named',
      globals: { react: 'React' },
      sourcemap: true,
      // Do not let Rollup call Object.freeze() on namespace import objects
      // (i.e. import * as namespaceImportObject from...) that are accessed dynamically.
      freeze: false,
      // Respect tsconfig esModuleInterop when setting __esModule.
      esModule: (tsconfigJSON && tsconfigJSON.compilerOptions.esModuleInterop) || false,
    },
    plugins: [
      nodeResolve({ mainFields }),
      format === 'umd' && commonjs({ include: /\/node_modules\// }),
      removeShebang(opts.name),
      typescriptRollup({
        typescript,
        cacheRoot: path.join(paths.projectCache, `build/${opts.name}/${opts.format}`),
        tsconfig,
        tsconfigDefaults: {
          exclude: [
            '**/*.spec.ts',
            '**/*.test.ts',
            '**/*.spec.tsx',
            '**/*.test.tsx',
            'node_modules',
            'bower_components',
            'jspm_packages',
            outDir,
          ],
        },
        tsconfigOverride: {
          allowJs: true,
          include: [
            path.resolve(packageRoot, 'src'),
            path.resolve(packageRoot, 'types'),
            path.resolve(paths.projectRoot, 'types'),
          ],
          compilerOptions: {
            outDir,

            // We only need output type declarations once per package.
            ...(buildCount > 0
              ? {
                  declaration: false,
                  declarationMap: false,
                  declarationDir: path.resolve(outDir, 'types'),
                }
              : {}),
          },
        },
        useTsconfigDeclarationDir: true,
        check: false,
      }),
      babel({
        babelHelpers: 'bundled',
        extensions: [...DEFAULT_EXTENSIONS, 'ts', 'tsx'],
        // https://babeljs.io/docs/en/options#passperpreset
        // @ts-ignore
        passPerPreset: true,
        ...babelConfig,
      }),
      opts.env !== undefined &&
        replace({
          'process.env.NODE_ENV': JSON.stringify(opts.env),
        }),
      sourceMaps(),
      shouldMinify &&
        terser({
          output: { comments: false },
          compress: {
            keep_infinity: true,
            pure_getters: true,
            passes: 10,
          },
          ecma: 5,
          toplevel: opts.format === 'cjs',
          warnings: true,
        }),
    ] as Plugin[],
  };
}

async function createBuildConfigs(opts: NormalizedOpts): Promise<RollupOptions[]> {
  let allInputs = opts.input.flatMap((input: string) =>
    createAllFormats(opts, input).map<ScriptOpts>((options, index) => ({
      ...options,
      // We want to know if this is the first run for each entryfile for certain plugins
      writeMeta: index === 0,
    }))
  );

  return await Promise.all(
    allInputs.map(async (options, index) => {
      return await createRollupConfig(options, index);
    })
  );
}

function createAllFormats(opts: NormalizedOpts, input: string): [ScriptOpts, ...ScriptOpts[]] {
  return [
    {
      ...opts,
      format: 'cjs',
      env: 'development',
      input,
    },
    {
      ...opts,
      format: 'cjs',
      env: 'production',
      input,
    },
    {
      ...opts,
      format: 'esm',
      env: 'production',
      input,
    },
  ];
}

/**
 * Grabs the packages in our repo from lerna and maps them to the correct directory as defined in
 * `tsconfig.json`.
 */
export async function getPackageDirectoryMap() {
  let topoPackageMap: Record<string, string> = {};
  let pkgs = await loadPackages();

  for (let pkg of pkgs) {
    // Skip any external packages or anything without an explicit path alias in tsconfig.
    if (!pkg.name.startsWith('@interop-ui')) continue;
    if (!rootTsConfig.compilerOptions.paths![pkg.name]) continue;

    topoPackageMap[pkg.name] = rootTsConfig.compilerOptions.paths![pkg.name]?.[0];
  }

  return topoPackageMap;
}

async function moveDeclarationFilesToDistTypes(
  packageName: string,
  packageRoot: string,
  packageDistTypes: string
) {
  try {
    let packageRelativePath = path.relative(paths.packages, packageRoot);
    let misplacedDeclarationFilesRoot = path.join(packageDistTypes, packageRelativePath, 'src');
    let distTypes = packageDistTypes;
    await fs.copy(misplacedDeclarationFilesRoot, distTypes);

    // delete leftover folder
    let relativeDirToDelete = packageRelativePath.replace(packageName, '');
    await fs.remove(path.resolve(packageDistTypes, relativeDirToDelete));
  } catch (e) {}
}

function writeCjsEntryFile(name: string, packageDist: string) {
  let contents = `'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./${name}.cjs.production.min.js');
} else {
  module.exports = require('./${name}.cjs.development.js');
}`;
  return fs.outputFile(path.join(packageDist, 'index.js'), contents);
}

/** @see https://github.com/formium/tsdx/blob/3c65bdf90860c45a619b8a23720e41f8e251a4ef/src/createRollupConfig.ts#L132 */
function removeShebang(pkg: string) {
  return {
    transform(code: string) {
      let reg = /^#!(.*)/;
      let match = code.match(reg);
      shebang[pkg] = match ? '#!' + (match[1] || '') : '';
      code = code.replace(reg, '');
      return {
        code,
        map: null,
      };
    },
  };
}
