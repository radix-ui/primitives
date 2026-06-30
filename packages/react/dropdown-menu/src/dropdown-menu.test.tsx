import * as React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';
import * as DropdownMenu from './dropdown-menu';

const TRIGGER_TEXT = 'Open';
const ITEM_TEXT = 'Item';
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
