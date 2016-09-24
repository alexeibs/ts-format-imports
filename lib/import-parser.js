"use strict";
var ts = require('typescript');
var ImportParser = (function () {
    function ImportParser() {
        this.imports = [];
        this.current = null;
        this.depth = 0;
        this.importDepth = -1;
    }
    ImportParser.prototype.enterNode = function (node) {
        ++this.depth;
        if (this.current === null) {
            if (node.kind === ts.SyntaxKind.ImportDeclaration) {
                this.current = {
                    pos: node.pos,
                    end: node.end,
                    isNamespace: false,
                    identifiers: [],
                    path: ''
                };
                this.importDepth = this.depth;
            }
        }
        else {
            switch (node.kind) {
                case ts.SyntaxKind.Identifier:
                    this.current.identifiers.push(node.text);
                    break;
                case ts.SyntaxKind.StringLiteral:
                    this.current.path = node.text;
                    break;
                case ts.SyntaxKind.NamespaceImport:
                    this.current.isNamespace = true;
                    break;
            }
        }
    };
    ImportParser.prototype.leaveNode = function () {
        if (this.depth === this.importDepth) {
            this.imports.push(this.current);
            this.current = null;
            this.importDepth = -1;
        }
        --this.depth;
    };
    ImportParser.prototype.getImports = function () {
        return this.imports;
    };
    return ImportParser;
}());
exports.ImportParser = ImportParser;
