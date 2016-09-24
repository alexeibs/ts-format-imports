import {closeSync} from 'fs';
import {openSync} from 'fs';
import {readFileSync} from 'fs';
import {writeSync} from 'fs';

import {formatImports} from './formatter';

function run(fileNames: string[]) {
  fileNames.forEach(fileName => {
      let fileContent = readFileSync(fileName).toString();
      let outFile: any = openSync(fileName + '.organized', 'w');
      formatImports(fileName, fileContent, false, data => {
        writeSync(outFile, data);
      });
      closeSync(outFile);
  });
}

run(process.argv.slice(2));
