import * as path from 'path';
import { PluginContext, Plugin, SourceDescription, RollupLogProps, OutputOptions } from 'rollup';
import resolveId, { AsyncOpts } from 'resolve';
import { readFileSync } from 'fs-extra';
import { dirname, resolve, relative } from 'path';
import { createFilter, FilterPattern } from '@rollup/pluginutils';
import defaultTs, {
  CompilerOptions,
  Diagnostic,
  DiagnosticCategory,
  DiagnosticReporter,
  EmitAndSemanticDiagnosticsBuilderProgram as BuilderProgram,
  FormatDiagnosticsHost,
  ModuleResolutionHost,
  ParsedCommandLine,
  ResolvedModuleFull,
  Watch,
  WatchStatusReporter,
  WriteFileCallback,
} from 'typescript';

// @see https://github.com/microsoft/TypeScript/blob/master/src/compiler/diagnosticMessages.json
enum DiagnosticCode {
  FILE_CHANGE_DETECTED = 6032,
  FOUND_1_ERROR_WATCHING_FOR_FILE_CHANGES = 6193,
  FOUND_N_ERRORS_WATCHING_FOR_FILE_CHANGES = 6194,
}

// `Cannot compile modules into 'es6' when targeting 'ES5' or lower.`
const CANNOT_COMPILE_ESM = 1204;

const DIRECTORY_PROPS = ['outDir', 'declarationDir'] as const;

const DEFAULT_COMPILER_OPTIONS: PartialCompilerOptions = {
  module: 'esnext',
  noEmitOnError: true,
  skipLibCheck: true,
};

const FORCED_COMPILER_OPTIONS: Partial<CompilerOptions> = {
  // Always use tslib
  noEmitHelpers: true,
  importHelpers: true,
  // Typescript needs to emit the code for us to work with
  noEmit: false,
  emitDeclarationOnly: false,
  // Preventing Typescript from resolving code may break compilation
  noResolve: false,
};

function typescript(options?: RollupTypescriptOptions): Plugin {
  options = options || ({} as RollupTypescriptOptions);
  const { filter, tsconfig, compilerOptions, tslib, typescript: ts } = getPluginOptions(options);
  const emittedFiles = new Map<string, string>();
  const watchProgramHelper = new WatchProgramHelper();

  const parsedOptions = parseTypescriptConfig(ts, tsconfig, compilerOptions);
  parsedOptions.fileNames = parsedOptions.fileNames.filter(filter);

  const formatHost = createFormattingHost(ts, parsedOptions.options);
  const resolveModule = createModuleResolver(ts, formatHost);

  let program: Watch<unknown> | null = null;

  function normalizePath(fileName: string) {
    return fileName.split(path.win32.sep).join(path.posix.sep);
  }

  return {
    name: 'typescript',

    buildStart() {
      emitParsedOptionsErrors(ts, this, parsedOptions);

      // Fixes a memory leak https://github.com/rollup/plugins/issues/322
      if (!program) {
        program = createWatchProgram(ts, this, {
          formatHost,
          resolveModule,
          parsedOptions,
          writeFile(fileName, data) {
            emittedFiles.set(fileName, data);
          },
          status(diagnostic) {
            watchProgramHelper.handleStatus(diagnostic);
          },
        });
      }
    },

    watchChange(id) {
      if (!filter(id)) return;

      watchProgramHelper.watch();
    },

    buildEnd() {
      if (this.meta.watchMode !== true) {
        // ESLint doesn't understand optional chaining
        // eslint-disable-next-line
        program?.close();
      }
    },

    renderStart(outputOptions) {
      validateSourceMap(this, parsedOptions.options, outputOptions, parsedOptions.autoSetSourceMap);
      validatePaths(ts, this, parsedOptions.options, outputOptions);
    },

    resolveId(importee, importer) {
      if (importee === 'tslib') {
        return tslib;
      }

      if (!importer) return null;

      // Convert path from windows separators to posix separators
      const containingFile = normalizePath(importer);

      const resolved = resolveModule(importee, containingFile);

      if (resolved) {
        if (resolved.extension === '.d.ts') return null;
        return resolved.resolvedFileName;
      }

      return null;
    },

    async load(id) {
      if (!filter(id)) return null;

      await watchProgramHelper.wait();

      const output = findTypescriptOutput(ts, parsedOptions, id, emittedFiles);

      return output.code != null ? (output as SourceDescription) : null;
    },

    generateBundle(outputOptions) {
      parsedOptions.fileNames.forEach((fileName) => {
        const output = findTypescriptOutput(ts, parsedOptions, fileName, emittedFiles);
        output.declarations.forEach((id) => {
          const code = emittedFiles.get(id);
          if (!code) return;

          this.emitFile({
            type: 'asset',
            fileName: normalizePath(path.relative(outputOptions.dir!, id)),
            source: code,
          });
        });
      });

      const tsBuildInfoPath = ts.getTsBuildInfoEmitOutputFilePath(parsedOptions.options);
      if (tsBuildInfoPath) {
        this.emitFile({
          type: 'asset',
          fileName: normalizePath(path.relative(outputOptions.dir!, tsBuildInfoPath)),
          source: emittedFiles.get(tsBuildInfoPath),
        });
      }
    },
  };
}

