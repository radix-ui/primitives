import { IContext } from './context';
import { Graph, alg } from 'graphlib';
import hash from 'object-hash';
import { RollingCache } from './rollingcache';
import { ICache } from './icache';
import { each, concat, some } from 'lodash';
import { tsModule } from './tsproxy';
import tsTypes from 'typescript';
import { blue, yellow, green } from 'colors/safe';
import { emptyDirSync, pathExistsSync, readdirSync, removeSync, statSync } from 'fs-extra';
import { NoCache } from './nocache';

export interface ICode {
  code: string;
  map?: string;
  dts?: tsTypes.OutputFile;
  dtsmap?: tsTypes.OutputFile;
  references?: string[];
}

interface INodeLabel {
  dirty: boolean;
}

interface ITypeSnapshot {
  id: string;
  snapshot: tsTypes.IScriptSnapshot | undefined;
}

export function convertEmitOutput(output: tsTypes.EmitOutput, references?: string[]): ICode {
  const out: ICode = { code: '', references };

  output.outputFiles.forEach((e) => {
    if (e.name.endsWith('.d.ts')) out.dts = e;
    else if (e.name.endsWith('.d.ts.map')) out.dtsmap = e;
    else if (e.name.endsWith('.map')) out.map = e.text;
    else out.code = e.text;
  });

  return out;
}

export function getAllReferences(
  importer: string,
  snapshot: tsTypes.IScriptSnapshot | undefined,
  options: tsTypes.CompilerOptions
) {
  if (!snapshot) return [];

  const info = tsModule.preProcessFile(snapshot.getText(0, snapshot.getLength()), true, true);

  return concat(info.referencedFiles, info.importedFiles)
    .map((reference) => {
      const resolved = tsModule.nodeModuleNameResolver(
        reference.fileName,
        importer,
        options,
        tsModule.sys
      );
      return resolved.resolvedModule ? resolved.resolvedModule.resolvedFileName : undefined;
    })
    .filter(Boolean);
}

export class TsCache {
  private cacheVersion = '9';
  private cachePrefix = 'rpt2_';
  private dependencyTree: Graph;
  private ambientTypes: ITypeSnapshot[];
  private ambientTypesDirty = false;
  private cacheDir: string | undefined;
  private codeCache!: ICache<ICode | undefined>;
  private typesCache!: ICache<string>;
  private hashOptions = { algorithm: 'sha1', ignoreUnknown: false };

  constructor(
    private noCache: boolean,
    hashIgnoreUnknown: boolean,
    private host: tsTypes.LanguageServiceHost,
    private cacheRoot: string,
    private options: tsTypes.CompilerOptions,
    private rollupConfig: any,
    rootFilenames: string[],
    private context: IContext
  ) {
    this.hashOptions.ignoreUnknown = hashIgnoreUnknown;
    if (!noCache) {
      this.cacheDir = `${this.cacheRoot}/${this.cachePrefix}${hash(
        {
          version: this.cacheVersion,
          rootFilenames,
          options: this.options,
          rollupConfig: this.rollupConfig,
          tsVersion: tsModule.version,
        },
        this.hashOptions
      )}`;
    }

    this.dependencyTree = new Graph({ directed: true });
    this.dependencyTree.setDefaultNodeLabel((_node: string) => ({ dirty: false }));

    const automaticTypes = tsModule
      .getAutomaticTypeDirectiveNames(options, tsModule.sys)
      .map((entry) =>
        tsModule.resolveTypeReferenceDirective(entry, undefined, options, tsModule.sys)
      )
      .filter(
        (entry) =>
          entry.resolvedTypeReferenceDirective &&
          entry.resolvedTypeReferenceDirective.resolvedFileName
      )
      .map((entry) => entry.resolvedTypeReferenceDirective!.resolvedFileName!);

    this.ambientTypes = rootFilenames
      .filter((file) => file.endsWith('.d.ts'))
      .concat(automaticTypes)
      .map((id) => ({ id, snapshot: this.host.getScriptSnapshot(id) }));

    this.init();

    this.checkAmbientTypes();
  }

