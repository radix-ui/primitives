import * as React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import * as Select from './select';

const PLACEHOLDER_TEXT = 'Pick one';
const CLEAR_TEXT = 'None';

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

const SelectClearableTest = (props: React.ComponentProps<typeof Select.Root>) => (
  <Select.Root {...props}>
    <Select.Trigger aria-label="Choice">
      <Select.Value placeholder={PLACEHOLDER_TEXT} />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content position="popper">
        <Select.Viewport>
          <Select.Item value="">
            <Select.ItemText>{CLEAR_TEXT}</Select.ItemText>
          </Select.Item>
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

describe('clearing an optional value (#2706)', () => {
  afterEach(cleanup);

  it('allows a `Select.Item` with an empty string value to be rendered', async () => {
    expect(() => render(<SelectClearableTest defaultOpen />)).not.toThrow();
    const clearItem = await waitFor(() => screen.getByText(CLEAR_TEXT));
    expect(clearItem).toBeInTheDocument();
  });

  it('marks the empty value item as selected when the value is empty', async () => {
    render(<SelectClearableTest defaultOpen value="" />);
    const clearItem = await waitFor(() =>
      screen.getByRole('option', { name: CLEAR_TEXT, hidden: true }),
    );
    expect(clearItem).toHaveAttribute('data-state', 'checked');
  });

  it('shows the placeholder (not the item text) when the empty value item is selected', async () => {
    render(<SelectClearableTest value="" />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent(PLACEHOLDER_TEXT);
    expect(trigger).not.toHaveTextContent(CLEAR_TEXT);
    expect(trigger).toHaveAttribute('data-placeholder');
  });

  it('lets the user reset a previously selected value back to the placeholder', async () => {
    function ControlledSelect() {
      const [value, setValue] = React.useState<string | undefined>('apple');
      return <SelectClearableTest value={value} onValueChange={setValue} defaultOpen />;
    }

    render(<ControlledSelect />);
    const trigger = screen.getByRole('combobox', { hidden: true });

    // Value starts as "apple" and the trigger reflects it.
    await waitFor(() => expect(trigger).toHaveTextContent('Apple'));
    expect(trigger).not.toHaveAttribute('data-placeholder');

    // Selecting the empty value item clears the selection.
    const clearItem = screen.getByRole('option', { name: CLEAR_TEXT, hidden: true });
    fireEvent.click(clearItem);

    await waitFor(() => expect(trigger).toHaveTextContent(PLACEHOLDER_TEXT));
    expect(trigger).not.toHaveTextContent('Apple');
    expect(trigger).toHaveAttribute('data-placeholder');
  });

  it('renders a single empty native option when a clear item is provided', async () => {
    const { container } = render(
      <form>
        <SelectClearableTest name="fruit" value="" defaultOpen />
      </form>,
    );
    // Wait for items to register their native options.
    await waitFor(() => {
      const nativeSelect = container.querySelector('select');
      const optionValues = Array.from(nativeSelect?.querySelectorAll('option') ?? []).map(
        (o) => o.value,
      );
      expect(optionValues).toContain('apple');
    });
    const nativeSelect = container.querySelector('select');
    const emptyOptions = Array.from(nativeSelect?.querySelectorAll('option') ?? []).filter(
      (option) => option.value === '',
    );
    expect(emptyOptions).toHaveLength(1);
  });
});

// Regression test for https://github.com/radix-ui/primitives/issues/1488
describe('given a select item', () => {
  afterEach(cleanup);

  it('should not allow text selection', async () => {
    render(<SelectTest defaultOpen />);
    const option = await waitFor(() => screen.getByRole('option', { name: 'Apple', hidden: true }));
    expect(option).toHaveStyle({ userSelect: 'none' });
  });
});