export { typescript };
export default typescript;

/* ---------------------------------------------------------------------------------------------- */

/**
 * Emit a Rollup warning or error for a Typescript type error.
 */
function emitDiagnostic(
  ts: TypeScript,
  context: PluginContext,
  host: DiagnosticsHost,
  diagnostic: Diagnostic
) {
  if (diagnostic.code === CANNOT_COMPILE_ESM) return;

  const { noEmitOnError } = host.getCompilationSettings();

  // Build a Rollup warning object from the diagnostics object.
  const warning = diagnosticToWarning(ts, host, diagnostic);

  // Errors are fatal. Otherwise emit warnings.
  if (noEmitOnError && diagnostic.category === ts.DiagnosticCategory.Error) {
    context.error(warning);
  } else {
    context.warn(warning);
  }
}

function buildDiagnosticReporter(
  ts: TypeScript,
  context: PluginContext,
  host: DiagnosticsHost
): DiagnosticReporter {
  return function reportDiagnostics(diagnostic) {
    emitDiagnostic(ts, context, host, diagnostic);
  };
}

/**
 * For each type error reported by Typescript, emit a Rollup warning or error.
 */
// function emitDiagnostics(
//   ts: TypeScript,
//   context: PluginContext,
//   host: DiagnosticsHost,
//   diagnostics: readonly Diagnostic[] | undefined
// ) {
//   if (!diagnostics) return;
//   diagnostics.forEach(buildDiagnosticReporter(ts, context, host));
// }

/* ---------------------------------------------------------------------------------------------- */

/**
 * Typescript watch program helper to sync Typescript watch status with Rollup hooks.
 */
class WatchProgramHelper {
  private _startDeferred: Deferred | null = null;
  private _finishDeferred: Deferred | null = null;

  watch(timeout = 1000) {
    // Race watcher start promise against a timeout in case Typescript and Rollup change detection
    // is not in sync.
    this._startDeferred = createDeferred(timeout);
    this._finishDeferred = createDeferred();
  }

  handleStatus(diagnostic: import('typescript').Diagnostic) {
    // Fullfil deferred promises by Typescript diagnostic message codes.
    if (diagnostic.category === DiagnosticCategory.Message) {
      switch (diagnostic.code) {
        case DiagnosticCode.FILE_CHANGE_DETECTED:
          this.resolveStart();
          break;

        case DiagnosticCode.FOUND_1_ERROR_WATCHING_FOR_FILE_CHANGES:
        case DiagnosticCode.FOUND_N_ERRORS_WATCHING_FOR_FILE_CHANGES:
          this.resolveFinish();
          break;

        default:
      }
    }
  }

  resolveStart() {
    if (this._startDeferred) {
      this._startDeferred.resolve(false);
      this._startDeferred = null;
    }
  }

  resolveFinish() {
    if (this._finishDeferred) {
      this._finishDeferred.resolve();
      this._finishDeferred = null;
    }
  }

