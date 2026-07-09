import * as React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';
import * as DismissableLayer from './dismissable-layer';

async function waitForDocumentPointerDownListener() {
  await act(async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 0));
  });
}

async function flushMutationObserver() {
  // `MutationObserver` callbacks run as a microtask after the mutation.
  await act(async () => {
    await Promise.resolve();
  });
}

function renderDismissableLayer(
  props: React.ComponentProps<typeof DismissableLayer.Root> = {},
  extraContent?: React.ReactNode,
) {
  return render(
    <>
      <DismissableLayer.Root {...props}>
        <button type="button">inside</button>
      </DismissableLayer.Root>
      {extraContent}
      <button type="button">outside</button>
    </>,
  );
}

function dispatchComposedPointerDown(target: Element) {
  target.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      composed: true,
      pointerType: 'mouse',
    }),
  );
}

function firePointerMouseClick(target: Element) {
  fireEvent.pointerDown(target, { pointerType: 'mouse' });
  fireEvent.mouseDown(target);
  fireEvent.pointerUp(target, { pointerType: 'mouse' });
  fireEvent.mouseUp(target);
  fireEvent.click(target);
}

function ShadowButton() {
  const hostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host || host.shadowRoot) {
      return;
    }

    const shadowRoot = host.attachShadow({ mode: 'open' });
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'inside shadow';
    shadowRoot.append(button);
  }, []);

  return <div data-testid="inside-shadow-host" ref={hostRef} />;
}

