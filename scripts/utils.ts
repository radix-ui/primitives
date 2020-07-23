import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import mri from 'mri';
import glob from 'tiny-glob/sync';
import createLogger from 'progress-estimator';
import { paths } from './constants';
import { NormalizedOpts } from './types';

const stderr = console.error.bind(console);

export function external(id: string) {
  return !id.startsWith('.') && !path.isAbsolute(id);
}

// Make sure any symlinks in a package folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
export const packageDirectory = fs.realpathSync(process.cwd());

export function resolvePackage(relativePath: string) {
  return path.resolve(packageDirectory, relativePath);
}

// Taken from Create React App, react-dev-utils/clearConsole
// @see https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/clearConsole.js
export function clearConsole() {
  process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
}

export async function isDir(name: string) {
  try {
    const stats = await fs.stat(name);
    return stats.isDirectory();
  } catch (e) {
    return false;
  }
}

export async function isFile(name: string) {
  try {
    const stats = await fs.stat(name);
    return stats.isFile();
  } catch (e) {
    return false;
  }
}

export async function jsOrTs(filename: string) {
  const extension = (await isFile(resolvePackage(filename + '.ts')))
    ? '.ts'
    : (await isFile(resolvePackage(filename + '.tsx')))
    ? '.tsx'
    : (await isFile(resolvePackage(filename + '.jsx')))
    ? '.jsx'
    : '.js';

  return resolvePackage(`${filename}${extension}`);
}

export async function getInputs(entries?: string | string[]): Promise<string[]> {
  return ([] as any[])
    .concat(
      entries && entries.length
        ? entries
        : (await isDir(resolvePackage('src'))) && (await jsOrTs('src/index'))
    )
    .flatMap((file) => glob(file));
}

export function getPackageName(opts: any) {
  return opts.name || path.basename(paths.packageRoot);
}

export async function normalizeOpts(opts: any): Promise<NormalizedOpts> {
  return {
    ...opts,
    name: getPackageName(opts),
    input: await getInputs(opts.entry),
  };
}

export async function createProgressEstimator() {
  await fs.ensureDir(paths.progressEstimatorCache);
  return createLogger({
    // All configuration keys are optional, but it's recommended to specify a
    // storage location.
    storagePath: paths.progressEstimatorCache,
  });
}

export function logError(err: any) {
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

export function warn(name: string, message: string) {
  console.log(chalk.yellow(`[${chalk.bold(name)}]: ${message}`));
}

export function logBuildStepCompletion(name: string, message: string, emoji = '💯') {
  console.log(`[${chalk.bold(name)}]: ${message} ${emoji}`);
}

export async function cleanDistFolder() {
  await fs.emptyDir(paths.packageDist);
}

export function parseArgs() {
  let { _, ...args } = mri(process.argv.slice(2));
  return args;
}
