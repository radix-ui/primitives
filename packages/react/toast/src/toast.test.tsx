import React from 'react';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import * as Toast from './toast';
import { describe, it, afterEach, beforeEach, vi, expect, type Mock } from 'vitest';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';

// Regression test for https://github.com/radix-ui/primitives/issues/3963
describe('ref stability', () => {
  afterEach(cleanup);

  it('keeps a stable composed ref on the Toast root', () => {
    assertStableComposedRef((ref) => (
      <Toast.Provider>
        <Toast.Root ref={ref} open>
          <Toast.Title>Title</Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    ));
  });
});

// Regression test for https://github.com/radix-ui/primitives/issues/2906
describe('escape key removal', () => {
  afterEach(cleanup);

  function renderToasts(onOpenChange: { first: Mock; second: Mock; third: Mock }) {
    render(
      <Toast.Provider>
        <Toast.Root open duration={Infinity} onOpenChange={onOpenChange.first}>
          <Toast.Title>Toast 1</Toast.Title>
        </Toast.Root>
        <Toast.Root open duration={Infinity} onOpenChange={onOpenChange.second}>
          <Toast.Title>Toast 2</Toast.Title>
        </Toast.Root>
        <Toast.Root open duration={Infinity} onOpenChange={onOpenChange.third}>
          <Toast.Title>Toast 3</Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );
  }

  it('closes only the focused (non-topmost) toast on Escape', () => {
    const onOpenChange = { first: vi.fn(), second: vi.fn(), third: vi.fn() };
    renderToasts(onOpenChange);

    const focusedToast = screen.getByText('Toast 2').closest('li')!;
    focusedToast.focus();
    fireEvent.keyDown(focusedToast, { key: 'Escape' });

    expect(onOpenChange.second).toHaveBeenCalledWith(false);
    expect(onOpenChange.first).not.toHaveBeenCalled();
    expect(onOpenChange.third).not.toHaveBeenCalled();
  });

  it('closes the topmost toast on Escape when focus is outside any toast', () => {
    const onOpenChange = { first: vi.fn(), second: vi.fn(), third: vi.fn() };
    renderToasts(onOpenChange);

    fireEvent.keyDown(document.body, { key: 'Escape' });

    expect(onOpenChange.third).toHaveBeenCalledWith(false);
    expect(onOpenChange.first).not.toHaveBeenCalled();
    expect(onOpenChange.second).not.toHaveBeenCalled();
  });
});

