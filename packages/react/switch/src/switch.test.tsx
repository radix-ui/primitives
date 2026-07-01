import * as React from 'react';
import * as Switch from './switch';
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

describe('async checked actions', () => {
  afterEach(cleanup);

  it('shows the next controlled checked state optimistically while the action is pending', async () => {
    const deferredAction = createDeferred<void>();
    const handleCheckedChangedAction = vi.fn();

    function ControlledSwitch() {
      const [checked, setChecked] = React.useState(false);

      return (
        <Switch.Root
          checked={checked}
          checkedChangedAction={async (nextChecked) => {
            handleCheckedChangedAction(nextChecked);
            await deferredAction.promise;
            setChecked(nextChecked);
          }}
        >
          <Switch.Thumb />
        </Switch.Root>
      );
    }

    render(<ControlledSwitch />);

    const switchControl = screen.getByRole(SWITCH_ROLE);
    const thumb = switchControl.querySelector('[data-state]');
    expect(switchControl).toHaveAttribute('aria-checked', 'false');

    act(() => fireEvent.click(switchControl));

    expect(handleCheckedChangedAction).toHaveBeenCalledWith(true);
    expect(switchControl).toHaveAttribute('aria-checked', 'true');
    expect(switchControl).toHaveAttribute('data-state', 'checked');
    expect(thumb).toHaveAttribute('data-state', 'checked');

    await act(async () => {
      deferredAction.resolve();
      await deferredAction.promise;
    });

    expect(switchControl).toHaveAttribute('aria-checked', 'true');
    expect(thumb).toHaveAttribute('data-state', 'checked');
  });

  it('ignores additional checked changes while the checked action is pending', async () => {
    const deferredAction = createDeferred<void>();
    const handleCheckedChangedAction = vi.fn(() => deferredAction.promise);

    render(
      <Switch.Root checked={false} checkedChangedAction={handleCheckedChangedAction}>
        <Switch.Thumb />
      </Switch.Root>,
    );

    const switchControl = screen.getByRole(SWITCH_ROLE);

    act(() => fireEvent.click(switchControl));
    act(() => fireEvent.click(switchControl));

    expect(handleCheckedChangedAction).toHaveBeenCalledTimes(1);
    expect(handleCheckedChangedAction).toHaveBeenCalledWith(true);
    expect(switchControl).toHaveAttribute('aria-checked', 'true');

    await act(async () => {
      deferredAction.resolve();
      await deferredAction.promise;
    });

    expect(switchControl).toHaveAttribute('aria-checked', 'false');
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

function createDeferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });

  return { promise, resolve, reject };
}
