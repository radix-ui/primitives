import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';
import { type CollectionDict, createCollection } from './collection';

type ItemData = { label: string };

const [TestCollection, { useCollection, useGetCollection, useInitCollection }] = createCollection<
  HTMLElement,
  ItemData
>('Test');

type TestCollectionDict = CollectionDict<HTMLElement, ItemData>;

function CollectionSpy({ onRender }: { onRender: (map: TestCollectionDict) => void }) {
  onRender(useCollection(undefined));
  return null;
}

function labelsOf(map: TestCollectionDict | undefined) {
  return map ? [...map.values()].map((item) => item.label) : [];
}

describe('createCollection', () => {
  afterEach(cleanup);

  describe('Provider', () => {
    it('creates its own item map when no state is passed', () => {
      let latestMap: TestCollectionDict | undefined;
      render(
        <TestCollection.Provider scope={undefined}>
          <TestCollection.ItemSlot scope={undefined} label="a">
            <div />
          </TestCollection.ItemSlot>
          <CollectionSpy onRender={(map) => (latestMap = map)} />
        </TestCollection.Provider>,
      );
      expect(labelsOf(latestMap)).toEqual(['a']);
    });

    it('uses the state passed from useInitCollection', () => {
      let ownerMap: TestCollectionDict | undefined;
      function Owner({ children }: { children: React.ReactNode }) {
        const state = useInitCollection();
        ownerMap = state[0];
        return (
          <TestCollection.Provider scope={undefined} state={state}>
            {children}
          </TestCollection.Provider>
        );
      }
      render(
        <Owner>
          <TestCollection.ItemSlot scope={undefined} label="a">
            <div />
          </TestCollection.ItemSlot>
          <TestCollection.ItemSlot scope={undefined} label="b">
            <div />
          </TestCollection.ItemSlot>
        </Owner>,
      );
      expect(labelsOf(ownerMap)).toEqual(['a', 'b']);
    });

    it('keeps items of nested providers separate', () => {
      let outerMap: TestCollectionDict | undefined;
      let innerMap: TestCollectionDict | undefined;
      render(
        <TestCollection.Provider scope={undefined}>
          <TestCollection.ItemSlot scope={undefined} label="outer">
            <div />
          </TestCollection.ItemSlot>
          <CollectionSpy onRender={(map) => (outerMap = map)} />
          <TestCollection.Provider scope={undefined}>
            <TestCollection.ItemSlot scope={undefined} label="inner">
              <div />
            </TestCollection.ItemSlot>
            <CollectionSpy onRender={(map) => (innerMap = map)} />
          </TestCollection.Provider>
        </TestCollection.Provider>,
      );
      expect(labelsOf(outerMap)).toEqual(['outer']);
      expect(labelsOf(innerMap)).toEqual(['inner']);
    });

    it('keeps items of different collections separate', () => {
      const [OtherCollection, { useCollection: useOtherCollection }] = createCollection<
        HTMLElement,
        { label: string }
      >('Other');
      let otherMap: TestCollectionDict | undefined;
      function OtherSpy() {
        otherMap = useOtherCollection(undefined);
        return null;
      }
      let testMap: TestCollectionDict | undefined;
      render(
        <TestCollection.Provider scope={undefined}>
          <OtherCollection.Provider scope={undefined}>
            <TestCollection.ItemSlot scope={undefined} label="test">
              <div />
            </TestCollection.ItemSlot>
            <OtherCollection.ItemSlot scope={undefined} label="other">
              <div />
            </OtherCollection.ItemSlot>
            <CollectionSpy onRender={(map) => (testMap = map)} />
            <OtherSpy />
          </OtherCollection.Provider>
        </TestCollection.Provider>,
      );
      expect(labelsOf(testMap)).toEqual(['test']);
      expect(labelsOf(otherMap)).toEqual(['other']);
    });
  });

  describe('useCollection', () => {
    it('throws outside of a provider', () => {
      expect(() => render(<CollectionSpy onRender={() => {}} />)).toThrow(
        /`TestCollectionConsumer` must be used within `TestCollectionProvider`/,
      );
    });

    it('supports index-based lookups on the returned map', () => {
      let latestMap: TestCollectionDict | undefined;
      render(
        <TestCollection.Provider scope={undefined}>
          <TestCollection.ItemSlot scope={undefined} label="a">
            <div data-testid="a" />
          </TestCollection.ItemSlot>
          <TestCollection.ItemSlot scope={undefined} label="b">
            <div data-testid="b" />
          </TestCollection.ItemSlot>
          <TestCollection.ItemSlot scope={undefined} label="c">
            <div data-testid="c" />
          </TestCollection.ItemSlot>
          <CollectionSpy onRender={(map) => (latestMap = map)} />
        </TestCollection.Provider>,
      );
      const map = latestMap!;
      expect(map.at(0)?.label).toBe('a');
      expect(map.at(-1)?.label).toBe('c');
      expect(map.indexOf(screen.getByTestId('b'))).toBe(1);
      expect(map.from(screen.getByTestId('b'), 1)?.label).toBe('c');
      expect(map.from(screen.getByTestId('b'), -1)?.label).toBe('a');
    });

    it('returns an empty map during server rendering', () => {
      let latestMap: TestCollectionDict | undefined;
      const html = renderToString(
        <TestCollection.Provider scope={undefined}>
          <TestCollection.ItemSlot scope={undefined} label="a">
            <div data-testid="a" />
          </TestCollection.ItemSlot>
          <CollectionSpy onRender={(map) => (latestMap = map)} />
        </TestCollection.Provider>,
      );
      expect(html).toContain('data-radix-collection-item');
      expect(latestMap?.size).toBe(0);
    });
  });

  describe('useGetCollection', () => {
    it('throws outside of a provider', () => {
      function GetterSpy() {
        useGetCollection(undefined);
        return null;
      }
      expect(() => render(<GetterSpy />)).toThrow(
        /`TestCollectionConsumer` must be used within `TestCollectionProvider`/,
      );
    });

    it('returns the current items when called from an event handler', () => {
      let labelsOnClick: string[] = [];
      function LabelsButton() {
        const getCollection = useGetCollection(undefined);
        return <button onClick={() => (labelsOnClick = labelsOf(getCollection()))}>read</button>;
      }
      function List({ items }: { items: string[] }) {
        return (
          <TestCollection.Provider scope={undefined}>
            {items.map((label) => (
              <TestCollection.ItemSlot key={label} scope={undefined} label={label}>
                <div />
              </TestCollection.ItemSlot>
            ))}
            <LabelsButton />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List items={['a', 'b']} />);
      fireEvent.click(screen.getByRole('button'));
      expect(labelsOnClick).toEqual(['a', 'b']);

      rerender(<List items={['a', 'b', 'c']} />);
      fireEvent.click(screen.getByRole('button'));
      expect(labelsOnClick).toEqual(['a', 'b', 'c']);

      rerender(<List items={['c']} />);
      fireEvent.click(screen.getByRole('button'));
      expect(labelsOnClick).toEqual(['c']);
    });

    it('returns items in document order after they are reordered', async () => {
      let labelsOnClick: string[] = [];
      function LabelsButton() {
        const getCollection = useGetCollection(undefined);
        return <button onClick={() => (labelsOnClick = labelsOf(getCollection()))}>read</button>;
      }
      function List({ items }: { items: string[] }) {
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.Slot scope={undefined}>
              <div>
                {items.map((label) => (
                  <TestCollection.ItemSlot key={label} scope={undefined} label={label}>
                    <div />
                  </TestCollection.ItemSlot>
                ))}
              </div>
            </TestCollection.Slot>
            <LabelsButton />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List items={['a', 'b', 'c']} />);
      await act(async () => {
        rerender(<List items={['c', 'a', 'b']} />);
      });
      fireEvent.click(screen.getByRole('button'));
      expect(labelsOnClick).toEqual(['c', 'a', 'b']);
    });

    it('returns the same function when items change', () => {
      const getters: Array<() => TestCollectionDict> = [];
      function GetterSpy() {
        getters.push(useGetCollection(undefined));
        return null;
      }
      function List({ items }: { items: string[] }) {
        return (
          <TestCollection.Provider scope={undefined}>
            {items.map((label) => (
              <TestCollection.ItemSlot key={label} scope={undefined} label={label}>
                <div />
              </TestCollection.ItemSlot>
            ))}
            <GetterSpy />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List items={['a']} />);
      rerender(<List items={['a', 'b']} />);
      rerender(<List items={['b']} />);
      expect(getters.length).toBeGreaterThan(1);
      expect(new Set(getters).size).toBe(1);
    });

    it('does not re-render its consumer when items change', () => {
      let renderCount = 0;
      const MemoizedGetterSpy = React.memo(function MemoizedGetterSpy() {
        useGetCollection(undefined);
        renderCount++;
        return null;
      });
      function List({ items }: { items: string[] }) {
        return (
          <TestCollection.Provider scope={undefined}>
            {items.map((label) => (
              <TestCollection.ItemSlot key={label} scope={undefined} label={label}>
                <div />
              </TestCollection.ItemSlot>
            ))}
            <MemoizedGetterSpy />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List items={['a']} />);
      expect(renderCount).toBe(1);

      rerender(<List items={['a', 'b', 'c']} />);
      rerender(<List items={['c']} />);
      expect(renderCount).toBe(1);
    });

    it('re-renders a useCollection consumer when items change, unlike useGetCollection', () => {
      let collectionRenderCount = 0;
      let getterRenderCount = 0;
      const MemoizedCollectionSpy = React.memo(function MemoizedCollectionSpy() {
        useCollection(undefined);
        collectionRenderCount++;
        return null;
      });
      const MemoizedGetterSpy = React.memo(function MemoizedGetterSpy() {
        useGetCollection(undefined);
        getterRenderCount++;
        return null;
      });
      function List({ items }: { items: string[] }) {
        return (
          <TestCollection.Provider scope={undefined}>
            {items.map((label) => (
              <TestCollection.ItemSlot key={label} scope={undefined} label={label}>
                <div />
              </TestCollection.ItemSlot>
            ))}
            <MemoizedCollectionSpy />
            <MemoizedGetterSpy />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List items={['a']} />);
      const collectionRenderCountAfterMount = collectionRenderCount;
      const getterRenderCountAfterMount = getterRenderCount;

      rerender(<List items={['a', 'b']} />);
      expect(collectionRenderCount).toBeGreaterThan(collectionRenderCountAfterMount);
      expect(getterRenderCount).toBe(getterRenderCountAfterMount);
    });

    it('reads from the nearest provider', () => {
      let labelsOnClick: string[] = [];
      function LabelsButton() {
        const getCollection = useGetCollection(undefined);
        return <button onClick={() => (labelsOnClick = labelsOf(getCollection()))}>read</button>;
      }
      render(
        <TestCollection.Provider scope={undefined}>
          <TestCollection.ItemSlot scope={undefined} label="outer">
            <div />
          </TestCollection.ItemSlot>
          <TestCollection.Provider scope={undefined}>
            <TestCollection.ItemSlot scope={undefined} label="inner">
              <div />
            </TestCollection.ItemSlot>
            <LabelsButton />
          </TestCollection.Provider>
        </TestCollection.Provider>,
      );
      fireEvent.click(screen.getByRole('button'));
      expect(labelsOnClick).toEqual(['inner']);
    });

    it('includes an item mounted in the same commit when read from a layout effect', () => {
      let labelsInLayoutEffect: string[] = [];
      function LayoutEffectReader({ items }: { items: string[] }) {
        const getCollection = useGetCollection(undefined);
        React.useLayoutEffect(() => {
          labelsInLayoutEffect = labelsOf(getCollection());
        }, [getCollection, items]);
        return null;
      }
      function List({ items }: { items: string[] }) {
        return (
          <TestCollection.Provider scope={undefined}>
            {items.map((label) => (
              <TestCollection.ItemSlot key={label} scope={undefined} label={label}>
                <div />
              </TestCollection.ItemSlot>
            ))}
            <LayoutEffectReader items={items} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List items={['a', 'c']} />);
      expect(labelsInLayoutEffect).toEqual(['a', 'c']);

      rerender(<List items={['a', 'b', 'c']} />);
      expect(labelsInLayoutEffect).toEqual(['a', 'b', 'c']);
    });

    it('excludes an item unmounted in the same commit when read from a layout effect', () => {
      let labelsInLayoutEffect: string[] = [];
      function LayoutEffectReader({ items }: { items: string[] }) {
        const getCollection = useGetCollection(undefined);
        React.useLayoutEffect(() => {
          labelsInLayoutEffect = labelsOf(getCollection());
        }, [getCollection, items]);
        return null;
      }
      function List({ items }: { items: string[] }) {
        return (
          <TestCollection.Provider scope={undefined}>
            {items.map((label) => (
              <TestCollection.ItemSlot key={label} scope={undefined} label={label}>
                <div />
              </TestCollection.ItemSlot>
            ))}
            <LayoutEffectReader items={items} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List items={['a', 'b', 'c']} />);
      rerender(<List items={['a', 'c']} />);
      expect(labelsInLayoutEffect).toEqual(['a', 'c']);
    });

    it('returns reordered items in document order when read from a layout effect', () => {
      let labelsInLayoutEffect: string[] = [];
      function LayoutEffectReader({ items }: { items: string[] }) {
        const getCollection = useGetCollection(undefined);
        React.useLayoutEffect(() => {
          labelsInLayoutEffect = labelsOf(getCollection());
        }, [getCollection, items]);
        return null;
      }
      function List({ items }: { items: string[] }) {
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.Slot scope={undefined}>
              <div>
                {items.map((label) => (
                  <TestCollection.ItemSlot key={label} scope={undefined} label={label}>
                    <div />
                  </TestCollection.ItemSlot>
                ))}
              </div>
            </TestCollection.Slot>
            <LayoutEffectReader items={items} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List items={['a', 'b', 'c']} />);
      rerender(<List items={['c', 'a', 'b']} />);
      expect(labelsInLayoutEffect).toEqual(['c', 'a', 'b']);
    });

    it('returns updated item data when read from a layout effect', () => {
      let labelsInLayoutEffect: string[] = [];
      function LayoutEffectReader({ middleLabel }: { middleLabel: string }) {
        const getCollection = useGetCollection(undefined);
        React.useLayoutEffect(() => {
          labelsInLayoutEffect = labelsOf(getCollection());
        }, [getCollection, middleLabel]);
        return null;
      }
      function List({ middleLabel }: { middleLabel: string }) {
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.ItemSlot scope={undefined} label="a">
              <div />
            </TestCollection.ItemSlot>
            <TestCollection.ItemSlot scope={undefined} label={middleLabel}>
              <div />
            </TestCollection.ItemSlot>
            <TestCollection.ItemSlot scope={undefined} label="c">
              <div />
            </TestCollection.ItemSlot>
            <LayoutEffectReader middleLabel={middleLabel} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List middleLabel="b" />);
      rerender(<List middleLabel="updated" />);
      expect(labelsInLayoutEffect).toEqual(['a', 'updated', 'c']);
    });

    // `ItemSlot` sets state from its ref callback, which React calls with `null`
    // while hiding the boundary's content. That update prevents the fallback
    // from committing, so the content is never hidden.
    it.fails('excludes items hidden when a Suspense boundary suspends again', async () => {
      const resolvedPromise = Object.assign(Promise.resolve(), {
        status: 'fulfilled' as const,
        value: undefined,
      });
      const pendingPromise = new Promise<void>(() => {});
      function Deferred({
        promise,
        children,
      }: {
        promise: Promise<void>;
        children: React.ReactNode;
      }) {
        React.use(promise);
        return children;
      }
      let labelsOnClick: string[] = [];
      function LabelsButton() {
        const getCollection = useGetCollection(undefined);
        return <button onClick={() => (labelsOnClick = labelsOf(getCollection()))}>read</button>;
      }
      function List({ promise }: { promise: Promise<void> }) {
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.ItemSlot scope={undefined} label="a">
              <div />
            </TestCollection.ItemSlot>
            <React.Suspense fallback={<span>loading</span>}>
              <Deferred promise={promise}>
                <TestCollection.ItemSlot scope={undefined} label="b">
                  <div />
                </TestCollection.ItemSlot>
              </Deferred>
            </React.Suspense>
            <TestCollection.ItemSlot scope={undefined} label="c">
              <div />
            </TestCollection.ItemSlot>
            <LabelsButton />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List promise={resolvedPromise} />);
      fireEvent.click(screen.getByRole('button'));
      expect(labelsOnClick).toEqual(['a', 'b', 'c']);

      await act(async () => {
        rerender(<List promise={pendingPromise} />);
      });
      expect(screen.getByText('loading')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button'));
      expect(labelsOnClick).toEqual(['a', 'c']);
    });

    it('does not expose methods that mutate the collection', () => {
      expectTypeOf<TestCollectionDict>().not.toHaveProperty('set');
      expectTypeOf<TestCollectionDict>().not.toHaveProperty('insert');
      expectTypeOf<TestCollectionDict>().not.toHaveProperty('setBefore');
      expectTypeOf<TestCollectionDict>().not.toHaveProperty('setAfter');
      expectTypeOf<TestCollectionDict>().not.toHaveProperty('delete');
      expectTypeOf<TestCollectionDict>().not.toHaveProperty('deleteAt');
      expectTypeOf<TestCollectionDict>().not.toHaveProperty('clear');
      expectTypeOf<TestCollectionDict>().not.toHaveProperty('sort');
    });
  });

  describe('Slot', () => {
    it('renders its child without a wrapper element', () => {
      const { container } = render(
        <TestCollection.Provider scope={undefined}>
          <TestCollection.Slot scope={undefined}>
            <ul data-testid="list" />
          </TestCollection.Slot>
        </TestCollection.Provider>,
      );
      expect(container.firstElementChild).toBe(screen.getByTestId('list'));
    });

    it('forwards its ref to the child element', () => {
      const ref = React.createRef<HTMLElement>();
      render(
        <TestCollection.Provider scope={undefined}>
          <TestCollection.Slot scope={undefined} ref={ref}>
            <ul data-testid="list" />
          </TestCollection.Slot>
        </TestCollection.Provider>,
      );
      expect(ref.current).toBe(screen.getByTestId('list'));
    });
  });

  describe('ItemSlot', () => {
    it('throws outside of a provider', () => {
      expect(() =>
        render(
          <TestCollection.ItemSlot scope={undefined} label="a">
            <div />
          </TestCollection.ItemSlot>,
        ),
      ).toThrow(/`TestCollectionItemSlot` must be used within `TestCollectionProvider`/);
    });

    it('renders its child with the collection item attribute', () => {
      render(
        <TestCollection.Provider scope={undefined}>
          <TestCollection.ItemSlot scope={undefined} label="a">
            <div data-testid="a" />
          </TestCollection.ItemSlot>
        </TestCollection.Provider>,
      );
      expect(screen.getByTestId('a')).toHaveAttribute('data-radix-collection-item', '');
    });

    it('forwards its ref to the child element', () => {
      const ref = React.createRef<HTMLElement>();
      render(
        <TestCollection.Provider scope={undefined}>
          <TestCollection.ItemSlot scope={undefined} label="a" ref={ref}>
            <div data-testid="a" />
          </TestCollection.ItemSlot>
        </TestCollection.Provider>,
      );
      expect(ref.current).toBe(screen.getByTestId('a'));
    });

    it('registers the element as the key along with the item data', () => {
      let latestMap: TestCollectionDict | undefined;
      render(
        <TestCollection.Provider scope={undefined}>
          <TestCollection.ItemSlot scope={undefined} label="a" id="item-a">
            <div data-testid="a" />
          </TestCollection.ItemSlot>
          <CollectionSpy onRender={(map) => (latestMap = map)} />
        </TestCollection.Provider>,
      );
      const element = screen.getByTestId('a');
      expect([...latestMap!.keys()]).toEqual([element]);
      expect(latestMap?.get(element)).toEqual({ label: 'a', id: 'item-a', element });
    });

    it('orders items by document position', () => {
      let latestMap: TestCollectionDict | undefined;
      render(
        <TestCollection.Provider scope={undefined}>
          <TestCollection.ItemSlot scope={undefined} label="a">
            <div />
          </TestCollection.ItemSlot>
          <TestCollection.ItemSlot scope={undefined} label="b">
            <div />
          </TestCollection.ItemSlot>
          <TestCollection.ItemSlot scope={undefined} label="c">
            <div />
          </TestCollection.ItemSlot>
          <CollectionSpy onRender={(map) => (latestMap = map)} />
        </TestCollection.Provider>,
      );
      expect(labelsOf(latestMap)).toEqual(['a', 'b', 'c']);
    });

    it('orders items nested at different depths by document position', () => {
      let latestMap: TestCollectionDict | undefined;
      render(
        <TestCollection.Provider scope={undefined}>
          <section>
            <TestCollection.ItemSlot scope={undefined} label="a">
              <div />
            </TestCollection.ItemSlot>
            <div>
              <div>
                <TestCollection.ItemSlot scope={undefined} label="b">
                  <div />
                </TestCollection.ItemSlot>
              </div>
            </div>
          </section>
          <TestCollection.ItemSlot scope={undefined} label="c">
            <div />
          </TestCollection.ItemSlot>
          <CollectionSpy onRender={(map) => (latestMap = map)} />
        </TestCollection.Provider>,
      );
      expect(labelsOf(latestMap)).toEqual(['a', 'b', 'c']);
    });

    it('sorts an item mounted later into its document position', () => {
      let latestMap: TestCollectionDict | undefined;
      function List({ showMiddle }: { showMiddle: boolean }) {
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.ItemSlot scope={undefined} label="a">
              <div />
            </TestCollection.ItemSlot>
            {showMiddle ? (
              <TestCollection.ItemSlot scope={undefined} label="b">
                <div />
              </TestCollection.ItemSlot>
            ) : null}
            <TestCollection.ItemSlot scope={undefined} label="c">
              <div />
            </TestCollection.ItemSlot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List showMiddle={false} />);
      expect(labelsOf(latestMap)).toEqual(['a', 'c']);

      rerender(<List showMiddle />);
      expect(labelsOf(latestMap)).toEqual(['a', 'b', 'c']);
    });

    it('removes an item when it unmounts', () => {
      let latestMap: TestCollectionDict | undefined;
      function List({ showMiddle }: { showMiddle: boolean }) {
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.ItemSlot scope={undefined} label="a">
              <div />
            </TestCollection.ItemSlot>
            {showMiddle ? (
              <TestCollection.ItemSlot scope={undefined} label="b">
                <div />
              </TestCollection.ItemSlot>
            ) : null}
            <TestCollection.ItemSlot scope={undefined} label="c">
              <div />
            </TestCollection.ItemSlot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List showMiddle />);
      expect(labelsOf(latestMap)).toEqual(['a', 'b', 'c']);

      rerender(<List showMiddle={false} />);
      expect(labelsOf(latestMap)).toEqual(['a', 'c']);
      expect(latestMap!.indexOf(latestMap!.keyAt(1)!)).toBe(1);
    });

    it('removes every item when the list unmounts', () => {
      let latestMap: TestCollectionDict | undefined;
      function List({ items }: { items: string[] }) {
        return (
          <TestCollection.Provider scope={undefined}>
            {items.map((item) => (
              <TestCollection.ItemSlot key={item} scope={undefined} label={item}>
                <div />
              </TestCollection.ItemSlot>
            ))}
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List items={['a', 'b', 'c']} />);
      expect(latestMap?.size).toBe(3);
      rerender(<List items={[]} />);
      expect(latestMap?.size).toBe(0);
    });

    it('updates item data in place when props change', () => {
      let latestMap: TestCollectionDict | undefined;
      function List({ middleLabel }: { middleLabel: string }) {
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.ItemSlot scope={undefined} label="a">
              <div />
            </TestCollection.ItemSlot>
            <TestCollection.ItemSlot scope={undefined} label={middleLabel}>
              <div data-testid="middle" />
            </TestCollection.ItemSlot>
            <TestCollection.ItemSlot scope={undefined} label="c">
              <div />
            </TestCollection.ItemSlot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List middleLabel="b" />);
      rerender(<List middleLabel="updated" />);
      expect(labelsOf(latestMap)).toEqual(['a', 'updated', 'c']);
      expect(latestMap?.get(screen.getByTestId('middle'))?.label).toBe('updated');
    });

    it('keeps the same map when rerendered with equal item data', () => {
      const maps: TestCollectionDict[] = [];
      function List({ count }: { count: number }) {
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.ItemSlot scope={undefined} label="a">
              <div data-count={count} />
            </TestCollection.ItemSlot>
            <CollectionSpy onRender={(map) => maps.push(map)} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List count={1} />);
      const mapBeforeRerender = maps.at(-1);
      rerender(<List count={2} />);
      expect(maps.at(-1)).toBe(mapBeforeRerender);
    });

    it('keeps the same map when the parent rerenders with memoized item data', () => {
      const [MemoizedCollection, { useCollection: useMemoizedCollection }] = createCollection<
        HTMLElement,
        { onSelect: () => void; meta: { group: string } }
      >('Memoized');
      const maps: unknown[] = [];
      function MemoizedSpy() {
        maps.push(useMemoizedCollection(undefined));
        return null;
      }
      function List({ count }: { count: number }) {
        const onSelect = React.useCallback(() => {}, []);
        const meta = React.useMemo(() => ({ group: 'a' }), []);
        return (
          <MemoizedCollection.Provider scope={undefined}>
            <MemoizedCollection.ItemSlot scope={undefined} onSelect={onSelect} meta={meta}>
              <div data-count={count} />
            </MemoizedCollection.ItemSlot>
            <MemoizedSpy />
          </MemoizedCollection.Provider>
        );
      }
      const { rerender } = render(<List count={1} />);
      const mapBeforeRerender = maps.at(-1);
      rerender(<List count={2} />);
      expect(maps.at(-1)).toBe(mapBeforeRerender);
    });

    it('replaces the map with a new instance when items change', () => {
      const maps: TestCollectionDict[] = [];
      function List({ items }: { items: string[] }) {
        return (
          <TestCollection.Provider scope={undefined}>
            {items.map((item) => (
              <TestCollection.ItemSlot key={item} scope={undefined} label={item}>
                <div />
              </TestCollection.ItemSlot>
            ))}
            <CollectionSpy onRender={(map) => maps.push(map)} />
          </TestCollection.Provider>
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
      let latestMap: TestCollectionDict | undefined;
      function List({ asSpan }: { asSpan: boolean }) {
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.ItemSlot scope={undefined} label="a">
              {asSpan ? <span data-testid="item" /> : <div data-testid="item" />}
            </TestCollection.ItemSlot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </TestCollection.Provider>
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
      let latestMap: TestCollectionDict | undefined;
      render(
        <React.StrictMode>
          <TestCollection.Provider scope={undefined}>
            <TestCollection.ItemSlot scope={undefined} label="a">
              <div />
            </TestCollection.ItemSlot>
            <TestCollection.ItemSlot scope={undefined} label="b">
              <div />
            </TestCollection.ItemSlot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </TestCollection.Provider>
        </React.StrictMode>,
      );
      expect(labelsOf(latestMap)).toEqual(['a', 'b']);
      expect([...latestMap!.keys()].every((element) => element.isConnected)).toBe(true);
    });

    it('reorders items when React moves them in the DOM', async () => {
      let latestMap: TestCollectionDict | undefined;
      function List({ items }: { items: string[] }) {
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.Slot scope={undefined}>
              <ul>
                {items.map((item) => (
                  <TestCollection.ItemSlot key={item} scope={undefined} label={item}>
                    <li>{item}</li>
                  </TestCollection.ItemSlot>
                ))}
              </ul>
            </TestCollection.Slot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </TestCollection.Provider>
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

    it('reorders nested items when their wrappers move in the DOM', async () => {
      let latestMap: TestCollectionDict | undefined;
      function List({ items }: { items: string[] }) {
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.Slot scope={undefined}>
              <div>
                {items.map((item) => (
                  <section key={item}>
                    <TestCollection.ItemSlot scope={undefined} label={item}>
                      <div />
                    </TestCollection.ItemSlot>
                  </section>
                ))}
              </div>
            </TestCollection.Slot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List items={['a', 'b', 'c']} />);
      rerender(<List items={['b', 'c', 'a']} />);
      await act(async () => {});
      expect(labelsOf(latestMap)).toEqual(['b', 'c', 'a']);
    });

    it('keeps the same map when the DOM changes without reordering items', async () => {
      const maps: TestCollectionDict[] = [];
      function List({ showExtra }: { showExtra: boolean }) {
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.Slot scope={undefined}>
              <ul>
                <TestCollection.ItemSlot scope={undefined} label="a">
                  <li>a</li>
                </TestCollection.ItemSlot>
                {showExtra ? <li>not an item</li> : null}
                <TestCollection.ItemSlot scope={undefined} label="b">
                  <li>b</li>
                </TestCollection.ItemSlot>
              </ul>
            </TestCollection.Slot>
            <CollectionSpy onRender={(map) => maps.push(map)} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List showExtra={false} />);
      await act(async () => {});
      const mapBeforeChange = maps.at(-1);
      rerender(<List showExtra />);
      await act(async () => {});
      expect(maps.at(-1)).toBe(mapBeforeChange);
      expect(labelsOf(maps.at(-1))).toEqual(['a', 'b']);
    });

    it('does not modify the previous map when an item is added', () => {
      const maps: TestCollectionDict[] = [];
      function List({ items }: { items: string[] }) {
        return (
          <TestCollection.Provider scope={undefined}>
            {items.map((item) => (
              <TestCollection.ItemSlot key={item} scope={undefined} label={item}>
                <div />
              </TestCollection.ItemSlot>
            ))}
            <CollectionSpy onRender={(map) => maps.push(map)} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List items={['a', 'b']} />);
      const mapBeforeAdd = maps.at(-1)!;
      rerender(<List items={['a', 'b', 'c']} />);
      expect(labelsOf(maps.at(-1))).toEqual(['a', 'b', 'c']);
      expect(labelsOf(mapBeforeAdd)).toEqual(['a', 'b']);
    });

    it('does not modify the previous map when an item is removed', () => {
      const maps: TestCollectionDict[] = [];
      function List({ items }: { items: string[] }) {
        return (
          <TestCollection.Provider scope={undefined}>
            {items.map((item) => (
              <TestCollection.ItemSlot key={item} scope={undefined} label={item}>
                <div />
              </TestCollection.ItemSlot>
            ))}
            <CollectionSpy onRender={(map) => maps.push(map)} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List items={['a', 'b', 'c']} />);
      const mapBeforeRemove = maps.at(-1)!;
      rerender(<List items={['a', 'b']} />);
      expect(labelsOf(maps.at(-1))).toEqual(['a', 'b']);
      expect(labelsOf(mapBeforeRemove)).toEqual(['a', 'b', 'c']);
    });
  });

  describe('React features', () => {
    it('registers items inside a Suspense boundary once it resolves', async () => {
      let resolve!: () => void;
      const promise = new Promise<void>((resolvePromise) => {
        resolve = resolvePromise;
      });
      function Deferred({ children }: { children: React.ReactNode }) {
        React.use(promise);
        return children;
      }
      let latestMap: TestCollectionDict | undefined;
      await act(async () => {
        render(
          <TestCollection.Provider scope={undefined}>
            <TestCollection.ItemSlot scope={undefined} label="a">
              <div />
            </TestCollection.ItemSlot>
            <React.Suspense fallback={<span>loading</span>}>
              <Deferred>
                <TestCollection.ItemSlot scope={undefined} label="b">
                  <div />
                </TestCollection.ItemSlot>
              </Deferred>
            </React.Suspense>
            <TestCollection.ItemSlot scope={undefined} label="c">
              <div />
            </TestCollection.ItemSlot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </TestCollection.Provider>,
        );
      });
      expect(screen.getByText('loading')).toBeInTheDocument();
      expect(labelsOf(latestMap)).toEqual(['a', 'c']);

      await act(async () => {
        resolve();
        await promise;
      });
      expect(screen.queryByText('loading')).not.toBeInTheDocument();
      expect(labelsOf(latestMap)).toEqual(['a', 'b', 'c']);
    });

    it('removes items while inside a hidden Activity and restores them when visible', () => {
      let latestMap: TestCollectionDict | undefined;
      function List({ mode }: { mode: 'visible' | 'hidden' }) {
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.ItemSlot scope={undefined} label="a">
              <div />
            </TestCollection.ItemSlot>
            <React.Activity mode={mode}>
              <TestCollection.ItemSlot scope={undefined} label="b">
                <div />
              </TestCollection.ItemSlot>
            </React.Activity>
            <TestCollection.ItemSlot scope={undefined} label="c">
              <div />
            </TestCollection.ItemSlot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List mode="visible" />);
      expect(labelsOf(latestMap)).toEqual(['a', 'b', 'c']);

      rerender(<List mode="hidden" />);
      expect(labelsOf(latestMap)).toEqual(['a', 'c']);

      rerender(<List mode="visible" />);
      expect(labelsOf(latestMap)).toEqual(['a', 'b', 'c']);
    });

    it('registers items inside an initially hidden Activity once it becomes visible', () => {
      let latestMap: TestCollectionDict | undefined;
      function List({ mode }: { mode: 'visible' | 'hidden' }) {
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.ItemSlot scope={undefined} label="a">
              <div />
            </TestCollection.ItemSlot>
            <React.Activity mode={mode}>
              <TestCollection.ItemSlot scope={undefined} label="b">
                <div />
              </TestCollection.ItemSlot>
            </React.Activity>
            <TestCollection.ItemSlot scope={undefined} label="c">
              <div />
            </TestCollection.ItemSlot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </TestCollection.Provider>
        );
      }
      const { rerender } = render(<List mode="hidden" />);
      expect(labelsOf(latestMap)).toEqual(['a', 'c']);

      rerender(<List mode="visible" />);
      expect(labelsOf(latestMap)).toEqual(['a', 'b', 'c']);
    });

    it('reorders items when the reorder happens in a transition', async () => {
      let setItems!: (items: string[]) => void;
      let latestMap: TestCollectionDict | undefined;
      function List() {
        const [items, setItemsState] = React.useState(['a', 'b', 'c']);
        setItems = setItemsState;
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.Slot scope={undefined}>
              <ul>
                {items.map((item) => (
                  <TestCollection.ItemSlot key={item} scope={undefined} label={item}>
                    <li>{item}</li>
                  </TestCollection.ItemSlot>
                ))}
              </ul>
            </TestCollection.Slot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </TestCollection.Provider>
        );
      }
      render(<List />);
      await act(async () => {
        React.startTransition(() => {
          setItems(['c', 'b', 'a']);
        });
      });
      expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
        'c',
        'b',
        'a',
      ]);
      expect(labelsOf(latestMap)).toEqual(['c', 'b', 'a']);
    });

    // jsdom does not implement `document.startViewTransition`, so React commits
    // these updates without animating. These tests cover compatibility with
    // `ViewTransition` boundaries, not the animation itself. When jsdom
    // eventually implements `document.startViewTransition`, we should re-visit.
    it.todo('registers items wrapped in ViewTransition in document order', () => {
      let latestMap: TestCollectionDict | undefined;
      render(
        <TestCollection.Provider scope={undefined}>
          <React.ViewTransition>
            <TestCollection.ItemSlot scope={undefined} label="a">
              <div />
            </TestCollection.ItemSlot>
          </React.ViewTransition>
          <TestCollection.ItemSlot scope={undefined} label="b">
            <div />
          </TestCollection.ItemSlot>
          <React.ViewTransition>
            <TestCollection.ItemSlot scope={undefined} label="c">
              <div />
            </TestCollection.ItemSlot>
          </React.ViewTransition>
          <CollectionSpy onRender={(map) => (latestMap = map)} />
        </TestCollection.Provider>,
      );
      expect(labelsOf(latestMap)).toEqual(['a', 'b', 'c']);
    });

    it.todo('reorders items wrapped in ViewTransition when reordered in a transition', async () => {
      let setItems!: (items: string[]) => void;
      let latestMap: TestCollectionDict | undefined;
      function List() {
        const [items, setItemsState] = React.useState(['a', 'b', 'c']);
        setItems = setItemsState;
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.Slot scope={undefined}>
              <ul>
                {items.map((item) => (
                  <React.ViewTransition key={item}>
                    <TestCollection.ItemSlot scope={undefined} label={item}>
                      <li>{item}</li>
                    </TestCollection.ItemSlot>
                  </React.ViewTransition>
                ))}
              </ul>
            </TestCollection.Slot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </TestCollection.Provider>
        );
      }
      render(<List />);
      await act(async () => {
        React.startTransition(() => {
          setItems(['c', 'b', 'a']);
        });
      });
      expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
        'c',
        'b',
        'a',
      ]);
      expect(labelsOf(latestMap)).toEqual(['c', 'b', 'a']);
    });

    it.todo('removes items wrapped in ViewTransition when removed in a transition', async () => {
      let setItems!: (items: string[]) => void;
      let latestMap: TestCollectionDict | undefined;
      function List() {
        const [items, setItemsState] = React.useState(['a', 'b', 'c']);
        setItems = setItemsState;
        return (
          <TestCollection.Provider scope={undefined}>
            <TestCollection.Slot scope={undefined}>
              <ul>
                {items.map((item) => (
                  <React.ViewTransition key={item}>
                    <TestCollection.ItemSlot scope={undefined} label={item}>
                      <li>{item}</li>
                    </TestCollection.ItemSlot>
                  </React.ViewTransition>
                ))}
              </ul>
            </TestCollection.Slot>
            <CollectionSpy onRender={(map) => (latestMap = map)} />
          </TestCollection.Provider>
        );
      }
      render(<List />);
      await act(async () => {
        React.startTransition(() => {
          setItems(['a', 'c']);
        });
      });
      expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['a', 'c']);
      expect(labelsOf(latestMap)).toEqual(['a', 'c']);
    });
  });
});
