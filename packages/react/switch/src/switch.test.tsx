import * as React from 'react';
import * as Switch from './switch';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';

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
