#!/usr/bin/env node

"use strict";
var fs_1 = require('fs');
var fs_2 = require('fs');
var fs_3 = require('fs');
var fs_4 = require('fs');
var formatter_1 = require('./formatter');
function run(fileNames) {
    fileNames.forEach(function (fileName) {
        var fileContent = fs_3.readFileSync(fileName).toString();
        var outFile = fs_2.openSync(fileName + '.organized', 'w');
        formatter_1.formatImports(fileName, fileContent, false, function (data) {
            fs_4.writeSync(outFile, data);
        });
        fs_1.closeSync(outFile);
    });
}
run(process.argv.slice(2));
