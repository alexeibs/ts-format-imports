"use strict";
function writeImportGroup(imports, doWrite) {
    var nImports = imports.length;
    for (var i = 0, imax = imports.length; i < imax; ++i) {
        var item = imports[i];
        if (item.isNamespace) {
            doWrite("import * as " + item.identifiers[0] + " from '" + item.path + "';\n");
        }
        else {
            for (var i_1 = 0, imax_1 = item.identifiers.length; i_1 < imax_1; ++i_1) {
                doWrite("import {" + item.identifiers[i_1] + "} from '" + item.path + "';\n");
            }
        }
    }
}
exports.writeImportGroup = writeImportGroup;