  async wait() {
    if (this._startDeferred) {
      const timeout = await this._startDeferred.promise;

      // If there is no file change detected by Typescript skip deferred promises.
      if (timeout) {
        this._startDeferred = null;
        this._finishDeferred = null;
      }

      await this._finishDeferred?.promise;
    }
  }
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Create a format diagnostics host to use with the Typescript type checking APIs.
 * Typescript hosts are used to represent the user's system,
 * with an API for checking case sensitivity etc.
 * @param compilerOptions Typescript compiler options. Affects functions such as `getNewLine`.
 * @see https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
 */
function createFormattingHost(ts: TypeScript, compilerOptions: CompilerOptions): DiagnosticsHost {
  return {
    /** Returns the compiler options for the project. */
    getCompilationSettings: () => compilerOptions,
    /** Returns the current working directory. */
    getCurrentDirectory: () => process.cwd(),
    /** Returns the string that corresponds with the selected `NewLineKind`. */
    getNewLine() {
      switch (compilerOptions.newLine) {
        case ts.NewLineKind.CarriageReturnLineFeed:
          return '\r\n';
        case ts.NewLineKind.LineFeed:
          return '\n';
        default:
          return ts.sys.newLine;
      }
    },
    /** Returns a lower case name on case insensitive systems, otherwise the original name. */
    getCanonicalFileName: (fileName) =>
      ts.sys.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase(),
  };
}

/**
 * Converts a Typescript type error into an equivalent Rollup warning object.
 */
function diagnosticToWarning(
  ts: TypeScript,
  host: FormatDiagnosticsHost | null,
  diagnostic: Diagnostic
) {
  const pluginCode = `TS${diagnostic.code}`;
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');

  // Build a Rollup warning object from the diagnostics object.
  const warning: RollupLogProps = {
    pluginCode,
    message: `@rollup/plugin-typescript ${pluginCode}: ${message}`,
  };

  if (diagnostic.file) {
    // Add information about the file location
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);

    warning.loc = {
      column: character + 1,
      line: line + 1,
      file: diagnostic.file.fileName,
    };

    if (host) {
      // Extract a code frame from Typescript
      const formatted = ts.formatDiagnosticsWithColorAndContext([diagnostic], host);
      // Typescript only exposes this formatter as a string prefixed with the flattened message.
      // We need to remove it here since Rollup treats the properties as separate parts.
      let frame = formatted.slice(formatted.indexOf(message) + message.length);
      const newLine = host.getNewLine();
      if (frame.startsWith(newLine)) {
        frame = frame.slice(frame.indexOf(newLine) + newLine.length);
      }
      warning.frame = frame;
    }
  }

  return warning;
}

/**
 * Create a helper for resolving modules using Typescript.
 * @param host Typescript host that extends `ModuleResolutionHost`
 * with methods for sanitizing filenames and getting compiler options.
 */
function createModuleResolver(ts: TypeScript, host: ModuleResolverHost): Resolver {
  const compilerOptions = host.getCompilationSettings();
  const cache = ts.createModuleResolutionCache(
    process.cwd(),
    host.getCanonicalFileName,
    compilerOptions
  );
  const moduleHost = { ...ts.sys, ...host };

  return (moduleName, containingFile) => {
    const resolved = ts.nodeModuleNameResolver(
      moduleName,
      containingFile,
      compilerOptions,
      moduleHost,
      cache
    );
    return resolved.resolvedModule;
  };
}

/**
 * Separate the Rollup plugin options from the Typescript compiler options,
 * and normalize the Rollup options.
 * @returns Object with normalized options:
 * - `filter`: Checks if a file should be included.
 * - `tsconfig`: Path to a tsconfig, or directive to ignore tsconfig.
 * - `compilerOptions`: Custom Typescript compiler options that override tsconfig.
 * - `typescript`: Instance of Typescript library (possibly custom).
 * - `tslib`: ESM code from the tslib helper library (possibly custom).
 */
function getPluginOptions(options: RollupTypescriptOptions) {
  const { include, exclude, tsconfig, typescript, tslib, ...compilerOptions } = options;

  const filter = createFilter(include || ['*.ts+(|x)', '**/*.ts+(|x)'], exclude);

  return {
    filter,
    tsconfig,
    compilerOptions: compilerOptions as PartialCompilerOptions,
    typescript: typescript || defaultTs,
    tslib: tslib || getTsLibPath(),
  };
}

function resolveIdAsync(file: string, opts: AsyncOpts) {
  return new Promise<string>((resolve, reject) =>
    resolveId(file, opts, (err, contents) => (err ? reject(err) : resolve(contents)))
  );
}

