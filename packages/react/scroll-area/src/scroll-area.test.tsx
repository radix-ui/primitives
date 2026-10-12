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
        <ScrollArea.Viewport disableImplicitContentElement>
          <ScrollArea.Content>content</ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea.Root>
    ));
  });

  it('keeps a stable composed ref on the scrollbar', () => {
    assertStableComposedRef((ref) => (
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport disableImplicitContentElement>
          <ScrollArea.Content>content</ScrollArea.Content>
        </ScrollArea.Viewport>
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
        <ScrollArea.Viewport disableImplicitContentElement>
          <ScrollArea.Content>Content</ScrollArea.Content>
        </ScrollArea.Viewport>
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
          <ScrollArea.Viewport disableImplicitContentElement>
            <ScrollArea.Content>Content</ScrollArea.Content>
          </ScrollArea.Viewport>
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
        <ScrollArea.Viewport disableImplicitContentElement>
          <ScrollArea.Content>Content</ScrollArea.Content>
        </ScrollArea.Viewport>
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
        <ScrollArea.Viewport disableImplicitContentElement>
          <ScrollArea.Content>Content</ScrollArea.Content>
        </ScrollArea.Viewport>
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
        <ScrollArea.Viewport disableImplicitContentElement>
          <ScrollArea.Content>Content</ScrollArea.Content>
        </ScrollArea.Viewport>
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
        <ScrollArea.Viewport disableImplicitContentElement>
          <ScrollArea.Content>Content</ScrollArea.Content>
        </ScrollArea.Viewport>
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
        <ScrollArea.Viewport disableImplicitContentElement>
          <ScrollArea.Content>Content</ScrollArea.Content>
        </ScrollArea.Viewport>
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
        <ScrollArea.Viewport disableImplicitContentElement>
          <ScrollArea.Content>Content</ScrollArea.Content>
        </ScrollArea.Viewport>
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

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport
          asChild
          ref={ref}
          data-testid="viewport"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article>Content</article>
        </ScrollArea.Viewport>
      </ScrollArea.Root>,
    );

    const viewport = screen.getByTestId('viewport');
    expect(viewport.tagName).toBe('ARTICLE');
    expect(viewport).toHaveAttribute('data-radix-scroll-area-viewport', '');
    expect(viewport.style.overflowX).toBe('hidden');
    expect(viewport.style.overflowY).toBe('hidden');
    expect(viewport).toHaveClass('custom-class');
    expect(viewport.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(viewport);
    expect(viewport.firstElementChild).toHaveStyle({ display: 'table', minWidth: '100%' });
    expect(viewport).toHaveTextContent('Content');

    fireEvent.click(viewport);
    expect(onClick).toHaveBeenCalled();
  });

  // Regression for the Slottable fallback when `asChild` can't redirect onto a
  // single element child. This avoids a breaking change for users who are
  // misusing the asChild API. We should expect this test to fail when we remove
  // the fallback branch ahead of the next major release.
  it('falls back to the content wrapper when `asChild` children are not a single element', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const condition = false;

    expect(() => {
      render(
        <ScrollArea.Root type="always">
          <ScrollArea.Viewport asChild data-testid="viewport" className="custom-class">
            {condition && <article />}
          </ScrollArea.Viewport>
        </ScrollArea.Root>,
      );
    }).not.toThrow();

    // Props land on the implicit content wrapper rather than throwing because
    // there is no element for Slot to target
    const viewport = screen.getByTestId('viewport');
    expect(viewport).toHaveClass('custom-class');
    expect(viewport).toHaveStyle({ display: 'table', minWidth: '100%' });
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('`asChild` expects a single React element child'),
    );

    warn.mockRestore();
  });

  it('renders an implicit content element around its children by default', () => {
    render(
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport data-testid="viewport">Content</ScrollArea.Viewport>
      </ScrollArea.Root>,
    );

    const viewport = screen.getByTestId('viewport');
    const content = viewport.firstElementChild;
    expect(content).toBeInstanceOf(HTMLDivElement);
    expect(content).toHaveStyle({ display: 'table', minWidth: '100%' });
    expect(content).toHaveTextContent('Content');
  });

  it('skips the implicit content element when `disableImplicitContentElement` is set', () => {
    render(
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport disableImplicitContentElement data-testid="viewport">
          <span data-testid="child">Content</span>
        </ScrollArea.Viewport>
      </ScrollArea.Root>,
    );

    const viewport = screen.getByTestId('viewport');
    const child = screen.getByTestId('child');
    expect(viewport.firstElementChild).toBe(child);
    expect(child).not.toHaveStyle({ display: 'table' });
  });

  it('forwards props to the child when `asChild` is set with `disableImplicitContentElement`', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport
          asChild
          disableImplicitContentElement
          ref={ref}
          data-testid="viewport"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article>
            <ScrollArea.Content>Content</ScrollArea.Content>
          </article>
        </ScrollArea.Viewport>
      </ScrollArea.Root>,
    );

    const viewport = screen.getByTestId('viewport');
    expect(viewport.tagName).toBe('ARTICLE');
    expect(viewport).toHaveAttribute('data-radix-scroll-area-viewport', '');
    expect(viewport.style.overflowX).toBe('hidden');
    expect(viewport.style.overflowY).toBe('hidden');
    expect(viewport).toHaveClass('custom-class');
    expect(viewport.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(viewport);
    expect(viewport.firstElementChild).toHaveStyle({ display: 'table', minWidth: '100%' });
    expect(viewport).toHaveTextContent('Content');

    fireEvent.click(viewport);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('ScrollArea.Content', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport disableImplicitContentElement>
          <ScrollArea.Content
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Content
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content).toHaveStyle({ display: 'table', minWidth: '100%' });
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
      <ScrollArea.Root type="always">
        <ScrollArea.Viewport disableImplicitContentElement>
          <ScrollArea.Content
            asChild
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>Content</article>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveStyle({ display: 'table', minWidth: '100%' });
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);
    expect(content).toHaveTextContent('Content');

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });
});
