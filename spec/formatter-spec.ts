import * as fs from 'fs';

import {formatImports} from '../src/formatter';

function defineTest(name: string, inputPath: string, expectPath: string, verbose: boolean) {
  it(name, () => {
    spyOn(console, 'log');

    let input = fs.readFileSync(inputPath).toString();
    let output: string[] = [];
    formatImports(inputPath, input, verbose, s => output.push(s));

    let expectedOutput = fs.readFileSync(expectPath).toString();
    expect(output.join('')).toEqual(expectedOutput);

    if (verbose) {
      expect(console.log).toHaveBeenCalled();
    } else {
      expect(console.log).not.toHaveBeenCalled();
    }
  });
}

describe('Formatter suite', () => {
  defineTest('Single identifiers', 'spec/support/test.ts', 'spec/support/test.ts.expected', true);
  defineTest('Single identifiers', 'spec/support/test2.ts', 'spec/support/test2.ts.expected', false);
});
