import * as React from 'react';
import { afterEach, describe, it, vi, expect } from 'vitest';
import { cleanup, fireEvent, screen, render } from '@testing-library/react';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';
import * as ScrollArea from './scroll-area';

// Regression tests for https://github.com/radix-ui/primitives/issues/3963
describe('ScrollArea ref stability', () => {
  afterEach(cleanup);

  it('keeps a stable composed ref on the root', () => {
    assertStableComposedRef((ref) => (
      <ScrollArea.Root ref={ref}>
        <ScrollArea.Viewport>content</ScrollArea.Viewport>
      </ScrollArea.Root>
    ));
  });

  it('keeps a stable composed ref on the scrollbar', () => {
    assertStableComposedRef((ref) => (
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport>content</ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" ref={ref}>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    ));
  });
});

/**
 * jsdom gives every element zero layout, so `ScrollArea.Corner` measures itself
 * as 0x0 and renders nothing. Give the scrollbars a size before the stubbed
 * `ResizeObserver` delivers its deferred callback, which is what the corner
 * measures from.
 */
function assignScrollbarsSizes() {
  for (const scrollbar of document.querySelectorAll('[data-orientation]')) {
    Object.defineProperty(scrollbar, 'offsetWidth', { configurable: true, get: () => 16 });
    Object.defineProperty(scrollbar, 'offsetHeight', { configurable: true, get: () => 16 });
  }
}

describe('ScrollArea.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <ScrollArea.Root
        type="always"
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <ScrollArea.Viewport>Content</ScrollArea.Viewport>
      </ScrollArea.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <ScrollArea.Root
        type="always"
        asChild
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>
          <ScrollArea.Viewport>Content</ScrollArea.Viewport>
        </article>
      </ScrollArea.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.tagName).toBe('ARTICLE');
    expect(root.style.position).toBe('relative');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('ScrollArea.Scrollbar', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport>Content</ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          ref={ref}
          data-testid="scrollbar"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        />
      </ScrollArea.Root>,
    );

    const scrollbar = screen.getByTestId('scrollbar');
    expect(scrollbar).toHaveClass('custom-class');
    expect(scrollbar.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(scrollbar);

    fireEvent.click(scrollbar);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport>Content</ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          orientation="vertical"
          asChild
          ref={ref}
          data-testid="scrollbar"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>,
    );

    const scrollbar = screen.getByTestId('scrollbar');
    expect(scrollbar.tagName).toBe('ARTICLE');
    expect(scrollbar).toHaveAttribute('data-orientation', 'vertical');
    expect(scrollbar).toHaveAttribute('data-state', 'visible');
    expect(scrollbar).toHaveClass('custom-class');
    expect(scrollbar.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(scrollbar);

    fireEvent.click(scrollbar);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('ScrollArea.Thumb', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport>Content</ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb
            // `forceMount` because the thumb otherwise waits for a measured overflow
            forceMount
            ref={ref}
            data-testid="thumb"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>,
    );

    const thumb = screen.getByTestId('thumb');
    expect(thumb).toHaveClass('custom-class');
    expect(thumb.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(thumb);

    fireEvent.click(thumb);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport>Content</ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb
            forceMount
            asChild
            ref={ref}
            data-testid="thumb"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article />
          </ScrollArea.Thumb>
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>,
    );

    const thumb = screen.getByTestId('thumb');
    expect(thumb.tagName).toBe('ARTICLE');
    expect(thumb).toHaveAttribute('data-state', 'hidden');
    expect(thumb).toHaveClass('custom-class');
    expect(thumb.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(thumb);

    fireEvent.click(thumb);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('ScrollArea.Corner', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport>Content</ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" />
        <ScrollArea.Scrollbar orientation="vertical" />
        <ScrollArea.Corner
          ref={ref}
          data-testid="corner"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        />
      </ScrollArea.Root>,
    );
    assignScrollbarsSizes();

    const corner = await screen.findByTestId('corner');
    expect(corner).toHaveClass('custom-class');
    expect(corner.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(corner);

    fireEvent.click(corner);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport>Content</ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" />
        <ScrollArea.Scrollbar orientation="vertical" />
        <ScrollArea.Corner
          asChild
          ref={ref}
          data-testid="corner"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article />
        </ScrollArea.Corner>
      </ScrollArea.Root>,
    );
    assignScrollbarsSizes();

    const corner = await screen.findByTestId('corner');
    expect(corner.tagName).toBe('ARTICLE');
    expect(corner.style.position).toBe('absolute');
    expect(corner.style.width).toBe('16px');
    expect(corner).toHaveClass('custom-class');
    expect(corner.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(corner);

    fireEvent.click(corner);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('ScrollArea.Viewport', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport
          ref={ref}
          data-testid="viewport"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Content
        </ScrollArea.Viewport>
      </ScrollArea.Root>,
    );

    const viewport = screen.getByTestId('viewport');
    expect(viewport).toHaveClass('custom-class');
    expect(viewport.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(viewport);

    fireEvent.click(viewport);
    expect(onClick).toHaveBeenCalled();
  });

  // TODO: Fix this
  it.todo('forwards props to the child element when `asChild` is set');
});
