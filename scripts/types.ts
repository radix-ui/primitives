import { CompilerOptions } from 'typescript';

interface SharedOpts {
  // TODO: Not sure we need to support this
  target: 'node' | 'browser';
  tsconfig?: string;
}

export type ModuleFormat = 'cjs' | 'umd' | 'esm';

export interface BuildOpts extends SharedOpts {
  name?: string;
  target: 'browser';
}

// TODO:
export interface WatchOpts extends BuildOpts {}

export interface NormalizedOpts extends Omit<BuildOpts, 'name' | 'target'> {
  name: string;
  input: string[];
  target?: 'node' | 'browser';
  packageRoot: string;
  packageDist: string;
  packageDistTypes: string;
  packageSrc: string;
}

export interface ScriptOpts extends Omit<NormalizedOpts, 'input'> {
  input: string;
  env: 'development' | 'production';
  format: ModuleFormat;
  minify?: boolean;
  writeMeta?: boolean;
  transpileOnly?: boolean;
}

export type TSConfigJSON = {
  /**
   * If no 'files' or 'include' property is present in a tsconfig.json, the compiler defaults to
   * including all files in the containing directory and subdirectories except those specified by
   * 'exclude'. When a 'files' property is specified, only those files and those specified by
   * 'include' are included.,
   */
  files?: string[];
  /**
   * Specifies a list of files to be excluded from compilation. The 'exclude' property only affects
   * the files included via the 'include' property and not the 'files' property. Glob patterns
   * require TypeScript version 2.0 or later.
   */
  exclude?: string[];
  /**
   * Specifies a list of glob patterns that match files to be included in compilation. If no
   * 'files' or 'include' property is present in a tsconfig.json, the compiler defaults to
   * including all files in the containing directory and subdirectories except those specified by
   * 'exclude'. Requires TypeScript version 2.0 or later.
   */
  include?: string[];
  /**
   * Enable Compile-on-Save for this project.
   */
  compileOnSave?: boolean;
  /**
   * Path to base configuration file to inherit from. Requires TypeScript version 2.1 or later.
   */
  extends?: string;
  /**
   * Instructs the TypeScript compiler how to compile .ts files.
   */
  compilerOptions: CompilerOptions;
};

export type Falsey = undefined | null | false | 0;
