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

/**
 * The scroll buttons mount off the viewport's scroll offsets, which jsdom
 * always reports as zero. We fake the metrics then re-notify the `scroll`
 * listener the buttons install once the content has been placed.
 */
function fakeViewportScroll(metrics: { scrollTop?: number; scrollHeight?: number }) {
  const viewport = document.querySelector('[data-radix-select-viewport]');
  if (!viewport) {
    console.warn('Expected a `Select.Viewport` to be rendered.');
    return;
  }
  for (const [property, value] of Object.entries(metrics)) {
    Object.defineProperty(viewport, property, {
      configurable: true,
      get: () => value,
      set: () => {},
    });
  }
  fireEvent.scroll(viewport);
}

describe('Select.Trigger', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Select.Root>
        <Select.Trigger
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
      </Select.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    // Composed with the trigger's own click handler rather than replaced by it.
    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Select.Root>
        <Select.Trigger
          asChild
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <button type="button">
            <Select.Value placeholder="Pick one" />
          </button>
        </Select.Trigger>
      </Select.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('role', 'combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Select.Icon', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
          <Select.Icon
            ref={ref}
            data-testid="icon"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          />
        </Select.Trigger>
      </Select.Root>,
    );

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveClass('custom-class');
    expect(icon.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(icon);

    fireEvent.click(icon);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Select.Root>
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
          <Select.Icon
            asChild
            ref={ref}
            data-testid="icon"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article />
          </Select.Icon>
        </Select.Trigger>
      </Select.Root>,
    );

    const icon = screen.getByTestId('icon');
    expect(icon.tagName).toBe('ARTICLE');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveClass('custom-class');
    expect(icon.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(icon);

    fireEvent.click(icon);
    expect(onClick).toHaveBeenCalled();
  });
});

