import * as React from 'react';
import { createContextScope } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createSlot, type Slot } from '@radix-ui/react-slot';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import type { EntryOf } from './ordered-dictionary';
import { OrderedDict } from './ordered-dictionary';

type SlotProps = React.ComponentPropsWithoutRef<typeof Slot>;
type CollectionElement = HTMLElement;
interface CollectionSlotProps extends SlotProps {
  scope: any;
}

interface BaseItemData {
  id?: string | undefined;
}

type ItemDataWithElement<
  ItemData extends BaseItemData,
  ItemElement extends HTMLElement,
> = ItemData & {
  element: ItemElement;
};

type BaseCollectionDict<
  ItemElement extends HTMLElement,
  ItemData extends BaseItemData,
> = OrderedDict<ItemElement, ItemDataWithElement<ItemData, ItemElement>>;

type Collection<ItemElement extends HTMLElement, ItemData> = BaseCollectionDict<
  ItemElement,
  ItemDataWithElement<ItemData & BaseItemData, ItemElement>
>;

/**
 * Creates a collection that tracks its items in document order and exposes them
 * during render via `useCollection`.
 *
 * Item data passed to `ItemSlot` (every prop other than `scope` and `children`)
 * must be referentially stable across renders. It is compared shallowly, and any
 * change re-registers the item and replaces the item map. Memoize objects,
 * arrays and callbacks with `useMemo` / `useCallback`, or define them outside of
 * render.
 */
/* @__NO_SIDE_EFFECTS__ */ function createCollection<
  ItemElement extends HTMLElement,
  ItemData extends {} = {},
