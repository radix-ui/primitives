import * as React from 'react';
import type { BaseItem } from './collection';
import { createCollection } from './collection';

export default { title: 'Collection' };

export const Basic = () => (
  <List>
    <Item>Red</Item>
    <Item disabled>Green</Item>
    <Item>Blue</Item>
  </List>
);

export const WithElementInBetween = () => (
  <List>
    <li style={{ fontVariant: 'small-caps' }}>Colors</li>
    <Item>Red</Item>
    <Item disabled>Green</Item>
    <Item>Blue</Item>
    <li style={{ fontVariant: 'small-caps' }}>Words</li>
    <Item>Hello</Item>
    <Item>World</Item>
  </List>
);

const Tomato = () => <Item style={{ color: 'tomato' }}>Tomato</Item>;

export const WithWrappedItem = () => (
  <List>
    <Item>Red</Item>
    <Item disabled>Green</Item>
    <Item>Blue</Item>
    <Tomato />
  </List>
);

export const WithFragment = () => {
  const countries = (
    <>
      <Item>France</Item>
      <Item disabled>UK</Item>
      <Item>Spain</Item>
    </>
  );
  return <List>{countries}</List>;
};

export const WithExplicitIndexes = () => (
  <List>
    <Item index={0}>Red</Item>
    <Item index={1} disabled>
      Green
    </Item>
    <Item index={2}>Blue</Item>
  </List>
);

export const DynamicInsertion = () => {
  const [hasTomato, setHasTomato] = React.useState(false);
  const [, forceUpdate] = React.useState();
  return (
    <>
      <button onClick={() => setHasTomato(!hasTomato)}>
        {hasTomato ? 'Remove' : 'Add'} Tomato
      </button>
      <button onClick={() => forceUpdate({})} style={{ marginLeft: 10 }}>
        Force Update
      </button>

      <List>
        <Item>Red</Item>
        {hasTomato ? <Tomato /> : null}
        <Item disabled>Green</Item>
        <Item>Blue</Item>
      </List>
    </>
  );
};

export const WithChangingItem = () => {
  const [isDisabled, setIsDisabled] = React.useState(false);
  return (
    <>
      <button onClick={() => setIsDisabled(!isDisabled)}>
        {isDisabled ? 'Enable' : 'Disable'} Green
      </button>

      <List>
        <Item>Red</Item>
        <Item disabled={isDisabled}>Green</Item>
        <Item>Blue</Item>
      </List>
    </>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Implementation
 * -----------------------------------------------------------------------------------------------*/

type ListItemType = BaseItem & { disabled: boolean };

const {
  useCollectionState,
  CollectionProvider,
  useCollectionItem,
  useCollectionItems,
} = createCollection<ListItemType>('List');

type ListProps = {
  children: React.ReactNode;
};

function List({ children }: ListProps) {
  return (
    <CollectionProvider collectionState={useCollectionState()}>
      <div style={{ display: 'flex' }}>
        <ul style={{ width: 200 }}>{children}</ul>
        <ItemsLog />
      </div>
    </CollectionProvider>
  );
}

type ItemProps = React.ComponentPropsWithRef<'li'> & {
  children: React.ReactNode;
  disabled?: boolean;
  index?: number;
};

function Item({ children, disabled = false, index: explicitIndex, ...props }: ItemProps) {
  const ref = React.useRef(null);
  const index = useCollectionItem({ element: ref.current, disabled }, explicitIndex);
  return (
    <li ref={ref} {...props} style={{ ...props.style, opacity: disabled ? 0.3 : undefined }}>
      {index} — {children}
    </li>
  );
}

function ItemsLog() {
  const items = useCollectionItems();
  const loggableItems = items.map(({ element, ...rest }) => ({
    element: `<li>${element?.textContent?.split('—')[1].trim()}</li>`,
    ...rest,
  }));
  console.log({ items });
  return (
    <div>
      <p>Internal data structure ↓</p>
      <pre style={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 5 }}>
        {JSON.stringify(loggableItems, null, 2)}
      </pre>
    </div>
  );
}
