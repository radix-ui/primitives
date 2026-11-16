import * as React from 'react';
import { createPortal } from 'react-dom';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Select from './select';

// Constructed event sequences exercise the boundary, not native Safari's event generation.
const layouts = ['plain', 'container', 'auto-container', 'portal-sheet'] as const;
type Layout = (typeof layouts)[number];

function Fixture({
  layout = 'plain',
  onOpenChange = vi.fn(),
  onClick = vi.fn(),
  onPointerDownOutside,
}: {
  layout?: Layout;
  onOpenChange?: (open: boolean) => void;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onPointerDownOutside?: React.ComponentProps<typeof Select.Content>['onPointerDownOutside'];
}) {
  const select = (
    <Select.Root onOpenChange={onOpenChange}>
      <Select.Trigger id="choice-trigger" aria-label="Choice" onClick={onClick}>
        <Select.Value placeholder="Pick one" />
        <svg data-testid="icon" width="16" height="16">
          <path d="M0 0L8 8L16 0" />
        </svg>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content position="popper" onPointerDownOutside={onPointerDownOutside}>
          <Select.Viewport>
            <Select.Item value="apple">
              <Select.ItemText>Apple</Select.ItemText>
            </Select.Item>
            <Select.Item value="banana">
              <Select.ItemText>Banana</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
  if (layout === 'portal-sheet') {
    return createPortal(
      <div style={{ transform: 'translateY(0)', pointerEvents: 'auto' }}>{select}</div>,
      document.body,
    );
  }
  if (layout === 'auto-container') return <div style={{ pointerEvents: 'auto' }}>{select}</div>;
  return layout === 'container' ? <div>{select}</div> : select;
}

function pointer(
  target: Element,
  type: string,
  pointerId = 7,
  pointerType = 'touch',
  detail = 1,
  clientY = 10,
) {
  target.hasPointerCapture ??= () => false;
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId,
    pointerType,
    button: 0,
    clientX: 10,
    clientY,
    detail: type === 'click' ? detail : 0,
  });
  fireEvent(target, event);
  return event;
}

