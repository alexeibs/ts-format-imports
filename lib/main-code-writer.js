"use strict";
var MainCodeWriter = (function () {
    function MainCodeWriter(fileContent, imports) {
        this.fileContent = fileContent;
        this.imports = imports;
    }
    MainCodeWriter.prototype.write = function (doWrite) {
        var originalDoWrite = doWrite;
        doWrite = function (s) {
            s = cutNewLines(s);
            if (s.length > 0) {
                originalDoWrite(s);
                doWrite = originalDoWrite;
            }
        };
        var nImports = this.imports.length;
        if (nImports === 0) {
            doWrite(this.fileContent);
        }
        else {
            var pos = 0;
            for (var i = 0; i < nImports; ++i) {
                var parsedImport = this.imports[i];
                doWrite(this.fileContent.slice(pos, parsedImport.pos));
                pos = parsedImport.end;
            }
            doWrite(this.fileContent.slice(pos));
        }
    };
    return MainCodeWriter;
}());
exports.MainCodeWriter = MainCodeWriter;
function cutNewLines(s) {
    var lineStart = 0;
    var lastChar = s.length;
    var isLineEnd = false;
    for (var i = 0; i < lastChar; ++i) {
        var ch = s[i];
        if (isLineEnd) {
            if (ch !== '\n' && ch !== '\r') {
                isLineEnd = false;
                lineStart = i;
                if (ch !== ' ' && ch !== '\t') {
                    break;
                }
            }
        }
        else {
            if (ch === '\n' || ch === '\r') {
                isLineEnd = true;
            }
            else if (ch !== ' ' && ch !== '\t') {
                break;
            }
        }
    }
    return isLineEnd ? '' : s.slice(lineStart);
}
exports.cutNewLines = cutNewLines;
