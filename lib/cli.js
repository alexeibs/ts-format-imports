#!/usr/bin/env node

"use strict";
var fs = require('fs');
var formatter = require('./formatter');

function run(fileNames) {
  fileNames.forEach(function(fileName) {
    var fileContent = fs.readFileSync(fileName).toString();
    var outFile = fs.openSync(fileName + '.organized', 'w');
    formatter.formatImports(fileName, fileContent, false, function(data) {
      fs.writeSync(outFile, data);
    });
    fs.closeSync(outFile);
  });
}
run(process.argv.slice(2));
