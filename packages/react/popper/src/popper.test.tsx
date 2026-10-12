import * as React from 'react';
import { cleanup, render, act, fireEvent, screen } from '@testing-library/react';
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

describe('Popper.Anchor', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Popper.Root>
        <Popper.Anchor
          ref={ref}
          data-testid="anchor"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        />
        <Popper.Content>Content</Popper.Content>
      </Popper.Root>,
    );

    const anchor = screen.getByTestId('anchor');
    expect(anchor).toHaveClass('custom-class');
    expect(anchor.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(anchor);

    fireEvent.click(anchor);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Popper.Root>
        <Popper.Anchor
          asChild
          ref={ref}
          data-testid="anchor"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article />
        </Popper.Anchor>
        <Popper.Content>Content</Popper.Content>
      </Popper.Root>,
    );

    const anchor = screen.getByTestId('anchor');
    expect(anchor.tagName).toBe('ARTICLE');
    expect(anchor).toHaveAttribute('data-radix-popper-side', 'bottom');
    expect(anchor).toHaveAttribute('data-radix-popper-align', 'center');
    expect(anchor).toHaveClass('custom-class');
    expect(anchor.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(anchor);

    fireEvent.click(anchor);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Popper.Content', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Popper.Root>
        <Popper.Anchor />
        <Popper.Content
          ref={ref}
          data-testid="content"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Content
        </Popper.Content>
      </Popper.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Popper.Root>
        <Popper.Anchor />
        <Popper.Content
          asChild
          ref={ref}
          data-testid="content"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article>Content</article>
        </Popper.Content>
      </Popper.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveAttribute('data-side', 'bottom');
    expect(content).toHaveAttribute('data-align', 'center');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Popper.Arrow', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<SVGSVGElement>();
    const onClick = vi.fn();

    render(
      <Popper.Root>
        <Popper.Anchor />
        <Popper.Content>
          Content
          <Popper.Arrow
            ref={ref}
            data-testid="arrow"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          />
        </Popper.Content>
      </Popper.Root>,
    );

    const arrow = screen.getByTestId('arrow');
    expect(arrow).toHaveClass('custom-class');
    expect(arrow.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(arrow);

    fireEvent.click(arrow);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<SVGSVGElement>();
    const onClick = vi.fn();

    render(
      <Popper.Root>
        <Popper.Anchor />
        <Popper.Content>
          Content
          <Popper.Arrow
            asChild
            ref={ref}
            data-testid="arrow"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <svg />
          </Popper.Arrow>
        </Popper.Content>
      </Popper.Root>,
    );

    const arrow = screen.getByTestId('arrow');
    // SVG elements report their tag name in lower case.
    expect(arrow.tagName).toBe('svg');
    expect(arrow).toHaveAttribute('viewBox', '0 0 30 10');
    expect(arrow).toHaveClass('custom-class');
    expect(arrow.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(arrow);

    fireEvent.click(arrow);
    expect(onClick).toHaveBeenCalled();
  });
});
