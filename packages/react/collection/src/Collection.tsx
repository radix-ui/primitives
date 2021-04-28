import React from 'react';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

function createCollection<ItemProps>() {
  /* -----------------------------------------------------------------------------------------------
   * Collection
   * ---------------------------------------------------------------------------------------------*/

  type Ref = React.RefObject<HTMLElement>;
  type ContextValue = { collectionRef: Ref; itemMap: Map<Ref, ItemProps & { ref: Ref }> };
  const Context = React.createContext<ContextValue>({} as any);

  type CollectionOwnProps = Polymorphic.OwnProps<typeof Primitive>;
  type CollectionPrimitive = Polymorphic.ForwardRefComponent<
    Polymorphic.IntrinsicElement<typeof Primitive>,
    CollectionOwnProps
  >;

  const Collection = React.forwardRef((props, forwardedRef) => {
    const ref = React.useRef<React.ElementRef<typeof Primitive>>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const itemMap = React.useRef<ContextValue['itemMap']>(new Map()).current;
    return (
      <Context.Provider value={React.useMemo(() => ({ itemMap, collectionRef: ref }), [itemMap])}>
        <Primitive {...props} ref={composedRefs} />
      </Context.Provider>
    );
  }) as CollectionPrimitive;

  /* -----------------------------------------------------------------------------------------------
   * CollectionItem
   * ---------------------------------------------------------------------------------------------*/

  type CollectionItemOwnProps = Polymorphic.Merge<
    Polymorphic.OwnProps<typeof Primitive>,
    ItemProps
  >;
  type CollectionItemPrimitive = Polymorphic.ForwardRefComponent<
    Polymorphic.IntrinsicElement<typeof Primitive>,
    CollectionItemOwnProps
  >;

  const ITEM_DATA_ATTR = 'data-radix-collection-item';

  const CollectionItem = React.forwardRef((props, forwardedRef) => {
    const ref = React.useRef<HTMLElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const context = React.useContext(Context);

    React.useEffect(() => {
      context.itemMap.set(ref, { ref, ...props });
      return () => void context.itemMap.delete(ref);
    });

    return <Primitive {...{ [ITEM_DATA_ATTR]: '' }} {...props} ref={composedRefs} />;
  }) as CollectionItemPrimitive;

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

  return [Collection, CollectionItem, useCollection] as const;
}

export { createCollection };
