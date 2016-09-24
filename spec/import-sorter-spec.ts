import {ImportSorter} from '../src/import-sorter';
import {PackageTree} from '../src/import-sorter';
import {pushToSortedArray} from '../src/import-sorter';

describe('ImportGroupBuilder suite', () => {
  it('pushToSortedArray', () => {
    let array: number[] = [];

    expect(pushToSortedArray(array, 10)).toBe(true);
    expect(array).toEqual([10]);

    expect(pushToSortedArray(array, 20)).toBe(true);
    expect(array).toEqual([10, 20]);

    expect(pushToSortedArray(array, 30)).toBe(true);
    expect(array).toEqual([10, 20, 30]);

    expect(pushToSortedArray(array, 0)).toBe(true);
    expect(array).toEqual([0, 10, 20, 30]);

    expect(pushToSortedArray(array, 15)).toBe(true);
    expect(array).toEqual([0, 10, 15, 20, 30]);

    expect(pushToSortedArray(array, 25)).toBe(true);
    expect(array).toEqual([0, 10, 15, 20, 25, 30]);

    expect(pushToSortedArray(array, 25)).toBe(false);
    expect(array).toEqual([0, 10, 15, 20, 25, 30]);

    expect(pushToSortedArray(array, 0)).toBe(false);
    expect(array).toEqual([0, 10, 15, 20, 25, 30]);

    expect(pushToSortedArray(array, 30)).toBe(false);
    expect(array).toEqual([0, 10, 15, 20, 25, 30]);
  });

  it('PackageTree', () => {
    let tree = new PackageTree;
    expect(tree.getPackages()).toEqual({});

    tree.putImport({
      path: 'util/string',
      isNamespace: false,
      identifiers: ['split']
    });
    expect(tree.getPackages()).toEqual({
      'util': {
        size: 1,
        modules: {
          'util/string': ['split']
        }
      }
    });

    tree.putImport({
      path: 'util/string',
      isNamespace: false,
      identifiers: ['search', 'split', 'replace']
    });
    expect(tree.getPackages()).toEqual({
      'util': {
        size: 3,
        modules: {
          'util/string': ['replace', 'search', 'split']
        }
      }
    });

    tree.putImport({
      path: 'arrays',
      isNamespace: true,
      identifiers: ['arr']
    });
    expect(tree.getPackages()).toEqual({
      'arrays': {
        size: 1,
        modules: {
          'arrays': ['arr']
        }
      },
      'util': {
        size: 3,
        modules: {
          'util/string': ['replace', 'search', 'split']
        }
      }
    });
  });

  it('ImportSorter', () => {
    let sorter = new ImportSorter;
    sorter.putImport({
      path: 'util/string',
      isNamespace: false,
      identifiers: ['search', 'split', 'replace']
    });
    sorter.putImport({
      path: 'util/math',
      isNamespace: false,
      identifiers: ['sin', 'cos']
    });
    sorter.putImport({
      path: 'filesystem',
      isNamespace: true,
      identifiers: ['fs']
    });

    expect(['a', 'b']).not.toEqual(['b', 'a']);

    expect(sorter.getSortedGroups()).toEqual([
      [{path: 'filesystem', identifiers: ['fs'], isNamespace: true}],
      [{path: 'util/math', identifiers: ['cos', 'sin'], isNamespace: false}],
      [{path: 'util/string', identifiers: ['replace', 'search', 'split'], isNamespace: false}]
    ]);
  });
});
