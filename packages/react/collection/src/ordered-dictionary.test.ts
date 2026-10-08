import { describe, expect, it } from 'vitest';
import { OrderedDict } from './ordered-dictionary';

function expectEntries<K, V>(dict: OrderedDict<K, V>, expected: Array<[K, V]>) {
  // native Map iteration order and index-based access are tracked separately,
  // so both must be checked
  expect([...dict.entries()]).toEqual(expected);
  expect(Array.from({ length: dict.size }, (_, index) => dict.entryAt(index))).toEqual(expected);
}

describe('OrderedDict', () => {
  describe('constructor', () => {
    it('accepts any iterable and keeps the last value for duplicate keys', () => {
      expectEntries(
        new OrderedDict(
          new Map([
            ['a', 1],
            ['b', 2],
          ]),
        ),
        [
          ['a', 1],
          ['b', 2],
        ],
      );
      expectEntries(
        new OrderedDict([
          ['a', 1],
          ['b', 2],
          ['a', 3],
        ]),
        [
          ['a', 3],
          ['b', 2],
        ],
      );
    });
  });

  describe('size', () => {
    it('tracks the number of entries', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(dict.size).toBe(3);
      dict.delete('b');
      expect(dict.size).toBe(2);
      dict.set('d', 4);
      expect(dict.size).toBe(3);
      dict.set('d', 5);
      expect(dict.size).toBe(3);
      dict.clear();
      expect(dict.size).toBe(0);
    });
  });

  describe('get', () => {
    it('returns the value for the given key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(dict.get('a')).toBe(1);
      expect(dict.get('b')).toBe(2);
      expect(dict.get('d')).toBeUndefined();
    });
  });

  describe('set', () => {
    it('updates the value for the given key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      dict.set('b', 4);
      dict.set('d', 5);
      dict.set('a', 6);
      expectEntries(dict, [
        ['a', 6],
        ['b', 4],
        ['c', 3],
        ['d', 5],
      ]);
    });

    it('re-adding a deleted key appends it', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      dict.delete('a');
      dict.set('a', 10);
      expectEntries(dict, [
        ['b', 2],
        ['c', 3],
        ['a', 10],
      ]);
    });
  });

  describe('at', () => {
    it('returns the value at the given index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(dict.at(0)).toBe(1);
      expect(dict.at(1)).toBe(2);
      expect(dict.at(-1)).toBe(3);
      expect(dict.at(-3)).toBe(1);
      expect(dict.at(3)).toBeUndefined();
      expect(dict.at(-4)).toBeUndefined();
    });
  });

  describe('keyAt', () => {
    it('returns the key at the given index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(dict.keyAt(0)).toBe('a');
      expect(dict.keyAt(2)).toBe('c');
      expect(dict.keyAt(-1)).toBe('c');
      expect(dict.keyAt(-3)).toBe('a');
      expect(dict.keyAt(3)).toBeUndefined();
      expect(dict.keyAt(-4)).toBeUndefined();
    });
  });

  describe('entryAt', () => {
    it('returns the entry at the given index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(dict.entryAt(0)).toEqual(['a', 1]);
      expect(dict.entryAt(1)).toEqual(['b', 2]);
      expect(dict.entryAt(-2)).toEqual(['b', 2]);
      expect(dict.entryAt(-1)).toEqual(['c', 3]);
      expect(dict.entryAt(10)).toBeUndefined();
      expect(dict.entryAt(-10)).toBeUndefined();
    });
  });

  describe('indexOf', () => {
    it('returns the index of the given key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(dict.indexOf('a')).toBe(0);
      expect(dict.indexOf('c')).toBe(2);
      expect(dict.indexOf('z')).toBe(-1);
    });
  });

  describe('from', () => {
    it('returns the value at an offset from the given key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(dict.from('b', 1)).toBe(3);
      expect(dict.from('b', -1)).toBe(1);
      expect(dict.from('b', 0)).toBe(2);
      expect(dict.from('z', 1)).toBeUndefined();
    });

    it('clamps out-of-range offsets rather than wrapping around', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(dict.from('c', 1)).toBe(3);
      expect(dict.from('a', -5)).toBe(1);
    });
  });

  describe('keyFrom', () => {
    it('returns the key at an offset from the given key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(dict.keyFrom('b', 1)).toBe('c');
      expect(dict.keyFrom('b', -1)).toBe('a');
      expect(dict.keyFrom('b', 0)).toBe('b');
      expect(dict.keyFrom('z', 1)).toBeUndefined();
    });

    it('clamps out-of-range offsets rather than wrapping around', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(dict.keyFrom('c', 1)).toBe('c');
      expect(dict.keyFrom('a', -5)).toBe('a');
    });
  });

  describe('insert', () => {
    it('updates the value of an existing key at its current index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      dict.insert(1, 'b', 4);
      expectEntries(dict, [
        ['a', 1],
        ['b', 4],
        ['c', 3],
      ]);
    });

    it('moves an existing key to a lower index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      dict.insert(0, 'c', 30);
      expectEntries(dict, [
        ['c', 30],
        ['a', 1],
        ['b', 2],
        ['d', 4],
      ]);
    });

    it('moves an existing key to a higher index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      dict.insert(2, 'a', 10);
      expectEntries(dict, [
        ['b', 2],
        ['c', 3],
        ['a', 10],
        ['d', 4],
      ]);
    });

    it('moves an existing key to the last index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      dict.insert(3, 'a', 10);
      expectEntries(dict, [
        ['b', 2],
        ['c', 3],
        ['d', 4],
        ['a', 10],
      ]);
    });

    it('moves an existing key to the end for an out-of-range index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      dict.insert(20, 'a', 10);
      expectEntries(dict, [
        ['b', 2],
        ['c', 3],
        ['a', 10],
      ]);
    });

    it('moves an existing key relative to the end for a negative index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      dict.insert(-1, 'a', 10);
      expectEntries(dict, [
        ['b', 2],
        ['c', 3],
        ['d', 4],
        ['a', 10],
      ]);

      dict.insert(-2, 'a', 100);
      expectEntries(dict, [
        ['b', 2],
        ['c', 3],
        ['a', 100],
        ['d', 4],
      ]);
    });

    it('moves an existing key to the start for an out-of-range negative index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      dict.insert(-20, 'c', 30);
      expectEntries(dict, [
        ['c', 30],
        ['a', 1],
        ['b', 2],
      ]);
    });

    it('adds a new key at index 0', () => {
      const dict = new OrderedDict([
        ['b', 2],
        ['c', 3],
        ['e', 5],
      ]);
      dict.insert(0, 'a', 1);
      expectEntries(dict, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['e', 5],
      ]);
    });

    it('adds a new key in the middle and preserves every other value', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['d', 4],
        ['e', 5],
      ]);
      dict.insert(2, 'c', 3);
      expectEntries(dict, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
        ['e', 5],
      ]);
    });

    it('appends a new key at the size index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
      ]);
      dict.insert(2, 'c', 3);
      expectEntries(dict, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
    });

    it('appends a new key for an out-of-range index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      dict.insert(20, 'd', 4);
      expectEntries(dict, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
    });

    it('adds a new key relative to the end for a negative index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['e', 5],
      ]);
      dict.insert(-1, 'f', 6);
      expectEntries(dict, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['e', 5],
        ['f', 6],
      ]);

      dict.insert(-3, 'd', 4);
      expectEntries(dict, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
        ['e', 5],
        ['f', 6],
      ]);
    });

    it('prepends a new key for an out-of-range negative index', () => {
      const dict = new OrderedDict([
        ['b', 2],
        ['c', 3],
      ]);
      dict.insert(-20, 'a', 1);
      expectEntries(dict, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
    });

    it('truncates non-integer indices and treats NaN as 0', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
      ]);
      dict.insert(NaN, 'c', 3);
      dict.insert(1.9, 'd', 4);
      expectEntries(dict, [
        ['c', 3],
        ['d', 4],
        ['a', 1],
        ['b', 2],
      ]);
    });

    it('inserts into an empty dictionary', () => {
      const dict = new OrderedDict<string, number>();
      dict.insert(5, 'a', 1);
      dict.insert(-5, 'b', 2);
      expectEntries(dict, [
        ['b', 2],
        ['a', 1],
      ]);
    });

    it('keeps every other entry intact for any index', () => {
      const initialEntries: Array<[string, number]> = [
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ];
      for (const key of ['a', 'b', 'c', 'd', 'x']) {
        for (let index = -6; index <= 6; index++) {
          const dict = new OrderedDict(initialEntries);
          dict.insert(index, key, 99);

          const isNewKey = key === 'x';
          expect(dict.size).toBe(isNewKey ? 5 : 4);
          expect(dict.get(key)).toBe(99);
          expect([...dict.entries()].filter(([entryKey]) => entryKey !== key)).toEqual(
            initialEntries.filter(([entryKey]) => entryKey !== key),
          );
          expect([...dict.keys()]).toEqual(
            Array.from({ length: dict.size }, (_, keyIndex) => dict.keyAt(keyIndex)),
          );
        }
      }
    });

    it('returns the same instance', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const next = dict.insert(0, 'b', 1);
      expect(next).toBe(dict);
    });
  });

  describe('setBefore', () => {
    it('adds a new key before the target key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['c', 3],
      ]);
      dict.setBefore('c', 'b', 2);
      expectEntries(dict, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
    });

    it('moves an existing key that comes before the target key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      dict.setBefore('d', 'a', 10);
      expectEntries(dict, [
        ['b', 2],
        ['c', 3],
        ['a', 10],
        ['d', 4],
      ]);
    });

    it('moves an existing key that comes after the target key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      dict.setBefore('a', 'd', 40);
      expectEntries(dict, [
        ['d', 40],
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
    });

    it('does nothing when the target key is missing', () => {
      const dict = new OrderedDict([['a', 1]]);
      dict.setBefore('z', 'b', 2);
      expectEntries(dict, [['a', 1]]);
    });
  });

  describe('setAfter', () => {
    it('adds a new key after the target key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['c', 3],
      ]);
      dict.setAfter('a', 'b', 2);
      dict.setAfter('c', 'd', 4);
      expectEntries(dict, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
    });

    it('moves an existing key that comes before the target key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      dict.setAfter('d', 'a', 10);
      expectEntries(dict, [
        ['b', 2],
        ['c', 3],
        ['d', 4],
        ['a', 10],
      ]);
    });

    it('moves an existing key that comes after the target key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      dict.setAfter('a', 'd', 40);
      expectEntries(dict, [
        ['a', 1],
        ['d', 40],
        ['b', 2],
        ['c', 3],
      ]);
    });

    it('updates the value in place when the key is the target key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
      ]);
      dict.setAfter('a', 'a', 10);
      expectEntries(dict, [
        ['a', 10],
        ['b', 2],
      ]);
    });

    it('does nothing when the target key is missing', () => {
      const dict = new OrderedDict([['a', 1]]);
      dict.setAfter('z', 'b', 2);
      expectEntries(dict, [['a', 1]]);
    });
  });

  describe('with', () => {
    it('returns a new instance', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const next = dict.with(0, 'b', 1);
      expect(next).not.toBe(dict);
    });

    it('inserts into the copy without modifying the original', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const next = dict.with(0, 'b', 1);
      expectEntries(dict, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expectEntries(next, [
        ['b', 1],
        ['a', 1],
        ['c', 3],
      ]);
    });
  });

  describe('first', () => {
    it('returns the first entry', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      expect(dict.first()).toEqual(['a', 1]);
    });

    it('returns undefined when empty', () => {
      const dict = new OrderedDict();
      expect(dict.first()).toBeUndefined();
    });
  });

  describe('last', () => {
    it('returns the last entry', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      expect(dict.last()).toEqual(['d', 4]);
    });

    it('returns undefined when empty', () => {
      const dict = new OrderedDict();
      expect(dict.last()).toBeUndefined();
    });
  });

  describe('before', () => {
    it('returns the entry before the given key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      expect(dict.before('b')).toEqual(['a', 1]);
      expect(dict.before('a')).toBeUndefined();
      expect(dict.before('z')).toBeUndefined();
    });
  });

  describe('after', () => {
    it('returns the entry after the given key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      expect(dict.after('b')).toEqual(['c', 3]);
      expect(dict.after('d')).toBeUndefined();
      expect(dict.after('z')).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('removes every entry', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
      ]);
      dict.clear();
      expect(dict.size).toBe(0);
      expect(dict.get('a')).toBeUndefined();
      expect(dict.get('b')).toBeUndefined();
      expect(dict.at(0)).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('removes an existing key and returns true', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
      ]);
      const status = dict.delete('a');
      expect(status).toBe(true);
      expect(dict.size).toBe(1);
      expect(dict.get('a')).toBeUndefined();
      expect(dict.at(0)).toBe(2);
    });

    it('returns false for a missing key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
      ]);
      const status = dict.delete('c');
      expect(status).toBe(false);
      expect(dict.size).toBe(2);
      expect(dict.at(0)).toBe(1);
    });
  });

  describe('deleteAt', () => {
    it('deletes the entry at a non-negative index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      const status = dict.deleteAt(0);
      expect(status).toBe(true);
      expect(dict.size).toBe(3);
      expect(dict.get('a')).toBeUndefined();

      dict.deleteAt(1);
      expect(dict.size).toBe(2);
      expect(dict.get('c')).toBeUndefined();
    });

    it('deletes the entry at a negative index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      const status = dict.deleteAt(-1);
      expect(status).toBe(true);
      expect(dict.size).toBe(3);
      expect(dict.get('d')).toBeUndefined();

      dict.deleteAt(-2);
      expect(dict.size).toBe(2);
      expect(dict.get('b')).toBeUndefined();
    });

    it('returns false for an out-of-range index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      let status = dict.deleteAt(20);
      expect(status).toBe(false);
      expect(dict.size).toBe(4);
      status = dict.deleteAt(-20);
      expect(status).toBe(false);
      expect(dict.size).toBe(4);
    });
  });

  describe('find', () => {
    it('finds an entry by key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.find(([key]) => key === 'b');
      expect(result).toEqual(['b', 2]);
    });

    it('returns undefined when no key matches', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.find(([key]) => key === 'd');
      expect(result).toBeUndefined();
    });

    it('finds an entry by value', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.find(([, value]) => value === 3);
      expect(result).toEqual(['c', 3]);
    });

    it('returns undefined when no value matches', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.find(([, value]) => value === 4);
      expect(result).toBeUndefined();
    });

    it('calls the predicate with thisArg', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.find(function (this: number, [, value]) {
        return value === this;
      }, 1);
      expect(result).toEqual(['a', 1]);
    });

    it('calls the predicate without a this value when thisArg is omitted', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.find(function (this: unknown, _, dictionary) {
        return dictionary === this;
      });
      expect(result).toBeUndefined();
    });
  });

  describe('findIndex', () => {
    it('finds an index by key', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.findIndex(([key]) => key === 'b');
      expect(result).toBe(1);
    });

    it('returns -1 when no key matches', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.findIndex(([key]) => key === 'd');
      expect(result).toBe(-1);
    });

    it('finds an index by value', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.findIndex(([, value]) => value === 3);
      expect(result).toBe(2);
    });

    it('returns -1 when no value matches', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.findIndex(([, value]) => value === 4);
      expect(result).toBe(-1);
    });

    it('calls the predicate with thisArg', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const thisArg = { key: 'b' };
      const result = dict.findIndex(function (this: typeof thisArg, [key]) {
        return key === this.key;
      }, thisArg);
      expect(result).toBe(1);
    });

    it('calls the predicate without a this value when thisArg is omitted', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(() => {
        dict.findIndex(function (this: unknown, [, value]) {
          return value === (this as any).get('b');
        });
      }).toThrow();
    });
  });

  describe('filter', () => {
    it('returns a new instance', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.filter(() => true);
      expect(result).not.toBe(dict);
    });

    it('keeps the entries that match the predicate', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.filter(([key, value]) => key === 'b' || value === 3);
      expect(result).toEqual(
        new OrderedDict([
          ['b', 2],
          ['c', 3],
        ]),
      );

      const result2 = dict.filter(([key]) => key === 'd');
      expect(result2).toEqual(new OrderedDict());

      const result3 = dict.filter(([, value]) => value === 3);
      expect(result3).toEqual(new OrderedDict([['c', 3]]));

      const result4 = dict.filter(([, value]) => value === 4);
      expect(result4).toEqual(new OrderedDict());
    });

    it('preserves order', () => {
      const dict = new OrderedDict([
        ['c', 3],
        ['a', 1],
        ['b', 2],
      ]);
      expectEntries(
        dict.filter(([key]) => key !== 'a'),
        [
          ['c', 3],
          ['b', 2],
        ],
      );
    });
  });

  describe('some', () => {
    it('returns true when a key matches', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.some(([key]) => key === 'b');
      expect(result).toBe(true);
    });

    it('returns false when no key matches', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.some(([key]) => key === 'd');
      expect(result).toBe(false);
    });

    it('returns true when a value matches', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.some(([, value]) => value === 2);
      expect(result).toBe(true);
    });

    it('returns false when no value matches', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.some(([, value]) => value === 4);
      expect(result).toBe(false);
    });

    it('calls the predicate with thisArg', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.some(function (this: string, [key]) {
        return key === this;
      }, 'b');
      expect(result).toBe(true);
    });

    it('calls the predicate without a this value when thisArg is omitted', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(() =>
        dict.some(function (this: unknown, [, value]) {
          return (this as any).get('b') === value;
        }),
      ).toThrow();
    });
  });

  describe('every', () => {
    it('returns true when every key matches', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.every(([key]) => key.length === 1);
      expect(result).toBe(true);
    });

    it('returns false when any key does not match', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.every(([key]) => key === 'a');
      expect(result).toBe(false);
    });

    it('returns true when every value matches', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.every(([, value]) => value > 0);
      expect(result).toBe(true);
    });

    it('returns false when any value does not match', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.every(([, value]) => value > 1);
      expect(result).toBe(false);
    });

    it('calls the predicate with thisArg', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.every(function (this: string, [key]) {
        return typeof key === typeof this;
      }, 'b');
      expect(result).toBe(true);
    });

    it('calls the predicate without a this value when thisArg is omitted', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(() =>
        dict.every(function (this: unknown, [, value]) {
          return typeof (this as any).get('b') === typeof value;
        }),
      ).toThrow();
    });
  });

  describe('map', () => {
    it('maps values into a new dictionary with the same keys', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
      ]);
      const result = dict.map(([key, value], index) => `${key}${value * 10}:${index}`);
      expect(result).not.toBe(dict);
      expectEntries(result, [
        ['a', 'a10:0'],
        ['b', 'b20:1'],
      ]);
    });
  });

  describe('reduce', () => {
    it('starts with the first entry when no initial value is given', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const calls: unknown[] = [];
      const result = dict.reduce((accumulator, entry, index) => {
        calls.push([accumulator, entry, index]);
        return [accumulator[0] + entry[0], accumulator[1] + entry[1]];
      });
      expect(result).toEqual(['abc', 6]);
      expect(calls).toEqual([
        [['a', 1], ['b', 2], 1],
        [['ab', 3], ['c', 3], 2],
      ]);
    });

    it('starts with the initial value', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.reduce((accumulator, [key]) => accumulator + key, '>');
      expect(result).toBe('>abc');
    });

    it('uses a nullish initial value instead of the first entry', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(
        dict.reduce<string | null>(
          (accumulator, [key]) => (accumulator === null ? `null:${key}` : accumulator + key),
          null,
        ),
      ).toBe('null:abc');
      expect(
        dict.reduce<string | undefined>((accumulator, [key]) => `${accumulator}${key}`, undefined),
      ).toBe('undefinedabc');
    });

    it('throws for an empty dictionary without an initial value', () => {
      const dict = new OrderedDict<string, number>();
      expect(() => dict.reduce((accumulator) => accumulator)).toThrow(TypeError);
    });

    it('returns the initial value for an empty dictionary', () => {
      const dict = new OrderedDict<string, number>();
      expect(dict.reduce((accumulator) => accumulator, 0)).toBe(0);
    });
  });

  describe('reduceRight', () => {
    it('starts with the last entry when no initial value is given', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const calls: unknown[] = [];
      const result = dict.reduceRight((accumulator, entry, index) => {
        calls.push([accumulator, entry, index]);
        return [accumulator[0] + entry[0], accumulator[1] + entry[1]];
      });
      expect(result).toEqual(['cba', 6]);
      expect(calls).toEqual([
        [['c', 3], ['b', 2], 1],
        [['cb', 5], ['a', 1], 0],
      ]);
    });

    it('starts with the initial value', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.reduceRight(
        (accumulator, [key, value]) => accumulator + key + value,
        '>',
      );
      expect(result).toBe('>c3b2a1');
    });

    it('uses a nullish initial value instead of the last entry', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expect(
        dict.reduceRight<string | null>(
          (accumulator, [key]) => (accumulator === null ? `null:${key}` : accumulator + key),
          null,
        ),
      ).toBe('null:cba');
    });

    it('throws for an empty dictionary without an initial value', () => {
      const dict = new OrderedDict<string, number>();
      expect(() => dict.reduceRight((accumulator) => accumulator)).toThrow(TypeError);
    });

    it('returns the initial value for an empty dictionary', () => {
      const dict = new OrderedDict<string, number>();
      expect(dict.reduceRight((accumulator) => accumulator, 0)).toBe(0);
    });
  });

  describe('slice', () => {
    it('copies every entry when called without arguments', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      const result = dict.slice();
      expect(result).not.toBe(dict);
      expectEntries(result, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
    });

    it('slices from a start index to the end', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      expectEntries(dict.slice(2), [
        ['c', 3],
        ['d', 4],
      ]);
      expectEntries(dict.slice(-1), [['d', 4]]);
      expectEntries(dict.slice(-10), [
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      expectEntries(dict.slice(10), []);
    });

    it('slices between a start and end index', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]);
      expectEntries(dict.slice(1, 3), [
        ['b', 2],
        ['c', 3],
      ]);
      expectEntries(dict.slice(0, -1), [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expectEntries(dict.slice(-3, -1), [
        ['b', 2],
        ['c', 3],
      ]);
      expectEntries(dict.slice(0, 0), []);
      expectEntries(dict.slice(3, 1), []);
      expectEntries(dict.slice(2, 10), [
        ['c', 3],
        ['d', 4],
      ]);
    });
  });

  describe('sort', () => {
    it('sorts the dictionary in place', () => {
      const dict = new OrderedDict([
        ['b', 2],
        ['c', 3],
        ['a', 1],
      ]);
      dict.sort(([, a], [, b]) => a - b);
      expectEntries(dict, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
    });

    it('returns the same instance', () => {
      const dict = new OrderedDict([
        ['b', 2],
        ['a', 1],
      ]);
      const result = dict.sort(([, a], [, b]) => a - b);
      expect(result).toBe(dict);
    });

    it('sorts by key when using a key comparator', () => {
      const dict = new OrderedDict([
        ['c', 1],
        ['a', 2],
        ['b', 3],
      ]);
      dict.sort(([a], [b]) => a.localeCompare(b));
      expectEntries(dict, [
        ['a', 2],
        ['b', 3],
        ['c', 1],
      ]);
    });

    it('throws without a compare function and leaves the dictionary unchanged', () => {
      const dict = new OrderedDict([
        ['b', 2],
        ['a', 1],
      ]);
      // @ts-expect-error compareFn is required
      expect(() => dict.sort()).toThrow(
        new TypeError('OrderedDict.sort requires a compare function'),
      );
      // @ts-expect-error compareFn must be a function
      expect(() => dict.sort(null)).toThrow(TypeError);
      expectEntries(dict, [
        ['b', 2],
        ['a', 1],
      ]);
    });

    it('keeps the existing order of entries that compare as equal', () => {
      const dict = new OrderedDict([
        ['d', 2],
        ['a', 1],
        ['c', 2],
        ['b', 1],
      ]);
      dict.sort(([, a], [, b]) => a - b);
      expectEntries(dict, [
        ['a', 1],
        ['b', 1],
        ['d', 2],
        ['c', 2],
      ]);
    });

    it('leaves an empty dictionary empty', () => {
      const dict = new OrderedDict<string, number>();
      dict.sort(([, a], [, b]) => a - b);
      expectEntries(dict, []);
    });

    it('leaves the dictionary unchanged when the comparator throws', () => {
      const dict = new OrderedDict([
        ['b', 2],
        ['a', 1],
      ]);
      expect(() =>
        dict.sort(() => {
          throw new Error('comparator failed');
        }),
      ).toThrow('comparator failed');
      expectEntries(dict, [
        ['b', 2],
        ['a', 1],
      ]);
    });

    it('appends keys added after sorting', () => {
      const dict = new OrderedDict([
        ['b', 2],
        ['a', 1],
      ]);
      dict.sort(([, a], [, b]) => a - b);
      dict.set('z', 0);
      dict.set('a', 10);
      expectEntries(dict, [
        ['a', 10],
        ['b', 2],
        ['z', 0],
      ]);
    });
  });

  describe('toSorted', () => {
    it('returns a sorted copy without modifying the original', () => {
      const dict = new OrderedDict([
        ['b', 2],
        ['c', 3],
        ['a', 1],
      ]);
      const result = dict.toSorted(([, a], [, b]) => a - b);
      expectEntries(result, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expectEntries(dict, [
        ['b', 2],
        ['c', 3],
        ['a', 1],
      ]);
    });

    it('throws without a compare function', () => {
      const dict = new OrderedDict([['a', 1]]);
      // @ts-expect-error compareFn is required
      expect(() => dict.toSorted()).toThrow(
        new TypeError('OrderedDict.toSorted requires a compare function'),
      );
      // @ts-expect-error compareFn must be a function
      expect(() => dict.toSorted(null)).toThrow(TypeError);
    });
  });

  describe('toReversed', () => {
    it('returns a reversed copy without modifying the original', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expectEntries(dict.toReversed(), [
        ['c', 3],
        ['b', 2],
        ['a', 1],
      ]);
      expectEntries(dict, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
    });
  });

  describe('toSpliced', () => {
    it('returns a spliced copy without modifying the original', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      expectEntries(dict.toSpliced(1, 1), [
        ['a', 1],
        ['c', 3],
      ]);
      expectEntries(dict.toSpliced(1, 0, ['x', 9]), [
        ['a', 1],
        ['x', 9],
        ['b', 2],
        ['c', 3],
      ]);
      expectEntries(dict, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
    });
  });
});
