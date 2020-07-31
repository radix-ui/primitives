declare module 'lerna-script' {
  type TypedArray =
    | Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Uint8ClampedArray
    | Float32Array
    | Float64Array;
  type Logger = (...args: any[]) => any;
  type LernaPackage = {
    name: string;
    version?: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };

  export function loadPackages(opts?: { log?: Logger }): Promise<LernaPackage[]>;

  export function loadRootPackage(opts?: { log?: Logger }): Promise<LernaPackage>;

  export const iter: {
    forEach(lernaPackages: LernaPackage[], opts?: { log?: Logger; build?: boolean }): void;
    parallel(
      lernaPackages: LernaPackage[],
      opts?: { log?: Logger; build?: boolean; concurrency?: number }
    ): void;
    batched(
      lernaPackages: LernaPackage[],
      opts?: { log?: Logger; build?: boolean }
    ): (taskFn: (pkg: LernaPackage, log?: Logger) => Promise<any>) => Promise<any[]>;
  };

  export const changes: {
    build(lernaPackage: LernaPackage, opts?: { log?: Logger }): (label: string) => void;
    unbuild(lernaPackage: LernaPackage, opts?: { log?: Logger }): (label: string) => void;
    isBuilt(lernaPackage: LernaPackage): (label: string) => void;
  };

  export const filters: {
    removeBuilt(
      allLernaPackages: LernaPackage[],
      opts?: { log?: Logger }
    ): (label: string) => LernaPackage[];
    gitSince(
      allLernaPackages: LernaPackage[],
      opts?: { log?: Logger }
    ): (refspec: string) => LernaPackage[];
    removeByGlob(
      allLernaPackages: LernaPackage[],
      opts?: { log?: Logger }
    ): (glob: string) => LernaPackage[];
    includeFilteredDeps(
      allLernaPackages: LernaPackage[],
      opts?: { log?: Logger }
    ): (filteredLernaPackages: LernaPackage[]) => LernaPackage[];
  };

  export const exec: {
    command(
      lernaPackage: LernaPackage,
      opts?: { silent?: boolean; log?: Logger }
    ): (command: string) => Promise<string>;
    script(
      lernaPackage: LernaPackage,
      opts?: { silent?: boolean; log?: Logger }
    ): (script: string) => Promise<string>;
  };

  export const fs: {
    readFile(
      lernaPackage: LernaPackage
    ): <T = string>(relativePath: string, convert?: (content: Buffer) => T) => Promise<T>;
    writeFile(
      lernaPackage: LernaPackage
    ): <T extends string | Buffer | TypedArray | DataView>(
      relativePath: string,
      content: T,
      convert?: (content: T) => string | Buffer | TypedArray | DataView
    ) => Promise<void>;
  };
}
