import React from 'react';
import { createContextScope } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createSlot, type Slot } from '@radix-ui/react-slot';
import type { EntryOf } from './ordered-dictionary';
import { OrderedDict } from './ordered-dictionary';

type SlotProps = React.ComponentPropsWithoutRef<typeof Slot>;
type CollectionElement = HTMLElement;
interface CollectionProps extends SlotProps {
  scope: any;
}

interface BaseItemData {
  id?: string;
}

type ItemDataWithElement<
  ItemData extends BaseItemData,
  ItemElement extends HTMLElement,
> = ItemData & {
  element: ItemElement;
};

type ItemMap<ItemElement extends HTMLElement, ItemData extends BaseItemData> = OrderedDict<
  ItemElement,
  ItemDataWithElement<ItemData, ItemElement>
>;

function createCollection<
  ItemElement extends HTMLElement,
  ItemData extends BaseItemData = BaseItemData,
>(name: string) {
  /* -----------------------------------------------------------------------------------------------
   * CollectionProvider
   * ---------------------------------------------------------------------------------------------*/

  const PROVIDER_NAME = name + 'CollectionProvider';
  const [createCollectionContext, createCollectionScope] = createContextScope(PROVIDER_NAME);

  type ContextValue = {
    collectionElement: CollectionElement | null;
    collectionRef: React.Ref<CollectionElement | null>;
    collectionRefObject: React.RefObject<CollectionElement | null>;
    itemMap: ItemMap<ItemElement, ItemData>;
    setItemMap: React.Dispatch<React.SetStateAction<ItemMap<ItemElement, ItemData>>>;
  };

  const [CollectionProviderImpl, useCollectionContext] = createCollectionContext<ContextValue>(
    PROVIDER_NAME,
    {
      collectionElement: null,
      collectionRef: { current: null },
      collectionRefObject: { current: null },
      itemMap: new OrderedDict(),
      setItemMap: () => void 0,
    }
  );

  const CollectionProvider: React.FC<{ children?: React.ReactNode; scope: any }> = (props) => {
    const { scope, children } = props;
    const ref = React.useRef<CollectionElement>(null);
    const [collectionElement, setCollectionElement] = React.useState<CollectionElement | null>(
      null
    );
    const composeRefs = useComposedRefs(ref, setCollectionElement);
    const [itemMap, setItemMap] = React.useState<ItemMap<ItemElement, ItemData>>(new OrderedDict());

    React.useEffect(() => {
      if (!collectionElement) return;

      const observer = getChildListObserver(() => {
        // setItemMap((map) => {
        //   const copy = new OrderedDict(map).toSorted(([, a], [, b]) =>
        //     !a.element || !b.element ? 0 : isElementPreceding(a.element, b.element) ? -1 : 1
        //   );
        //   // check if the order has changed
        //   let index = -1;
        //   for (const entry of copy) {
        //     index++;
        //     const key = map.keyAt(index)!;
        //     const [copyKey] = entry;
        //     if (key !== copyKey) {
        //       // order has changed!
        //       return copy;
        //     }
        //   }
        //   return map;
        // });
      });
      observer.observe(collectionElement, {
        childList: true,
        subtree: true,
      });
      return () => {
        observer.disconnect();
      };
    }, [collectionElement]);

    return (
      <CollectionProviderImpl
        scope={scope}
        itemMap={itemMap}
        setItemMap={setItemMap}
        collectionRef={composeRefs}
        collectionRefObject={ref}
        collectionElement={collectionElement}
      >
        {children}
      </CollectionProviderImpl>
    );
  };

  CollectionProvider.displayName = PROVIDER_NAME;

  /* -----------------------------------------------------------------------------------------------
   * CollectionSlot
   * ---------------------------------------------------------------------------------------------*/

  const COLLECTION_SLOT_NAME = name + 'CollectionSlot';

  const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
  const CollectionSlot = React.forwardRef<CollectionElement, CollectionProps>(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
      return <CollectionSlotImpl ref={composedRefs}>{children}</CollectionSlotImpl>;
    }
  );

  CollectionSlot.displayName = COLLECTION_SLOT_NAME;

  /* -----------------------------------------------------------------------------------------------
   * CollectionItem
   * ---------------------------------------------------------------------------------------------*/

  const ITEM_SLOT_NAME = name + 'CollectionItemSlot';
  const ITEM_DATA_ATTR = 'data-radix-collection-item';

  type CollectionItemSlotProps = ItemData & {
    children: React.ReactNode;
    scope: any;
  };

  const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
  const CollectionItemSlot = React.forwardRef<ItemElement, CollectionItemSlotProps>(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = React.useRef<ItemElement>(null);
      const [element, setElement] = React.useState<ItemElement | null>(null);
      const composedRefs = useComposedRefs(forwardedRef, ref, setElement);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);

      const { setItemMap } = context;

      const itemDataRef = React.useRef(itemData);
      if (!shallowEqual(itemDataRef.current, itemData)) {
        itemDataRef.current = itemData;
      }
      const memoizedItemData = itemDataRef.current;

      React.useEffect(() => {
        const itemData = memoizedItemData;
        setItemMap((map) => {
          if (!element) {
            return map;
          }

          if (!map.has(element)) {
            map.set(element, { ...(itemData as unknown as ItemData), element });
            return map.toSorted(sortByDocumentPosition);
          }

          return map
            .set(element, { ...(itemData as unknown as ItemData), element })
            .toSorted(sortByDocumentPosition);
        });

        return () => {
          setItemMap((map) => {
            if (!element || !map.has(element)) {
              return map;
            }
            map.delete(element);
            return new OrderedDict(map);
          });
        };
      }, [element, memoizedItemData, setItemMap]);

      return (
        <CollectionItemSlotImpl {...{ [ITEM_DATA_ATTR]: '' }} ref={composedRefs as any}>
          {children}
        </CollectionItemSlotImpl>
      );
    }
  );

  CollectionItemSlot.displayName = ITEM_SLOT_NAME;

  /* -----------------------------------------------------------------------------------------------
   * useCollection
   * ---------------------------------------------------------------------------------------------*/

  function useCollection(scope: any) {
    const { itemMap } = useCollectionContext(name + 'CollectionConsumer', scope);

    return itemMap;
  }

  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    useCollection,
    createCollectionScope,
  ] as const;
}

export { createCollection };
export type { CollectionProps };

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
  a: EntryOf<ItemMap<E, T>>,
  b: EntryOf<ItemMap<E, T>>
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
