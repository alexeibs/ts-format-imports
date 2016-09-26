"use strict";
var ts = require('typescript');
var ast_printer_1 = require('./ast-printer');
var ast_utils_1 = require('./ast-utils');
var import_group_writer_1 = require('./import-group-writer');
var import_parser_1 = require('./import-parser');
var import_sorter_1 = require('./import-sorter');
var main_code_writer_1 = require('./main-code-writer');
function formatImports(filename, content, verbose, doWrite) {
    var sourceFile = ts.createSourceFile(filename, content, ts.ScriptTarget.ES5, true);
    var parser = new import_parser_1.ImportParser(content);
    var explorers = [parser];
    if (verbose) {
        explorers.push(new ast_printer_1.ASTPrinter(sourceFile));
    }
    ast_utils_1.exploreSourceFile(sourceFile, explorers);
    var imports = parser.getImports();
    var sorter = new import_sorter_1.ImportSorter;
    for (var i = 0, imax = imports.length; i < imax; ++i) {
        sorter.putImport(imports[i]);
    }
    var mainCode = new main_code_writer_1.MainCodeWriter(content, imports);
    mainCode.writeHeader(doWrite);
    var groupedImports = sorter.getSortedGroups();
    for (var i = 0, imax = groupedImports.length; i < imax; ++i) {
        import_group_writer_1.writeImportGroup(groupedImports[i], doWrite);
        doWrite('\n');
    }
    mainCode.write(doWrite);
}
exports.formatImports = formatImports;
