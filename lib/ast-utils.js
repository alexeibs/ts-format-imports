"use strict";
var ts = require('typescript');
function exploreSourceFile(node, explorers) {
    var nExplorers = explorers.length;
    for (var i = 0; i < nExplorers; ++i) {
        explorers[i].enterNode(node);
    }
    ts.forEachChild(node, function (child) { return exploreSourceFile(child, explorers); });
    for (var i = 0; i < nExplorers; ++i) {
        explorers[i].leaveNode();
    }
}
exports.exploreSourceFile = exploreSourceFile;
