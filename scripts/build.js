// TODO: This file is temporary while we figure out how to speed up the build while using ts-node
const chalk = require('chalk');
const path = require('path');
const glob = require('tiny-glob/sync');
const mri = require('mri');
const fs = require('fs-extra');
const { DEFAULT_EXTENSIONS, createConfigItem } = require('@babel/core');
const { rollup } = require('rollup');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const replace = require('@rollup/plugin-replace');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const sourceMaps = require('rollup-plugin-sourcemaps');
const { terser } = require('rollup-plugin-terser');
const typescript = require('rollup-plugin-typescript2');

const projectRoot = path.resolve(__dirname, '../');

// Make sure any symlinks in a package folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const packageDirectory = fs.realpathSync(process.cwd());

const paths = {
  projectRoot,
  packages: path.join(projectRoot, 'packages'),
  packageRoot: resolvePackage('.'),
  packageDist: resolvePackage('dist'),
  packageDistTypes: resolvePackage('dist/types'),
  projectCache: path.join(projectRoot, '.cache'),
  progressEstimatorCache: path.join(projectRoot, 'node_modules/.cache/.progress-estimator'),
};

let plugins = createConfigItems('plugin', [
  { name: 'babel-plugin-annotate-pure-calls' },
  { name: 'babel-plugin-dev-expression' },
  {
    name: '@babel/plugin-proposal-class-properties',
    loose: true,
  },
  { name: '@babel/plugin-proposal-optional-chaining' },
  { name: '@babel/plugin-proposal-nullish-coalescing-operator' },
  { name: 'babel-plugin-macros' },
]);

let presets = createConfigItems('preset', [
  {
    name: '@babel/preset-env',
    modules: false,
    loose: true,
    exclude: ['transform-async-to-generator', 'transform-regenerator'],
  },
]);

const babelConfig = {
  exclude: ['node_modules/**'],
  presets,
  plugins,
};

// shebang cache map thing because the transform only gets run once
let shebang = {};

async function createRollupConfig(opts, buildCount) {
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

  let tsconfig;
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
    external: (id) => external(id),
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
        ),
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
        transform(code) {
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
    ],
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
        await bundle.write(inputOptions.output);
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

function writeCjsEntryFile(name) {
  const contents = `'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./${name}.cjs.production.min.js');
} else {
  module.exports = require('./${name}.cjs.development.js');
}`;
  return fs.outputFile(path.join(paths.packageDist, 'index.js'), contents);
}

async function createBuildConfigs(opts) {
  const allInputs = opts.input.flatMap((input) =>
    createAllFormats(opts, input).map((options, index) => ({
      ...options,
      // We want to know if this is the first run for each entryfile
      // for certain plugins (e.g. css)
      writeMeta: index === 0,
    }))
  );

  return await Promise.all(
    allInputs.map(async (options, index) => {
      return await createRollupConfig(options, index);
    })
  );
}

function createAllFormats(opts, input) {
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
  ];
}

async function moveDeclarationFilesToDistTypes(packageName) {
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

/* ---------------------------------------------------------------------------------------------- */

const stderr = console.error.bind(console);

function createConfigItems(type, items) {
  return items.map(({ name, ...options }) => {
    return createConfigItem([require.resolve(name), options], { type });
  });
}

async function cleanDistFolder() {
  await fs.remove(paths.packageDist);
}

function external(id) {
  return !id.startsWith('.') && !path.isAbsolute(id);
}

function logBuildStepCompletion(name, message, emoji = '💯') {
  console.log(`[${chalk.bold(name)}]: ${message} ${emoji}`);
}

function logError(err) {
  const error = err.error || err;
  const description = `${error.name ? error.name + ': ' : ''}${error.message || error}`;
  const message = error.plugin
    ? error.plugin === 'rpt2'
      ? `(typescript) ${description}`
      : `(${error.plugin} plugin) ${description}`
    : description;

  stderr(chalk.bold.red(message));

  if (error.loc) {
    stderr();
    stderr(`at ${error.loc.file}:${error.loc.line}:${error.loc.column}`);
  }

  if (error.frame) {
    stderr();
    stderr(chalk.dim(error.frame));
  } else if (err.stack) {
    const headlessStack = error.stack.replace(message, '');
    stderr(chalk.dim(headlessStack));
  }

  stderr();
}

function getPackageName(opts) {
  return opts.name || path.basename(paths.packageRoot);
}

async function normalizeOpts(opts) {
  return {
    ...opts,
    name: getPackageName(opts),
    input: await getInputs(opts.entry),
  };
}

async function getInputs(entries) {
  return []
    .concat(
      entries && entries.length
        ? entries
        : (await isDir(resolvePackage('src'))) && (await jsOrTs('src/index'))
    )
    .flatMap((file) => glob(file));
}

async function isDir(name) {
  try {
    const stats = await fs.stat(name);
    return stats.isDirectory();
  } catch (e) {
    return false;
  }
}

async function jsOrTs(filename) {
  const extension = (await isFile(resolvePackage(filename + '.ts')))
    ? '.ts'
    : (await isFile(resolvePackage(filename + '.tsx')))
    ? '.tsx'
    : (await isFile(resolvePackage(filename + '.jsx')))
    ? '.jsx'
    : '.js';

  return resolvePackage(`${filename}${extension}`);
}

function parseArgs() {
  let { _, ...args } = mri(process.argv.slice(2));
  return args;
}

async function isFile(name) {
  try {
    const stats = await fs.stat(name);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}

function resolvePackage(relativePath) {
  return path.resolve(packageDirectory, relativePath);
}
