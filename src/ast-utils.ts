import * as ts from 'typescript';

import {ASTExplorer} from './ast-interfaces';

export function exploreSourceFile(node: ts.Node, explorers: ASTExplorer[]) {
  let nExplorers = explorers.length;
  for (let i = 0; i < nExplorers; ++i) {
    explorers[i].enterNode(node);
  }
  ts.forEachChild(node, child => exploreSourceFile(child, explorers));
  for (let i = 0; i < nExplorers; ++i) {
    explorers[i].leaveNode();
  }
}
