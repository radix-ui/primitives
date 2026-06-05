import * as React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import * as Select from './select';

const PLACEHOLDER_TEXT = 'Pick one';

const SelectTest = (props: React.ComponentProps<typeof Select.Root>) => (
  <Select.Root {...props}>
    <Select.Trigger aria-label="Choice">
      <Select.Value placeholder={PLACEHOLDER_TEXT} />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content position="popper">
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

describe('aria-controls', () => {
  afterEach(cleanup);

  it('should not reference a non-existent element while closed', () => {
    render(<SelectTest />);
    const trigger = screen.getByRole('combobox');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
  });

  it('should reference the rendered content while open', async () => {
    render(<SelectTest defaultOpen />);
    const trigger = screen.getByRole('combobox', { hidden: true });
    const content = await waitFor(() => screen.getByRole('listbox'));

    expect(content.id).toBeTruthy();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', content.id);
    expect(document.getElementById(content.id)).toBe(content);
  });
});
