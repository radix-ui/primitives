import * as React from 'react';
import { cleanup, render, act } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';
import * as Popper from './popper';

function makeVirtual() {
  return {
    getBoundingClientRect: vi.fn(() => DOMRect.fromRect({ x: 0, y: 0, width: 10, height: 10 })),
  };
}

describe('PopperAnchor virtualRef', () => {
  afterEach(cleanup);

  it('updates the anchor when virtualRef.current is swapped on an unrelated re-render', async () => {
    const first = makeVirtual();
    const second = makeVirtual();

    function Test() {
      const virtualRef = React.useRef(first);
      const [, force] = React.useReducer((c) => c + 1, 0);
      return (
        <Popper.Root>
          <Popper.Anchor virtualRef={virtualRef as React.RefObject<typeof first>} />
          <Popper.Content>content</Popper.Content>
          <button
            onClick={() => {
              virtualRef.current = second;
              force();
            }}
          >
            swap
          </button>
        </Popper.Root>
      );
    }

    const { getByText } = render(<Test />);
    await act(async () => {});
    second.getBoundingClientRect.mockClear();

    await act(async () => {
      getByText('swap').click();
    });
    await act(async () => {});

    // After swapping the virtual anchor object and re-rendering, floating-ui
    // should measure the NEW anchor object. If the anchor was never updated,
    // `second` is never measured (stale anchor regression).
    expect(second.getBoundingClientRect).toHaveBeenCalled();
  });

  it('registers a virtualRef whose current is set after mount', async () => {
    const anchor = makeVirtual();

    function Test() {
      const virtualRef = React.useRef<typeof anchor | null>(null);
      const [, force] = React.useReducer((c) => c + 1, 0);
      return (
        <Popper.Root>
          <Popper.Anchor virtualRef={virtualRef as React.RefObject<typeof anchor>} />
          <Popper.Content>content</Popper.Content>
          <button
            onClick={() => {
              virtualRef.current = anchor;
              force();
            }}
          >
            attach
          </button>
        </Popper.Root>
      );
    }

    const { getByText } = render(<Test />);
    await act(async () => {});
    anchor.getBoundingClientRect.mockClear();

    await act(async () => {
      getByText('attach').click();
    });
    await act(async () => {});

    expect(anchor.getBoundingClientRect).toHaveBeenCalled();
  });
});

// Regression test for https://github.com/radix-ui/primitives/issues/3963
describe('PopperContent ref stability', () => {
  afterEach(cleanup);

  it('keeps a stable composed ref (no infinite render loop)', () => {
    assertStableComposedRef((ref) => (
      <Popper.Root>
        <Popper.Anchor />
        <Popper.Content ref={ref}>content</Popper.Content>
      </Popper.Root>
    ));
  });
});