async function open() {
  const icon = screen.getByTestId('icon');
  pointer(icon, 'pointerdown');
  pointer(icon, 'pointerup');
  await act(async () => {
    pointer(icon, 'click');
  });
  await screen.findByRole('listbox');
  // DismissableLayer installs its document listener in a later task.
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

function cancelContentScroll() {
  const content = screen.getByRole('listbox');
  pointer(content, 'pointerdown');
  pointer(content, 'pointermove', 7, 'touch', 1, 40);
  pointer(content, 'pointercancel');
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('touching an open Select trigger', () => {
  for (const layout of layouts) {
    for (const afterScroll of [false, true]) {
      for (const delay of [5, 11]) {
        for (const clickId of [9, 1]) {
          it(`stays closed (${layout}, canceled scroll=${afterScroll}, ${delay}ms, click ID=${clickId})`, async () => {
            const changes = vi.fn();
            const clicks = vi.fn();
            render(<Fixture layout={layout} onOpenChange={changes} onClick={clicks} />);
            await open();
            const trigger = screen.getByRole('combobox', { hidden: true });
            const icon = screen.getByTestId('icon');
            if (afterScroll) cancelContentScroll();
            expect(trigger).toHaveAttribute('aria-expanded', 'true');
            // jsdom does not hit test; explicitly cover HTML and direct-trigger entry.
            const downTarget =
              layout === 'auto-container' || layout === 'portal-sheet'
                ? icon
                : document.documentElement;
            pointer(downTarget, 'pointerdown', 9);
            pointer(icon, 'pointerup', 9);
            await act(async () => {
              await new Promise((resolve) => setTimeout(resolve, delay));
              pointer(
                icon.querySelector('path')!,
                'click',
                clickId,
                'mouse',
                clickId === 1 ? 2 : 1,
              );
            });
            expect(trigger).toHaveAttribute('aria-expanded', 'false');
            expect(changes.mock.calls.map(([value]) => value)).toEqual([true, false]);
            expect(clicks).toHaveBeenCalledTimes(2);
            // A fresh gesture must work even when its pointer ID is reused.
            pointer(icon, 'pointerdown', 9);
            pointer(icon, 'pointerup', 9);
            await act(async () => {
              pointer(icon, 'click', 9);
            });
            expect(trigger).toHaveAttribute('aria-expanded', 'true');
          });
        }
      }
    }
  }

  it.each(layouts)('keeps the content open after a canceled scroll (%s)', async (layout) => {
    const changes = vi.fn();
    render(<Fixture layout={layout} onOpenChange={changes} />);
    await open();
    cancelContentScroll();
    expect(screen.getByRole('combobox', { hidden: true })).toHaveAttribute('aria-expanded', 'true');
    expect(changes.mock.calls.map(([value]) => value)).toEqual([true]);
  });

  it.each(['touch', 'pen'])(
    'does not open on a canceled %s gesture, and allows the next gesture',
    async (type) => {
      render(<Fixture />);
      const icon = screen.getByTestId('icon');
      pointer(icon, 'pointerdown', 7, type);
      pointer(icon, 'pointermove', 7, type, 1, 40);
      pointer(icon, 'pointercancel', 7, type);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
      pointer(icon, 'pointerdown', 7, type);
      pointer(icon, 'pointerup', 7, type);
      await act(async () => {
        pointer(icon, 'click', 7, type);
      });
      expect(screen.getByRole('combobox', { hidden: true })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    },
  );

  it('preserves the stationary mouse pointerup guard', async () => {
    render(<Fixture />);
    const icon = screen.getByTestId('icon');
    pointer(icon, 'pointerdown', 1, 'mouse');
    await screen.findByRole('listbox');
    const event = pointer(icon, 'pointerup', 1, 'mouse');
    expect(event.defaultPrevented).toBe(true);
    expect(screen.getByRole('combobox', { hidden: true })).toHaveAttribute('aria-expanded', 'true');
  });

  it('preserves closing on mouse pointerup outside after a drag', async () => {
    const changes = vi.fn();
    render(<Fixture onOpenChange={changes} />);
    pointer(screen.getByTestId('icon'), 'pointerdown', 1, 'mouse');
    await screen.findByRole('listbox');
    pointer(document.documentElement, 'pointermove', 1, 'mouse', 1, 40);
    pointer(document.documentElement, 'pointerup', 1, 'mouse');
    expect(changes.mock.calls.map(([value]) => value)).toEqual([true, false]);
  });

  it.each(['Enter', ' '])(
    'preserves keyboard opening with %j and closing with Escape',
    async (key) => {
      render(<Fixture />);
      const trigger = screen.getByRole('combobox');
      fireEvent.keyDown(trigger, { key });
      fireEvent.keyDown(await screen.findByRole('listbox'), { key: 'Escape' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    },
  );

  it('allows non-pointer click activation', async () => {
    render(<Fixture />);
    fireEvent.click(screen.getByRole('combobox'), { detail: 0 });
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
  });

  it('allows label activation', async () => {
    render(
      <>
        <label htmlFor="choice-trigger">Open choice</label>
        <Fixture />
      </>,
    );
    fireEvent.click(screen.getByText('Open choice'));
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
  });

  it.each(['touch', 'pen'])('preserves %s item selection', async (type) => {
    render(<Fixture />);
    await open();
    const item = screen.getByRole('option', { name: 'Banana' });
    pointer(item, 'pointerdown', 9, type);
    pointer(item, 'pointerup', 9, type);
    pointer(item, 'click', 9, type);
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
  });

  it('defers outside dismissal until click and allows consumer cancellation', async () => {
    const outside = vi.fn((event: Event) => event.preventDefault());
    render(<Fixture onPointerDownOutside={outside} />);
    await open();
    pointer(document.documentElement, 'pointerdown', 9);
    pointer(document.documentElement, 'pointerup', 9);
    expect(outside).not.toHaveBeenCalled();
    await act(async () => {
      pointer(document.documentElement, 'click', 9);
    });
    expect(outside).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('combobox', { hidden: true })).toHaveAttribute('aria-expanded', 'true');
  });

  it('preserves consumer click handlers and bubbling', async () => {
    const click = vi.fn();
    const bubble = vi.fn();
    render(
      <div onClick={bubble}>
        <Fixture onClick={click} />
      </div>,
    );
    await open();
    const icon = screen.getByTestId('icon');
    pointer(icon, 'pointerdown', 9);
    pointer(icon, 'pointerup', 9);
    await act(async () => {
      pointer(icon, 'click', 9);
    });
    expect(click).toHaveBeenCalledTimes(2);
    expect(bubble).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
  });
});
