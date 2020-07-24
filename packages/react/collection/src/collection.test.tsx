import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import type { BaseItem } from './collection';
import { createCollection } from './collection';

describe('given a collection', () => {
  it('should index collection items properly', () => {
    const CollectionTest = () => (
      <List>
        <Item>Red</Item>
        <Item>Green</Item>
        <Item>Blue</Item>
      </List>
    );
    const rendered = render(<CollectionTest />);

    expect(rendered.getByRole('list').textContent).toBe('Red(0)Green(1)Blue(2)');
  });

  it('should not be disturbed by arbitrary elements', () => {
    const CollectionTest = () => (
      <List>
        <li>test</li>
        <Item>Red</Item>
        <li>test</li>
        <Item>Green</Item>
        <li>test</li>
        <Item>Blue</Item>
        <li>test</li>
      </List>
    );
    const rendered = render(<CollectionTest />);

    expect(rendered.getByRole('list').textContent?.replace(/test/g, '')).toBe(
      'Red(0)Green(1)Blue(2)'
    );
  });

  it('should support arbitrary wrapped items', () => {
    const Tomato = () => <Item>Tomato</Item>;
    const CollectionTest = () => (
      <List>
        <Item>Red</Item>
        <Item>Green</Item>
        <Item>Blue</Item>
        <Tomato />
      </List>
    );
    const rendered = render(<CollectionTest />);

    expect(rendered.getByRole('list').textContent).toBe('Red(0)Green(1)Blue(2)Tomato(3)');
  });

  it('should support items in a Fragment', () => {
    const CollectionTest = () => {
      const countries = (
        <>
          <Item>France</Item>
          <Item>UK</Item>
          <Item>Spain</Item>
        </>
      );
      return <List>{countries}</List>;
    };
    const rendered = render(<CollectionTest />);

    expect(rendered.getByRole('list').textContent).toBe('France(0)UK(1)Spain(2)');
  });

  it('should update when items are added', () => {
    const Tomato = () => <Item>Tomato</Item>;
    const CollectionTest = () => {
      const [hasTomato, setHasTomato] = React.useState(false);
      return (
        <>
          <button onClick={() => setHasTomato(true)}>Add Tomato</button>

          <List>
            <Item>Red</Item>
            {hasTomato ? <Tomato /> : null}
            <Item>Green</Item>
            <Item>Blue</Item>
          </List>
        </>
      );
    };
    const rendered = render(<CollectionTest />);

    expect(rendered.getByRole('list').textContent).toBe('Red(0)Green(1)Blue(2)');

    fireEvent.click(rendered.getByText('Add Tomato'));

    expect(rendered.getByRole('list').textContent).toBe('Red(0)Tomato(1)Green(2)Blue(3)');
  });

  it('should update when items are removed', () => {
    const Tomato = () => <Item>Tomato</Item>;
    const CollectionTest = () => {
      const [hasTomato, setHasTomato] = React.useState(true);
      return (
        <>
          <button onClick={() => setHasTomato(false)}>Remove Tomato</button>

          <List>
            <Item>Red</Item>
            {hasTomato ? <Tomato /> : null}
            <Item>Green</Item>
            <Item>Blue</Item>
          </List>
        </>
      );
    };
    const rendered = render(<CollectionTest />);

    expect(rendered.getByRole('list').textContent).toBe('Red(0)Tomato(1)Green(2)Blue(3)');

    fireEvent.click(rendered.getByText('Remove Tomato'));

    expect(rendered.getByRole('list').textContent).toBe('Red(0)Green(1)Blue(2)');
  });

  it('should update when items are changing', () => {
    const CollectionTest = () => {
      const [isDisabled, setIsDisabled] = React.useState(true);
      return (
        <>
          <button onClick={() => setIsDisabled(false)}>Enable Green</button>

          <List>
            <Item>Red</Item>
            <Item disabled={isDisabled}>Green</Item>
            <Item>Blue</Item>

            <ItemsLog />
          </List>
        </>
      );
    };
    const rendered = render(<CollectionTest />);

    expect(rendered.getByTestId('log').textContent).toBe(`[
  {
    "element": "<li>Red</li>",
    "disabled": false
  },
  {
    "element": "<li>Green</li>",
    "disabled": true
  },
  {
    "element": "<li>Blue</li>",
    "disabled": false
  }
]`);

    fireEvent.click(rendered.getByText('Enable Green'));

    expect(rendered.getByTestId('log').textContent).toBe(`[
  {
    "element": "<li>Red</li>",
    "disabled": false
  },
  {
    "element": "<li>Green</li>",
    "disabled": false
  },
  {
    "element": "<li>Blue</li>",
    "disabled": false
  }
]`);
  });
});

describe('given a collection with explicit indexes', () => {
  it.todo('should have the correct indexes on first render (for SSR)');
});

/* -------------------------------------------------------------------------------------------------
 * Implementation
 * -----------------------------------------------------------------------------------------------*/

type ListItemType = BaseItem & { disabled: boolean };

const { createCollectionComponent, useCollectionItem, useCollectionItems } = createCollection<
  ListItemType
>('List');

type ListProps = {
  children: React.ReactNode;
};

const List = createCollectionComponent(function List({ children }: ListProps) {
  return <ul>{children}</ul>;
});

type ItemProps = {
  children: React.ReactNode;
  disabled?: boolean;
  index?: number;
};

function Item({ children, disabled = false, index: explicitIndex }: ItemProps) {
  const ref = React.useRef(null);
  const index = useCollectionItem({ ref, disabled });
  return (
    <li ref={ref} data-disabled={disabled}>
      {children}({index})
    </li>
  );
}

function ItemsLog() {
  const items = useCollectionItems();
  const loggableItems = items.map(({ ref, ...rest }) => ({
    element: `<li>${ref.current?.textContent?.split('(')[0]}</li>`,
    ...rest,
  }));
  return <pre data-testid="log">{JSON.stringify(loggableItems, null, 2)}</pre>;
}
