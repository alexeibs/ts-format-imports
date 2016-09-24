import {ImportEntry} from './ast-interfaces';

export function writeImportGroup(imports: ImportEntry[], doWrite: (s: string) => void) {
  let nImports = imports.length;
  for (let i = 0, imax = imports.length; i < imax; ++i) {
    let item = imports[i];
    if (item.isNamespace) {
      doWrite(`import * as ${item.identifiers[0]} from '${item.path}';\n`);
    } else {
      for (let i = 0, imax = item.identifiers.length; i < imax; ++i) {
        doWrite(`import {${item.identifiers[i]}} from '${item.path}';\n`);
      }
    }
  }
}
