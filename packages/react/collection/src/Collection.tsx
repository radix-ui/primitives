import React from 'react';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { Slot } from '@radix-ui/react-slot';

type SlotProps = React.ComponentProps<typeof Slot>;

function createCollection<ItemElement extends HTMLElement, ItemData>() {
  /* -----------------------------------------------------------------------------------------------
   * Collection
   * ---------------------------------------------------------------------------------------------*/

  type CollectionElement = HTMLElement;

  type ContextValue = {
    collectionRef: React.RefObject<CollectionElement>;
    itemMap: Map<React.RefObject<ItemElement>, { ref: React.RefObject<ItemElement> } & ItemData>;
  };
  const Context = React.createContext<ContextValue>({} as any);

  const COLLECTION_SLOT_NAME = 'CollectionSlot';

  const CollectionSlot = React.forwardRef<CollectionElement, SlotProps>((props, forwardedRef) => {
    const { children } = props;
    const ref = React.useRef<CollectionElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const itemMap = React.useRef<ContextValue['itemMap']>(new Map()).current;
    return (
      <Context.Provider value={React.useMemo(() => ({ itemMap, collectionRef: ref }), [itemMap])}>
        <Slot ref={composedRefs}>{children}</Slot>
      </Context.Provider>
    );
  });

  CollectionSlot.displayName = COLLECTION_SLOT_NAME;

  /* -----------------------------------------------------------------------------------------------
   * CollectionItem
   * ---------------------------------------------------------------------------------------------*/

  const ITEM_SLOT_NAME = 'CollectionItemSlot';
  const ITEM_DATA_ATTR = 'data-radix-collection-item';

  type CollectionItemSlotProps = { children: React.ReactNode } & ItemData;

  const CollectionItemSlot = React.forwardRef<ItemElement, CollectionItemSlotProps>(
    (props, forwardedRef) => {
      const { children, ...itemData } = props;
      const ref = React.useRef<ItemElement>(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const context = React.useContext(Context);

      React.useEffect(() => {
        context.itemMap.set(ref, { ref, ...((itemData as unknown) as ItemData) });
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
    return {
      getItems() {
        const orderedNodes = Array.from(
          context.collectionRef.current!.querySelectorAll(`[${ITEM_DATA_ATTR}]`)
        );
        const items = Array.from(context.itemMap.values());
        const orderedItems = items.sort(
          (a, b) => orderedNodes.indexOf(a.ref.current!) - orderedNodes.indexOf(b.ref.current!)
        );
        return orderedItems;
      },
    };
  }

  return [CollectionSlot, CollectionItemSlot, useCollection] as const;
}

export { createCollection };
