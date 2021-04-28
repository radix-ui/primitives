import * as React from 'react';
import { createCollection } from './Collection';

export default { title: 'Components/Collection' };

export const Basic = () => (
  <List>
    <ListItem>Red</ListItem>
    <ListItem disabled>Green</ListItem>
    <ListItem>Blue</ListItem>
    <LogItems />
  </List>
);

export const WithElementInBetween = () => (
  <List>
    <div style={{ fontVariant: 'small-caps' }}>Colors</div>
    <ListItem>Red</ListItem>
    <ListItem disabled>Green</ListItem>
    <ListItem>Blue</ListItem>
    <div style={{ fontVariant: 'small-caps' }}>Words</div>
    <ListItem>Hello</ListItem>
    <ListItem>World</ListItem>
    <LogItems />
  </List>
);

const Tomato = () => <ListItem style={{ color: 'tomato' }}>Tomato</ListItem>;

export const WithWrappedItem = () => (
  <List>
    <ListItem>Red</ListItem>
    <ListItem disabled>Green</ListItem>
    <ListItem>Blue</ListItem>
    <Tomato />
    <LogItems />
  </List>
);

export const WithFragment = () => {
  const countries = (
    <>
      <ListItem>France</ListItem>
      <ListItem disabled>UK</ListItem>
      <ListItem>Spain</ListItem>
    </>
  );
  return (
    <List>
      {countries}
      <LogItems />
    </List>
  );
};

export const DynamicInsertion = () => {
  const [hasTomato, setHasTomato] = React.useState(false);
  const [, forceUpdate] = React.useState<any>();
  return (
    <>
      <button onClick={() => setHasTomato(!hasTomato)}>
        {hasTomato ? 'Remove' : 'Add'} Tomato
      </button>
      <button onClick={() => forceUpdate({})} style={{ marginLeft: 10 }}>
        Force Update
      </button>

      <List>
        <MemoItems hasTomato={hasTomato} />
        <LogItems />
      </List>
    </>
  );
};

function WrappedItems({ hasTomato }: any) {
  return (
    <>
      <MemoItem>Red</MemoItem>
      {hasTomato ? <Tomato /> : null}
      <MemoItem disabled>Green</MemoItem>
      <MemoItem>Blue</MemoItem>
    </>
  );
}

export const WithChangingItem = () => {
  const [isDisabled, setIsDisabled] = React.useState(false);
  return (
    <>
      <button onClick={() => setIsDisabled(!isDisabled)}>
        {isDisabled ? 'Enable' : 'Disable'} Green
      </button>

      <List>
        <ListItem>Red</ListItem>
        <ListItem disabled={isDisabled}>Green</ListItem>
        <ListItem>Blue</ListItem>
        <LogItems />
      </List>
    </>
  );
};

export const Nested = () => (
  <List>
    <ListItem>1</ListItem>
    <ListItem>
      2
      <List>
        <ListItem>2.1</ListItem>
        <ListItem>2.2</ListItem>
        <ListItem>2.3</ListItem>
        <LogItems name="items inside 2" />
      </List>
    </ListItem>
    <ListItem>3</ListItem>
    <LogItems name="top-level items" />
  </List>
);

/* -------------------------------------------------------------------------------------------------
 * List implementation
 * -----------------------------------------------------------------------------------------------*/

type ListItemOwnProps = { disabled?: boolean };

const [List, ListItem, useItems] = createCollection<ListItemOwnProps>();
List.displayName = 'List';
ListItem.displayName = 'ListItem';

// Ensure that our implementation doesn't break if the item list/item is memoized
const MemoItem = React.memo(ListItem);
const MemoItems = React.memo(WrappedItems);

function LogItems({ name = 'items' }: { name?: string }) {
  const { getItems } = useItems();
  React.useEffect(() => console.log(name, getItems()));
  return null;
}