describe('DismissableLayer', () => {
  afterEach(cleanup);

  it('dismisses on an outside pointer interaction', async () => {
    const onPointerDownOutside = vi.fn();
    const onInteractOutside = vi.fn();
    const onDismiss = vi.fn();

    renderDismissableLayer({ onPointerDownOutside, onInteractOutside, onDismiss });
    await waitForDocumentPointerDownListener();

    firePointerMouseClick(screen.getByText('outside'));

    expect(onPointerDownOutside).toHaveBeenCalledTimes(1);
    expect(onInteractOutside).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('dismisses immediately on pointer down outside by default', async () => {
    const onDismiss = vi.fn();

    renderDismissableLayer({ onDismiss });
    await waitForDocumentPointerDownListener();

    fireEvent.pointerDown(screen.getByText('outside'));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not dismiss on pointer down inside', async () => {
    const onDismiss = vi.fn();

    renderDismissableLayer({ onDismiss });
    await waitForDocumentPointerDownListener();

    fireEvent.pointerDown(screen.getByText('inside'));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not dismiss when pointer down outside is prevented', async () => {
    const onDismiss = vi.fn();

    renderDismissableLayer({
      onPointerDownOutside: (event) => event.preventDefault(),
      onDismiss,
    });
    await waitForDocumentPointerDownListener();

    firePointerMouseClick(screen.getByText('outside'));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not dismiss when interact outside is prevented for a pointer down outside event', async () => {
    const onDismiss = vi.fn();

    renderDismissableLayer({
      onInteractOutside: (event) => event.preventDefault(),
      onDismiss,
    });
    await waitForDocumentPointerDownListener();

    firePointerMouseClick(screen.getByText('outside'));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('dismisses on focus outside', () => {
    const onFocusOutside = vi.fn();
    const onInteractOutside = vi.fn();
    const onDismiss = vi.fn();

    renderDismissableLayer({ onFocusOutside, onInteractOutside, onDismiss });

    fireEvent.focusIn(screen.getByText('outside'));

    expect(onFocusOutside).toHaveBeenCalledTimes(1);
    expect(onInteractOutside).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not dismiss on focus inside', () => {
    const onDismiss = vi.fn();

    renderDismissableLayer({ onDismiss });

    fireEvent.focusIn(screen.getByText('inside'));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('does not dismiss when interacting with a branch', async () => {
    const onDismiss = vi.fn();

    renderDismissableLayer(
      { onDismiss },
      <DismissableLayer.Branch>
        <button type="button">branch</button>
      </DismissableLayer.Branch>,
    );
    await waitForDocumentPointerDownListener();

    fireEvent.pointerDown(screen.getByText('branch'));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('defers touch pointer down outside dismissal until click', async () => {
    const onDismiss = vi.fn();

    renderDismissableLayer({ deferPointerDownOutside: true, onDismiss });
    await waitForDocumentPointerDownListener();

    fireEvent.pointerDown(screen.getByText('outside'), { pointerType: 'touch' });
    expect(onDismiss).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('outside'));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('dismisses immediately on non-primary mouse pointer down outside', async () => {
    const onDismiss = vi.fn();

    renderDismissableLayer({ onDismiss });
    await waitForDocumentPointerDownListener();

    fireEvent.pointerDown(screen.getByText('outside'), { button: 2, pointerType: 'mouse' });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('dismisses immediately on non-primary pen pointer down outside', async () => {
    const onDismiss = vi.fn();

    renderDismissableLayer({ onDismiss });
    await waitForDocumentPointerDownListener();

    fireEvent.pointerDown(screen.getByText('outside'), { button: 2, pointerType: 'pen' });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('cancels pending touch outside dismissal when pointer down moves back inside', async () => {
    const onDismiss = vi.fn();

    renderDismissableLayer({ deferPointerDownOutside: true, onDismiss });
    await waitForDocumentPointerDownListener();

    fireEvent.pointerDown(screen.getByText('outside'), { pointerType: 'touch' });
    fireEvent.pointerDown(screen.getByText('inside'));
    fireEvent.click(screen.getByText('outside'));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('treats a shadow tree inside the layer as inside', async () => {
    const onDismiss = vi.fn();

    render(
      <>
        <DismissableLayer.Root onDismiss={onDismiss}>
          <ShadowButton />
        </DismissableLayer.Root>
        <button type="button">outside</button>
      </>,
    );
    await waitForDocumentPointerDownListener();

    const shadowButton = screen
      .getByTestId('inside-shadow-host')
      .shadowRoot?.querySelector('button');
    expect(shadowButton).toBeInstanceOf(HTMLButtonElement);

    dispatchComposedPointerDown(shadowButton!);

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('dismisses when a later outside interaction event is stopped by default', async () => {
    const onDismiss = vi.fn();

    renderDismissableLayer({ onDismiss });
    await waitForDocumentPointerDownListener();

    const outside = screen.getByText('outside');
    const stopPropagation = (event: Event) => event.stopPropagation();
    outside.addEventListener('mousedown', stopPropagation);
    outside.addEventListener('mouseup', stopPropagation);
    outside.addEventListener('click', stopPropagation);

    fireEvent.pointerDown(outside);
    fireEvent.mouseDown(outside);
    fireEvent.mouseUp(outside);
    fireEvent.click(outside);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not dismiss when a later outside interaction event is stopped and pointer down outside is deferred', async () => {
    const onDismiss = vi.fn();

    renderDismissableLayer({ deferPointerDownOutside: true, onDismiss });
    await waitForDocumentPointerDownListener();

    const outside = screen.getByText('outside');
    const stopPropagation = (event: Event) => event.stopPropagation();
    outside.addEventListener('mousedown', stopPropagation);
    outside.addEventListener('mouseup', stopPropagation);
    outside.addEventListener('click', stopPropagation);

    fireEvent.pointerDown(outside);
    fireEvent.mouseDown(outside);
    fireEvent.mouseUp(outside);
    fireEvent.click(outside);

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('dismisses when a registered dismiss surface stops propagation', async () => {
    const onDismiss = vi.fn();

    function Surface() {
      const registerSurface = DismissableLayer.useDismissableLayerSurface();
      return (
        <div ref={registerSurface} onClick={(event) => event.stopPropagation()}>
          surface
        </div>
      );
    }

    render(
      <>
        <DismissableLayer.Root deferPointerDownOutside onDismiss={onDismiss}>
          <button type="button">inside</button>
        </DismissableLayer.Root>
        <Surface />
      </>,
    );
    await waitForDocumentPointerDownListener();

    firePointerMouseClick(screen.getByText('surface'));
    await waitForDocumentPointerDownListener();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('dismisses when a registered dismiss surface stops propagation without deferring', async () => {
    const onDismiss = vi.fn();

    function Surface() {
      const registerSurface = DismissableLayer.useDismissableLayerSurface();
      return (
        <div ref={registerSurface} onClick={(event) => event.stopPropagation()}>
          surface
        </div>
      );
    }

    render(
      <>
        <DismissableLayer.Root onDismiss={onDismiss}>
          <button type="button">inside</button>
        </DismissableLayer.Root>
        <Surface />
      </>,
    );
    await waitForDocumentPointerDownListener();

    firePointerMouseClick(screen.getByText('surface'));
    await waitForDocumentPointerDownListener();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('only exempts registered dismiss surfaces from stopped propagation', async () => {
    const onDismiss = vi.fn();

    function Surface() {
      const registerSurface = DismissableLayer.useDismissableLayerSurface();
      return (
        <div ref={registerSurface} onClick={(event) => event.stopPropagation()}>
          surface
        </div>
      );
    }

    render(
      <>
        <DismissableLayer.Root deferPointerDownOutside onDismiss={onDismiss}>
          <button type="button">inside</button>
        </DismissableLayer.Root>
        <Surface />
        <button type="button">outside</button>
      </>,
    );
    await waitForDocumentPointerDownListener();

    // A non-surface outside element that stops propagation should still block
    // dismissal.
    const outside = screen.getByText('outside');
    const stopPropagation = (event: Event) => event.stopPropagation();
    outside.addEventListener('mousedown', stopPropagation);
    outside.addEventListener('mouseup', stopPropagation);
    outside.addEventListener('click', stopPropagation);

    firePointerMouseClick(outside);
    await waitForDocumentPointerDownListener();
    expect(onDismiss).not.toHaveBeenCalled();

    firePointerMouseClick(screen.getByText('surface'));
    await waitForDocumentPointerDownListener();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not dismiss when focus moves outside during a deferred stopped interaction', async () => {
    const onDismiss = vi.fn();

    renderDismissableLayer({ deferPointerDownOutside: true, onDismiss });
    await waitForDocumentPointerDownListener();

    const outside = screen.getByText('outside');
    const stopPropagation = (event: Event) => event.stopPropagation();
    outside.addEventListener('mousedown', stopPropagation);
    outside.addEventListener('mouseup', stopPropagation);
    outside.addEventListener('click', stopPropagation);

    fireEvent.pointerDown(outside);
    fireEvent.mouseDown(outside);
    fireEvent.focusIn(outside);
    fireEvent.mouseUp(outside);
    fireEvent.click(outside);

    expect(onDismiss).not.toHaveBeenCalled();
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/3971
  it('does not dismiss a deferred parent when a child layer dismisses first', async () => {
    const onParentDismiss = vi.fn();
    const onChildDismiss = vi.fn();

    render(
      <>
        <DismissableLayer.Root
          disableOutsidePointerEvents
          deferPointerDownOutside
          onDismiss={onParentDismiss}
        >
          <button type="button">parent</button>
        </DismissableLayer.Root>
        <DismissableLayer.Root disableOutsidePointerEvents onDismiss={onChildDismiss}>
          <button type="button">child</button>
        </DismissableLayer.Root>
        <button type="button">outside</button>
      </>,
    );
    await waitForDocumentPointerDownListener();

    firePointerMouseClick(screen.getByText('outside'));
    await waitForDocumentPointerDownListener();

    expect(onChildDismiss).toHaveBeenCalledTimes(1);
    expect(onParentDismiss).not.toHaveBeenCalled();
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/3222
  //
  // While outside pointer events are disabled, `pointer-events: none` on the
  // `body` is inherited by any element appended to it afterwards. Drag
  // libraries (Plotly, d3, etc.) append a full-viewport "cover" element to the
  // `body` on pointer down and listen for `mousemove`/`mouseup` on it; if it
  // inherits `pointer-events: none` the drag never tracks or ends. We re-enable
  // pointer events on such elements so drags originating inside the layer keep
  // working.
  describe('elements appended to the body while outside pointer events are disabled', () => {
    afterEach(() => {
      document.body.style.pointerEvents = '';
    });

    it('re-enables pointer events on newly appended body elements', async () => {
      renderDismissableLayer({ disableOutsidePointerEvents: true });
      expect(document.body.style.pointerEvents).toBe('none');

      const dragCover = document.createElement('div');
      document.body.appendChild(dragCover);
      await flushMutationObserver();

      expect(dragCover.style.pointerEvents).toBe('auto');

      dragCover.remove();
    });

    it('does not override an explicit pointer-events value', async () => {
      renderDismissableLayer({ disableOutsidePointerEvents: true });

      const cover = document.createElement('div');
      cover.style.pointerEvents = 'none';
      document.body.appendChild(cover);
      await flushMutationObserver();

      expect(cover.style.pointerEvents).toBe('none');

      cover.remove();
    });

    it('does not touch appended elements when outside pointer events are enabled', async () => {
      renderDismissableLayer({ disableOutsidePointerEvents: false });
      expect(document.body.style.pointerEvents).toBe('');

      const cover = document.createElement('div');
      document.body.appendChild(cover);
      await flushMutationObserver();

      expect(cover.style.pointerEvents).toBe('');

      cover.remove();
    });

    it('stops re-enabling elements once the layer unmounts', async () => {
      const { unmount } = renderDismissableLayer({ disableOutsidePointerEvents: true });
      unmount();
      await flushMutationObserver();
      expect(document.body.style.pointerEvents).toBe('');

      const cover = document.createElement('div');
      document.body.appendChild(cover);
      await flushMutationObserver();

      expect(cover.style.pointerEvents).toBe('');

      cover.remove();
    });
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/3963
  it('keeps a stable composed ref (no infinite render loop)', () => {
    assertStableComposedRef((ref) => (
      <DismissableLayer.Root ref={ref}>
        <button type="button">inside</button>
      </DismissableLayer.Root>
    ));
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/4014
  it('calls the latest escape key handler after re-rendering', () => {
    const onEscapeKeyDown = vi.fn();

    function Test() {
      const [count, setCount] = React.useState(0);
      return (
        <DismissableLayer.Root onEscapeKeyDown={() => onEscapeKeyDown(count)}>
          <button type="button" onClick={() => setCount((value) => value + 1)}>
            increment
          </button>
        </DismissableLayer.Root>
      );
    }

    render(<Test />);

    fireEvent.click(screen.getByText('increment'));
    fireEvent.click(screen.getByText('increment'));

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onEscapeKeyDown).toHaveBeenLastCalledWith(2);
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/4014
  it('observes the latest state when preventing escape dismissal', () => {
    const onDismiss = vi.fn();

    function Test() {
      const [blocked, setBlocked] = React.useState(false);
      return (
        <DismissableLayer.Root
          onEscapeKeyDown={(event) => {
            if (blocked) event.preventDefault();
          }}
          onDismiss={onDismiss}
        >
          <button type="button" onClick={() => setBlocked(true)}>
            block
          </button>
        </DismissableLayer.Root>
      );
    }

    render(<Test />);

    fireEvent.click(screen.getByText('block'));
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onDismiss).not.toHaveBeenCalled();
  });
});