/**
 * Returns code asynchronously for the tslib helper library.
 */
function getTsLibPath() {
  return resolveIdAsync('tslib/tslib.es6.js', { basedir: __dirname });
}

/**
 * Finds the path to the tsconfig file relative to the current working directory.
 * @param relativePath Relative tsconfig path given by the user.
 * If `false` is passed, then a null path is returned.
 * @returns The absolute path, or null if the file does not exist.
 */
function getTsConfigPath(ts: typeof import('typescript'), relativePath?: string | false) {
  if (relativePath === false) return null;

  // Resolve path to file. `tsConfigOption` defaults to 'tsconfig.json'.
  const tsConfigPath = resolve(process.cwd(), relativePath || 'tsconfig.json');

  if (!ts.sys.fileExists(tsConfigPath)) {
    if (relativePath) {
      // If an explicit path was provided but no file was found, throw
      throw new Error(`Could not find specified tsconfig.json at ${tsConfigPath}`);
    } else {
      return null;
    }
  }

  return tsConfigPath;
}

/**
 * Tries to read the tsconfig file at `tsConfigPath`.
 * @param tsConfigPath Absolute path to tsconfig JSON file.
 * @param explicitPath If true, the path was set by the plugin user.
 * If false, the path was computed automatically.
 */
function readTsConfigFile(ts: typeof import('typescript'), tsConfigPath: string) {
  const { config, error } = ts.readConfigFile(tsConfigPath, (path) => readFileSync(path, 'utf8'));
  if (error) {
    throw Object.assign(Error(), diagnosticToWarning(ts, null, error));
  }

  return config || {};
}

/**
 * Returns true if any of the `compilerOptions` contain an enum value (i.e.: ts.ScriptKind) rather
 * than a string. This indicates that the internal CompilerOptions type is used rather than the
 * JsonCompilerOptions.
 */
function containsEnumOptions(
  compilerOptions: PartialCompilerOptions
): compilerOptions is Partial<CompilerOptions> {
  const enums: Array<EnumCompilerOptions> = [
    'module',
    'target',
    'jsx',
    'moduleResolution',
    'newLine',
  ];
  return enums.some((prop) => prop in compilerOptions && typeof compilerOptions[prop] === 'number');
}

const configCache = new Map() as import('typescript').Map<
  import('typescript').ExtendedConfigCacheEntry
>;

/**
 * Parse the Typescript config to use with the plugin.
 * @param ts Typescript library instance.
 * @param tsconfig Path to the tsconfig file, or `false` to ignore the file.
 * @param compilerOptions Options passed to the plugin directly for Typescript.
 *
 * @returns Parsed tsconfig.json file with some important properties:
 * - `options`: Parsed compiler options.
 * - `fileNames` Type definition files that should be included in the build.
 * - `errors`: Any errors from parsing the config file.
 */
function parseTypescriptConfig(
  ts: typeof import('typescript'),
  tsconfig: RollupTypescriptOptions['tsconfig'],
  compilerOptions: PartialCompilerOptions
) {
  /* eslint-disable no-undefined */
  const cwd = process.cwd();
  makePathsAbsolute(compilerOptions, cwd);
  let parsedConfig: import('typescript').ParsedCommandLine;

  // Resolve path to file. If file is not found, pass undefined path to `parseJsonConfigFileContent`.
  // eslint-disable-next-line no-undefined
  const tsConfigPath = getTsConfigPath(ts, tsconfig) || undefined;
  const tsConfigFile = tsConfigPath ? readTsConfigFile(ts, tsConfigPath) : {};
  const basePath = tsConfigPath ? dirname(tsConfigPath) : cwd;

  // If compilerOptions has enums, it represents an CompilerOptions object instead of parsed JSON.
  // This determines where the data is passed to the parser.
  if (containsEnumOptions(compilerOptions)) {
    parsedConfig = ts.parseJsonConfigFileContent(
      {
        ...tsConfigFile,
        compilerOptions: {
          ...DEFAULT_COMPILER_OPTIONS,
          ...tsConfigFile.compilerOptions,
        },
      },
      ts.sys,
      basePath,
      { ...compilerOptions, ...FORCED_COMPILER_OPTIONS },
      tsConfigPath,
      undefined,
      undefined,
      configCache
    );
  } else {
    parsedConfig = ts.parseJsonConfigFileContent(
      {
        ...tsConfigFile,
        compilerOptions: {
          ...DEFAULT_COMPILER_OPTIONS,
          ...tsConfigFile.compilerOptions,
          ...compilerOptions,
        },
      },
      ts.sys,
      basePath,
      FORCED_COMPILER_OPTIONS,
      tsConfigPath,
      undefined,
      undefined,
      configCache
    );
  }

  const autoSetSourceMap = normalizeCompilerOptions(ts, parsedConfig.options);

  return {
    ...parsedConfig,
    autoSetSourceMap,
  };
}

