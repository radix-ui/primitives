import * as React from 'react';
import { createContextScope } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createSlot, type Slot } from '@radix-ui/react-slot';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import type { EntryOf } from './ordered-dictionary';
import { OrderedDict, type ReadOnlyOrderedDict } from './ordered-dictionary';

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

type CollectionDict<ItemElement extends HTMLElement, ItemData> = ReadOnlyOrderedDict<
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
    getCollection: () => CollectionDict<ItemElement, AllItemData>;
    registryRef: React.RefObject<BaseCollectionDict<ItemElement, AllItemData>>;
  }

  interface CollectionStatefulContextValue {
    collectionElement: CollectionElement | null;
    collection: CollectionDict<ItemElement, AllItemData>;
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

    // Written only during commit (from item ref callbacks and layout effects),
    // so it never includes items from renders that React discards.
    const registryRef = React.useRef<BaseCollectionDict<ItemElement, AllItemData>>(
      new OrderedDict(),
    );
    const getCollection = React.useCallback(() => {
      const registry = registryRef.current;
      if (!isInDocumentOrder(registry)) {
        registry.sort(sortByDocumentPosition);
      }
      return registry;
    }, []);

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
        registryRef={registryRef}
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
      const context = useStableCollectionContext(ITEM_SLOT_NAME, scope);

      const { setCollection, registryRef } = context;

      const itemDataRef = React.useRef(itemData);
      if (!shallowEqual(itemDataRef.current, itemData)) {
        itemDataRef.current = itemData;
      }
      const memoizedItemData = itemDataRef.current;

      // TODO: Once React 19 is the minimum supported version, return a cleanup
      // function that unregisters `node` instead of handling `null`, which
      // depends on `ref.current` still holding the previous element.
      const registerElement = React.useCallback(
        (node: ItemElement | null) => {
          const registry = registryRef.current;
          if (node) {
            registry.set(node, {
              ...(itemDataRef.current as unknown as AllItemData),
              element: node,
            });
          } else if (ref.current) {
            registry.delete(ref.current);
          }
        },
        [registryRef],
      );
      const composedRefs = useComposedRefs(forwardedRef, registerElement, ref);

      useLayoutEffect(() => {
        const node = ref.current;
        const registry = registryRef.current;
        if (node && registry.has(node)) {
          registry.set(node, { ...(memoizedItemData as unknown as AllItemData), element: node });
        }
      }, [memoizedItemData, registryRef]);

      const registeredRef = React.useRef<{
        element: ItemElement;
        itemData: typeof memoizedItemData;
      } | null>(null);

      React.useEffect(() => {
        const element = ref.current;
        const registered = registeredRef.current;
        if (
          (registered?.element ?? null) === element &&
          (!element || registered?.itemData === memoizedItemData)
        ) {
          return;
        }

        registeredRef.current = element ? { element, itemData: memoizedItemData } : null;
        setCollection((map) => {
          const next = new OrderedDict(map);
          if (registered && registered.element !== element) {
            next.delete(registered.element);
          }
          if (element) {
            next.set(element, { ...(memoizedItemData as unknown as AllItemData), element });
          }
          return next.sort(sortByDocumentPosition);
        });
      });

      React.useEffect(() => {
        return () => {
          const registered = registeredRef.current;
          registeredRef.current = null;
          if (!registered) {
            return;
          }
          setCollection((map) => {
            if (!map.has(registered.element)) {
              return map;
            }
            const next = new OrderedDict(map);
            next.delete(registered.element);
            return next;
          });
        };
      }, [setCollection]);

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
export type { CollectionSlotProps, CollectionDict };

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

function isInDocumentOrder<E extends HTMLElement, T extends BaseItemData>(
  dict: BaseCollectionDict<E, T>,
) {
  let previous: Element | undefined;
  for (const element of dict.keys()) {
    if (previous) {
      const position = previous.compareDocumentPosition(element);
      if (
        !(position & Node.DOCUMENT_POSITION_DISCONNECTED) &&
        position & Node.DOCUMENT_POSITION_PRECEDING
      ) {
        return false;
      }
    }
    previous = element;
  }
  return true;
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