// `position="item-aligned"` and `position="popper"` render entirely different
// internal trees so we need coverage for both.
describe('Select.Content', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders with `position="item-aligned"`', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="item-aligned"
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <Select.Viewport>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set with `position="item-aligned"`', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="item-aligned"
            asChild
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>
              <Select.Viewport>
                <Select.Item value="apple">
                  <Select.ItemText>Apple</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </article>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveAttribute('role', 'listbox');
    expect(content).toHaveAttribute('data-state', 'open');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });

  it('spreads props it does not consume onto the element it renders with `position="popper"`', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <Select.Viewport>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set with `position="popper"`', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            position="popper"
            asChild
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>
              <Select.Viewport>
                <Select.Item value="apple">
                  <Select.ItemText>Apple</Select.ItemText>
                </Select.Item>
              </Select.Viewport>
            </article>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveAttribute('role', 'listbox');
    expect(content).toHaveAttribute('data-state', 'open');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Select.Viewport', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport
              ref={ref}
              data-testid="viewport"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const viewport = screen.getByTestId('viewport');
    expect(viewport).toHaveClass('custom-class');
    expect(viewport.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(viewport);

    fireEvent.click(viewport);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport
              asChild
              ref={ref}
              data-testid="viewport"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>
                <Select.Item value="apple">
                  <Select.ItemText>Apple</Select.ItemText>
                </Select.Item>
              </article>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const viewport = screen.getByTestId('viewport');
    expect(viewport.tagName).toBe('ARTICLE');
    expect(viewport).toHaveAttribute('data-radix-select-viewport', '');
    expect(viewport).toHaveAttribute('role', 'presentation');
    expect(viewport).toHaveClass('custom-class');
    expect(viewport.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(viewport);

    fireEvent.click(viewport);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Select.Group', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport>
              <Select.Group
                ref={ref}
                data-testid="group"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <Select.Label>Fruit</Select.Label>
              </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const group = screen.getByTestId('group');
    expect(group).toHaveClass('custom-class');
    expect(group.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(group);

    fireEvent.click(group);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport>
              <Select.Group
                asChild
                ref={ref}
                data-testid="group"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>
                  <Select.Label data-testid="label">Fruit</Select.Label>
                </article>
              </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const group = screen.getByTestId('group');
    expect(group.tagName).toBe('ARTICLE');
    expect(group).toHaveAttribute('role', 'group');
    expect(group).toHaveAttribute('aria-labelledby', screen.getByTestId('label').id);
    expect(group).toHaveClass('custom-class');
    expect(group.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(group);

    fireEvent.click(group);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Select.Label', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport>
              <Select.Group>
                <Select.Label
                  ref={ref}
                  data-testid="label"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  Fruit
                </Select.Label>
              </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const label = screen.getByTestId('label');
    expect(label).toHaveClass('custom-class');
    expect(label.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(label);

    fireEvent.click(label);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport>
              <Select.Group data-testid="group">
                <Select.Label
                  asChild
                  ref={ref}
                  data-testid="label"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  <article>Fruit</article>
                </Select.Label>
              </Select.Group>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const label = screen.getByTestId('label');
    expect(label.tagName).toBe('ARTICLE');
    // The label owns the `id` its group points at, so that has to land on the consumer's element.
    expect(screen.getByTestId('group')).toHaveAttribute('aria-labelledby', label.id);
    expect(label).toHaveClass('custom-class');
    expect(label.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(label);

    fireEvent.click(label);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Select.Item', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport>
              <Select.Item
                value="apple"
                ref={ref}
                data-testid="item"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const item = screen.getByTestId('item');
    expect(item).toHaveClass('custom-class');
    expect(item.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(item);

    // Composed with the item's own handler rather than replaced
    fireEvent.click(item);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport>
              <Select.Item
                value="apple"
                asChild
                ref={ref}
                data-testid="item"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>
                  <Select.ItemText>Apple</Select.ItemText>
                </article>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const item = screen.getByTestId('item');
    expect(item.tagName).toBe('ARTICLE');
    expect(item).toHaveAttribute('role', 'option');
    expect(item).toHaveAttribute('data-state', 'checked');
    expect(item).toHaveClass('custom-class');
    expect(item.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(item);

    fireEvent.click(item);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Select.ItemIndicator', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport>
              {/* The indicator only renders inside the selected item. */}
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
                <Select.ItemIndicator
                  ref={ref}
                  data-testid="indicator"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                />
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const indicator = screen.getByTestId('indicator');
    expect(indicator).toHaveClass('custom-class');
    expect(indicator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(indicator);

    fireEvent.click(indicator);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
                <Select.ItemIndicator
                  asChild
                  ref={ref}
                  data-testid="indicator"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  <article />
                </Select.ItemIndicator>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const indicator = screen.getByTestId('indicator');
    expect(indicator.tagName).toBe('ARTICLE');
    expect(indicator).toHaveAttribute('aria-hidden', 'true');
    expect(indicator).toHaveClass('custom-class');
    expect(indicator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(indicator);

    fireEvent.click(indicator);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Select.ScrollUpButton', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.ScrollUpButton
              ref={ref}
              data-testid="scroll-up-button"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            />
            <Select.Viewport>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    // The up button only mounts once the viewport has been scrolled away from the top.
    fakeViewportScroll({ scrollTop: 1 });

    const scrollUpButton = screen.getByTestId('scroll-up-button');
    expect(scrollUpButton).toHaveClass('custom-class');
    expect(scrollUpButton.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(scrollUpButton);

    fireEvent.click(scrollUpButton);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.ScrollUpButton
              asChild
              ref={ref}
              data-testid="scroll-up-button"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article />
            </Select.ScrollUpButton>
            <Select.Viewport>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );
    fakeViewportScroll({ scrollTop: 1 });

    const scrollUpButton = screen.getByTestId('scroll-up-button');
    expect(scrollUpButton.tagName).toBe('ARTICLE');
    expect(scrollUpButton).toHaveAttribute('aria-hidden', 'true');
    expect(scrollUpButton).toHaveClass('custom-class');
    expect(scrollUpButton.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(scrollUpButton);

    fireEvent.click(scrollUpButton);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Select.ScrollDownButton', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
            <Select.ScrollDownButton
              ref={ref}
              data-testid="scroll-down-button"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            />
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );
    // The down button only mounts once the viewport has more content than it can show.
    fakeViewportScroll({ scrollHeight: 100 });

    const scrollDownButton = screen.getByTestId('scroll-down-button');
    expect(scrollDownButton).toHaveClass('custom-class');
    expect(scrollDownButton.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(scrollDownButton);

    fireEvent.click(scrollDownButton);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
            <Select.ScrollDownButton
              asChild
              ref={ref}
              data-testid="scroll-down-button"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );
    fakeViewportScroll({ scrollHeight: 100 });

    const scrollDownButton = screen.getByTestId('scroll-down-button');
    expect(scrollDownButton.tagName).toBe('ARTICLE');
    expect(scrollDownButton).toHaveAttribute('aria-hidden', 'true');
    expect(scrollDownButton).toHaveClass('custom-class');
    expect(scrollDownButton.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(scrollDownButton);

    fireEvent.click(scrollDownButton);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Select.Separator', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
              <Select.Separator
                ref={ref}
                data-testid="separator"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              />
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('custom-class');
    expect(separator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(separator);

    fireEvent.click(separator);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content>
            <Select.Viewport>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
              <Select.Separator
                asChild
                ref={ref}
                data-testid="separator"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article />
              </Select.Separator>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const separator = screen.getByTestId('separator');
    expect(separator.tagName).toBe('ARTICLE');
    expect(separator).toHaveAttribute('aria-hidden', 'true');
    expect(separator).toHaveClass('custom-class');
    expect(separator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(separator);

    fireEvent.click(separator);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Select.Arrow', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<SVGSVGElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          {/* The arrow only renders for `position="popper"`. */}
          <Select.Content position="popper">
            <Select.Viewport>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
            <Select.Arrow
              ref={ref}
              data-testid="arrow"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            />
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const arrow = screen.getByTestId('arrow');
    expect(arrow).toHaveClass('custom-class');
    expect(arrow.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(arrow);

    fireEvent.click(arrow);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<SVGSVGElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="apple">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content position="popper">
            <Select.Viewport>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
            <Select.Arrow
              asChild
              ref={ref}
              data-testid="arrow"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <svg />
            </Select.Arrow>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const arrow = screen.getByTestId('arrow');
    // SVG tag names keep their authored case.
    expect(arrow.tagName).toBe('svg');
    expect(arrow).toHaveAttribute('viewBox', '0 0 30 10');
    expect(arrow).toHaveClass('custom-class');
    expect(arrow.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(arrow);

    fireEvent.click(arrow);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Select.BubbleInput', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLSelectElement>();
    const onClick = vi.fn();

    render(
      <Select.Provider>
        <Select.BubbleInput
          ref={ref}
          data-testid="bubble-input"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        />
      </Select.Provider>,
    );

    const bubbleInput = screen.getByTestId('bubble-input');
    expect(bubbleInput).toHaveAttribute('aria-hidden', 'true');
    expect(bubbleInput).toHaveAttribute('tabindex', '-1');
    expect(bubbleInput).toHaveClass('custom-class');
    expect(bubbleInput.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(bubbleInput);

    fireEvent.click(bubbleInput);
    expect(onClick).toHaveBeenCalled();
  });

  // TODO: Fix this
  it.todo('forwards props to the child element when `asChild` is set');
});

describe('Select.Value', () => {
  afterEach(cleanupModal);

  it('spreads unknown props and the ref onto the element it renders', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Select.Root>
        <Select.Trigger>
          <Select.Value ref={ref} data-testid="value" onClick={onClick} placeholder="Pick one" />
        </Select.Trigger>
      </Select.Root>,
    );

    const value = screen.getByTestId('value');
    expect(ref.current).toBe(value);

    fireEvent.click(value);
    expect(onClick).toHaveBeenCalled();
  });

  // TODO: Fix this
  it.todo("applies the consumer's `className` and `style`");

  // TODO: Fix this
  it.todo('forwards props to the child element when `asChild` is set');
});

describe('Select.ItemText', () => {
  afterEach(cleanupModal);

  it('spreads unknown props and the ref onto the element it renders', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Select.Root defaultOpen defaultValue="banana">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content position="item-aligned">
            <Select.Viewport>
              <Select.Item value="apple">
                <Select.ItemText ref={ref} data-testid="item-text" onClick={onClick}>
                  Apple
                </Select.ItemText>
              </Select.Item>
              <Select.Item value="banana">
                <Select.ItemText>Banana</Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>,
    );

    const itemText = screen.getByTestId('item-text');
    expect(ref.current).toBe(itemText);

    fireEvent.click(itemText);
    expect(onClick).toHaveBeenCalled();
  });

  // TODO: Fix this
  it.todo("applies the consumer's `className` and `style`");
});

function cleanupModal() {
  cleanup();
  // Open content is a modal layer, which sets this on the `body` and only
  // restores it on close.
  document.body.style.pointerEvents = '';
}
