import * as ts from 'typescript';

import {ASTExplorer} from './ast-interfaces';

export class ASTPrinter implements ASTExplorer {
  constructor(sourceFile: ts.SourceFile) {
    this.sourceFile = sourceFile;
  }

  enterNode(node: ts.Node) {
    this.print(node, ts.SyntaxKind[node.kind] + ' ' + node.pos + ' ' + (node.end - node.pos));
    this.padding += this.paddingIncrement;
  }
  leaveNode() {
    this.padding = this.padding.slice(0, this.padding.length - this.paddingIncrement.length);
  }

  private print(node: ts.Node, message: string) {
    let {line, character} = this.sourceFile.getLineAndCharacterOfPosition(node.getStart());
    console.log(
        `${this.padding}${this.sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
  }

  private padding: string = '';
  private paddingIncrement: string = '  ';
  private sourceFile: ts.SourceFile;
}
