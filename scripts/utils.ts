import chalk from 'chalk';
import fs from 'fs-extra';
import ms from 'pretty-ms';
import path from 'path';
import mri from 'mri';
import { paths } from './constants';
import { NormalizedOpts, Falsey } from './types';
import { exec } from 'child_process';

const stderr = console.error.bind(console);

export function external(id: string) {
  return !id.startsWith('.') && !path.isAbsolute(id);
}

// Make sure any symlinks in a package folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
export const packageDirectory = fs.realpathSync(process.cwd());

export function normalizeOpts(opts: any): NormalizedOpts {
  let { name } = opts;
  let packageSrc = path.join(opts.packageRoot, 'src');
  let packageDist = path.join(opts.packageRoot, 'dist');
  let packageDistTypes = path.join(packageDist, 'types');

  return {
    ...opts,
    name,
    input: Array.isArray(opts.input) ? opts.input : [opts.input],
    packageSrc,
    packageDist,
    packageDistTypes,
  };
}

export function logError(err: any) {
  let error = err.error || err;
  let description = `${error.name ? error.name + ': ' : ''}${error.message || error}`;
  let message = error.plugin
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

export async function cleanDistDirectories() {
  return await new Promise((res, reject) => {
    exec(`rm -rf ${path.join(paths.projectRoot, 'packages', '*', '*', 'dist')}`, (err) =>
      err ? reject(err.message) : res('hell yeah pew pew deleted!')
    );
  });
}

export function parseArgs() {
  let { _, ...args } = mri(process.argv.slice(2));
  return args;
}

export function buildDelineatedFilename(pathname: string, ...args: (string | Falsey)[]) {
  return path.join(pathname, args.filter(Boolean).join('.'));
}

export function timeFromStart(start: number) {
  return ms(Date.now() - start);
}

/** Just a helpful lil async util for creating space between processes ⏰ */
export function waaaaitJustAMinute(howLongsItGonnaBe = 1) {
  return new Promise((res) => setTimeout(res, howLongsItGonnaBe * 1000));
}

/** Resolve a bunch of promises sequentially before moving on */
export function serialResolve(...promises: Promise<any>[]) {
  return promises.reduce(
    (promise, cur) => promise.then((result) => cur.then(Array.prototype.concat.bind(result))),
    Promise.resolve([])
  );
}
