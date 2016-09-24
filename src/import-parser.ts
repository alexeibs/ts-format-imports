import * as ts from 'typescript';

import {ASTExplorer} from './ast-interfaces';
import {ParsedImport} from './ast-interfaces';

export class ImportParser implements ASTExplorer {
  enterNode(node: ts.Node) {
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
    } else {
      switch (node.kind) {
        case ts.SyntaxKind.Identifier:
          this.current.identifiers.push((<ts.Identifier>node).text);
          break;
        case ts.SyntaxKind.StringLiteral:
          this.current.path = (<ts.StringLiteral>node).text;
          break;
        case ts.SyntaxKind.NamespaceImport:
          this.current.isNamespace = true;
          break;
      }
    }
  }

  leaveNode() {
    if (this.depth === this.importDepth) {
      this.imports.push(this.current);
      this.current = null;
      this.importDepth = -1;
    }
    --this.depth;
  }

  getImports(): ParsedImport[] {
    return this.imports;
  }

  private imports: ParsedImport[] = [];
  private current: ParsedImport = null;
  private depth: number = 0;
  private importDepth: number = -1;
}
