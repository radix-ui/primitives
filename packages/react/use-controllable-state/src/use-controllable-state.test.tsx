import * as React from 'react';
import { screen, cleanup, render, waitFor } from '@testing-library/react';
import { useControllableState } from './use-controllable-state';
import { afterEach, describe, it, expect, afterAll, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('useControllableState', () => {
  afterEach(cleanup);

  describe('given a controlled value', () => {
    it('should initially use the controlled value', () => {
      render(<ControlledComponent />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'false');
    });

    it('should update the value when set internally', async () => {
      render(<ControlledComponent />);
      const checkbox = screen.getByRole('checkbox');
      userEvent.click(checkbox);
      await waitFor(() => {
        expect(checkbox).toHaveAttribute('aria-checked', 'true');
      });
    });

    it('should update the value when set externally', async () => {
      render(<ControlledComponent defaultChecked />);
      const checkbox = screen.getByRole('checkbox');
      const clearButton = screen.getByText('Clear value');
      userEvent.click(clearButton);
      await waitFor(() => {
        expect(checkbox).toHaveAttribute('aria-checked', 'false');
      });
    });
  });

  describe('given a default value', () => {
    it('should initially use the default value', () => {
      render(<UncontrolledComponent defaultChecked />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-checked', 'true');
    });

    it('should update the value', async () => {
      render(<UncontrolledComponent defaultChecked />);
      const checkbox = screen.getByRole('checkbox');
      userEvent.click(checkbox);
      await waitFor(() => {
        expect(checkbox).toHaveAttribute('aria-checked', 'false');
      });
    });
  });

  describe('switching between controlled and uncontrolled', () => {
    const consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => void 0);
    afterAll(() => {
      consoleMock.mockReset();
    });

    describe('controlled to uncontrolled', () => {
      it('should warn', async () => {
        render(<UnstableComponent defaultChecked />);
        const clearButton = screen.getByText('Clear value');
        userEvent.click(clearButton);
        await waitFor(() => {
          expect(consoleMock).toHaveBeenLastCalledWith(
            'Checkbox is changing from controlled to uncontrolled. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.'
          );
        });
      });
    });

    describe('uncontrolled to controlled', () => {
      it('should warn', async () => {
        render(<UnstableComponent />);
        const checkbox = screen.getByRole('checkbox');
        userEvent.click(checkbox);
        await waitFor(() => {
          expect(consoleMock).toHaveBeenLastCalledWith(
            'Checkbox is changing from uncontrolled to controlled. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.'
          );
        });
      });
    });
  });
});

function ControlledComponent({ defaultChecked }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = React.useState(defaultChecked ?? false);
  return (
    <div>
      <Checkbox checked={checked} onChange={setChecked} />
      <button type="button" onClick={() => setChecked(false)}>
        Clear value
      </button>
    </div>
  );
}

function UncontrolledComponent({ defaultChecked }: { defaultChecked?: boolean }) {
  return <Checkbox defaultChecked={defaultChecked} />;
}

function UnstableComponent({ defaultChecked }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = React.useState(defaultChecked);
  return (
    <div>
      <Checkbox checked={checked} onChange={setChecked} />
      <button type="button" onClick={() => setChecked(undefined)}>
        Clear value
      </button>
    </div>
  );
}

function Checkbox(props: {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (value: boolean) => void;
}) {
  const [checked, setChecked] = useControllableState({
    defaultProp: props.defaultChecked ?? false,
    prop: props.checked,
    onChange: props.onChange,
    caller: 'Checkbox',
  });

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onKeyDown={(e) => void (e.key === 'Enter' && e.preventDefault())}
      onClick={() => setChecked((c) => !c)}
    />
  );
}
