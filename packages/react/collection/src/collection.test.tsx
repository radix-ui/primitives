import * as React from 'react';
import { act, create } from 'react-test-renderer';
import { createCollection } from './collection';

const defaultItems = [{ itemRef: 'one' }, { itemRef: 'two', disabled: true }, { itemRef: 'three' }];

describe('given collection items', () => {
  let collection: ReturnType<typeof setup>;

  beforeAll(() => {
    collection = setup(defaultItems);
  });

  it('should have the correct number of items in the collection context', () => {
    expect(collection.context.length).toBe(defaultItems.length);
  });

  it('should have the correct indexes in each item context', () => {
    const isPass = hasCorrectIndexesForItems(defaultItems, collection.itemContexts);
    expect(isPass).toBe(true);
  });

  it('should maintain item state in the collection context', () => {
    expect(collection.context[1].disabled).toBe(true);
  });

  describe('when updating item state', () => {
    beforeAll(() => {
      const items = [...defaultItems];
      items[1].disabled = false;
      collection.update(items);
    });

    it('should reflect the update in the collection context', () => {
      expect(collection.context[1].disabled).toBe(false);
    });
  });

  describe('when unmounting an item', () => {
    let itemsWithoutOne = defaultItems.filter((item) => item.itemRef !== 'one');

    beforeAll(() => {
      collection.update(itemsWithoutOne);
    });

    it('should remove the item from the collection context', () => {
      const hasOne = collection.context.some((item) => item.ref.current === 'one');
      expect(hasOne).toBe(false);
    });

    it('should update indexes to reflect the removal', () => {
      const isPass = hasCorrectIndexesForItems(itemsWithoutOne, collection.itemContexts);
      expect(isPass).toBe(true);
    });
  });

  describe('when mounting an item', () => {
    let itemsWithNew = [{ itemRef: 'new' }, ...defaultItems];

    beforeAll(() => {
      collection.update(itemsWithNew);
    });

    it('should add the item to the collection context', () => {
      const hasNew = collection.context.some((item) => item.ref.current === 'new');
      expect(hasNew).toBe(true);
    });

    it('should update indexes to reflect the addition', () => {
      const isPass = hasCorrectIndexesForItems(itemsWithNew, collection.itemContexts);
      expect(isPass).toBe(true);
    });
  });
});

describe("given children that aren't collection items", () => {
  let collection: ReturnType<typeof setup>;

  beforeAll(() => {
    const items = defaultItems.reduce(
      (acc, item) => [...acc, item, { itemRef: null }],
      [] as TestItem[]
    );

    collection = setup(items);
  });

  it('should only maintain collection items in collection context', () => {
    expect(collection.context.length).toBe(defaultItems.length);
  });

  it('should have the correct indexes in each item context', () => {
    const isPass = hasCorrectIndexesForItems(defaultItems, collection.itemContexts);
    expect(isPass).toBe(true);
  });
});

type ElementRef = string;
type ItemState = { disabled?: boolean };

const [createCollectionComponent, useCollectionItem, useCollectionItems] = createCollection<
  ElementRef,
  ItemState
>('Collection');

type TestItem = { itemRef: ElementRef | null } & ItemState;
type CollectionItemContext = ReturnType<typeof useCollectionItem>;

function setup(items: TestItem[]) {
  let testRenderer: ReturnType<typeof create>;
  let context: ReturnType<typeof useCollectionItems> = [];
  let itemContexts: CollectionItemContext[] = [];

  const List = createCollectionComponent(({ items }: { items: TestItem[] }) => {
    context = useCollectionItems();
    itemContexts = [];
    return (
      <>
        {items.map(({ itemRef, ...props }, index) => {
          return itemRef ? <Item key={itemRef} itemRef={itemRef} {...props} /> : <i key={index} />;
        })}
      </>
    );
  });

  const Item = ({ itemRef, disabled }: { itemRef: ElementRef } & ItemState) => {
    const item = useCollectionItem({ disabled });
    item.ref.current = itemRef;
    itemContexts = [...itemContexts, item];
    return null;
  };

  act(() => {
    testRenderer = create(<List items={items} />);
  });

  const update = (items: TestItem[]) => {
    act(() => testRenderer.update(<List items={items} />));
  };

  return {
    update,
    get context() {
      return context;
    },
    get itemContexts() {
      return itemContexts;
    },
  };
}

const hasCorrectIndexesForItems = (
  testItems: TestItem[],
  itemContexts: CollectionItemContext[]
) => {
  return testItems.every((testItem, index) => {
    const item = itemContexts[index];
    return item.index === index && item.ref.current === testItem.itemRef;
  });
};
