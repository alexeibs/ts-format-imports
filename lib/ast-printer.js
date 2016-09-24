"use strict";
var ts = require('typescript');
var ASTPrinter = (function () {
    function ASTPrinter(sourceFile) {
        this.padding = '';
        this.paddingIncrement = '  ';
        this.sourceFile = sourceFile;
    }
    ASTPrinter.prototype.enterNode = function (node) {
        this.print(node, ts.SyntaxKind[node.kind] + ' ' + node.pos + ' ' + (node.end - node.pos));
        this.padding += this.paddingIncrement;
    };
    ASTPrinter.prototype.leaveNode = function () {
        this.padding = this.padding.slice(0, this.padding.length - this.paddingIncrement.length);
    };
    ASTPrinter.prototype.print = function (node, message) {
        var _a = this.sourceFile.getLineAndCharacterOfPosition(node.getStart()), line = _a.line, character = _a.character;
        console.log("" + this.padding + this.sourceFile.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message);
    };
    return ASTPrinter;
}());
exports.ASTPrinter = ASTPrinter;
