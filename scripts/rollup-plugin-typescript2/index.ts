import { RollupContext } from './rollupcontext';
import { ConsoleContext, VerbosityLevel } from './context';
import { LanguageServiceHost } from './host';
import { TsCache, convertDiagnostic, convertEmitOutput, getAllReferences } from './tscache';
import { tsModule, setTypescriptModule } from './tsproxy';
import tsTypes from 'typescript';
import resolve from 'resolve';
import { each, concat, defaults as objectDefault, has as objectHas, isFunction } from 'lodash';
import { IOptions } from './ioptions';
import { parseTsConfig } from './parse-tsconfig';
import { printDiagnostics } from './print-diagnostics';
import { TSLIB, TSLIB_VIRTUAL, tslibSource, tslibVersion } from './tslib';
import { blue, red, yellow, green } from 'colors/safe';
import { relative } from 'path';
import { normalize } from './normalize';
import { satisfies } from 'semver';
import findCacheDir from 'find-cache-dir';
import {
  PluginImpl,
  PluginContext,
  InputOptions,
  OutputOptions,
  TransformResult,
  Plugin,
} from 'rollup';
import { createFilter } from './get-options-overrides';

type RPT2Options = Partial<IOptions>;

export { RPT2Options };

const typescript: PluginImpl<RPT2Options> = (options) => {
  let watchMode = false;
  let generateRound = 0;
  let rollupOptions: InputOptions;
  let context: ConsoleContext;
  let filter: any;
  let parsedConfig: tsTypes.ParsedCommandLine;
  let tsConfigPath: string | undefined;
  let servicesHost: LanguageServiceHost;
  let service: tsTypes.LanguageService;
  let noErrors = true;
  const declarations: {
    [name: string]: { type: tsTypes.OutputFile; map?: tsTypes.OutputFile };
  } = {};
  const allImportedFiles = new Set<string>();

  let _cache: TsCache;
  const cache = (): TsCache => {
    if (!_cache)
      _cache = new TsCache(
        pluginOptions.clean,
        pluginOptions.objectHashIgnoreUnknownHack,
        servicesHost,
        pluginOptions.cacheRoot,
        parsedConfig.options,
        rollupOptions,
        parsedConfig.fileNames,
        context
      );
    return _cache;
  };

  const pluginOptions = { ...options } as IOptions;

  objectDefault(pluginOptions, {
    check: true,
    verbosity: VerbosityLevel.Warning,
    clean: false,
    cacheRoot: findCacheDir({ name: 'rollup-plugin-typescript2' }),
    include: ['*.ts+(|x)', '**/*.ts+(|x)'],
    exclude: ['*.d.ts', '**/*.d.ts'],
    abortOnError: true,
    rollupCommonJSResolveHack: false,
    tsconfig: undefined,
    useTsconfigDeclarationDir: false,
    tsconfigOverride: {},
    transformers: [],
    tsconfigDefaults: {},
    objectHashIgnoreUnknownHack: false,
    cwd: process.cwd(),
  });

  if (!pluginOptions.typescript) {
    pluginOptions.typescript = require('typescript');
  }

  setTypescriptModule(pluginOptions.typescript);

  const self: Plugin & { _ongenerate: Function; _onwrite: Function } = {
    name: 'rpt2',

    options(config) {
      rollupOptions = { ...config };
      context = new ConsoleContext(pluginOptions.verbosity, 'rpt2: ');

      watchMode = process.env.ROLLUP_WATCH === 'true';
      ({ parsedTsConfig: parsedConfig, fileName: tsConfigPath } = parseTsConfig(
        context,
        pluginOptions
      ));

      if (generateRound === 0) {
        parsedConfig.fileNames.forEach((fileName) => {
          allImportedFiles.add(fileName);
        });

        context.info(`typescript version: ${tsModule.version}`);
        context.info(`tslib version: ${tslibVersion}`);
        if (this.meta) context.info(`rollup version: ${this.meta.rollupVersion}`);

        if (!satisfies(tsModule.version, '$TS_VERSION_RANGE', { includePrerelease: true } as any))
          throw new Error(
            `Installed typescript version '${tsModule.version}' is outside of supported range '$TS_VERSION_RANGE'`
          );

        context.info(`rollup-plugin-typescript2 version: $RPT2_VERSION`);
        context.debug(
          () =>
            `plugin options:\n${JSON.stringify(
              pluginOptions,
              (key, value) =>
                key === 'typescript' ? `version ${(value as typeof tsModule).version}` : value,
              4
            )}`
        );
        context.debug(() => `rollup config:\n${JSON.stringify(rollupOptions, undefined, 4)}`);
        context.debug(() => `tsconfig path: ${tsConfigPath}`);

        if (pluginOptions.objectHashIgnoreUnknownHack)
          context.warn(
            () =>
              `${yellow(
                "You are using 'objectHashIgnoreUnknownHack' option"
              )}. If you enabled it because of async functions, try disabling it now.`
          );

        if (watchMode) context.info(`running in watch mode`);
      }

      filter = createFilter(context, pluginOptions, parsedConfig);

      servicesHost = new LanguageServiceHost(
        parsedConfig,
        pluginOptions.transformers,
        pluginOptions.cwd
      );

      service = tsModule.createLanguageService(servicesHost, tsModule.createDocumentRegistry());
      servicesHost.setLanguageService(service);

      // printing compiler option errors
      if (pluginOptions.check)
        printDiagnostics(
          context,
          convertDiagnostic('options', service.getCompilerOptionsDiagnostics()),
          parsedConfig.options.pretty === true
        );

      if (pluginOptions.clean) cache().clean();

      return config;
    },

    watchChange(id) {
      const key = normalize(id);
      delete declarations[key];
    },

    resolveId(importee, importer) {
      if (importee === TSLIB) return TSLIB_VIRTUAL;

      if (!importer) return;

      importer = normalize(importer);

      // avoiding trying to resolve ids for things imported from files unrelated to this plugin
      if (!allImportedFiles.has(importer)) return;

      // TODO: use module resolution cache
      const result = tsModule.nodeModuleNameResolver(
        importee,
        importer,
        parsedConfig.options,
        tsModule.sys
      );

      if (result.resolvedModule && result.resolvedModule.resolvedFileName) {
        if (filter(result.resolvedModule.resolvedFileName))
          cache().setDependency(result.resolvedModule.resolvedFileName, importer);

        if (result.resolvedModule.resolvedFileName.endsWith('.d.ts')) {
          return;
        }

        const resolved = pluginOptions.rollupCommonJSResolveHack
          ? resolve.sync(result.resolvedModule.resolvedFileName)
          : result.resolvedModule.resolvedFileName;

        context.debug(() => `${blue('resolving')} '${importee}' imported by '${importer}'`);
        context.debug(() => `    to '${resolved}'`);

        return resolved;
      }

      return;
    },

    load(id) {
      if (id === TSLIB_VIRTUAL) return tslibSource;

      return null;
    },

    transform(code, id) {
      generateRound = 0; // in watch mode transform call resets generate count (used to avoid printing too many copies of the same error messages)

      if (!filter(id)) return undefined;

      allImportedFiles.add(normalize(id));

      const contextWrapper = new RollupContext(
        pluginOptions.verbosity,
        pluginOptions.abortOnError,
        this,
        'rpt2: '
      );

      const snapshot = servicesHost.setSnapshot(id, code);

      // getting compiled file from cache or from ts
      const result = cache().getCompiled(id, snapshot, () => {
        const output = service.getEmitOutput(id);

        if (output.emitSkipped) {
          noErrors = false;

          // always checking on fatal errors, even if options.check is set to false
          const diagnostics = concat(
            cache().getSyntacticDiagnostics(id, snapshot, () => {
              return service.getSyntacticDiagnostics(id);
            }),
            cache().getSemanticDiagnostics(id, snapshot, () => {
              return service.getSemanticDiagnostics(id);
            })
          );
          printDiagnostics(contextWrapper, diagnostics, parsedConfig.options.pretty === true);

          // since no output was generated, aborting compilation
          cache().done();
          if (isFunction(this.error)) this.error(red(`failed to transpile '${id}'`));
        }

        const references = getAllReferences(
          id,
          servicesHost.getScriptSnapshot(id),
          parsedConfig.options
        );
        return convertEmitOutput(output, references as any);
      });

      if (pluginOptions.check) {
        const diagnostics = concat(
          cache().getSyntacticDiagnostics(id, snapshot, () => {
            return service.getSyntacticDiagnostics(id);
          }),
          cache().getSemanticDiagnostics(id, snapshot, () => {
            return service.getSemanticDiagnostics(id);
          })
        );

        if (diagnostics.length > 0) noErrors = false;

        printDiagnostics(contextWrapper, diagnostics, parsedConfig.options.pretty === true);
      }

      if (result) {
        if (result.references)
          result.references.map(normalize).map(allImportedFiles.add, allImportedFiles);

        if (watchMode && this.addWatchFile && result.references) {
          if (tsConfigPath) this.addWatchFile(tsConfigPath);
          result.references.map(this.addWatchFile, this);
          context.debug(
            () => `${green('    watching')}: ${result.references!.join('\nrpt2:               ')}`
          );
        }

        if (result.dts) {
          const key = normalize(id);
          declarations[key] = { type: result.dts, map: result.dtsmap };
          context.debug(() => `${blue('generated declarations')} for '${key}'`);
        }

        const transformResult: TransformResult = { code: result.code, map: { mappings: '' } };

        if (result.map) {
          if (pluginOptions.sourceMapCallback) pluginOptions.sourceMapCallback(id, result.map);
          transformResult.map = JSON.parse(result.map);
        }

        return transformResult;
      }

      return undefined;
    },

    generateBundle(bundleOptions) {
      self._ongenerate();
      self._onwrite.call(this, bundleOptions);
    },

    _ongenerate(): void {
      context.debug(() => `generating target ${generateRound + 1}`);

      if (pluginOptions.check && watchMode && generateRound === 0) {
        cache().walkTree((id) => {
          if (!filter(id)) return;

          const snapshot = servicesHost.getScriptSnapshot(id);
          if (!snapshot) return;

          const diagnostics = concat(
            cache().getSyntacticDiagnostics(id, snapshot, () => {
              return service.getSyntacticDiagnostics(id);
            }),
            cache().getSemanticDiagnostics(id, snapshot, () => {
              return service.getSemanticDiagnostics(id);
            })
          );

          printDiagnostics(context, diagnostics, parsedConfig.options.pretty === true);
        });
      }

      if (!watchMode && !noErrors) context.info(yellow('there were errors or warnings.'));

      cache().done();

      generateRound++;
    },

    _onwrite(this: PluginContext, _output: OutputOptions): void {
      if (!parsedConfig.options.declaration) return;

      each(parsedConfig.fileNames, (name) => {
        const key = normalize(name);
        if (objectHas(declarations, key)) return;
        if (!allImportedFiles.has(key)) {
          context.debug(() => `skipping declarations for unused '${key}'`);
          return;
        }

        context.debug(() => `generating missed declarations for '${key}'`);
        const output = service.getEmitOutput(key, true);
        const out = convertEmitOutput(output);
        if (out.dts) declarations[key] = { type: out.dts, map: out.dtsmap };
      });

      const emitDeclaration = (key: string, extension: string, entry?: tsTypes.OutputFile) => {
        if (!entry) return;

        let fileName = entry.name;
        if (fileName.includes('?'))
          // HACK for rollup-plugin-vue, it creates virtual modules in form 'file.vue?rollup-plugin-vue=script.ts'
          fileName = fileName.split('?', 1) + extension;

        // If 'useTsconfigDeclarationDir' is given in the
        // plugin options, directly write to the path provided
        // by Typescript's LanguageService (which may not be
        // under Rollup's output directory, and thus can't be
        // emitted as an asset).
        if (pluginOptions.useTsconfigDeclarationDir) {
          context.debug(() => `${blue('emitting declarations')} for '${key}' to '${fileName}'`);
          tsModule.sys.writeFile(fileName, entry.text, entry.writeByteOrderMark);
        } else {
          const relativePath = relative(pluginOptions.cwd, fileName);
          context.debug(() => `${blue('emitting declarations')} for '${key}' to '${relativePath}'`);
          this.emitFile({
            type: 'asset',
            source: entry.text,
            fileName: relativePath,
          });
        }
      };

      each(declarations, ({ type, map }, key) => {
        emitDeclaration(key, '.d.ts', type);
        emitDeclaration(key, '.d.ts.map', map);
      });
    },
  };

  return self;
};

export default typescript;
