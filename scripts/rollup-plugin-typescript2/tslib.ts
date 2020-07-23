import { readFileSync } from 'fs-extra';

// The injected id for helpers.
export const TSLIB = 'tslib';
export const TSLIB_VIRTUAL = '\0tslib.js';
export let tslibSource: string;
export let tslibVersion: string;
try {
  // tslint:disable-next-line:no-string-literal no-var-requires
  const tslibPackage = require('tslib/package.json');
  const tslibPath = require.resolve('tslib/' + tslibPackage.module);
  tslibSource = readFileSync(tslibPath, 'utf8');
  tslibVersion = tslibPackage.version;
} catch (e) {
  console.warn('Error loading `tslib` helper library.');
  throw e;
}
