import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';
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

describe('disabled item', () => {
  afterEach(cleanup);

  const SelectWithDisabledItem = (
    props: React.ComponentProps<typeof Select.Root> & { onItemClick?: () => void },
  ) => {
    const { onItemClick, ...rootProps } = props;
    return (
      <Select.Root defaultOpen {...rootProps}>
        <Select.Trigger aria-label="Choice">
          <Select.Value placeholder={PLACEHOLDER_TEXT} />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content position="popper">
            <Select.Viewport>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
              <Select.Item value="banana" disabled onClick={onItemClick}>
                <Select.ItemText>Banana</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    );
  };

  it('does not select a disabled item that is clicked', async () => {
    const onValueChange = vi.fn();
    render(<SelectWithDisabledItem onValueChange={onValueChange} />);
    const banana = await waitFor(() =>
      screen.getByRole('option', { name: 'Banana', hidden: true }),
    );
    fireEvent.click(banana);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('still calls a consumer-provided `onClick` on a disabled item', async () => {
    const onItemClick = vi.fn();
    render(<SelectWithDisabledItem onItemClick={onItemClick} />);
    const banana = await waitFor(() =>
      screen.getByRole('option', { name: 'Banana', hidden: true }),
    );
    fireEvent.click(banana);
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });
});

// Regression tests for https://github.com/radix-ui/primitives/issues/3232
describe('keys from focusable descendants', () => {
  afterEach(cleanup);

  const SelectWithPortaledInput = (props: React.ComponentProps<typeof Select.Root>) => (
    <Select.Root defaultOpen {...props}>
      <Select.Trigger aria-label="Choice">
        <Select.Value placeholder={PLACEHOLDER_TEXT} />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content position="popper">
          <Select.Viewport>
            <Select.Item value="apple">
              <Select.ItemText>Apple</Select.ItemText>
              {ReactDOM.createPortal(<input data-testid="input" defaultValue="" />, document.body)}
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );

  it('does not select an item from Space/Enter typed into a portaled focusable descendant', async () => {
    const onValueChange = vi.fn();
    render(<SelectWithPortaledInput onValueChange={onValueChange} />);
    const input = await waitFor(() => screen.getByTestId('input'));
    input.focus();
    fireEvent.keyDown(input, { key: ' ' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('still selects the item via Enter when the item itself is focused', async () => {
    const onValueChange = vi.fn();
    render(<SelectWithPortaledInput onValueChange={onValueChange} />);
    const item = await waitFor(() => screen.getByRole('option', { name: 'Apple', hidden: true }));
    item.focus();
    fireEvent.keyDown(item, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('apple');
  });
});

// Regression tests for https://github.com/radix-ui/primitives/issues/3963
describe('Select ref stability', () => {
  afterEach(cleanup);

  const renderOpenSelect =
    (slot: 'content' | 'item' | 'itemText') => (ref: React.RefCallback<any>) => (
      <Select.Root defaultOpen>
        <Select.Trigger aria-label="Choice">
          <Select.Value placeholder={PLACEHOLDER_TEXT} />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content ref={slot === 'content' ? ref : undefined}>
            <Select.Viewport>
              <Select.Item value="apple" ref={slot === 'item' ? ref : undefined}>
                <Select.ItemText ref={slot === 'itemText' ? ref : undefined}>Apple</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    );

  it('keeps a stable composed ref on Content', () => {
    assertStableComposedRef(renderOpenSelect('content'));
  });

  it('keeps a stable composed ref on Item', () => {
    assertStableComposedRef(renderOpenSelect('item'));
  });

  it('keeps a stable composed ref on ItemText', () => {
    assertStableComposedRef(renderOpenSelect('itemText'));
  });
});

describe('given a Select in a form that is reset', () => {
  afterEach(cleanup);

  describe('uncontrolled', () => {
    it('should restore its `defaultValue` when the form is reset', async () => {
      render(
        <form>
          {/* Keep the content open so the items (and their selection state) stay mounted. */}
          <SelectTest name="fruit" defaultValue="apple" open onOpenChange={() => {}} />
          <button type="reset">Reset</button>
        </form>,
      );

      const listbox = await screen.findByRole('listbox', { hidden: true });
      const apple = within(listbox).getByRole('option', { name: 'Apple' });
      const banana = within(listbox).getByRole('option', { name: 'Banana' });

      expect(apple).toHaveAttribute('data-state', 'checked');

      act(() => fireEvent.click(banana));
      expect(banana).toHaveAttribute('data-state', 'checked');
      expect(apple).toHaveAttribute('data-state', 'unchecked');

      act(() => fireEvent.click(screen.getByText('Reset')));
      expect(apple).toHaveAttribute('data-state', 'checked');
      expect(banana).toHaveAttribute('data-state', 'unchecked');
    });

    it('should restore the placeholder when reset with no initial value', async () => {
      render(
        <form>
          {/* Keep the content open so the items (and their selection state) stay mounted. */}
          <SelectTest name="fruit" open onOpenChange={() => {}} />
          <button type="reset">Reset</button>
        </form>,
      );

      const trigger = screen.getByRole('combobox', { name: 'Choice', hidden: true });
      // No value selected initially, so the placeholder is shown.
      expect(trigger).toHaveTextContent(PLACEHOLDER_TEXT);

      const listbox = await screen.findByRole('listbox', { hidden: true });
      const banana = within(listbox).getByRole('option', { name: 'Banana' });
      act(() => fireEvent.click(banana));
      expect(banana).toHaveAttribute('data-state', 'checked');
      expect(trigger).not.toHaveTextContent(PLACEHOLDER_TEXT);

      act(() => fireEvent.click(screen.getByRole('button', { name: 'Reset', hidden: true })));
      expect(banana).toHaveAttribute('data-state', 'unchecked');
      expect(trigger).toHaveTextContent(PLACEHOLDER_TEXT);
    });
  });

  describe('controlled', () => {
    it('should restore its initial `value` when the form is reset', async () => {
      function ControlledSelect() {
        const [value, setValue] = React.useState('apple');
        return (
          <form>
            <SelectTest
              name="fruit"
              value={value}
              onValueChange={setValue}
              open
              onOpenChange={() => {}}
            />
            <button type="reset">Reset</button>
          </form>
        );
      }

      render(<ControlledSelect />);

      const listbox = await screen.findByRole('listbox', { hidden: true });
      const apple = within(listbox).getByRole('option', { name: 'Apple' });
      expect(apple).toHaveAttribute('data-state', 'checked');

      const banana = within(listbox).getByRole('option', { name: 'Banana' });
      act(() => fireEvent.click(banana));
      expect(banana).toHaveAttribute('data-state', 'checked');
      expect(apple).toHaveAttribute('data-state', 'unchecked');

      act(() => fireEvent.click(screen.getByText('Reset')));
      expect(apple).toHaveAttribute('data-state', 'checked');
      expect(banana).toHaveAttribute('data-state', 'unchecked');
    });
  });

  describe('external form association', () => {
    it('should restore its `defaultValue` when reset from an external form', async () => {
      render(
        <>
          <form id="select-reset-form">
            <button type="reset">Reset</button>
          </form>
          <SelectTest
            name="fruit"
            form="select-reset-form"
            defaultValue="apple"
            open
            onOpenChange={() => {}}
          />
        </>,
      );

      const listbox = await screen.findByRole('listbox', { hidden: true });
      const apple = within(listbox).getByRole('option', { name: 'Apple' });
      expect(apple).toHaveAttribute('data-state', 'checked');

      const banana = within(listbox).getByRole('option', { name: 'Banana' });
      act(() => fireEvent.click(banana));
      expect(banana).toHaveAttribute('data-state', 'checked');

      act(() => fireEvent.click(screen.getByRole('button', { name: 'Reset', hidden: true })));
      expect(apple).toHaveAttribute('data-state', 'checked');
      expect(banana).toHaveAttribute('data-state', 'unchecked');
    });

    it('should restore its initial `value` when reset from an external form', async () => {
      function ControlledSelect() {
        const [value, setValue] = React.useState('apple');
        return (
          <>
            <form id="select-reset-form">
              <button type="reset">Reset</button>
            </form>
            <SelectTest
              name="fruit"
              form="select-reset-form"
              value={value}
              onValueChange={setValue}
              open
              onOpenChange={() => {}}
            />
          </>
        );
      }

      render(<ControlledSelect />);

      const listbox = await screen.findByRole('listbox', { hidden: true });
      const apple = within(listbox).getByRole('option', { name: 'Apple' });
      expect(apple).toHaveAttribute('data-state', 'checked');

      const banana = within(listbox).getByRole('option', { name: 'Banana' });
      act(() => fireEvent.click(banana));
      expect(banana).toHaveAttribute('data-state', 'checked');

      act(() => fireEvent.click(screen.getByRole('button', { name: 'Reset', hidden: true })));
      expect(apple).toHaveAttribute('data-state', 'checked');
      expect(banana).toHaveAttribute('data-state', 'unchecked');
    });
  });
});