/**
 * If errors are detected in the parsed options,
 * display all of them as warnings then emit an error.
 */
function emitParsedOptionsErrors(
  ts: typeof import('typescript'),
  context: PluginContext,
  parsedOptions: import('typescript').ParsedCommandLine
) {
  if (parsedOptions.errors.length > 0) {
    parsedOptions.errors.forEach((error) => context.warn(diagnosticToWarning(ts, null, error)));

    context.error(`@rollup/plugin-typescript: Couldn't process compiler options`);
  }
}

/**
 * Mutates the compiler options to convert paths from relative to absolute.
 * This should be used with compiler options passed through the Rollup plugin options,
 * not those found from loading a tsconfig.json file.
 * @param compilerOptions Compiler options to _mutate_.
 * @param relativeTo Paths are resolved relative to this path.
 */
function makePathsAbsolute(compilerOptions: PartialCompilerOptions, relativeTo: string) {
  for (const pathProp of DIRECTORY_PROPS) {
    if (compilerOptions[pathProp]) {
      compilerOptions[pathProp] = resolve(relativeTo, compilerOptions[pathProp] as string);
    }
  }
}

/**
 * Mutates the compiler options to normalize some values for Rollup.
 * @param compilerOptions Compiler options to _mutate_.
 * @returns True if the source map compiler option was not initially set.
 */
function normalizeCompilerOptions(
  ts: typeof import('typescript'),
  compilerOptions: CompilerOptions
) {
  let autoSetSourceMap = false;
  if (compilerOptions.inlineSourceMap) {
    // Force separate source map files for Rollup to work with.
    compilerOptions.sourceMap = true;
    compilerOptions.inlineSourceMap = false;
  } else if (typeof compilerOptions.sourceMap !== 'boolean') {
    // Default to using source maps.
    // If the plugin user sets sourceMap to false we keep that option.
    compilerOptions.sourceMap = true;
    // Using inlineSources to make sure typescript generate source content
    // instead of source path.
    compilerOptions.inlineSources = true;
    autoSetSourceMap = true;
  }

  switch (compilerOptions.module) {
    case ts.ModuleKind.ES2015:
    case ts.ModuleKind.ESNext:
    case ts.ModuleKind.CommonJS:
      // OK module type
      return autoSetSourceMap;
    case ts.ModuleKind.None:
    case ts.ModuleKind.AMD:
    case ts.ModuleKind.UMD:
    case ts.ModuleKind.System: {
      // Invalid module type
      const moduleType = ts.ModuleKind[compilerOptions.module];
      throw new Error(
        `@rollup/plugin-typescript: The module kind should be 'ES2015' or 'ESNext, found: '${moduleType}'`
      );
    }
    default:
      // Unknown or unspecified module type, force ESNext
      compilerOptions.module = ts.ModuleKind.ESNext;
  }

  return autoSetSourceMap;
}

/**
 * Validate that the `compilerOptions.sourceMap` option matches `outputOptions.sourcemap`.
 * @param context Rollup plugin context used to emit warnings.
 * @param compilerOptions Typescript compiler options.
 * @param outputOptions Rollup output options.
 * @param autoSetSourceMap True if the `compilerOptions.sourceMap` property was set to `true`
 * by the plugin, not the user.
 */
function validateSourceMap(
  context: PluginContext,
  compilerOptions: CompilerOptions,
  outputOptions: OutputOptions,
  autoSetSourceMap: boolean
) {
  if (compilerOptions.sourceMap && !outputOptions.sourcemap && !autoSetSourceMap) {
    context.warn(
      `@rollup/plugin-typescript: Rollup 'sourcemap' option must be set to generate source maps.`
    );
  } else if (!compilerOptions.sourceMap && outputOptions.sourcemap) {
    context.warn(
      `@rollup/plugin-typescript: Typescript 'sourceMap' compiler option must be set to generate source maps.`
    );
  }
}

