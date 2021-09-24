import React from 'react';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { Slot } from '@radix-ui/react-slot';

import type * as Radix from '@radix-ui/react-primitive';

type SlotProps = Radix.ComponentPropsWithoutRef<typeof Slot>;
interface CollectionProps extends SlotProps {}

// We have resorted to returning slots directly rather than exposing primitives that can then
// be slotted like `<CollectionItem as={Slot}>…</CollectionItem>`.
// This is because we encountered issues with generic types that cannot be statically analysed
// due to creating them dynamically via createCollection.

function createCollection<ItemElement extends HTMLElement, ItemData>() {
  /* -----------------------------------------------------------------------------------------------
   * CollectionProvider
   * ---------------------------------------------------------------------------------------------*/

  type CollectionElement = HTMLElement;

  type ContextValue = {
    collectionRef: React.RefObject<CollectionElement>;
    itemMap: Map<React.RefObject<ItemElement>, { ref: React.RefObject<ItemElement> } & ItemData>;
  };
  const Context = React.createContext<ContextValue>({} as any);

  const PROVIDER_NAME = 'CollectionProvider';

  const CollectionProvider: React.FC = (props) => {
    const { children } = props;
    const ref = React.useRef<CollectionElement>(null);
    const itemMap = React.useRef<ContextValue['itemMap']>(new Map()).current;
    return (
      <Context.Provider value={React.useMemo(() => ({ itemMap, collectionRef: ref }), [itemMap])}>
        {children}
      </Context.Provider>
    );
  };

  CollectionProvider.displayName = PROVIDER_NAME;

  /* -----------------------------------------------------------------------------------------------
   * CollectionSlot
   * ---------------------------------------------------------------------------------------------*/

  const COLLECTION_SLOT_NAME = 'CollectionSlot';

  const CollectionSlot = React.forwardRef<CollectionElement, CollectionProps>(
    (props, forwardedRef) => {
      const { children } = props;
      const context = React.useContext(Context);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
      return <Slot ref={composedRefs}>{children}</Slot>;
    }
  );

  CollectionSlot.displayName = COLLECTION_SLOT_NAME;

  /* -----------------------------------------------------------------------------------------------
   * CollectionItem
   * ---------------------------------------------------------------------------------------------*/

  const ITEM_SLOT_NAME = 'CollectionItemSlot';
  const ITEM_DATA_ATTR = 'data-radix-collection-item';

  type CollectionItemSlotProps = ItemData & {
    children: React.ReactNode;
  };

  const CollectionItemSlot = React.forwardRef<ItemElement, CollectionItemSlotProps>(
    (props, forwardedRef) => {
      const { children, ...itemData } = props;
      const ref = React.useRef<ItemElement>(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const context = React.useContext(Context);

      React.useEffect(() => {
        context.itemMap.set(ref, { ref, ...(itemData as unknown as ItemData) });
        return () => void context.itemMap.delete(ref);
      });

      return (
        <Slot {...{ [ITEM_DATA_ATTR]: '' }} ref={composedRefs}>
          {children}
        </Slot>
      );
    }
  );

  CollectionItemSlot.displayName = ITEM_SLOT_NAME;

  /* -----------------------------------------------------------------------------------------------
   * useCollection
   * ---------------------------------------------------------------------------------------------*/

  function useCollection() {
    const context = React.useContext(Context);

    const getItems = React.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref.current!) - orderedNodes.indexOf(b.ref.current!)
      );
      return orderedItems;
    }, [context.collectionRef, context.itemMap]);

    return getItems;
  }

  return [CollectionProvider, CollectionSlot, CollectionItemSlot, useCollection] as const;
}

export { createCollection };
export type { CollectionProps };
