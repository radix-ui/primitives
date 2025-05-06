import { describe, expect, test } from 'vitest';
import { OrderedDict } from './ordered-dictionary';

describe('OrderedDict', () => {
  test('size', () => {
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
    dict.clear();
    expect(dict.size).toBe(0);
  });

  test('get()', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    expect(dict.get('a')).toBe(1);
    expect(dict.get('b')).toBe(2);
    expect(dict.get('d')).toBeUndefined();
  });

  test('set()', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    dict.set('b', 4);
    expect(dict.get('b')).toBe(4);
    dict.set('d', 5);
    expect(dict.get('d')).toBe(5);
  });

  test('insert(): existing key at its current index', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    dict.insert(1, 'b', 4);
    expect(dict.get('b')).toBe(4);
  });

  test('insert(): existing key at a new index', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    dict.insert(0, 'b', 1);
    // sets the correct value
    expect(dict.get('b')).toBe(1);

    // moves to the inserted index
    expect(dict.at(0)).toBe(1);
    expect(dict.keyAt(0)).toBe('b');

    // previous item at the inserted index is moved up by one
    expect(dict.keyAt(1)).toBe('a');
    expect(dict.get('a')).toBe(1);
  });

  test('insert(): existing key at out-of-range index', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    dict.insert(20, 'd', 4);
    expect(dict.keyAt(3)).toBe('d');
    expect(dict.at(3)).toBe(4);
  });

  test('insert(): existing key at 0 index', () => {
    const dict = new OrderedDict([
      ['a', 0],
      ['b', 2],
      ['c', 3],
      ['e', 5],
    ]);
    dict.insert(0, 'a', 1);
    expect(dict.keyAt(0)).toBe('a');
    expect(dict.at(0)).toBe(1);
    expect(dict.keyAt(1)).toBe('b');
    expect(dict.at(1)).toBe(2);
    expect(dict.size).toBe(4);
  });

  test('insert(): new key at 0 index', () => {
    const dict = new OrderedDict([
      ['b', 2],
      ['c', 3],
      ['e', 5],
    ]);
    dict.insert(0, 'a', 1);
    expect(dict.keyAt(0)).toBe('a');
    expect(dict.at(0)).toBe(1);
    expect(dict.keyAt(1)).toBe('b');
    expect(dict.at(1)).toBe(2);
    expect(dict.size).toBe(4);
  });

  test('insert(): existing key at relative negative index', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
      ['e', 5],
      ['f', 4],
    ]);
    dict.insert(-1, 'f', 6);
    expect(dict.keyAt(-1)).toBe('f');
    expect(dict.at(-1)).toBe(6);
    expect(dict.size).toBe(5);
  });

  test('insert(): new key at relative negative index', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
      ['e', 5],
    ]);
    dict.insert(-1, 'f', 6);
    expect(dict.keyAt(-1)).toBe('f');
    expect(dict.at(0)).toBe(1);
    expect(dict.at(-1)).toBe(6);

    dict.insert(-3, 'd', 4);
    expect(dict.keyAt(3)).toBe('d');
    expect(dict.at(3)).toBe(4);
  });

  test('insert(): existing key at a new index', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    dict.insert(0, 'b', 1);
    expect(dict.get('b')).toBe(1);
    expect(dict.at(0)).toBe(1);
    expect(dict.keyAt(0)).toBe('b');
  });

  test('insert(): adds item to existing object', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    const next = dict.insert(0, 'b', 1);
    expect(next).toBe(dict);
  });

  test('with(): returns a new reference', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    const next = dict.with(0, 'b', 1);
    expect(next).not.toBe(dict);
  });

  test('with(): does not update copied object', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    dict.with(0, 'b', 1);
    expect(dict.get('b')).toBe(2);
    expect(dict.keyAt(1)).toBe('b');
  });

  test('first()', () => {
    expect(
      new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]).first()
    ).toEqual(['a', 1]);
    expect(new OrderedDict().first()).toBeUndefined();
  });

  test('last()', () => {
    expect(
      new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
      ]).last()
    ).toEqual(['d', 4]);
    expect(new OrderedDict().last()).toBeUndefined();
  });

  test('before()', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
      ['d', 4],
    ]);
    expect(dict.before('b')).toEqual(['a', 1]);
    expect(dict.before('a')).toBeUndefined();
  });

  test('after()', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
      ['d', 4],
    ]);
    expect(dict.after('b')).toEqual(['c', 3]);
    expect(dict.after('d')).toBeUndefined();
  });

  test('clear()', () => {
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

  test('delete(): existing key', () => {
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

  test('delete(): non-existing key', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
    ]);
    const status = dict.delete('c');
    expect(status).toBe(false);
    expect(dict.size).toBe(2);
    expect(dict.at(0)).toBe(1);
  });

  test('deleteAt(): standard indices', () => {
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

  test('deleteAt(): negative indices', () => {
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

  test('deleteAt(): out-of-range indices', () => {
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

  describe('find', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    test('key: found', () => {
      const result = dict.find(([key]) => key === 'b');
      expect(result).toEqual(['b', 2]);
    });

    test('key: not found', () => {
      const result = dict.find(([key]) => key === 'd');
      expect(result).toBeUndefined();
    });

    test('value: found', () => {
      const result = dict.find(([, value]) => value === 3);
      expect(result).toEqual(['c', 3]);
    });

    test('value: not found', () => {
      const result = dict.find(([, value]) => value === 4);
      expect(result).toBeUndefined();
    });

    test('thisArg', () => {
      const result = dict.find(function (this: number, [, value]) {
        return value === this;
      }, 1);
      expect(result).toEqual(['a', 1]);
    });

    test('no thisArg', () => {
      const result = dict.find(function (this: unknown, _, dictionary) {
        return dictionary === this;
      });
      expect(result).toBeUndefined();
    });
  });

  describe('findIndex', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);
    test('key: found', () => {
      const result = dict.findIndex(([key]) => key === 'b');
      expect(result).toBe(1);
    });

    test('key: not found', () => {
      const result = dict.findIndex(([key]) => key === 'd');
      expect(result).toBe(-1);
    });

    test('value: found', () => {
      const result = dict.findIndex(([, value]) => value === 3);
      expect(result).toBe(2);
    });

    test('value: not found', () => {
      const result = dict.findIndex(([, value]) => value === 4);
      expect(result).toBe(-1);
    });

    test('with thisArg', () => {
      const thisArg = { key: 'b' };
      const result = dict.findIndex(function (this: typeof thisArg, [key]) {
        return key === this.key;
      }, thisArg);
      expect(result).toBe(1);
    });

    test('no thisArg', () => {
      expect(() => {
        dict.findIndex(function (this: unknown, [, value]) {
          return value === (this as any).get('b');
        });
      }).toThrow();
    });
  });

  describe('filter', () => {
    test('makes a copy of the dictionary', () => {
      const dict = new OrderedDict([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
      const result = dict.filter(() => true);
      expect(result).not.toBe(dict);
    });

    test('misc', () => {
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
        ])
      );

      const result2 = dict.filter(([key]) => key === 'd');
      expect(result2).toEqual(new OrderedDict());

      const result3 = dict.filter(([, value]) => value === 3);
      expect(result3).toEqual(new OrderedDict([['c', 3]]));

      const result4 = dict.filter(([, value]) => value === 4);
      expect(result4).toEqual(new OrderedDict());
    });
  });

  describe('some', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    test('key: truthy', () => {
      const result = dict.some(([key]) => key === 'b');
      expect(result).toBe(true);
    });

    test('key: falsey', () => {
      const result = dict.some(([key]) => key === 'd');
      expect(result).toBe(false);
    });

    test('value: truthy', () => {
      const result = dict.some(([, value]) => value === 2);
      expect(result).toBe(true);
    });

    test('value: truthy', () => {
      const result = dict.some(([, value]) => value === 4);
      expect(result).toBe(false);
    });

    test('thisArg', () => {
      const result = dict.some(function (this: string, [key]) {
        return key === this;
      }, 'b');
      expect(result).toBe(true);
    });

    test('no thisArg', () => {
      expect(() =>
        dict.some(function (this: unknown, [, value]) {
          return (this as any).get('b') === value;
        })
      ).toThrow();
    });
  });

  describe('every', () => {
    const dict = new OrderedDict([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]);

    test('key: truthy', () => {
      const result = dict.every(([key]) => key.length === 1);
      expect(result).toBe(true);
    });

    test('key: falsey', () => {
      const result = dict.every(([key]) => key === 'a');
      expect(result).toBe(false);
    });

    test('value: truthy', () => {
      const result = dict.every(([, value]) => value > 0);
      expect(result).toBe(true);
    });

    test('value: falsey', () => {
      const result = dict.every(([, value]) => value > 1);
      expect(result).toBe(false);
    });

    test('thisArg', () => {
      const result = dict.every(function (this: string, [key]) {
        return typeof key === typeof this;
      }, 'b');
      expect(result).toBe(true);
    });

    test('no thisArg', () => {
      expect(() =>
        dict.every(function (this: unknown, [, value]) {
          return typeof (this as any).get('b') === typeof value;
        })
      ).toThrow();
    });
  });
});
