import {TextSlice} from './ast-interfaces';

export class MainCodeWriter {
  // assuming |imports| are sorted by 'pos' field
  constructor(fileContent: string, imports: TextSlice[]) {
    this.fileContent = fileContent;
    this.imports = imports;
  }

  write(doWrite: (s: string) => void) {
    let originalDoWrite = doWrite;
    doWrite = (s: string) => {
      s = cutNewLines(s);
      if (s.length > 0) {
        originalDoWrite(s);
        doWrite = originalDoWrite;
      }
    };

    let nImports = this.imports.length;
    if (nImports === 0) {
      doWrite(this.fileContent);

    } else {
      let pos = 0;
      for (let i = 0; i < nImports; ++i) {
        let parsedImport = this.imports[i];
        doWrite(this.fileContent.slice(pos, parsedImport.pos));
        pos = parsedImport.end;
      }
      doWrite(this.fileContent.slice(pos));
    }
  }

  private fileContent: string;
  private imports: TextSlice[];
}

export function cutNewLines(s: string): string {
  let lineStart = 0;
  let lastChar = s.length;
  let isLineEnd = false;
  for (let i = 0; i < lastChar; ++i) {
    let ch = s[i];
    if (isLineEnd) {
      if (ch !== '\n' && ch !== '\r') {
        isLineEnd = false;
        lineStart = i;
        if (ch !== ' ' && ch !== '\t') {
          break;
        }
      }
    } else {
      if (ch === '\n' || ch === '\r') {
        isLineEnd = true;
      } else if (ch !== ' ' && ch !== '\t') {
        break;
      }
    }
  }
  return isLineEnd ? '' : s.slice(lineStart);
}
