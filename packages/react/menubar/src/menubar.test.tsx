import * as React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import * as Menubar from './menubar';

const TRIGGER_TEXT = 'File';
const ITEM_TEXT = 'New';

const MenubarTest = (props: React.ComponentProps<typeof Menubar.Root>) => (
  <Menubar.Root {...props}>
    <Menubar.Menu value="file">
      <Menubar.Trigger>{TRIGGER_TEXT}</Menubar.Trigger>
      <Menubar.Portal>
        <Menubar.Content>
          <Menubar.Item>{ITEM_TEXT}</Menubar.Item>
        </Menubar.Content>
      </Menubar.Portal>
    </Menubar.Menu>
  </Menubar.Root>
);

describe('aria-controls', () => {
  afterEach(cleanup);

  it('should not reference a non-existent element while closed', () => {
    render(<MenubarTest />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
  });

  it('should reference the rendered content while open', async () => {
    render(<MenubarTest defaultValue="file" />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    const content = await waitFor(() => screen.getByRole('menu'));

    expect(content.id).toBeTruthy();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', content.id);
    expect(document.getElementById(content.id)).toBe(content);
  });
});
