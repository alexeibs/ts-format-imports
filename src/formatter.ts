import * as ts from 'typescript';

import {ASTExplorer} from './ast-interfaces';

import {ASTPrinter} from './ast-printer';

import {exploreSourceFile} from './ast-utils';

import {writeImportGroup} from './import-group-writer';

import {ImportParser} from './import-parser';

import {ImportSorter} from './import-sorter';

import {MainCodeWriter} from './main-code-writer';

export function formatImports(filename: string, content: string, verbose: boolean, doWrite: (s: string) => void) {
  let sourceFile = ts.createSourceFile(filename, content, ts.ScriptTarget.ES5, true);

  let parser = new ImportParser(content);
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

  let mainCode = new MainCodeWriter(content, imports);
  mainCode.writeHeader(doWrite);
  let groupedImports = sorter.getSortedGroups();
  for (let i = 0, imax = groupedImports.length; i < imax; ++i) {
    writeImportGroup(groupedImports[i], doWrite);
    doWrite('\n');
  }
  mainCode.write(doWrite);
}
