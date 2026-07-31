import * as React from 'react';
import * as Switch from '.';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';

const SWITCH_ROLE = 'switch';

describe('given a default Switch', () => {
  afterEach(cleanup);

  let cleanedUp = false;

  function Test() {
    return (
      <Switch.Root
        ref={() => () => {
          cleanedUp = true;
        }}
      >
        <Switch.Thumb />
      </Switch.Root>
    );
  }

  it('should correctly invoke the cleanup function of a ref callback', () => {
    const rendered = render(<Test />);
    rendered.unmount();
    expect(cleanedUp).toBe(true);
  });
});

describe('given a Switch in a form', () => {
  afterEach(cleanup);

  describe('uncontrolled', () => {
    it('should restore its `defaultChecked` value when the form is reset', () => {
      render(
        <form>
          <Switch.Root name="notifications" defaultChecked>
            <Switch.Thumb />
          </Switch.Root>
          <button type="reset">Reset</button>
        </form>,
      );

      const switchControl = screen.getByRole(SWITCH_ROLE);
      expect(switchControl).toHaveAttribute('aria-checked', 'true');

      act(() => fireEvent.click(switchControl));
      expect(switchControl).toHaveAttribute('aria-checked', 'false');

      act(() => fireEvent.click(screen.getByText('Reset')));
      expect(switchControl).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('controlled', () => {
    it('should restore its initial `checked` value when the form is reset', () => {
      function ControlledSwitch() {
        const [checked, setChecked] = React.useState(true);
        return (
          <form>
            <Switch.Root name="notifications" checked={checked} onCheckedChange={setChecked}>
              <Switch.Thumb />
            </Switch.Root>
            <button type="reset">Reset</button>
          </form>
        );
      }

      render(<ControlledSwitch />);

      const switchControl = screen.getByRole(SWITCH_ROLE);
      expect(switchControl).toHaveAttribute('aria-checked', 'true');

      act(() => fireEvent.click(switchControl));
      expect(switchControl).toHaveAttribute('aria-checked', 'false');

      act(() => fireEvent.click(screen.getByText('Reset')));
      expect(switchControl).toHaveAttribute('aria-checked', 'true');
    });
  });
});

describe('given a Switch with external form association', () => {
  afterEach(cleanup);

  describe('uncontrolled', () => {
    it('should restore its `defaultChecked` value when the external form is reset', () => {
      render(
        <>
          <form id="switch-reset-form">
            <button type="reset">Reset</button>
          </form>
          <Switch.Root name="notifications" form="switch-reset-form" defaultChecked>
            <Switch.Thumb />
          </Switch.Root>
        </>,
      );

      const switchControl = screen.getByRole(SWITCH_ROLE);
      expect(switchControl).toHaveAttribute('aria-checked', 'true');

      act(() => fireEvent.click(switchControl));
      expect(switchControl).toHaveAttribute('aria-checked', 'false');

      act(() => fireEvent.click(screen.getByRole('button', { name: 'Reset' })));
      expect(switchControl).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('controlled', () => {
    it('should restore its initial `checked` value when the external form is reset', () => {
      function ControlledSwitch() {
        const [checked, setChecked] = React.useState(true);
        return (
          <>
            <form id="switch-reset-form">
              <button type="reset">Reset</button>
            </form>
            <Switch.Root
              name="notifications"
              form="switch-reset-form"
              checked={checked}
              onCheckedChange={setChecked}
            >
              <Switch.Thumb />
            </Switch.Root>
          </>
        );
      }

      render(<ControlledSwitch />);

      const switchControl = screen.getByRole(SWITCH_ROLE);
      expect(switchControl).toHaveAttribute('aria-checked', 'true');

      act(() => fireEvent.click(switchControl));
      expect(switchControl).toHaveAttribute('aria-checked', 'false');

      act(() => fireEvent.click(screen.getByRole('button', { name: 'Reset' })));
      expect(switchControl).toHaveAttribute('aria-checked', 'true');
    });
  });
});

describe('given a Switch with a clickable ancestor inside a form', () => {
  afterEach(cleanup);

  const onParentClick = vi.fn();
  const onFormChange = vi.fn();

  afterEach(() => {
    onParentClick.mockClear();
    onFormChange.mockClear();
  });

  function App({ checked }: { checked: boolean }) {
    return (
      <form
        onChange={(event) => onFormChange((event.target as unknown as HTMLInputElement).checked)}
      >
        <div onClick={onParentClick}>
          <Switch.Root checked={checked} onCheckedChange={() => {}}>
            <Switch.Thumb />
          </Switch.Root>
        </div>
      </form>
    );
  }

  // regression test for https://github.com/radix-ui/primitives/issues/3265
  it('should not trigger the ancestor `onClick` when `checked` is updated programmatically', () => {
    const { rerender } = render(<App checked={false} />);
    act(() => rerender(<App checked={true} />));
    expect(onParentClick).not.toHaveBeenCalled();
    // the form should still be notified of the change
    expect(onFormChange).toHaveBeenCalledWith(true);
  });

  it('should trigger the ancestor `onClick` on a real user click', () => {
    render(
      <form
        onChange={(event) => onFormChange((event.target as unknown as HTMLInputElement).checked)}
      >
        <div onClick={onParentClick}>
          <Switch.Root>
            <Switch.Thumb />
          </Switch.Root>
        </div>
      </form>,
    );
    act(() => fireEvent.click(screen.getByRole(SWITCH_ROLE)));
    expect(onParentClick).toHaveBeenCalledTimes(1);
  });

  // regression test for https://github.com/radix-ui/primitives/issues/3265
  it('should not trigger the ancestor `onClick` on a programmatic update after a click that did not change `checked`', () => {
    const { rerender } = render(<App checked={false} />);
    // user click that is rejected by the controlled parent (no `checked` change)
    act(() => fireEvent.click(screen.getByRole(SWITCH_ROLE)));
    onParentClick.mockClear();
    // subsequent programmatic update
    act(() => rerender(<App checked />));
    expect(onParentClick).not.toHaveBeenCalled();
    // the form should still be notified of the change
    expect(onFormChange).toHaveBeenCalledWith(true);
  });
});

describe('Switch.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Switch.Root
        defaultChecked
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <Switch.Thumb />
      </Switch.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    // Composed with the switch's own click handler rather than replaced by it.
    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Switch.Root
        defaultChecked
        asChild
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <button type="button">
          <Switch.Thumb />
        </button>
      </Switch.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.tagName).toBe('BUTTON');
    expect(root).toHaveAttribute('role', 'switch');
    expect(root).toHaveAttribute('data-state', 'checked');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Switch.unstable_Trigger', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Switch.unstable_Provider defaultChecked>
        <Switch.unstable_Trigger
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <Switch.Thumb />
        </Switch.unstable_Trigger>
      </Switch.unstable_Provider>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Switch.unstable_Provider defaultChecked>
        <Switch.unstable_Trigger
          asChild
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <button type="button">
            <Switch.Thumb />
          </button>
        </Switch.unstable_Trigger>
      </Switch.unstable_Provider>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('role', 'switch');
    expect(trigger).toHaveAttribute('aria-checked', 'true');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Switch.Thumb', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Switch.Root defaultChecked>
        <Switch.Thumb
          ref={ref}
          data-testid="thumb"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        />
      </Switch.Root>,
    );

    const thumb = screen.getByTestId('thumb');
    expect(thumb).toHaveClass('custom-class');
    expect(thumb.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(thumb);

    fireEvent.click(thumb);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Switch.Root defaultChecked>
        <Switch.Thumb
          asChild
          ref={ref}
          data-testid="thumb"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article />
        </Switch.Thumb>
      </Switch.Root>,
    );

    const thumb = screen.getByTestId('thumb');
    expect(thumb.tagName).toBe('ARTICLE');
    expect(thumb).toHaveAttribute('data-state', 'checked');
    expect(thumb).toHaveClass('custom-class');
    expect(thumb.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(thumb);

    fireEvent.click(thumb);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Switch.unstable_BubbleInput', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLInputElement>();
    const onClick = vi.fn();

    render(
      <Switch.unstable_Provider defaultChecked>
        <Switch.unstable_BubbleInput
          ref={ref}
          data-testid="bubble-input"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        />
      </Switch.unstable_Provider>,
    );

    const input = screen.getByTestId('bubble-input');
    expect(input).toHaveClass('custom-class');
    expect(input.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(input);

    // The input is visually hidden, so a real user never clicks it. The part
    // composes `onClick` to swallow the synthetic clicks it dispatches at
    // forms, and that composition is exactly where a consumer's handler could
    // get dropped.
    fireEvent.click(input);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLInputElement>();
    const onClick = vi.fn();

    render(
      <Switch.unstable_Provider defaultChecked>
        <Switch.unstable_BubbleInput
          asChild
          ref={ref}
          data-testid="bubble-input"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <input />
        </Switch.unstable_BubbleInput>
      </Switch.unstable_Provider>,
    );

    const input = screen.getByTestId('bubble-input');
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'checkbox');
    expect(input).toHaveAttribute('aria-hidden', 'true');
    expect(input).toHaveClass('custom-class');
    expect(input.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(input);

    fireEvent.click(input);
    expect(onClick).toHaveBeenCalled();
  });
});