/**
 * Validate that the out directory used by Typescript can be controlled by Rollup.
 * @param context Rollup plugin context used to emit errors.
 * @param compilerOptions Typescript compiler options.
 * @param outputOptions Rollup output options.
 */
function validatePaths(
  ts: typeof import('typescript'),
  context: PluginContext,
  compilerOptions: CompilerOptions,
  outputOptions: OutputOptions
) {
  if (compilerOptions.out) {
    context.error(
      `@rollup/plugin-typescript: Deprecated 'out' option is not supported. Use 'outDir' instead.`
    );
  } else if (compilerOptions.outFile) {
    context.error(
      `@rollup/plugin-typescript: 'outFile' option is not supported. Use 'outDir' instead.`
    );
  }

  for (const dirProperty of DIRECTORY_PROPS) {
    if (compilerOptions[dirProperty]) {
      if (!outputOptions.dir) {
        context.error(
          `@rollup/plugin-typescript: 'dir' must be used when '${dirProperty}' is specified.`
        );
      }

      // Checks if the given path lies within Rollup output dir
      const fromRollupDirToTs = relative(outputOptions.dir, compilerOptions[dirProperty]!);
      if (fromRollupDirToTs.startsWith('..')) {
        context.error(`@rollup/plugin-typescript: '${dirProperty}' must be located inside 'dir'.`);
      }
    }
  }

  const tsBuildInfoPath = ts.getTsBuildInfoEmitOutputFilePath(compilerOptions);
  if (tsBuildInfoPath && compilerOptions.incremental) {
    if (!outputOptions.dir) {
      context.error(
        `@rollup/plugin-typescript: 'dir' must be used when 'tsBuildInfoFile' or 'incremental' are specified.`
      );
    }

    // Checks if the given path lies within Rollup output dir
    const fromRollupDirToTs = relative(outputOptions.dir, tsBuildInfoPath);
    if (fromRollupDirToTs.startsWith('..')) {
      context.error(`@rollup/plugin-typescript: 'tsBuildInfoFile' must be located inside 'dir'.`);
    }
  }

  if (compilerOptions.declaration || compilerOptions.declarationMap) {
    if (DIRECTORY_PROPS.every((dirProperty) => !compilerOptions[dirProperty])) {
      context.error(
        `@rollup/plugin-typescript: 'outDir' or 'declarationDir' must be specified to generate declaration files.`
      );
    }
  }
}

/**
 * Checks if the given OutputFile represents some code
 */
function isCodeOutputFile(name: string): boolean {
  return !isMapOutputFile(name) && !name.endsWith('.d.ts');
}

/**
 * Checks if the given OutputFile represents some source map
 */
function isMapOutputFile(name: string): boolean {
  return name.endsWith('.map');
}

/**
 * Finds the corresponding emitted Javascript files for a given Typescript file.
 * @param id Path to the Typescript file.
 * @param emittedFiles Map of file names to source code,
 * containing files emitted by the Typescript compiler.
 */
function findTypescriptOutput(
  ts: typeof import('typescript'),
  parsedOptions: import('typescript').ParsedCommandLine,
  id: string,
  emittedFiles: ReadonlyMap<string, string>
): TypescriptSourceDescription {
  const emittedFileNames = ts.getOutputFileNames(
    parsedOptions,
    id,
    !ts.sys.useCaseSensitiveFileNames
  );

  const codeFile = emittedFileNames.find(isCodeOutputFile);
  const mapFile = emittedFileNames.find(isMapOutputFile);

  return {
    code: emittedFiles.get(codeFile!),
    map: emittedFiles.get(mapFile!),
    declarations: emittedFileNames.filter((name) => name !== codeFile && name !== mapFile),
  };
}

function createDeferred(timeout?: number): Deferred {
  let promise: Promise<boolean | void>;
  let resolve: DeferredResolve = () => {};

  if (timeout) {
    promise = Promise.race<Promise<boolean>>([
      new Promise((r) => setTimeout(r, timeout, true)),
      new Promise((r) => (resolve = r)),
    ]);
  } else {
    promise = new Promise((r) => (resolve = r));
  }

  return { promise, resolve };
}

