import * as fs from 'fs';

import {formatImports} from '../src/formatter';

function defineTest(name: string, inputPath: string, verbose: boolean) {
  it(name, () => {
    spyOn(console, 'log');

    let input = fs.readFileSync(inputPath).toString();
    let output: string[] = [];
    formatImports(inputPath, input, verbose, s => output.push(s));

    let expectedOutput = fs.readFileSync(inputPath + '.expected').toString();
    expect(output.join('')).toEqual(expectedOutput);

    if (verbose) {
      expect(console.log).toHaveBeenCalled();
    } else {
      expect(console.log).not.toHaveBeenCalled();
    }
  });
}

describe('Formatter suite', () => {
  defineTest('Single identifiers', 'spec/support/test.ts', true);
  defineTest('Multiple identifiers', 'spec/support/test2.ts', false);
  defineTest('Code before import section', 'spec/support/test3.ts', false);
});
