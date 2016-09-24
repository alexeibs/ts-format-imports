import {writeImportGroup} from '../src/import-group-writer';

describe('ImportGroupWriter suite', () => {
  it('Normal scenario', () => {
    let output = [];
    let callback = s => output.push(s);
    writeImportGroup([
      {isNamespace: true, path: 'fs', identifiers: ['fs']},
      {isNamespace: false, path: 'module1', identifiers: ['class1']},
      {isNamespace: false, path: 'module2', identifiers: ['class2', 'class3']}
    ], callback);
    expect(output).toEqual([
      'import * as fs from \'fs\';\n',
      'import {class1} from \'module1\';\n',
      'import {class2} from \'module2\';\n',
      'import {class3} from \'module2\';\n'
    ]);
  });
  it('Empty list', () => {
    let output = [];
    writeImportGroup([], s => output.push(s));
    expect(output).toEqual([]);
  });
});
