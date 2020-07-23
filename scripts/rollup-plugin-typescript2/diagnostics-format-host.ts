import path from 'path';
import tsTypes from 'typescript';
import { tsModule } from './tsproxy';

export class FormatHost implements tsTypes.FormatDiagnosticsHost {
  public getCurrentDirectory(): string {
    return tsModule.sys.getCurrentDirectory();
  }

  public getCanonicalFileName(fileName: string): string {
    return path.normalize(fileName);
  }

  public getNewLine(): string {
    return tsModule.sys.newLine;
  }
}

export const formatHost = new FormatHost();
