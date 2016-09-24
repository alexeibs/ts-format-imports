import * as ts from 'typescript';

import {ASTExplorer} from './ast-interfaces';
import {ASTPrinter} from './ast-printer';
import {ImportParser} from './import-parser';
import {ImportSorter} from './import-sorter';
import {MainCodeWriter} from './main-code-writer';

import {exploreSourceFile} from './ast-utils';
import {writeImportGroup} from './import-group-writer';

export function formatImports(filename: string, content: string, verbose: boolean, doWrite: (s: string) => void) {
  let sourceFile = ts.createSourceFile(filename, content, ts.ScriptTarget.ES5, true);

  let parser = new ImportParser;
  let explorers: ASTExplorer[] = [parser];
  if (verbose) {
    explorers.push(new ASTPrinter(sourceFile));
  }
  exploreSourceFile(sourceFile, explorers);

  let imports = parser.getImports();
  let sorter = new ImportSorter;
  for (let i = 0, imax = imports.length; i < imax; ++i) {
    sorter.putImport(imports[i]);
  }

  let groupedImports = sorter.getSortedGroups();
  for (let i = 0, imax = groupedImports.length; i < imax; ++i) {
    writeImportGroup(groupedImports[i], doWrite);
    doWrite('\n');
  }
  let mainCode = new MainCodeWriter(content, imports);
  mainCode.write(doWrite);
}