>(name: string) {
  type AllItemData = ItemData & BaseItemData;
  /* -----------------------------------------------------------------------------------------------
   * CollectionProvider
   * ---------------------------------------------------------------------------------------------*/

  const PROVIDER_NAME = name + 'CollectionProvider';
  const [createCollectionContext, createCollectionScope] = createContextScope(PROVIDER_NAME);

  interface CollectionStableContextValue {
    collectionElementRef: React.Ref<CollectionElement | null>;
    collectionElementRefObject: React.RefObject<CollectionElement | null>;
    setCollection: React.Dispatch<
      React.SetStateAction<BaseCollectionDict<ItemElement, AllItemData>>
    >;
    getCollection: () => BaseCollectionDict<ItemElement, AllItemData>;
  }

  interface CollectionStatefulContextValue {
    collectionElement: CollectionElement | null;
    collection: BaseCollectionDict<ItemElement, AllItemData>;
  }

  const [CollectionStableContextProvider, useStableCollectionContext] =
    createCollectionContext<CollectionStableContextValue>(PROVIDER_NAME);
  CollectionStableContextProvider.displayName = name + 'CollectionStableContextProvider';

  const [CollectionStatefulContextProvider, useStatefulCollectionContext] =
    createCollectionContext<CollectionStatefulContextValue>(PROVIDER_NAME);
  CollectionStatefulContextProvider.displayName = name + 'CollectionStatefulContextProvider';

  type CollectionState = [
    ItemMap: BaseCollectionDict<ItemElement, AllItemData>,
    SetItemMap: React.Dispatch<React.SetStateAction<BaseCollectionDict<ItemElement, AllItemData>>>,
  ];

  const CollectionProvider: React.FC<{
    children?: React.ReactNode | undefined;
    scope: any;
    state?: CollectionState | undefined;
  }> = ({ state, ...props }) => {
    return state ? (
      <CollectionProviderImpl {...props} state={state} />
    ) : (
      <CollectionInit {...props} />
    );
  };
  CollectionProvider.displayName = PROVIDER_NAME;

  const CollectionInit: React.FC<{
    children?: React.ReactNode | undefined;
    scope: any;
  }> = (props) => {
    const state = useInitCollection();
    return <CollectionProviderImpl {...props} state={state} />;
  };
  CollectionInit.displayName = name + 'CollectionInit';

  const CollectionProviderImpl: React.FC<{
    children?: React.ReactNode | undefined;
    scope: any;
    state: CollectionState;
  }> = (props) => {
    const { scope, children, state } = props;
    const ref = React.useRef<CollectionElement>(null);
    const [collectionElement, setCollectionElement] = React.useState<CollectionElement | null>(
      null,
    );
    const composeRefs = useComposedRefs(ref, setCollectionElement);
    const [collection, setCollection] = state;
    const getCollection = useCallbackRef(() => collection);

    React.useEffect(() => {
      if (!collectionElement) {
        return;
      }

      const observer = getChildListObserver(() => {
        setCollection((map) => {
          const sorted = map.toSorted(sortByDocumentPosition);
          const orderChanged = sorted.some(([key], index) => map.keyAt(index) !== key);

          return orderChanged ? sorted : map;
        });
      });
      observer.observe(collectionElement, {
        childList: true,
        subtree: true,
      });
      return () => {
        observer.disconnect();
      };
    }, [collectionElement, setCollection]);

    return (
      <CollectionStableContextProvider
        scope={scope}
        collectionElementRef={composeRefs}
        collectionElementRefObject={ref}
        getCollection={getCollection}
        setCollection={setCollection}
      >
        <CollectionStatefulContextProvider
          scope={scope}
          collectionElement={collectionElement}
          collection={collection}
        >
          {children}
        </CollectionStatefulContextProvider>
      </CollectionStableContextProvider>
    );
  };

  CollectionProviderImpl.displayName = name + 'CollectionProviderImpl';

  /* -----------------------------------------------------------------------------------------------
   * CollectionSlot
   * ---------------------------------------------------------------------------------------------*/

  const COLLECTION_SLOT_NAME = name + 'CollectionSlot';

  const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
  const CollectionSlot = React.forwardRef<CollectionElement, CollectionSlotProps>(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useStableCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionElementRef);
      return <CollectionSlotImpl ref={composedRefs}>{children}</CollectionSlotImpl>;
    },
  );

  CollectionSlot.displayName = COLLECTION_SLOT_NAME;

  /* -----------------------------------------------------------------------------------------------
   * CollectionItem
   * ---------------------------------------------------------------------------------------------*/

  const ITEM_SLOT_NAME = name + 'CollectionItemSlot';
  const ITEM_DATA_ATTR = 'data-radix-collection-item';

  type CollectionItemSlotProps = AllItemData & {
    children: React.ReactNode;
    scope: any;
  };

  const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
  /**
   * Registers its child element as a collection item. Every prop other than
   * `scope` and `children` is item data and must be referentially stable across
   * renders (see `createCollection`).
   */
  const CollectionItemSlot = React.forwardRef<ItemElement, CollectionItemSlotProps>(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = React.useRef<ItemElement>(null);
      const [element, setElement] = React.useState<ItemElement | null>(null);
      const composedRefs = useComposedRefs(forwardedRef, ref, setElement);
      const context = useStableCollectionContext(ITEM_SLOT_NAME, scope);

      const { setCollection } = context;

      const itemDataRef = React.useRef(itemData);
      if (!shallowEqual(itemDataRef.current, itemData)) {
        itemDataRef.current = itemData;
      }
      const memoizedItemData = itemDataRef.current;

      React.useEffect(() => {
        const itemData = memoizedItemData;
        setCollection((map) => {
          if (!element) {
            return map;
          }

          if (!map.has(element)) {
            const next = new OrderedDict(map);
            next.set(element, { ...(itemData as unknown as AllItemData), element });
            return next.sort(sortByDocumentPosition);
          }

          return map
            .set(element, { ...(itemData as unknown as AllItemData), element })
            .toSorted(sortByDocumentPosition);
        });

        return () => {
          setCollection((map) => {
            if (!element || !map.has(element)) {
              return map;
            }
            const next = new OrderedDict(map);
            next.delete(element);
            return next;
          });
        };
      }, [element, memoizedItemData, setCollection]);

      return (
        <CollectionItemSlotImpl {...{ [ITEM_DATA_ATTR]: '' }} ref={composedRefs as any}>
          {children}
        </CollectionItemSlotImpl>
      );
    },
  );

  CollectionItemSlot.displayName = ITEM_SLOT_NAME;

  /* -----------------------------------------------------------------------------------------------
   * useInitCollection
   * ---------------------------------------------------------------------------------------------*/

  function useInitCollection() {
    return React.useState<BaseCollectionDict<ItemElement, AllItemData>>(new OrderedDict());
  }

  /* -----------------------------------------------------------------------------------------------
   * useCollection
   * ---------------------------------------------------------------------------------------------*/

  function useCollection(scope: any) {
    const { collection } = useStatefulCollectionContext(name + 'CollectionConsumer', scope);
    return collection;
  }

  function useGetCollection(scope: any) {
    const { getCollection } = useStableCollectionContext(name + 'CollectionConsumer', scope);
    return getCollection;
  }

  const functions = {
    createCollectionScope,
    useCollection,
    useGetCollection,
    useInitCollection,
  };

  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    functions,
  ] as const;
}

export { createCollection };
export type { CollectionSlotProps, Collection as CollectionDict };

function shallowEqual(a: any, b: any) {
  if (a === b) return true;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  if (a == null || b == null) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (a[key] !== b[key]) return false;
  }
  return true;
}

function isElementPreceding(a: Element, b: Element) {
  return !!(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING);
}

function sortByDocumentPosition<E extends HTMLElement, T extends BaseItemData>(
  a: EntryOf<BaseCollectionDict<E, T>>,
  b: EntryOf<BaseCollectionDict<E, T>>,
) {
  return !a[1].element || !b[1].element
    ? 0
    : isElementPreceding(a[1].element, b[1].element)
      ? -1
      : 1;
}

function getChildListObserver(callback: () => void) {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        callback();
        return;
      }
    }
  });

  return observer;
}
