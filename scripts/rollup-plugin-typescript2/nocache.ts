import { ICache } from './icache';

export class NoCache<DataType> implements ICache<DataType> {
  public exists(_name: string): boolean {
    return false;
  }

  public path(name: string): string {
    return name;
  }

  public match(_names: string[]): boolean {
    return false;
  }

  public read(_name: string): DataType | null | undefined {
    return undefined;
  }

  public write(_name: string, _data: DataType): void {
    return;
  }

  public touch(_name: string) {
    return;
  }

  public roll() {
    return;
  }
}