  public clean() {
    if (pathExistsSync(this.cacheRoot)) {
      const entries = readdirSync(this.cacheRoot);
      entries.forEach((e) => {
        const dir = `${this.cacheRoot}/${e}`;
        if (e.startsWith(this.cachePrefix) && statSync(dir).isDirectory) {
          this.context.info(blue(`cleaning cache: ${dir}`));
          emptyDirSync(`${dir}`);
          removeSync(`${dir}`);
        } else this.context.debug(`not cleaning ${dir}`);
      });
    }

    this.init();
  }

  public setDependency(importee: string, importer: string): void {
    // importee -> importer
    this.context.debug(`${blue('dependency')} '${importee}'`);
    this.context.debug(`    imported by '${importer}'`);
    this.dependencyTree.setEdge(importer, importee);
  }

  public walkTree(cb: (id: string) => void | false): void {
    const acyclic = alg.isAcyclic(this.dependencyTree);

    if (acyclic) {
      each(alg.topsort(this.dependencyTree), (id: string) => cb(id));
      return;
    }

    this.context.info(yellow('import tree has cycles'));

    each(this.dependencyTree.nodes(), (id: string) => cb(id));
  }

  public done() {
    this.context.info(blue('rolling caches'));
    this.codeCache.roll();
    this.typesCache.roll();
  }

  public getCompiled(
    id: string,
    snapshot: tsTypes.IScriptSnapshot,
    transform: () => ICode | undefined
  ): ICode | undefined {
    if (this.noCache) {
      this.context.info(`${blue('transpiling')} '${id}'`);
      this.markAsDirty(id);
      return transform();
    }

    const name = this.makeName(id, snapshot);

    this.context.info(`${blue('transpiling')} '${id}'`);
    this.context.debug(`    cache: '${this.codeCache.path(name)}'`);

    if (this.codeCache.exists(name) && !this.isDirty(id, false)) {
      this.context.debug(green('    cache hit'));
      const data = this.codeCache.read(name);
      if (data) {
        this.codeCache.write(name, data);
        return data;
      } else this.context.warn(yellow('    cache broken, discarding'));
    }

    this.context.debug(yellow('    cache miss'));

    const transformedData = transform();
    this.codeCache.write(name, transformedData);
    this.markAsDirty(id);
    return transformedData;
  }

  private checkAmbientTypes(): void {
    if (this.noCache) {
      this.ambientTypesDirty = true;
      return;
    }

    this.context.debug(blue('Ambient types:'));
    const typeNames = this.ambientTypes
      .filter((snapshot) => snapshot.snapshot !== undefined)
      .map((snapshot) => {
        this.context.debug(`    ${snapshot.id}`);
        return this.makeName(snapshot.id, snapshot.snapshot!);
      });
    // types dirty if any d.ts changed, added or removed
    this.ambientTypesDirty = !this.typesCache.match(typeNames);

    if (this.ambientTypesDirty)
      this.context.info(yellow('ambient types changed, redoing all semantic diagnostics'));

    each(typeNames, (name) => this.typesCache.touch(name));
  }

  private init() {
    if (this.noCache) {
      this.codeCache = new NoCache<ICode>();
      this.typesCache = new NoCache<string>();
    } else {
      if (this.cacheDir === undefined) throw new Error(`this.cacheDir undefined`);
      this.codeCache = new RollingCache<ICode>(`${this.cacheDir}/code`, true);
      this.typesCache = new RollingCache<string>(`${this.cacheDir}/types`, true);
    }
  }

  private markAsDirty(id: string): void {
    this.dependencyTree.setNode(id, { dirty: true });
  }

  // returns true if node or any of its imports or any of global types changed
  private isDirty(id: string, checkImports: boolean): boolean {
    const label = this.dependencyTree.node(id) as INodeLabel;

    if (!label) return false;

    if (!checkImports || label.dirty) return label.dirty;

    if (this.ambientTypesDirty) return true;

    const dependencies = alg.dijkstra(this.dependencyTree, id);

    return some(dependencies, (dependency, node) => {
      if (!node || dependency.distance === Infinity) return false;

      const l = this.dependencyTree.node(node) as INodeLabel | undefined;
      const dirty = l === undefined ? true : l.dirty;

      if (dirty) this.context.debug(`    import changed: ${node}`);

      return dirty;
    });
  }

  private makeName(id: string, snapshot: tsTypes.IScriptSnapshot) {
    const data = snapshot.getText(0, snapshot.getLength());
    return hash({ data, id }, this.hashOptions);
  }
}
