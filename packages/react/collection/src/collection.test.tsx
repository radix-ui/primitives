import * as React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { type CollectionItemMap, createCollection } from './collection';

type ItemData = { label: string };

const [Collection, { useCollection, useInitCollection }] = createCollection<HTMLElement, ItemData>(
  'Test',
);

type ItemMap = CollectionItemMap<HTMLElement, ItemData>;

function CollectionSpy({ onRender }: { onRender: (map: ItemMap) => void }) {
  onRender(useCollection(undefined));
  return null;
}

function labelsOf(map: ItemMap | undefined) {
  return map ? [...map.values()].map((item) => item.label) : [];
}

describe('createCollection', () => {
  afterEach(cleanup);

  describe('Provider', () => {
    it('creates its own item map when no state is passed', () => {
      let latestMap: ItemMap | undefined;
      render(
        <Collection.Provider scope={undefined}>
          <Collection.ItemSlot scope={undefined} label="a">
            <div />
          </Collection.ItemSlot>
          <CollectionSpy onRender={(map) => (latestMap = map)} />
        </Collection.Provider>,
      );
      expect(labelsOf(latestMap)).toEqual(['a']);
    });

    it('uses the state passed from useInitCollection', () => {
      let ownerMap: ItemMap | undefined;
      function Owner({ children }: { children: React.ReactNode }) {
        const state = useInitCollection();
        ownerMap = state[0];
        return (
          <Collection.Provider scope={undefined} state={state}>
            {children}
          </Collection.Provider>
        );
      }
      render(
        <Owner>
          <Collection.ItemSlot scope={undefined} label="a">
            <div />
          </Collection.ItemSlot>
          <Collection.ItemSlot scope={undefined} label="b">
            <div />
          </Collection.ItemSlot>
        </Owner>,
      );
      expect(labelsOf(ownerMap)).toEqual(['a', 'b']);
    });

    it('keeps items of nested providers separate', () => {
      let outerMap: ItemMap | undefined;
      let innerMap: ItemMap | undefined;
      render(
        <Collection.Provider scope={undefined}>
          <Collection.ItemSlot scope={undefined} label="outer">
            <div />
          </Collection.ItemSlot>
          <CollectionSpy onRender={(map) => (outerMap = map)} />
          <Collection.Provider scope={undefined}>
            <Collection.ItemSlot scope={undefined} label="inner">
              <div />
            </Collection.ItemSlot>
            <CollectionSpy onRender={(map) => (innerMap = map)} />
          </Collection.Provider>
        </Collection.Provider>,
      );
      expect(labelsOf(outerMap)).toEqual(['outer']);
      expect(labelsOf(innerMap)).toEqual(['inner']);
    });

    it('keeps items of different collections separate', () => {
      const [OtherCollection, { useCollection: useOtherCollection }] = createCollection<
        HTMLElement,
        { label: string }
      >('Other');
      let otherMap: ItemMap | undefined;
      function OtherSpy() {
        otherMap = useOtherCollection(undefined);
        return null;
      }
      let testMap: ItemMap | undefined;
      render(
        <Collection.Provider scope={undefined}>
          <OtherCollection.Provider scope={undefined}>
            <Collection.ItemSlot scope={undefined} label="test">
              <div />
            </Collection.ItemSlot>
            <OtherCollection.ItemSlot scope={undefined} label="other">
              <div />
            </OtherCollection.ItemSlot>
            <CollectionSpy onRender={(map) => (testMap = map)} />
            <OtherSpy />
          </OtherCollection.Provider>
        </Collection.Provider>,
      );
      expect(labelsOf(testMap)).toEqual(['test']);
      expect(labelsOf(otherMap)).toEqual(['other']);
    });
  });

  describe('useCollection', () => {
    it('returns an empty map outside of a provider', () => {
      let latestMap: ItemMap | undefined;
      render(<CollectionSpy onRender={(map) => (latestMap = map)} />);
      expect(latestMap!.size).toBe(0);
    });

    it('supports index-based lookups on the returned map', () => {
      let latestMap: ItemMap | undefined;
      render(
        <Collection.Provider scope={undefined}>
          <Collection.ItemSlot scope={undefined} label="a">
            <div data-testid="a" />
          </Collection.ItemSlot>
          <Collection.ItemSlot scope={undefined} label="b">
            <div data-testid="b" />
          </Collection.ItemSlot>
          <Collection.ItemSlot scope={undefined} label="c">
            <div data-testid="c" />
          </Collection.ItemSlot>
          <CollectionSpy onRender={(map) => (latestMap = map)} />
        </Collection.Provider>,
      );
      const map = latestMap!;
      expect(map.at(0)?.label).toBe('a');
      expect(map.at(-1)?.label).toBe('c');
      expect(map.indexOf(screen.getByTestId('b'))).toBe(1);
      expect(map.from(screen.getByTestId('b'), 1)?.label).toBe('c');
      expect(map.from(screen.getByTestId('b'), -1)?.label).toBe('a');
    });
  });

  describe('Slot', () => {
    it('renders its child without a wrapper element', () => {
      const { container } = render(
        <Collection.Provider scope={undefined}>
          <Collection.Slot scope={undefined}>
            <ul data-testid="list" />
          </Collection.Slot>
        </Collection.Provider>,
      );
      expect(container.firstElementChild).toBe(screen.getByTestId('list'));
    });

    it('forwards its ref to the child element', () => {
      const ref = React.createRef<HTMLElement>();
      render(
        <Collection.Provider scope={undefined}>
          <Collection.Slot scope={undefined} ref={ref}>
            <ul data-testid="list" />
          </Collection.Slot>
        </Collection.Provider>,
      );
      expect(ref.current).toBe(screen.getByTestId('list'));
    });
  });

  describe('ItemSlot', () => {
    it('renders its child with the collection item attribute', () => {
      render(
        <Collection.Provider scope={undefined}>
          <Collection.ItemSlot scope={undefined} label="a">
            <div data-testid="a" />
          </Collection.ItemSlot>
        </Collection.Provider>,
      );
      expect(screen.getByTestId('a')).toHaveAttribute('data-radix-collection-item', '');
    });

    it('forwards its ref to the child element', () => {
      const ref = React.createRef<HTMLElement>();
      render(
        <Collection.Provider scope={undefined}>
          <Collection.ItemSlot scope={undefined} label="a" ref={ref}>
            <div data-testid="a" />
          </Collection.ItemSlot>
        </Collection.Provider>,
      );
      expect(ref.current).toBe(screen.getByTestId('a'));
    });

    it('registers the element as the key along with the item data', () => {
      let latestMap: ItemMap | undefined;
      render(
        <Collection.Provider scope={undefined}>
          <Collection.ItemSlot scope={undefined} label="a" id="item-a">
            <div data-testid="a" />
          </Collection.ItemSlot>
          <CollectionSpy onRender={(map) => (latestMap = map)} />
        </Collection.Provider>,
      );
      const element = screen.getByTestId('a');
      expect([...latestMap!.keys()]).toEqual([element]);
      expect(latestMap?.get(element)).toEqual({ label: 'a', id: 'item-a', element });
    });

    it('orders items by document position', () => {
      let latestMap: ItemMap | undefined;
      render(
        <Collection.Provider scope={undefined}>
          <Collection.ItemSlot scope={undefined} label="a">
            <div />
          </Collection.ItemSlot>
          <Collection.ItemSlot scope={undefined} label="b">
            <div />
          </Collection.ItemSlot>
          <Collection.ItemSlot scope={undefined} label="c">
            <div />
          </Collection.ItemSlot>
          <CollectionSpy onRender={(map) => (latestMap = map)} />
        </Collection.Provider>,
      );
      expect(labelsOf(latestMap)).toEqual(['a', 'b', 'c']);
    });

    it('orders items nested at different depths by document position', () => {
      let latestMap: ItemMap | undefined;
      render(
        <Collection.Provider scope={undefined}>
          <section>
            <Collection.ItemSlot scope={undefined} label="a">
              <div />
            </Collection.ItemSlot>
            <div>
              <div>
                <Collection.ItemSlot scope={undefined} label="b">
                  <div />
                </Collection.ItemSlot>
              </div>
            </div>
          </section>
          <Collection.ItemSlot scope={undefined} label="c">
            <div />
          </Collection.ItemSlot>
          <CollectionSpy onRender={(map) => (latestMap = map)} />
        </Collection.Provider>,
      );
      expect(labelsOf(latestMap)).toEqual(['a', 'b', 'c']);
    });

    it('sorts an item mounted later into its document position', () => {
      let latestMap: ItemMap | undefined;
      function List({ showMiddle }: { showMiddle: boolean }) {
        return (
          <Collection.Provider scope={undefined}>
            <Collection.ItemSlot scope={undefined} label="a">
              <div />
            </Collection.ItemSlot>
            {showMiddle ? (
              <Collection.ItemSlot scope={undefined} label="b">
                <div />
              </Collection.ItemSlot>
            ) : null}
            <Collection.ItemSlot scope={undefined} label="c">
              <div />
            </Collection.ItemSlot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </Collection.Provider>
        );
      }
      const { rerender } = render(<List showMiddle={false} />);
      expect(labelsOf(latestMap)).toEqual(['a', 'c']);

      rerender(<List showMiddle />);
      expect(labelsOf(latestMap)).toEqual(['a', 'b', 'c']);
    });

    it('removes an item when it unmounts', () => {
      let latestMap: ItemMap | undefined;
      function List({ showMiddle }: { showMiddle: boolean }) {
        return (
          <Collection.Provider scope={undefined}>
            <Collection.ItemSlot scope={undefined} label="a">
              <div />
            </Collection.ItemSlot>
            {showMiddle ? (
              <Collection.ItemSlot scope={undefined} label="b">
                <div />
              </Collection.ItemSlot>
            ) : null}
            <Collection.ItemSlot scope={undefined} label="c">
              <div />
            </Collection.ItemSlot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </Collection.Provider>
        );
      }
      const { rerender } = render(<List showMiddle />);
      expect(labelsOf(latestMap)).toEqual(['a', 'b', 'c']);

      rerender(<List showMiddle={false} />);
      expect(labelsOf(latestMap)).toEqual(['a', 'c']);
      expect(latestMap!.indexOf(latestMap!.keyAt(1)!)).toBe(1);
    });

    it('removes every item when the list unmounts', () => {
      let latestMap: ItemMap | undefined;
      function List({ items }: { items: string[] }) {
        return (
          <Collection.Provider scope={undefined}>
            {items.map((item) => (
              <Collection.ItemSlot key={item} scope={undefined} label={item}>
                <div />
              </Collection.ItemSlot>
            ))}
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </Collection.Provider>
        );
      }
      const { rerender } = render(<List items={['a', 'b', 'c']} />);
      expect(latestMap?.size).toBe(3);
      rerender(<List items={[]} />);
      expect(latestMap?.size).toBe(0);
    });

    it('updates item data in place when props change', () => {
      let latestMap: ItemMap | undefined;
      function List({ middleLabel }: { middleLabel: string }) {
        return (
          <Collection.Provider scope={undefined}>
            <Collection.ItemSlot scope={undefined} label="a">
              <div />
            </Collection.ItemSlot>
            <Collection.ItemSlot scope={undefined} label={middleLabel}>
              <div data-testid="middle" />
            </Collection.ItemSlot>
            <Collection.ItemSlot scope={undefined} label="c">
              <div />
            </Collection.ItemSlot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </Collection.Provider>
        );
      }
      const { rerender } = render(<List middleLabel="b" />);
      rerender(<List middleLabel="updated" />);
      expect(labelsOf(latestMap)).toEqual(['a', 'updated', 'c']);
      expect(latestMap?.get(screen.getByTestId('middle'))?.label).toBe('updated');
    });

    it('keeps the same map when rerendered with equal item data', () => {
      const maps: ItemMap[] = [];
      function List({ count }: { count: number }) {
        return (
          <Collection.Provider scope={undefined}>
            <Collection.ItemSlot scope={undefined} label="a">
              <div data-count={count} />
            </Collection.ItemSlot>
            <CollectionSpy onRender={(map) => maps.push(map)} />
          </Collection.Provider>
        );
      }
      const { rerender } = render(<List count={1} />);
      const mapBeforeRerender = maps.at(-1);
      rerender(<List count={2} />);
      expect(maps.at(-1)).toBe(mapBeforeRerender);
    });

    it('replaces the map with a new instance when items change', () => {
      const maps: ItemMap[] = [];
      function List({ items }: { items: string[] }) {
        return (
          <Collection.Provider scope={undefined}>
            {items.map((item) => (
              <Collection.ItemSlot key={item} scope={undefined} label={item}>
                <div />
              </Collection.ItemSlot>
            ))}
            <CollectionSpy onRender={(map) => maps.push(map)} />
          </Collection.Provider>
        );
      }
      const { rerender } = render(<List items={['a']} />);
      const mapBeforeAdd = maps.at(-1);
      rerender(<List items={['a', 'b']} />);
      const mapAfterAdd = maps.at(-1);
      expect(mapAfterAdd).not.toBe(mapBeforeAdd);

      rerender(<List items={['a']} />);
      expect(maps.at(-1)).not.toBe(mapAfterAdd);
    });

    it('replaces the entry when the child element changes', () => {
      let latestMap: ItemMap | undefined;
      function List({ asSpan }: { asSpan: boolean }) {
        return (
          <Collection.Provider scope={undefined}>
            <Collection.ItemSlot scope={undefined} label="a">
              {asSpan ? <span data-testid="item" /> : <div data-testid="item" />}
            </Collection.ItemSlot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </Collection.Provider>
        );
      }
      const { rerender } = render(<List asSpan={false} />);
      rerender(<List asSpan />);
      const element = screen.getByTestId('item');
      expect(element.tagName).toBe('SPAN');
      expect([...latestMap!.keys()]).toEqual([element]);
      expect(latestMap?.get(element)?.element).toBe(element);
    });

    it('does not register duplicate items in strict mode', () => {
      let latestMap: ItemMap | undefined;
      render(
        <React.StrictMode>
          <Collection.Provider scope={undefined}>
            <Collection.ItemSlot scope={undefined} label="a">
              <div />
            </Collection.ItemSlot>
            <Collection.ItemSlot scope={undefined} label="b">
              <div />
            </Collection.ItemSlot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </Collection.Provider>
        </React.StrictMode>,
      );
      expect(labelsOf(latestMap)).toEqual(['a', 'b']);
      expect([...latestMap!.keys()].every((element) => element.isConnected)).toBe(true);
    });

    // TODO: Fix. The map is only sorted when an item mounts, so keyed reorders
    // that move DOM nodes without remounting leave the map in the old order.
    it.fails('reorders items when React moves them in the DOM', async () => {
      let latestMap: ItemMap | undefined;
      function List({ items }: { items: string[] }) {
        return (
          <Collection.Provider scope={undefined}>
            <Collection.Slot scope={undefined}>
              <ul>
                {items.map((item) => (
                  <Collection.ItemSlot key={item} scope={undefined} label={item}>
                    <li>{item}</li>
                  </Collection.ItemSlot>
                ))}
              </ul>
            </Collection.Slot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </Collection.Provider>
        );
      }
      const { rerender } = render(<List items={['a', 'b', 'c']} />);
      rerender(<List items={['c', 'a', 'b']} />);
      await act(async () => {});
      expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
        'c',
        'a',
        'b',
      ]);
      expect(labelsOf(latestMap)).toEqual(['c', 'a', 'b']);
    });

    // TODO: Fix. The add updater calls `map.set` on the previous state before
    // copying it.
    it.fails('does not modify the previous map when an item is added', () => {
      const maps: ItemMap[] = [];
      function List({ items }: { items: string[] }) {
        return (
          <Collection.Provider scope={undefined}>
            {items.map((item) => (
              <Collection.ItemSlot key={item} scope={undefined} label={item}>
                <div />
              </Collection.ItemSlot>
            ))}
            <CollectionSpy onRender={(map) => maps.push(map)} />
          </Collection.Provider>
        );
      }
      const { rerender } = render(<List items={['a', 'b']} />);
      const mapBeforeAdd = maps.at(-1)!;
      rerender(<List items={['a', 'b', 'c']} />);
      expect(labelsOf(maps.at(-1))).toEqual(['a', 'b', 'c']);
      expect(labelsOf(mapBeforeAdd)).toEqual(['a', 'b']);
    });

    // TODO: Fix. The cleanup updater calls `map.delete` on the previous state
    // before copying it.
    it.fails('does not modify the previous map when an item is removed', () => {
      const maps: ItemMap[] = [];
      function List({ items }: { items: string[] }) {
        return (
          <Collection.Provider scope={undefined}>
            {items.map((item) => (
              <Collection.ItemSlot key={item} scope={undefined} label={item}>
                <div />
              </Collection.ItemSlot>
            ))}
            <CollectionSpy onRender={(map) => maps.push(map)} />
          </Collection.Provider>
        );
      }
      const { rerender } = render(<List items={['a', 'b', 'c']} />);
      const mapBeforeRemove = maps.at(-1)!;
      rerender(<List items={['a', 'b']} />);
      expect(labelsOf(maps.at(-1))).toEqual(['a', 'b']);
      expect(labelsOf(mapBeforeRemove)).toEqual(['a', 'b', 'c']);
    });
  });
});
