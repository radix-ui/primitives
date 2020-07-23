export interface ICache<DataType> {
  exists(name: string): boolean;
  path(name: string): string;
  match(names: string[]): boolean;
  read(name: string): DataType | null | undefined;
  write(name: string, data: DataType): void;
  touch(name: string): void;
  roll(): void;
}
