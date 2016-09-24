import * as ts from 'typescript';

export interface TextSlice {
  pos: number;
  end: number;
}

export interface ImportEntry {
  isNamespace: boolean;
  identifiers: string[];
  path: string;
}

export interface ParsedImport extends TextSlice, ImportEntry {}

export interface ASTExplorer {
  enterNode(node: ts.Node);
  leaveNode();
}
