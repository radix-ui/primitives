import { ICache } from './icache';
import { emptyDirSync, ensureFileSync, readJsonSync, removeSync, writeJsonSync } from 'fs-extra';
import { existsSync, readdirSync, renameSync } from 'fs-extra';
import { isEqual } from 'lodash';

/**
 * Saves data in new cache folder or reads it from old one.
 * Avoids perpetually growing cache and situations when things need to consider changed and then reverted data to be changed.
 */
export class RollingCache<DataType> implements ICache<DataType> {
  private oldCacheRoot: string;
  private newCacheRoot: string;

  private rolled: boolean = false;

  /**
   * @param cacheRoot: root folder for the cache
   * @param checkNewCache: whether to also look in new cache when reading from cache
   */
  constructor(private cacheRoot: string, private checkNewCache: boolean) {
    this.oldCacheRoot = `${this.cacheRoot}/cache`;
    this.newCacheRoot = `${this.cacheRoot}/cache_`;

    emptyDirSync(this.newCacheRoot);
  }

  /**
   * @returns true if name exist in old cache (or either old of new cache if checkNewCache is true)
   */
  public exists(name: string): boolean {
    if (this.rolled) return false;

    if (this.checkNewCache && existsSync(`${this.newCacheRoot}/${name}`)) return true;

    return existsSync(`${this.oldCacheRoot}/${name}`);
  }

  public path(name: string): string {
    return `${this.oldCacheRoot}/${name}`;
  }

  /**
   * @returns true if old cache contains all names and nothing more
   */
  public match(names: string[]): boolean {
    if (this.rolled) return false;

    if (!existsSync(this.oldCacheRoot)) return names.length === 0; // empty folder matches

    return isEqual(readdirSync(this.oldCacheRoot).sort(), names.sort());
  }

  /**
   * @returns data for name, must exist in old cache (or either old of new cache if checkNewCache is true)
   */
  public read(name: string): DataType | null | undefined {
    if (this.checkNewCache && existsSync(`${this.newCacheRoot}/${name}`))
      return readJsonSync(`${this.newCacheRoot}/${name}`, { encoding: 'utf8', throws: false });

    return readJsonSync(`${this.oldCacheRoot}/${name}`, { encoding: 'utf8', throws: false });
  }

  public write(name: string, data: DataType): void {
    if (this.rolled) return;

    if (data === undefined) return;

    writeJsonSync(`${this.newCacheRoot}/${name}`, data);
  }

  public touch(name: string) {
    if (this.rolled) return;
    ensureFileSync(`${this.newCacheRoot}/${name}`);
  }

  /**
   * clears old cache and moves new in its place
   */
  public roll() {
    if (this.rolled) return;

    this.rolled = true;
    removeSync(this.oldCacheRoot);
    renameSync(this.newCacheRoot, this.oldCacheRoot);
  }
}
