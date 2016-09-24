import {MainCodeWriter} from '../src/main-code-writer';
import {TextSlice} from '../src/ast-interfaces';
import {cutNewLines} from '../src/main-code-writer';

describe('MainCodeWriter suite', () => {
  it('cutNewLines', () => {
    expect(cutNewLines('')).toBe('');
    expect(cutNewLines('\n')).toBe('');
    expect(cutNewLines('\r')).toBe('');
    expect(cutNewLines('\r\n')).toBe('');
    expect(cutNewLines('\n\ncode')).toBe('code');
    expect(cutNewLines('\n\n  code')).toBe('  code');
    expect(cutNewLines('\r\n\r\n\tcode')).toBe('\tcode');
    expect(cutNewLines('\r\n \n\tcode')).toBe('\tcode');
    expect(cutNewLines('  \t  \r \r\t code')).toBe('\t code');
  });

  function defineTest(name: string, input: string, exptected: string, imports: TextSlice[]) {
    it(name, () => {
      let actual = '';
      let callback = (s) => actual += s;
      let writer = new MainCodeWriter(input, imports);
      writer.write(callback);
      expect(actual).toBe(exptected);
    });
  }

  defineTest('MainCodeWriter, no imports', '\n\ncode\nline 2', 'code\nline 2', []);
  defineTest('MainCodeWriter, no imports', '\nimport1\nimport2\n\ncode\nline 2', 'code\nline 2', [
    {pos: 1, end: 8},
    {pos: 9, end: 16}
  ]);

  it('making sure...', () => {
    expect('\nimport1\nimport2\n\ncode\nline 2'.slice(1, 8)).toBe('import1');
    expect('\nimport1\nimport2\n\ncode\nline 2'.slice(9, 16)).toBe('import2');

  });
});
