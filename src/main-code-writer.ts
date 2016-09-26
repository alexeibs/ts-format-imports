import {TextSlice} from './ast-interfaces';

export class MainCodeWriter {
  // assuming |imports| are sorted by 'pos' field
  constructor(fileContent: string, imports: TextSlice[]) {
    this.fileContent = fileContent;
    this.imports = imports;
  }

  hasHeader(): boolean {
    return this.imports.length > 0 && this.imports[0].pos > 0;
  }

  writeHeader(doWrite: (s: string) => void) {
    if (this.hasHeader()) {
      let header = this.fileContent.slice(0, this.imports[0].pos).replace(/\s+$/, '\n\n');
      doWrite(header);
    }
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
      let pos = this.imports[0].end;
      for (let i = 1; i < nImports; ++i) {
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