// Regression test for https://github.com/radix-ui/primitives/issues/2233
describe('pause/resume with changing duration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('closes after resume when duration changes from Infinity to a finite value while paused', () => {
    const onOpenChange = vi.fn();

    function renderToast(duration: number) {
      return (
        <Toast.Provider>
          <Toast.Root open duration={duration} onOpenChange={onOpenChange}>
            <Toast.Title>Title</Toast.Title>
          </Toast.Root>
          <Toast.Viewport />
        </Toast.Provider>
      );
    }

    const { rerender } = render(renderToast(Infinity));

    // window blur pauses the toast
    fireEvent.blur(window);

    // update the toast to a finite duration
    rerender(renderToast(3000));

    // resume the toast
    fireEvent.focus(window);

    // advancing past the new duration should now close the toast
    vi.advanceTimersByTime(3000);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// Regression test for https://github.com/radix-ui/primitives/pull/3703
describe('timer cleanup', () => {
  let clearTimeoutSpy: Mock<(id: number | undefined) => void>;
  beforeEach(() => {
    vi.useFakeTimers();
    clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
  });

  afterEach(() => {
    clearTimeoutSpy.mockRestore();
    cleanup();
    vi.useRealTimers();
  });

  it('should clear the close timer when the component unmounts before duration expires', () => {
    const { unmount } = render(
      <Toast.Provider duration={5000}>
        <Toast.Root defaultOpen>
          <Toast.Title>Title</Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    // Advance time but not enough to trigger auto-close
    vi.advanceTimersByTime(1000);

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should not error when unmounting before time expires', () => {
    const { unmount } = render(
      <Toast.Provider duration={5000}>
        <Toast.Root defaultOpen>
          <Toast.Title>Title</Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    // Advance time but not enough to trigger auto-close
    vi.advanceTimersByTime(1000);

    expect(() => {
      unmount();
      // Advance time past the original duration to ensure no errors occur. In
      // test environments, the dangling timeout would cause "ReferenceError:
      // document is not defined" errors since the DOM test environment would have
      // been torn down by this point.
      vi.advanceTimersByTime(5000);
    }).not.toThrow();
  });
});

describe('Toast.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLLIElement>();
    const onClick = vi.fn();

    render(
      <Toast.Provider>
        <Toast.Root
          open
          duration={Infinity}
          ref={ref}
          data-testid="toast"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <Toast.Title>Title</Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    const toast = screen.getByTestId('toast');
    expect(toast).toHaveClass('custom-class');
    expect(toast.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(toast);

    fireEvent.click(toast);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLLIElement>();
    const onClick = vi.fn();

    render(
      <Toast.Provider>
        <Toast.Root
          open
          duration={Infinity}
          asChild
          ref={ref}
          data-testid="toast"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article>
            <Toast.Title>Title</Toast.Title>
          </article>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    const toast = screen.getByTestId('toast');
    expect(toast.tagName).toBe('ARTICLE');
    expect(toast).toHaveAttribute('data-state', 'open');
    expect(toast).toHaveAttribute('data-swipe-direction', 'right');
    expect(toast).toHaveClass('custom-class');
    expect(toast.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(toast);

    fireEvent.click(toast);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Toast.Viewport', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLOListElement>();
    const onClick = vi.fn();

    render(
      <Toast.Provider>
        <Toast.Viewport
          ref={ref}
          data-testid="viewport"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        />
      </Toast.Provider>,
    );

    const viewport = screen.getByTestId('viewport');
    expect(viewport).toHaveClass('custom-class');
    expect(viewport.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(viewport);

    fireEvent.click(viewport);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLOListElement>();
    const onClick = vi.fn();

    render(
      <Toast.Provider>
        <Toast.Viewport
          asChild
          ref={ref}
          data-testid="viewport"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article />
        </Toast.Viewport>
      </Toast.Provider>,
    );

    const viewport = screen.getByTestId('viewport');
    expect(viewport.tagName).toBe('ARTICLE');
    expect(viewport).toHaveAttribute('tabindex', '-1');
    expect(viewport).toHaveClass('custom-class');
    expect(viewport.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(viewport);

    fireEvent.click(viewport);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Toast.Title', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Toast.Provider>
        <Toast.Root open duration={Infinity}>
          <Toast.Title
            ref={ref}
            data-testid="title"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Title
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    const title = screen.getByTestId('title');
    expect(title).toHaveClass('custom-class');
    expect(title.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(title);

    fireEvent.click(title);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Toast.Provider>
        <Toast.Root open duration={Infinity}>
          <Toast.Title
            asChild
            ref={ref}
            data-testid="title"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>Title</article>
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    const title = screen.getByTestId('title');
    expect(title.tagName).toBe('ARTICLE');
    expect(title).toHaveClass('custom-class');
    expect(title.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(title);

    fireEvent.click(title);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Toast.Description', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Toast.Provider>
        <Toast.Root open duration={Infinity}>
          <Toast.Title>Title</Toast.Title>
          <Toast.Description
            ref={ref}
            data-testid="description"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Description
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    const description = screen.getByTestId('description');
    expect(description).toHaveClass('custom-class');
    expect(description.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(description);

    fireEvent.click(description);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Toast.Provider>
        <Toast.Root open duration={Infinity}>
          <Toast.Title>Title</Toast.Title>
          <Toast.Description
            asChild
            ref={ref}
            data-testid="description"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>Description</article>
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    const description = screen.getByTestId('description');
    expect(description.tagName).toBe('ARTICLE');
    expect(description).toHaveClass('custom-class');
    expect(description.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(description);

    fireEvent.click(description);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Toast.Action', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Toast.Provider>
        <Toast.Root open duration={Infinity}>
          <Toast.Title>Title</Toast.Title>
          <Toast.Action
            altText="Undo the change"
            ref={ref}
            data-testid="action"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Undo
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    const action = screen.getByTestId('action');
    expect(action).toHaveClass('custom-class');
    expect(action.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(action);

    // Composed with the action's own close handler rather than replaced by it.
    fireEvent.click(action);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Toast.Provider>
        <Toast.Root open duration={Infinity}>
          <Toast.Title>Title</Toast.Title>
          <Toast.Action
            altText="Undo the change"
            asChild
            ref={ref}
            data-testid="action"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <button type="button">Undo</button>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    const action = screen.getByTestId('action');
    expect(action.tagName).toBe('BUTTON');
    // The `altText` the action announces instead of its contents must reach the same element.
    expect(action).toHaveAttribute('data-radix-toast-announce-alt', 'Undo the change');
    expect(action).toHaveClass('custom-class');
    expect(action.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(action);

    fireEvent.click(action);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Toast.Close', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Toast.Provider>
        <Toast.Root open duration={Infinity}>
          <Toast.Title>Title</Toast.Title>
          <Toast.Close
            ref={ref}
            data-testid="close"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Close
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    const close = screen.getByTestId('close');
    expect(close).toHaveAttribute('type', 'button');
    expect(close).toHaveClass('custom-class');
    expect(close.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(close);

    // Composed with the close button's own click handler rather than replaced by it.
    fireEvent.click(close);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Toast.Provider>
        <Toast.Root open duration={Infinity}>
          <Toast.Title>Title</Toast.Title>
          <Toast.Close
            asChild
            ref={ref}
            data-testid="close"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <button type="button">Close</button>
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>,
    );

    const close = screen.getByTestId('close');
    expect(close.tagName).toBe('BUTTON');
    expect(close).toHaveAttribute('data-radix-toast-announce-exclude', '');
    expect(close).toHaveClass('custom-class');
    expect(close.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(close);

    fireEvent.click(close);
    expect(onClick).toHaveBeenCalled();
  });
});
