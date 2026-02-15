'use client';
import * as React from 'react';
import { Collection as CollectionPrimitive } from 'radix-ui/internal';
import type { Context } from 'radix-ui/internal';

const ElementHashMap = new WeakMap<HTMLDivElement, string>();

const [
  UnstableCollection,
  {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    useCollection: useUnstableCollection,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createCollectionScope: createUnstableCollectionScope,
    useInitCollection: useInitUnstableCollection,
  },
] = CollectionPrimitive.unstable_createCollection<
  HTMLDivElement,
  {
    test: number;
    // TODO: remove when package is updated to extend BaseItemData internally
    id?: string;
  }
>('UNSTABLE');

const [
  Collection,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useCollection,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createCollectionScope,
] = CollectionPrimitive.createCollection<HTMLDivElement, { test: number }>('STABLE');

type ScopedProps<P = {}> = P & { __scopeCollection?: Context.Scope };

export function Unstable(props: ScopedProps<{ children: React.ReactNode }>) {
  const collectionState = useInitUnstableCollection();
  const [collection] = collectionState;

  return (
    <div>
      {collection.size ? (
        <dl>
          {Array.from(collection).map(([element, { element: _, ...data }]) => {
            let key = ElementHashMap.get(element);
            if (!key) {
              key = crypto.randomUUID();
            }
            return (
              <React.Fragment key={getElementKey(element)}>
                <dt>Item content: {element.textContent}</dt>
                <dd>Item data: {JSON.stringify(data)}</dd>
              </React.Fragment>
            );
          })}
        </dl>
      ) : (
        <p>No items in collection</p>
      )}
      <hr />
      <UnstableCollection.Provider scope={props.__scopeCollection} state={collectionState}>
        <UnstableCollection.Slot scope={props.__scopeCollection}>
          <div role="group">{props.children}</div>
        </UnstableCollection.Slot>
      </UnstableCollection.Provider>
    </div>
  );
}

export function UnstableItem(props: ScopedProps<{ children: React.ReactNode }>) {
  return (
    <UnstableCollection.ItemSlot scope={props.__scopeCollection} test={1}>
      <div>{props.children}</div>
    </UnstableCollection.ItemSlot>
  );
}

export function Stable(props: ScopedProps<{ children: React.ReactNode }>) {
  return (
    <Collection.Provider scope={props.__scopeCollection}>
      <Collection.Slot scope={props.__scopeCollection}>
        <div role="group">{props.children}</div>
      </Collection.Slot>
    </Collection.Provider>
  );
}

export function StableItem(props: ScopedProps<{ children: React.ReactNode }>) {
  return (
    <Collection.ItemSlot scope={props.__scopeCollection} test={1}>
      <div>{props.children}</div>
    </Collection.ItemSlot>
  );
}

function getElementKey(element: HTMLDivElement) {
  let key = ElementHashMap.get(element);
  if (!key) {
    key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    ElementHashMap.set(element, key);
  }
  return key;
}
