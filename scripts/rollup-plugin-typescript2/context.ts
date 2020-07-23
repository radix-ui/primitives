import { isFunction } from 'lodash';

export interface IContext {
  warn(message: string | (() => string)): void;
  error(message: string | (() => string)): void;
  info(message: string | (() => string)): void;
  debug(message: string | (() => string)): void;
}

export enum VerbosityLevel {
  Error = 0,
  Warning,
  Info,
  Debug,
}

export class ConsoleContext implements IContext {
  constructor(private verbosity: VerbosityLevel, private prefix: string = '') {}

  public warn(message: string | (() => string)): void {
    if (this.verbosity < VerbosityLevel.Warning) return;
    console.log(`${this.prefix}${isFunction(message) ? message() : message}`);
  }

  public error(message: string | (() => string)): void {
    if (this.verbosity < VerbosityLevel.Error) return;
    console.log(`${this.prefix}${isFunction(message) ? message() : message}`);
  }

  public info(message: string | (() => string)): void {
    if (this.verbosity < VerbosityLevel.Info) return;
    console.log(`${this.prefix}${isFunction(message) ? message() : message}`);
  }

  public debug(message: string | (() => string)): void {
    if (this.verbosity < VerbosityLevel.Debug) return;
    console.log(`${this.prefix}${isFunction(message) ? message() : message}`);
  }
}
