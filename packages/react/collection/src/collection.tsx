import * as React from 'react';
import { createContext, useIsomorphicLayoutEffect } from '@interop-ui/react-utils';

type BaseItem = { ref: React.RefObject<HTMLElement> };

function createCollection<Item extends BaseItem>(name: string) {
  const providerName = name + 'CollectionProvider';

  type CollectionContextValue = {
    items: Item[];
    addItem: (item: Item, explicitIndex?: number) => void;
    removeItem: (ref: Item['ref']) => void;
    ssrSyncUseCollectionItemCountRef: React.MutableRefObject<number>;
  };
  const [CollectionContext, useCollectionContext] = createContext<CollectionContextValue>(
    name + 'CollectionContext',
    providerName
  );

  function CollectionProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = React.useState<Item[]>([]);
    const ssrSyncUseCollectionItemCountRef = React.useRef(0);

    const addItem = React.useCallback(
      function addItem(item: Item) {
        setItems((previousItems) => {
          const exists = previousItems.find(({ ref }) => item.ref.current === ref.current);
          if (exists) return previousItems;
          return [...previousItems, item];
        });
      },
      [setItems]
    );

    const removeItem = React.useCallback(
      function removeItem(ref: Item['ref']) {
        setItems((items) => items.filter((item) => ref.current !== item.ref.current));
      },
      [setItems]
    );

    useIsomorphicLayoutEffect(() => {
      setItems([]);
    }, [children]);

    ssrSyncUseCollectionItemCountRef.current = 0;

    return (
      <CollectionContext.Provider
        value={React.useMemo(
          () => ({ items, addItem, removeItem, ssrSyncUseCollectionItemCountRef }),
          [items, addItem, removeItem]
        )}
      >
        {children}
      </CollectionContext.Provider>
    );
  }

  CollectionProvider.displayName = providerName;

  function createCollectionComponent<P extends object>(Component: React.ComponentType<P>) {
    function CollectionComponent(props: P) {
      return (
        <CollectionProvider>
          <Component {...props} />
        </CollectionProvider>
      );
    }
    CollectionComponent.displayName = name + 'CollectionComponent';
    return CollectionComponent;
  }

  function useCollectionItem(item: Item) {
    const { items, addItem, removeItem, ssrSyncUseCollectionItemCountRef } = useCollectionContext(
      'useCollectionItem'
    );

    const existingIndex = items.findIndex(({ ref }) => item.ref.current === ref.current);
    const index = existingIndex !== -1 ? existingIndex : ssrSyncUseCollectionItemCountRef.current;
    ssrSyncUseCollectionItemCountRef.current = ssrSyncUseCollectionItemCountRef.current + 1;

    React.useLayoutEffect(() => {
      addItem(item);
    });

    React.useLayoutEffect(() => {
      return () => removeItem(item.ref);
    }, [item.ref, removeItem]);

    return index;
  }

  function useCollectionItems() {
    return useCollectionContext('useCollectionItems').items;
  }

  return {
    createCollectionComponent,
    useCollectionItem,
    useCollectionItems,
  };
}

export { createCollection };
export type { BaseItem };