/**
 * Create a language service host to use with the Typescript compiler & type checking APIs.
 * Typescript hosts are used to represent the user's system,
 * with an API for reading files, checking directories and case sensitivity etc.
 * @see https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API
 */
function createWatchHost(
  ts: typeof import('typescript'),
  context: PluginContext,
  { formatHost, parsedOptions, writeFile, status, resolveModule }: CreateProgramOptions
): import('typescript').WatchCompilerHostOfFilesAndCompilerOptions<BuilderProgram> {
  const createProgram = ts.createEmitAndSemanticDiagnosticsBuilderProgram;

  const baseHost = ts.createWatchCompilerHost(
    parsedOptions.fileNames,
    parsedOptions.options,
    ts.sys,
    createProgram,
    buildDiagnosticReporter(ts, context, formatHost),
    status,
    parsedOptions.projectReferences
  );

  return {
    ...baseHost,
    /** Override the created program so an in-memory emit is used */
    afterProgramCreate(program) {
      const origEmit = program.emit;
      // eslint-disable-next-line no-param-reassign
      program.emit = (targetSourceFile, _, ...args) =>
        origEmit(targetSourceFile, writeFile, ...args);
      return baseHost.afterProgramCreate!(program);
    },
    /** Add helper to deal with module resolution */
    resolveModuleNames(moduleNames, containingFile) {
      return moduleNames.map((moduleName) => resolveModule(moduleName, containingFile));
    },
  };
}

function createWatchProgram(
  ts: typeof import('typescript'),
  context: PluginContext,
  options: CreateProgramOptions
) {
  return ts.createWatchProgram(createWatchHost(ts, context, options));
}

/* ---------------------------------------------------------------------------------------------- */

type DeferredResolve = ((value?: boolean) => void) | (() => void);

type TypeScript = typeof import('typescript');

type ModuleResolverHost = Partial<ModuleResolutionHost> & DiagnosticsHost;

/** Properties of `CompilerOptions` that are normally enums */
type EnumCompilerOptions = 'module' | 'moduleResolution' | 'newLine' | 'jsx' | 'target';

/** JSON representation of Typescript compiler options */
type JsonCompilerOptions = Omit<CompilerOptions, EnumCompilerOptions> &
  Record<EnumCompilerOptions, string>;

/** Compiler options set by the plugin user. */
type PartialCompilerOptions = Partial<CompilerOptions> | Partial<JsonCompilerOptions>;

type RollupTypescriptOptions = RollupTypescriptPluginOptions & PartialCompilerOptions;

type Resolver = (moduleName: string, containingFile: string) => ResolvedModuleFull | undefined;

interface DiagnosticsHost extends FormatDiagnosticsHost {
  getCompilationSettings(): CompilerOptions;
}

interface RollupTypescriptPluginOptions {
  /**
   * Determine which files are transpiled by Typescript (all `.ts` and `.tsx` files by default).
   */
  include?: FilterPattern;
  /**
   * Determine which files are transpiled by Typescript (all `.ts` and `.tsx` files by default).
   */
  exclude?: FilterPattern;
  /**
   * When set to false, ignores any options specified in the config file. If set to a string that
   * corresponds to a file path, the specified file will be used as config file.
   */
  tsconfig?: string | false;
  /**
   * Overrides TypeScript used for transpilation
   */
  typescript?: TypeScript;
  /**
   * Overrides the injected TypeScript helpers with a custom version.
   */
  tslib?: Promise<string> | string;
}

interface TypescriptSourceDescription extends Partial<SourceDescription> {
  declarations: string[];
}

interface CreateProgramOptions {
  /** Formatting host used to get some system functions and emit type errors. */
  formatHost: DiagnosticsHost;
  /** Parsed Typescript compiler options. */
  parsedOptions: ParsedCommandLine;
  /** Callback to save compiled files in memory. */
  writeFile: WriteFileCallback;
  /** Callback for the Typescript status reporter. */
  status: WatchStatusReporter;
  /** Function to resolve a module location */
  resolveModule: Resolver;
}

interface Deferred {
  promise: Promise<boolean | void>;
  resolve: DeferredResolve;
}
