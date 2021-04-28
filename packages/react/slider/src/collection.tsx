import * as React from 'react';
import { createContext } from '@radix-ui/react-context';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

function createCollection<E extends React.ElementRef<any> = void, S = {}>(name: string) {
  const providerName = name + 'CollectionProvider';

  // the internal item type, has a ref and user-defined state
  type Item<EE = E> = { ref: React.RefObject<EE> } & S;

  // if no element type was provided, fallback to the same type as React.useRef(null)
  type ItemElementRef = React.MutableRefObject<E extends void ? null : E>;

  type CollectionContextValue = {
    items: Item[];
    onItemAdd: (item: Item) => void;
    onItemRemove: (ref: ItemElementRef) => void;
    // Tracks how many times `useCollectionItem` is called to get initial indexes for SSR.
    // We increment this synchronously during render in `useCollectionItem`
    // and reset it synchronously during render in `CollectionProvider`.
    // After hydration on the client, the count will be wrong but we don't care at that point
    // as we rely on client side effects which infer the correct index from `items`.
    ssrSyncUseCollectionItemCountRef: React.MutableRefObject<number>;
  };

  const [CollectionProviderImpl, useCollectionContext] = createContext<CollectionContextValue>(
    name + 'CollectionItems'
  );

  function CollectionProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = React.useState<Item[]>([]);
    const ssrSyncUseCollectionItemCountRef = React.useRef(0);

    const handleItemAdd = React.useCallback(
      (item: Item) => {
        setItems((previousItems) => {
          const exists = previousItems.find(({ ref }) => item.ref.current === ref.current);
          if (exists) return previousItems;
          return [...previousItems, item];
        });
      },
      [setItems]
    );

    const handleItemRemove = React.useCallback(
      (ref: ItemElementRef) => {
        setItems((items) => items.filter((item) => ref.current !== item.ref.current));
      },
      [setItems]
    );

    // items are pushed into the `items` array every render, so we reset them
    // everytime the children change.
    useLayoutEffect(() => {
      setItems([]);
    }, [children]);

    // this is intentionally done synchronously, see notes on `CollectionContextValue` type
    ssrSyncUseCollectionItemCountRef.current = 0;

    return (
      <CollectionProviderImpl
        items={items}
        onItemAdd={handleItemAdd}
        onItemRemove={handleItemRemove}
        ssrSyncUseCollectionItemCountRef={ssrSyncUseCollectionItemCountRef}
      >
        {children}
      </CollectionProviderImpl>
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

  function useCollectionItem(state?: S) {
    const ref = React.useRef(null) as ItemElementRef;
    const {
      items,
      onItemAdd,
      onItemRemove,
      ssrSyncUseCollectionItemCountRef,
    } = useCollectionContext('useCollectionItem');

    // on first render, this will be -1 as the item hasn't been pushed into the `items` array yet
    const existingIndex = items.findIndex((item) => ref.current === item.ref.current);
    // we therefore rely on our syncrhonous count as a fallback which will be useful for SSR
    const index = existingIndex !== -1 ? existingIndex : ssrSyncUseCollectionItemCountRef.current;
    // this is intentionally done synchronously, see notes on `CollectionContextValue` type
    ssrSyncUseCollectionItemCountRef.current = ssrSyncUseCollectionItemCountRef.current + 1;

    // add item on every render, this is fine because we reset the items in the parent everytime
    useLayoutEffect(() => {
      onItemAdd(({ ...state, ref } as unknown) as Item);
    });

    // only remove on unmount
    useLayoutEffect(() => {
      return () => onItemRemove(ref);
    }, [ref, onItemRemove]);

    return { ref, index };
  }

  function useCollectionItems() {
    // if no element type was provided, fallback to HTMLElement so that items' refs
    // have default types for consumers
    type FallbackElement = E extends void ? HTMLElement : E;
    return (useCollectionContext('useCollectionItems').items as unknown) as Item<FallbackElement>[];
  }

  return [createCollectionComponent, useCollectionItem, useCollectionItems] as [
    typeof createCollectionComponent,
    typeof useCollectionItem,
    typeof useCollectionItems
  ];
}

export { createCollection };
