import * as React from 'react';
import { arrayInsert, isElementPreceding } from '@interop-ui/utils';
import { createContext, useIsomorphicLayoutEffect } from '@interop-ui/react-utils';

type BaseItem = { element: HTMLElement | null };

function createCollection<Item extends BaseItem>(name: string) {
  const contextName = name + 'CollectionContext';
  const providerName = name + 'CollectionProvider';

  type CollectionContextValue = {
    items: Item[];
    addItem: (item: Item, explicitIndex?: number) => void;
    removeItem: (element: Item['element']) => void;
  };
  const [CollectionContext, useCollectionContext] = createContext<CollectionContextValue>(
    contextName,
    providerName
  );

  function useCollectionState() {
    return React.useState<Item[]>([]);
  }

  function CollectionProvider({
    collectionState,
    children,
  }: {
    collectionState: ReturnType<typeof useCollectionState>;
    children: React.ReactNode;
  }) {
    const [items, setItems] = collectionState;

    const addItem = React.useCallback(
      function addItem(item: Item, explicitIndex?: number) {
        if (!item.element) return;

        setItems((items) => {
          if (explicitIndex !== undefined) {
            return arrayInsert(items, item, explicitIndex);
          }

          if (items.length === 0) return [item];

          if (items.find(({ element }) => item.element === element) !== undefined) {
            console.warn('element already registered', item.element);
            return items;
          }

          const index = findDOMIndex(items, item);
          return arrayInsert(items, item, index);
        });
      },
      [setItems]
    );

    const removeItem = React.useCallback(
      function removeItem(element: Item['element']) {
        if (!element) return;
        setItems((items) => items.filter((item) => element !== item.element));
      },
      [setItems]
    );

    return (
      <CollectionContext.Provider
        value={React.useMemo(() => ({ items, addItem, removeItem }), [items, addItem, removeItem])}
      >
        {children}
      </CollectionContext.Provider>
    );
  }

  CollectionProvider.displayName = providerName;

  function useCollectionItem(item: Item, explicitIndex?: number) {
    const [, forceUpdate] = React.useState();
    const { items, addItem, removeItem } = useCollectionContext('useCollectionItem');

    const existingIndex = items.findIndex(({ element }) => item.element === element);
    const index = explicitIndex ?? existingIndex;

    useIsomorphicLayoutEffect(() => {
      if (!item.element) {
        return forceUpdate({});
      } else {
        addItem(item, explicitIndex);
        return () => removeItem(item.element);
      }
    }, [addItem, removeItem, ...Object.values(item), explicitIndex]);

    return index;
  }

  function useCollectionItems() {
    return useCollectionContext('useCollectionItems').items;
  }

  return {
    CollectionContext,
    useCollectionState,
    CollectionProvider,
    useCollectionItem,
    useCollectionItems,
  };

  function findDOMIndex(items: Item[], item: Item) {
    const index = items.findIndex(({ element }) => {
      if (!element || !item.element) return false;
      return isElementPreceding({ element: item.element, referenceElement: element });
    });

    // `findIndex` will return -1 if the item's element didn't precede any other element
    // therefore, it's at the end
    return index === -1 ? items.length : index;
  }
}

export { createCollection };
export type { BaseItem };
