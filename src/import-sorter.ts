import {ImportEntry} from './ast-interfaces';

export interface Package {
  size: number;
  modules: {
    [path: string]: string[];
  };
}

export type PackageMap = { [name: string]: Package; };

export class PackageTree {
  putImport(entry: ImportEntry) {
    let packageName = getPackageName(entry.path);
    let packageEntry = this.packages[packageName];
    if (packageEntry === undefined) {
      packageEntry = {
        size: 0,
        modules: {}
      };
      this.packages[packageName] = packageEntry;
    }
    let moduleEntry = packageEntry.modules[entry.path];
    if (moduleEntry === undefined) {
      moduleEntry = [];
      packageEntry.modules[entry.path] = moduleEntry;
    }
    for (let i = 0, imax = entry.identifiers.length; i < imax; ++i) {
      if (pushToSortedArray(moduleEntry, entry.identifiers[i])) {
        ++packageEntry.size;
      }
    }
  }

  getPackages(): PackageMap {
    return this.packages;
  }

  private packages: PackageMap = {};
}

export class ImportSorter {
  putImport(entry: ImportEntry) {
    if (entry.isNamespace) {
      this.namespaces.putImport(entry);
    } else {
      this.identifiers.putImport(entry);
    }
  }

  getSortedGroups(): ImportEntry[][] {
    let groupsOfNamespaces = getGroupsFromTree(this.namespaces.getPackages(), true);
    let groupsOfIdentifiers = getGroupsFromTree(this.identifiers.getPackages(), false);
    return groupsOfNamespaces.concat(groupsOfIdentifiers);
  }

  private namespaces = new PackageTree;
  private identifiers = new PackageTree;
}

function getGroupsFromTree(packages: PackageMap, isNamespace: boolean): ImportEntry[][] {
  let packageNames = Object.keys(packages).sort();
  let sortedImports: ImportEntry[][] = [];
  for (let i = 0, imax = packageNames.length; i < imax; ++i) {
    let currentPackage = packages[packageNames[i]];
    let moduleNames = Object.keys(currentPackage.modules).sort();
    for (let j = 0, jmax = moduleNames.length; j < jmax; ++j) {
      let path = moduleNames[j];
      let identifiers = currentPackage.modules[moduleNames[j]];
      sortedImports.push([{path, isNamespace, identifiers}]);
    }
  }
  return sortedImports;
}

function getPackageName(path: string): string {
  let slash = path.indexOf('/');
  return slash === -1 ? path : path.slice(0, slash);
}

export function pushToSortedArray<T>(array: T[], item: T): boolean {
  let count = array.length;
  let first = 0;
  let it: number;
  let step: number;
  while (count > 0) {
    step = count >> 1;
    it = first + step;
    if (array[it] >= item) {
      count = step;
    } else {
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
