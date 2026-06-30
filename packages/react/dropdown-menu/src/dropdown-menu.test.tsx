import * as React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';
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

const DropdownMenuWithInputTest = (props: {
  focusOnItemEnter?: boolean;
}) => (
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

    fireEvent.pointerMove(item, { pointerType: 'mouse' });

    expect(document.activeElement).toBe(searchInput);
    expect(document.activeElement).not.toBe(item);
  });

  it('should still focus items on hover when focusOnItemEnter is omitted (default)', async () => {
    const { searchInput } = await openMenuAndFocusInput();
    const item = await waitFor(() => screen.getByText(ITEM_TEXT));

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
    render(<DropdownMenuWithInputTest focusOnItemEnter={false} />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    fireEvent.keyDown(trigger, { key: 'Enter' });

    const item = await waitFor(() => screen.getByText(ITEM_TEXT));
    await waitFor(() => expect(document.activeElement).toBe(item));
  });
});

describe('focusOnItemEnter with submenus', () => {
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
      </DropdownMenu.Root>
    );

    const trigger = screen.getByText(TRIGGER_TEXT);
    fireEvent.keyDown(trigger, { key: 'Enter' });

    const subTrigger = await waitFor(() => screen.getByText(SUB_TRIGGER_TEXT));
    expect(screen.queryByText(SUB_ITEM_TEXT)).not.toBeInTheDocument();

    fireEvent.pointerMove(subTrigger, { pointerType: 'mouse' });

    await waitFor(() => expect(screen.getByText(SUB_ITEM_TEXT)).toBeInTheDocument(), {
      timeout: 1000,
    });
  });
});

// Regression tests for https://github.com/radix-ui/primitives/issues/3963
describe('ref stability', () => {
  afterEach(cleanup);

  it('keeps a stable composed ref on the Trigger', () => {
    assertStableComposedRef((ref) => (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger ref={ref}>{TRIGGER_TEXT}</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Item>{ITEM_TEXT}</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    ));
  });

  // Exercises the underlying `@radix-ui/react-menu` `MenuSubTrigger` fix.
  it('keeps a stable composed ref on the SubTrigger', () => {
    assertStableComposedRef((ref) => (
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger ref={ref}>{SUB_TRIGGER_TEXT}</DropdownMenu.SubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item>{SUB_ITEM_TEXT}</DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    ));
  });
});
