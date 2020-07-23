import { tsModule } from './tsproxy';
import tsTypes from 'typescript';

export function checkTsConfig(parsedConfig: tsTypes.ParsedCommandLine): void {
  const module = parsedConfig.options.module!;

  if (module !== tsModule.ModuleKind.ES2015 && module !== tsModule.ModuleKind.ESNext)
    throw new Error(
      `Incompatible tsconfig option. Module resolves to '${tsModule.ModuleKind[module]}'. This is incompatible with rollup, please use 'module: "ES2015"' or 'module: "ESNext"'.`
    );
}
