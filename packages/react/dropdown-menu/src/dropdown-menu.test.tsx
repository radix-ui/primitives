import * as React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import * as DropdownMenu from './dropdown-menu';

const TRIGGER_TEXT = 'Open';
const ITEM_TEXT = 'Item';

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
