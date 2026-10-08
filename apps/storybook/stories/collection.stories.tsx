import * as React from 'react';
import { Collection as CollectionPrimitive } from 'radix-ui/internal';

const { createCollection } = CollectionPrimitive;

export default { title: 'Utilities/Collection' };

export const Basic = () => (
  <List>
    <Item>Red</Item>
    <Item disabled>Green</Item>
    <Item>Blue</Item>
    <LogItems />
  </List>
);

export const WithElementInBetween = () => (
  <List>
    <div style={{ fontVariant: 'small-caps' }}>Colors</div>
    <Item>Red</Item>
    <Item disabled>Green</Item>
    <Item>Blue</Item>
    <div style={{ fontVariant: 'small-caps' }}>Words</div>
    <Item>Hello</Item>
    <Item>World</Item>
    <LogItems />
  </List>
);

const Tomato = () => <Item style={{ color: 'tomato' }}>Tomato</Item>;

export const WithWrappedItem = () => (
  <List>
    <Item>Red</Item>
    <Item disabled>Green</Item>
    <Item>Blue</Item>
    <Tomato />
    <LogItems />
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
        <Item>Red</Item>
        <Item disabled={isDisabled}>Green</Item>
        <Item>Blue</Item>
        <LogItems />
      </List>
    </>
  );
};

export const Nested = () => (
  <List>
    <Item>1</Item>
    <Item>
      2
      <List>
        <Item>2.1</Item>
        <Item>2.2</Item>
        <Item>2.3</Item>
        <LogItems name="items inside 2" />
      </List>
    </Item>
    <Item>3</Item>
    <LogItems name="top-level items" />
  </List>
);

/* -------------------------------------------------------------------------------------------------
 * List implementation
 * -----------------------------------------------------------------------------------------------*/

type ItemData = { disabled: boolean };

const [Collection, useCollection] = createCollection<React.ComponentRef<typeof Item>, ItemData>(
  'List',
);

const List: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <Collection.Provider scope={undefined}>
      <Collection.Slot scope={undefined}>
        <ul {...props} style={{ width: 200 }} />
      </Collection.Slot>
    </Collection.Provider>
  );
};

type ItemProps = React.ComponentPropsWithRef<'li'> & {
  children: React.ReactNode;
  disabled?: boolean;
};

function Item({ disabled = false, ...props }: ItemProps) {
  return (
    <Collection.ItemSlot scope={undefined} disabled={disabled}>
      <li {...props} style={{ ...props.style, opacity: disabled ? 0.3 : undefined }} />
    </Collection.ItemSlot>
  );
}

// Ensure that our implementation doesn't break if the item list/item is memoized
const MemoItem = React.memo(Item);
const MemoItems = React.memo(WrappedItems);

function LogItems({ name = 'items' }: { name?: string }) {
  const getItems = useCollection(undefined);
  React.useEffect(() => console.log(name, getItems()));
  return null;
}

const [TransitionCollection, { useCollection: useTransitionCollection }] =
  CollectionPrimitive.unstable_createCollection<HTMLLIElement, { label: string }>('TransitionList');

const INITIAL_FRUITS = ['Apple', 'Banana', 'Cherry'];

export const ViewTransitionReorder = () => {
  const [fruits, setFruits] = React.useState(INITIAL_FRUITS);
  return (
    <>
      <button
        onClick={() => {
          React.startTransition(() => {
            setFruits((current) => current.toReversed());
          });
        }}
      >
        Reverse
      </button>
      <button
        onClick={() => {
          React.startTransition(() => {
            setFruits((current) => current.slice(1));
          });
        }}
        style={{ marginLeft: 10 }}
      >
        Remove first
      </button>
      <button
        onClick={() => {
          React.startTransition(() => {
            setFruits(INITIAL_FRUITS);
          });
        }}
        style={{ marginLeft: 10 }}
      >
        Reset
      </button>

      <TransitionCollection.Provider scope={undefined}>
        <TransitionCollection.Slot scope={undefined}>
          <ul style={{ width: 200 }}>
            {fruits.map((fruit) => (
              <React.ViewTransition key={fruit}>
                <TransitionItem label={fruit} />
              </React.ViewTransition>
            ))}
          </ul>
        </TransitionCollection.Slot>
      </TransitionCollection.Provider>
    </>
  );
};

function TransitionItem({ label }: { label: string }) {
  const collection = useTransitionCollection(undefined);
  const [element, setElement] = React.useState<HTMLLIElement | null>(null);
  const position = element ? collection.indexOf(element) + 1 : 0;
  return (
    <TransitionCollection.ItemSlot scope={undefined} label={label}>
      <li ref={setElement} data-fruit={label}>
        {label} <span data-position="">{`${position} of ${collection.size}`}</span>
      </li>
    </TransitionCollection.ItemSlot>
  );
}
