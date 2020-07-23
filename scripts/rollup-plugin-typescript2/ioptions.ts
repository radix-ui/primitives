import { tsModule } from './tsproxy';
import tsTypes from 'typescript';

export interface ICustomTransformer {
  before?: tsTypes.TransformerFactory<tsTypes.SourceFile>;
  after?: tsTypes.TransformerFactory<tsTypes.SourceFile>;
  afterDeclarations?: tsTypes.TransformerFactory<tsTypes.Bundle | tsTypes.SourceFile>;
}

export type TransformerFactoryCreator = (
  ls: tsTypes.LanguageService
) => tsTypes.CustomTransformers | ICustomTransformer;

export interface IOptions {
  cwd: string;
  include: string | string[];
  exclude: string | string[];
  check: boolean;
  verbosity: number;
  clean: boolean;
  cacheRoot: string;
  abortOnError: boolean;
  rollupCommonJSResolveHack: boolean;
  tsconfig?: string;
  useTsconfigDeclarationDir: boolean;
  typescript: typeof tsModule;
  tsconfigOverride: any;
  transformers: TransformerFactoryCreator[];
  tsconfigDefaults: any;
  sourceMapCallback: (id: string, map: string) => void;
  objectHashIgnoreUnknownHack: boolean;
}
