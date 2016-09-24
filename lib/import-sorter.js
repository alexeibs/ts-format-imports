"use strict";
var PackageTree = (function () {
    function PackageTree() {
        this.packages = {};
    }
    PackageTree.prototype.putImport = function (entry) {
        var packageName = getPackageName(entry.path);
        var packageEntry = this.packages[packageName];
        if (packageEntry === undefined) {
            packageEntry = {
                size: 0,
                modules: {}
            };
            this.packages[packageName] = packageEntry;
        }
        var moduleEntry = packageEntry.modules[entry.path];
        if (moduleEntry === undefined) {
            moduleEntry = [];
            packageEntry.modules[entry.path] = moduleEntry;
        }
        for (var i = 0, imax = entry.identifiers.length; i < imax; ++i) {
            if (pushToSortedArray(moduleEntry, entry.identifiers[i])) {
                ++packageEntry.size;
            }
        }
    };
    PackageTree.prototype.getPackages = function () {
        return this.packages;
    };
    return PackageTree;
}());
exports.PackageTree = PackageTree;
var ImportSorter = (function () {
    function ImportSorter() {
        this.namespaces = new PackageTree;
        this.identifiers = new PackageTree;
    }
    ImportSorter.prototype.putImport = function (entry) {
        if (entry.isNamespace) {
            this.namespaces.putImport(entry);
        }
        else {
            this.identifiers.putImport(entry);
        }
    };
    ImportSorter.prototype.getSortedGroups = function () {
        var groupsOfNamespaces = getGroupsFromTree(this.namespaces.getPackages(), true);
        var groupsOfIdentifiers = getGroupsFromTree(this.identifiers.getPackages(), false);
        return groupsOfNamespaces.concat(groupsOfIdentifiers);
    };
    return ImportSorter;
}());
exports.ImportSorter = ImportSorter;
function getGroupsFromTree(packages, isNamespace) {
    var packageNames = Object.keys(packages).sort();
    var sortedImports = [];
    for (var i = 0, imax = packageNames.length; i < imax; ++i) {
        var currentPackage = packages[packageNames[i]];
        var moduleNames = Object.keys(currentPackage.modules).sort();
        for (var j = 0, jmax = moduleNames.length; j < jmax; ++j) {
            var path = moduleNames[j];
            var identifiers = currentPackage.modules[moduleNames[j]];
            sortedImports.push([{ path: path, isNamespace: isNamespace, identifiers: identifiers }]);
        }
    }
    return sortedImports;
}
function getPackageName(path) {
    var slash = path.indexOf('/');
    return slash === -1 ? path : path.slice(0, slash);
}
function pushToSortedArray(array, item) {
    var count = array.length;
    var first = 0;
    var it;
    var step;
    while (count > 0) {
        step = count >> 1;
        it = first + step;
        if (array[it] >= item) {
            count = step;
        }
        else {
            first = ++it;
            count -= step + 1;
        }
    }
    if (first < array.length && array[first] === item) {
        return false;
    }
    array.splice(first, 0, item);
    return true;
}
exports.pushToSortedArray = pushToSortedArray;
