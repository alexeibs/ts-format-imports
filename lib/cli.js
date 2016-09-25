#!/usr/bin/env node

"use strict";
var fs = require('fs');
var fsExtra = require('fs-extra');
var temp = require('temp');
var formatter = require('./formatter');

function run(fileNames) {
  fileNames.forEach(function(fileName) {
    var fileContent = fs.readFileSync(fileName).toString();
    var outFile = temp.openSync('ts-format-imports', 'w');
    formatter.formatImports(fileName, fileContent, false, function(data) {
      fs.writeSync(outFile.fd, data);
    });
    fs.closeSync(outFile.fd);
    fsExtra.move(outFile.path, fileName, {clobber: true}, function(err) {
      if (err !== null) {
        console.error('Failed to rewrite ' + fileName + '\n' + err);
      }
    });
  });
}
run(process.argv.slice(2));
