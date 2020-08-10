import { __DEV__ } from './constants';

const alreadyWarned: Record<string, boolean> = {};

export function invariant(cond: boolean, message: string): void {
  if (!cond) {
    throw new Error(message);
  }
}

export function warning(cond: boolean, message: string): void {
  if (!cond) {
    if (__DEV__) {
      console.warn(message);
    }

    try {
      // This error is thrown as a convenience so you can more easily
      // find the source for a warning that appears in the console by
      // enabling "pause on exceptions" in your JavaScript debugger.
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

export function warningOnce(key: string, cond: boolean, message: string) {
  if (!cond && !alreadyWarned[key]) {
    alreadyWarned[key] = true;
    warning(false, message);
  }
}

export function log(message: any, ...optionalParams: any[]) {
  return console.log(message, ...optionalParams);
}
