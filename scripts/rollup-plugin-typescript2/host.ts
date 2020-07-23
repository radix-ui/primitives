import { tsModule } from './tsproxy';
import tsTypes from 'typescript';
import { has as objectHas, concat } from 'lodash';
import { normalize } from './normalize';
import { TransformerFactoryCreator } from './ioptions';

export class LanguageServiceHost implements tsTypes.LanguageServiceHost {
  private cwd: string;
  private snapshots: { [fileName: string]: tsTypes.IScriptSnapshot } = {};
  private versions: { [fileName: string]: number } = {};
  private service?: tsTypes.LanguageService;
  private fileNames: Set<string>;

  constructor(
    private parsedConfig: tsTypes.ParsedCommandLine,
    private transformers: TransformerFactoryCreator[],
    cwd: string
  ) {
    this.fileNames = new Set(parsedConfig.fileNames);
    this.cwd = cwd;
  }

  public reset() {
    this.snapshots = {};
    this.versions = {};
  }

  public setLanguageService(service: tsTypes.LanguageService) {
    this.service = service;
  }

  public setSnapshot(fileName: string, data: string): tsTypes.IScriptSnapshot {
    fileName = normalize(fileName);

    const snapshot = tsModule.ScriptSnapshot.fromString(data);
    this.snapshots[fileName] = snapshot;
    this.versions[fileName] = (this.versions[fileName] || 0) + 1;
    this.fileNames.add(fileName);
    return snapshot;
  }

  public getScriptSnapshot(fileName: string): tsTypes.IScriptSnapshot | undefined {
    fileName = normalize(fileName);

    if (objectHas(this.snapshots, fileName)) return this.snapshots[fileName];

    const source = tsModule.sys.readFile(fileName);
    if (source) {
      this.snapshots[fileName] = tsModule.ScriptSnapshot.fromString(source);
      this.versions[fileName] = (this.versions[fileName] || 0) + 1;
      return this.snapshots[fileName];
    }

    return undefined;
  }

  public getCurrentDirectory() {
    return this.cwd;
  }

  public getScriptVersion(fileName: string) {
    fileName = normalize(fileName);

    return (this.versions[fileName] || 0).toString();
  }

  public getScriptFileNames() {
    return Array.from(this.fileNames.values());
  }

  public getCompilationSettings(): tsTypes.CompilerOptions {
    return this.parsedConfig.options;
  }

  public getDefaultLibFileName(opts: tsTypes.CompilerOptions) {
    return tsModule.getDefaultLibFilePath(opts);
  }

  public useCaseSensitiveFileNames(): boolean {
    return tsModule.sys.useCaseSensitiveFileNames;
  }

  public readDirectory(
    path: string,
    extensions?: string[],
    exclude?: string[],
    include?: string[]
  ): string[] {
    return tsModule.sys.readDirectory(path, extensions, exclude, include);
  }

  public readFile(path: string, encoding?: string): string | undefined {
    return tsModule.sys.readFile(path, encoding);
  }

  public fileExists(path: string): boolean {
    return tsModule.sys.fileExists(path);
  }

  public getTypeRootsVersion(): number {
    return 0;
  }

  public directoryExists(directoryName: string): boolean {
    return tsModule.sys.directoryExists(directoryName);
  }

  public getDirectories(directoryName: string): string[] {
    return tsModule.sys.getDirectories(directoryName);
  }

  public getCustomTransformers(): tsTypes.CustomTransformers | undefined {
    if (
      this.service === undefined ||
      this.transformers === undefined ||
      this.transformers.length === 0
    )
      return undefined;

    const transformer: tsTypes.CustomTransformers = {
      before: [],
      after: [],
      afterDeclarations: [],
    };

    for (const creator of this.transformers) {
      const factory = creator(this.service);
      if (factory.before) transformer.before = concat(transformer.before!, factory.before);
      if (factory.after) transformer.after = concat(transformer.after!, factory.after);
      if (factory.afterDeclarations)
        transformer.afterDeclarations = concat(
          transformer.afterDeclarations!,
          factory.afterDeclarations
        );
    }

    return transformer;
  }
}
