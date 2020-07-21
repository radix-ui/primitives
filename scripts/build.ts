// Forked and simplified from https://github.com/jaredpalmer/tsdx
import path from 'path';
import * as fs from 'fs-extra';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import { rollup, RollupOptions, OutputOptions } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { babel } from '@rollup/plugin-babel';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { paths } from './constants';
import {
  external,
  normalizeOpts,
  logBuildStepCompletion,
  logError,
  cleanDistFolder,
  parseArgs,
} from './utils';
import { ScriptOpts, NormalizedOpts } from './types';
import babelConfig from './config/babel';

// shebang cache map thing because the transform only gets run once
let shebang: any = {};

export async function createRollupConfig(
  opts: ScriptOpts,
  buildCount: number
): Promise<RollupOptions> {
  const shouldMinify = opts.minify !== undefined ? opts.minify : opts.env === 'production';

  const outputName = [
    `${paths.packageDist}/${opts.name}`,
    opts.format,
    opts.format === 'esm' ? '' : opts.env,
    shouldMinify ? 'min' : '',
    'js',
  ]
    .filter(Boolean)
    .join('.');

  let tsconfig: string | undefined;
  let tsconfigJSON;
  try {
    tsconfig = opts.tsconfig || path.join(paths.projectRoot, 'tsconfig.json');
    tsconfigJSON = await fs.readJSON(tsconfig);
  } catch (e) {
    tsconfig = undefined;
  }

  return {
    // Tell Rollup the entry point to the package
    input: opts.input,
    // Tell Rollup which packages to ignore
    external: (id: string) => external(id),
    // Establish Rollup output
    output: {
      // Set filenames of the consumer's package
      file: outputName,
      // Pass through the file format
      format: opts.format,
      // Do not let Rollup call Object.freeze() on namespace import objects (i.e. import * as
      // namespaceImportObject from...) that are accessed dynamically.
      freeze: false,
      // Respect tsconfig esModuleInterop when setting __esModule.
      esModule: tsconfigJSON ? tsconfigJSON.esModuleInterop : false,
      name: opts.name,
      sourcemap: true,
      globals: { react: 'React', 'react-native': 'ReactNative' },
      exports: 'named',
    },
    plugins: [
      nodeResolve({
        mainFields: ['module', 'main', opts.target !== 'node' ? 'browser' : undefined].filter(
          Boolean
        ) as string[],
      }),
      opts.format === 'umd' &&
        commonjs({
          // use a regex to make sure to include eventual hoisted packages
          include: /\/node_modules\//,
        }),
      json(),
      {
        // Custom plugin that removes shebang from code because newer versions of bublé bundle their
        // own private version of `acorn` and I don't know a way to patch in the option
        // `allowHashBang` to acorn. Taken from microbundle. See:
        // https://github.com/Rich-Harris/buble/pull/165
        transform(code: string) {
          let reg = /^#!(.*)/;
          let match = code.match(reg);

          shebang[opts.name] = match ? '#!' + match[1] : '';

          code = code.replace(reg, '');

          return {
            code,
            map: null,
          };
        },
      },
      typescript({
        typescript: require('typescript'),
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
            paths.packageDist,
          ],
        },
        tsconfigOverride: {
          allowJs: true,
          include: [
            path.resolve(paths.packageRoot, 'src'),
            path.resolve(paths.packageRoot, 'types'),
            path.resolve(paths.projectRoot, 'types'),
          ],
          compilerOptions: {
            outDir: paths.packageDist,
            declarationDir: paths.packageDistTypes,

            // We run multiple builds for each package, but we only need to
            // output type declarations once.
            ...(buildCount > 0 ? { declaration: false, declarationMap: false } : {}),
          },
        },
        useTsconfigDeclarationDir: true,
        check: !opts.transpileOnly,
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

async function build() {
  const opts = await normalizeOpts(parseArgs());
  const buildConfigs = await createBuildConfigs(opts);

  Promise.all([
    cleanDistFolder().then(() => logBuildStepCompletion(opts.name, 'Cleaned up old files')),

    writeCjsEntryFile(opts.name).then(() =>
      logBuildStepCompletion(opts.name, 'Created CJS entry file')
    ),

    Promise.all(
      buildConfigs.map(async (inputOptions) => {
        let bundle = await rollup(inputOptions);
        await bundle.write(inputOptions.output as OutputOptions);
      })
    ).then(() => logBuildStepCompletion(opts.name, 'Built modules')),

    // The typescript rollup plugin let's tsc handle dumping the declaration file. Ocassionally its
    // methods for determining where to dump it results in it ending up in a sub-directory rather
    // than adjacent to the bundled code, which we don't want. Unclear exactly why, but this script
    // moves it back after rollup is done.
    // https://github.com/ezolenko/rollup-plugin-typescript2/issues/136
    moveDeclarationFilesToDistTypes(opts.name),
  ])
    .then(() => logBuildStepCompletion(opts.name, 'Building complete', '🍻'))
    .catch((error) => {
      logError(error);
      process.exit(1);
    });
}

build();

export function writeCjsEntryFile(name: string) {
  const contents = `'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./${name}.cjs.production.min.js');
} else {
  module.exports = require('./${name}.cjs.development.js');
}`;
  return fs.outputFile(path.join(paths.packageDist, 'index.js'), contents);
}

export async function createBuildConfigs(opts: NormalizedOpts): Promise<RollupOptions[]> {
  const allInputs = opts.input.flatMap((input: string) =>
    createAllFormats(opts, input).map((options: ScriptOpts, index: number) => ({
      ...options,
      // We want to know if this is the first run for each entryfile
      // for certain plugins (e.g. css)
      writeMeta: index === 0,
    }))
  );

  return await Promise.all(
    allInputs.map(async (options: ScriptOpts, index) => {
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
      env: 'development',
      input,
    },
    {
      ...opts,
      format: 'esm',
      env: 'production',
      input,
    },
  ] as [ScriptOpts, ...ScriptOpts[]];
}

async function moveDeclarationFilesToDistTypes(packageName: string) {
  try {
    const packageRelativePath = path.relative(paths.packages, paths.packageRoot);
    const misplacedDeclarationFilesRoot = path.join(
      paths.packageDistTypes,
      packageRelativePath,
      'src'
    );
    const distTypes = paths.packageDistTypes;
    await fs.copy(misplacedDeclarationFilesRoot, distTypes);

    // delete leftover folder
    const relativeDirToDelete = packageRelativePath.replace(packageName, '');
    await fs.remove(path.resolve(paths.packageDistTypes, relativeDirToDelete));
  } catch (e) {}
}
