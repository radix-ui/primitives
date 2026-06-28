import * as React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import * as DropdownMenu from './dropdown-menu';

const TRIGGER_TEXT = 'Open';
const ITEM_TEXT = 'Item';
const ITEM_TEXT_2 = 'Item 2';
const SUB_TRIGGER_TEXT = 'Sub';
const SUB_ITEM_TEXT = 'Sub Item';

const DropdownMenuTest = (props: React.ComponentProps<typeof DropdownMenu.Root>) => (
  <DropdownMenu.Root {...props}>
    <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content>
        <DropdownMenu.Item>{ITEM_TEXT}</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

const DropdownMenuWithSubTest = (props: React.ComponentProps<typeof DropdownMenu.Root>) => (
  <DropdownMenu.Root {...props}>
    <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content>
        <DropdownMenu.Item>{ITEM_TEXT}</DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>{SUB_TRIGGER_TEXT}</DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item>{SUB_ITEM_TEXT}</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

const DropdownMenuWithInputTest = (props: { focusOnItemEnter?: boolean }) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content focusOnItemEnter={props.focusOnItemEnter}>
        <input data-testid="search" type="text" />
        <DropdownMenu.Item>{ITEM_TEXT}</DropdownMenu.Item>
        <DropdownMenu.Item>{ITEM_TEXT_2}</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

describe('aria-controls', () => {
  afterEach(cleanup);

  it('should not reference a non-existent element while closed', () => {
    render(<DropdownMenuTest />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
  });

  it('should reference the rendered content while open', async () => {
    render(<DropdownMenuTest />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    fireEvent.keyDown(trigger, { key: 'Enter' });

    const content = await waitFor(() => screen.getByRole('menu'));
    expect(content.id).toBeTruthy();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', content.id);
    expect(document.getElementById(content.id)).toBe(content);
  });
});

describe('closing on window blur', () => {
  afterEach(cleanup);

  it('should close the menu and any open submenus when the window loses focus', async () => {
    render(<DropdownMenuWithSubTest />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    fireEvent.keyDown(trigger, { key: 'Enter' });

    const subTrigger = await waitFor(() => screen.getByText(SUB_TRIGGER_TEXT));
    fireEvent.keyDown(subTrigger, { key: 'ArrowRight' });

    await waitFor(() => expect(screen.getByText(SUB_ITEM_TEXT)).toBeInTheDocument());

    act(() => {
      window.dispatchEvent(new FocusEvent('blur'));
    });

    await waitFor(() => expect(screen.queryByText(SUB_ITEM_TEXT)).not.toBeInTheDocument());
    expect(screen.queryByText(ITEM_TEXT)).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('focusOnItemEnter', () => {
  afterEach(cleanup);

  // Helper: open the menu with a keyboard Enter, focus the input (Radix does
  // not auto-focus non-menuitem children on open — `onMountAutoFocus` only
  // focuses the content root), then simulate a pointermove with the
  // `pointerType: 'mouse'` Radix's `whenMouse` guard requires.
  async function openMenuAndFocusInput(options: { focusOnItemEnter?: boolean } = {}) {
    render(<DropdownMenuWithInputTest focusOnItemEnter={options.focusOnItemEnter} />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    fireEvent.keyDown(trigger, { key: 'Enter' });

    const searchInput = await waitFor(() => screen.getByTestId('search'));
    searchInput.focus();
    expect(document.activeElement).toBe(searchInput);

    return { searchInput };
  }

  it('should keep focus on a sibling input when focusOnItemEnter={false}', async () => {
    const { searchInput } = await openMenuAndFocusInput({ focusOnItemEnter: false });
    const item = await waitFor(() => screen.getByText(ITEM_TEXT));

    // `whenMouse` in menu.tsx short-circuits unless event.pointerType === 'mouse'.
    fireEvent.pointerMove(item, { pointerType: 'mouse' });

    expect(document.activeElement).toBe(searchInput);
    expect(document.activeElement).not.toBe(item);
  });

  it('should still focus items on hover when focusOnItemEnter is omitted (default)', async () => {
    const { searchInput } = await openMenuAndFocusInput();
    const item = await waitFor(() => screen.getByText(ITEM_TEXT));

    // Default behaviour is preserved: hovering the item steals focus even though
    // there's a sibling input that was just focused. Regression guard for the
    // default (focusOnItemEnter: true) path.
    fireEvent.pointerMove(item, { pointerType: 'mouse' });

    expect(document.activeElement).toBe(item);
    expect(document.activeElement).not.toBe(searchInput);
  });

  it('should keep focus on the input across multiple pointer moves over different items', async () => {
    const { searchInput } = await openMenuAndFocusInput({ focusOnItemEnter: false });
    const item1 = await waitFor(() => screen.getByText(ITEM_TEXT));
    const item2 = await waitFor(() => screen.getByText(ITEM_TEXT_2));

    fireEvent.pointerMove(item1, { pointerType: 'mouse' });
    expect(document.activeElement).toBe(searchInput);

    fireEvent.pointerMove(item2, { pointerType: 'mouse' });
    expect(document.activeElement).toBe(searchInput);
  });

  it('should still focus the first item on keyboard-open when focusOnItemEnter={false}', async () => {
    // Regression guard: disabling hover-to-focus must not break the
    // RovingFocusGroup entry-focus path. Keyboard-open focuses the first
    // item via onEntryFocus (RovingFocusGroup), independent of pointermove.
    render(<DropdownMenuWithInputTest focusOnItemEnter={false} />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    fireEvent.keyDown(trigger, { key: 'Enter' });

    const item = await waitFor(() => screen.getByText(ITEM_TEXT));
    await waitFor(() => expect(document.activeElement).toBe(item));
  });
});

describe('focusOnItemEnter with submenus', () => {
  // Submenu hover-open is driven by MenuSubTrigger.onPointerMove scheduling
  // a setTimeout(open, 100). `focusOnItemEnter={false}` on the parent must
  // not interfere with that path — the focus call lives in MenuItemImpl, not
  // MenuSubTrigger.
  //
  // We avoid mixing fake timers with `waitFor` (which polls via setInterval
  // and deadlocks under fake timers). Instead: real timers, then flush the
  // 100ms SubTrigger open timer via the real event loop.
  afterEach(cleanup);

  it('should still open submenu on SubTrigger hover when parent has focusOnItemEnter={false}', async () => {
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content focusOnItemEnter={false}>
            <DropdownMenu.Item>{ITEM_TEXT}</DropdownMenu.Item>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>{SUB_TRIGGER_TEXT}</DropdownMenu.SubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item>{SUB_ITEM_TEXT}</DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const trigger = screen.getByText(TRIGGER_TEXT);
    fireEvent.keyDown(trigger, { key: 'Enter' });

    const subTrigger = await waitFor(() => screen.getByText(SUB_TRIGGER_TEXT));
    expect(screen.queryByText(SUB_ITEM_TEXT)).not.toBeInTheDocument();

    // Pointer grace intent needs mouse pointer type (matches Radix whenMouse).
    fireEvent.pointerMove(subTrigger, { pointerType: 'mouse' });

    // Wait past the 100ms SubTrigger open timer + render flush.
    await waitFor(() => expect(screen.getByText(SUB_ITEM_TEXT)).toBeInTheDocument(), {
      timeout: 1000,
    });
  });
});
