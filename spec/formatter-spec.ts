import * as fs from 'fs';

import {formatImports} from '../src/formatter';

function doTest(filename: string, verbose: boolean): string[] {
  let content = fs.readFileSync(filename).toString();
  let output: string[] = [];
  formatImports(filename, content, verbose, s => output.push(s));
  return output;
}

describe('Formatter suite', () => {
  it('Single identifiers', () => {
    spyOn(console, 'log');
    let output = doTest('spec/support/test.ts', true);
    expect(output).toEqual(jasmine.any(Array));
    expect(console.log).toHaveBeenCalled();
  });

  it('Multiple identifiers', () => {
    spyOn(console, 'log');
    let output = doTest('spec/support/test2.ts', false);
    expect(output).toEqual(jasmine.any(Array));
    expect(console.log).not.toHaveBeenCalled();
  });
});
