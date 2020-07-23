import { tsModule } from './tsproxy';
import { IContext } from './context';
import { dirname } from 'path';
import { getOptionsOverrides } from './get-options-overrides';
import { IOptions } from './ioptions';
import { merge } from 'lodash';
import { checkTsConfig } from './check-tsconfig';

export function parseTsConfig(context: IContext, pluginOptions: IOptions) {
  const fileName = tsModule.findConfigFile(
    pluginOptions.cwd,
    tsModule.sys.fileExists,
    pluginOptions.tsconfig
  );

  // if the value was provided, but no file, fail hard
  if (pluginOptions.tsconfig !== undefined && !fileName)
    throw new Error(`failed to open '${fileName}'`);

  let loadedConfig: any = {};
  let baseDir = pluginOptions.cwd;
  let configFileName;
  if (fileName) {
    const text = tsModule.sys.readFile(fileName);
    if (text === undefined) throw new Error(`failed to read '${fileName}'`);

    const result = tsModule.parseConfigFileTextToJson(fileName, text);

    if (result.error !== undefined) {
      throw new Error(`failed to parse '${fileName}'`);
    }

    loadedConfig = result.config;
    baseDir = dirname(fileName);
    configFileName = fileName;
  }

  const mergedConfig = {};
  merge(mergedConfig, pluginOptions.tsconfigDefaults, loadedConfig, pluginOptions.tsconfigOverride);

  const preParsedTsConfig = tsModule.parseJsonConfigFileContent(
    mergedConfig,
    tsModule.sys,
    baseDir,
    getOptionsOverrides(pluginOptions),
    configFileName
  );
  const compilerOptionsOverride = getOptionsOverrides(pluginOptions, preParsedTsConfig);
  const parsedTsConfig = tsModule.parseJsonConfigFileContent(
    mergedConfig,
    tsModule.sys,
    baseDir,
    compilerOptionsOverride,
    configFileName
  );

  checkTsConfig(parsedTsConfig);

  context.debug(
    `built-in options overrides: ${JSON.stringify(compilerOptionsOverride, undefined, 4)}`
  );
  context.debug(`parsed tsconfig: ${JSON.stringify(parsedTsConfig, undefined, 4)}`);

  return { parsedTsConfig, fileName };
}
