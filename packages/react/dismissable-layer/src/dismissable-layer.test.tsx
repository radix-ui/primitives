import * as React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as DismissableLayer from './dismissable-layer';

async function waitForDocumentPointerDownListener() {
  await act(async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 0));
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

    renderDismissableLayer({ onDismiss });
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

  it('cancels pending touch outside dismissal when pointer down moves back inside', async () => {
    const onDismiss = vi.fn();

    renderDismissableLayer({ onDismiss });
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

  it('does not dismiss when a later outside interaction event is stopped', async () => {
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

    expect(onDismiss).not.toHaveBeenCalled();
  });
});
