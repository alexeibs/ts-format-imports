import * as fs from 'fs';
import * as ts from 'typescript';

import {ImportParser} from '../src/import-parser';
import {ParsedImport} from '../src/ast-interfaces';
import {exploreSourceFile} from '../src/ast-utils';

function parseImports(filename: string): ParsedImport[] {
  let content = fs.readFileSync(filename).toString();
  let sourceFile = ts.createSourceFile(filename, content, ts.ScriptTarget.ES5, true);

  let parser = new ImportParser(content);
  exploreSourceFile(sourceFile, [parser]);

  return parser.getImports();
}

describe('ImportParser suite', () => {
  it('Single identifiers', () => {
    let imports = parseImports('spec/support/test.ts');
    expect(imports).toEqual([
      {
        pos: 0,
        end: 32,
        isNamespace: false,
        identifiers: ['readFileSync'],
        path: 'fs'
      }, {
        pos: 33,
        end: 66,
        isNamespace: true,
        identifiers: ['ts'],
        path: 'typescript'
      }, {
        pos: 67,
        end: 107,
        isNamespace: false,
        identifiers: ['class1'],
        path: 'package1/module1'
      }, {
        pos: 108,
        end: 148,
        isNamespace: false,
        identifiers: ['class2'],
        path: 'package2/module3'
      }, {
        pos: 149,
        end: 189,
        isNamespace: false,
        identifiers: ['class3'],
        path: 'package1/module1'
      }, {
        pos: 190,
        end: 223,
        isNamespace: false,
        identifiers: ['class4'],
        path: './module4'
      }
    ]);
  });

  it('Multiple identifiers', () => {
    let imports = parseImports('spec/support/test2.ts');
    expect(imports).toEqual([
      {
        pos: 0,
        end: 40,
        isNamespace: false,
        identifiers: ['class1'],
        path: 'package1/module1'
      }, {
        pos: 41,
        end: 89,
        isNamespace: false,
        identifiers: ['class2', 'class3'],
        path: 'package2/module3'
      }, {
        pos: 91,
        end: 145,
        isNamespace: false,
        identifiers: ['class4', 'class5'],
        path: 'package1/module2'
      }
    ]);
  });
});
