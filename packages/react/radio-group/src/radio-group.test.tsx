import * as React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, fireEvent, screen, act } from '@testing-library/react';
import * as RadioGroup from '.';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

const RADIO_ROLE = 'radio';
const INDICATOR_TEST_ID = 'radio-indicator';

global.ResizeObserver = class ResizeObserver {
  cb: any;
  constructor(cb: any) {
    this.cb = cb;
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
  }
  unobserve() {}
  disconnect() {}
};

const VALUES = ['1', '2', '3'];
const LABELS: Record<string, string> = { '1': 'cat', '2': 'dog', '3': 'rabbit' };

function ClassicRadioGroup(props: React.ComponentProps<typeof RadioGroup.Root>) {
  return (
    <RadioGroup.Root aria-label="pets" {...props}>
      {VALUES.map((value) => (
        <RadioGroup.Item key={value} value={value} aria-label={LABELS[value]}>
          <RadioGroup.Indicator data-testid={`${INDICATOR_TEST_ID}-${value}`} />
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  );
}

function ComposableRadioGroup(props: React.ComponentProps<typeof RadioGroup.Root>) {
  return (
    <RadioGroup.Root aria-label="pets" {...props}>
      {VALUES.map((value) => (
        <RadioGroup.unstable_ItemProvider key={value} value={value}>
          <RadioGroup.unstable_ItemTrigger aria-label={LABELS[value]}>
            <RadioGroup.Indicator data-testid={`${INDICATOR_TEST_ID}-${value}`} />
          </RadioGroup.unstable_ItemTrigger>
          <RadioGroup.unstable_ItemBubbleInput />
        </RadioGroup.unstable_ItemProvider>
      ))}
    </RadioGroup.Root>
  );
}

describe('RadioGroup', () => {
  afterEach(cleanup);

  describe('given a default RadioGroup', () => {
    let rendered: RenderResult;
    beforeEach(() => {
      rendered = render(<ClassicRadioGroup />);
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should render all items unchecked', () => {
      const radios = screen.getAllByRole(RADIO_ROLE);
      expect(radios).toHaveLength(3);
      radios.forEach((radio) => expect(radio).toHaveAttribute('aria-checked', 'false'));
    });

    it('should check an item and show its indicator when clicked', async () => {
      const radios = screen.getAllByRole(RADIO_ROLE);
      await act(async () => fireEvent.click(radios[0]!));

      expect(radios[0]).toHaveAttribute('aria-checked', 'true');
      expect(screen.queryByTestId(`${INDICATOR_TEST_ID}-1`)).toBeVisible();
    });

    it('should move selection to another item', async () => {
      const radios = screen.getAllByRole(RADIO_ROLE);
      await act(async () => fireEvent.click(radios[0]!));
      await act(async () => fireEvent.click(radios[1]!));

      expect(radios[0]).toHaveAttribute('aria-checked', 'false');
      expect(radios[1]).toHaveAttribute('aria-checked', 'true');
      expect(screen.queryByTestId(`${INDICATOR_TEST_ID}-1`)).not.toBeInTheDocument();
      expect(screen.queryByTestId(`${INDICATOR_TEST_ID}-2`)).toBeVisible();
    });

    it('should not uncheck an item when clicked again', async () => {
      const radios = screen.getAllByRole(RADIO_ROLE);
      await act(async () => fireEvent.click(radios[0]!));
      await act(async () => fireEvent.click(radios[0]!));

      expect(radios[0]).toHaveAttribute('aria-checked', 'true');
      expect(screen.queryByTestId(`${INDICATOR_TEST_ID}-1`)).toBeVisible();
    });
  });

  describe('given a RadioGroup with `defaultValue`', () => {
    it('should render the matching item checked', () => {
      render(<ClassicRadioGroup defaultValue="2" />);
      const radios = screen.getAllByRole(RADIO_ROLE);
      expect(radios[1]).toHaveAttribute('aria-checked', 'true');
      expect(screen.queryByTestId(`${INDICATOR_TEST_ID}-2`)).toBeVisible();
    });
  });

  describe('given a disabled RadioGroup', () => {
    let rendered: RenderResult;
    const onValueChange = vi.fn();
    beforeEach(() => {
      onValueChange.mockReset();
      rendered = render(<ClassicRadioGroup disabled onValueChange={onValueChange} />);
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should not check an item when clicked', async () => {
      const radios = screen.getAllByRole(RADIO_ROLE);
      await act(async () => fireEvent.click(radios[0]!));
      expect(radios[0]).toHaveAttribute('aria-checked', 'false');
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('given a RadioGroup with a disabled item', () => {
    const onValueChange = vi.fn();
    beforeEach(() => {
      onValueChange.mockReset();
      render(
        <RadioGroup.Root aria-label="pets" onValueChange={onValueChange}>
          <RadioGroup.Item value="1" aria-label="cat">
            <RadioGroup.Indicator data-testid={`${INDICATOR_TEST_ID}-1`} />
          </RadioGroup.Item>
          <RadioGroup.Item value="2" aria-label="dog" disabled>
            <RadioGroup.Indicator data-testid={`${INDICATOR_TEST_ID}-2`} />
          </RadioGroup.Item>
        </RadioGroup.Root>,
      );
    });

    it('should not check the disabled item when clicked', async () => {
      const radios = screen.getAllByRole(RADIO_ROLE);
      await act(async () => fireEvent.click(radios[1]!));
      expect(radios[1]).toHaveAttribute('aria-checked', 'false');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('should still allow checking an enabled item', async () => {
      const radios = screen.getAllByRole(RADIO_ROLE);
      await act(async () => fireEvent.click(radios[0]!));
      expect(radios[0]).toHaveAttribute('aria-checked', 'true');
      expect(onValueChange).toHaveBeenCalledWith('1');
    });
  });

  describe('given a controlled RadioGroup', () => {
    const onValueChange = vi.fn();

    function ControlledRadioGroup() {
      const [value, setValue] = React.useState<string | null>(null);
      const [blockChange, setBlockChange] = React.useState(false);
      return (
        <div>
          <RadioGroup.Root
            aria-label="pets"
            value={value}
            onValueChange={(next) => {
              onValueChange(next);
              if (!blockChange) setValue(next);
            }}
          >
            {VALUES.map((v) => (
              <RadioGroup.Item key={v} value={v} aria-label={LABELS[v]}>
                <RadioGroup.Indicator data-testid={`${INDICATOR_TEST_ID}-${v}`} />
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
          <button type="button" onClick={() => setBlockChange((prev) => !prev)}>
            {blockChange ? 'Unblock' : 'Block'}
          </button>
        </div>
      );
    }

    beforeEach(() => {
      onValueChange.mockReset();
      render(<ControlledRadioGroup />);
    });

    it('should call `onValueChange` with the clicked value', async () => {
      const radios = screen.getAllByRole(RADIO_ROLE);
      await act(async () => fireEvent.click(radios[2]!));
      expect(onValueChange).toHaveBeenCalledWith('3');
      expect(radios[2]).toHaveAttribute('aria-checked', 'true');
    });

    it('should not change selection unless controlled state updates', async () => {
      const radios = screen.getAllByRole(RADIO_ROLE);
      await act(async () => fireEvent.click(screen.getByText('Block')));
      await act(async () => fireEvent.click(radios[0]!));
      expect(onValueChange).toHaveBeenCalledWith('1');
      expect(radios[0]).toHaveAttribute('aria-checked', 'false');
      expect(screen.queryByTestId(`${INDICATOR_TEST_ID}-1`)).not.toBeInTheDocument();
    });
  });

  describe('given a controlled RadioGroup that is reset to `null`', () => {
    function ResettableRadioGroup() {
      const [value, setValue] = React.useState<string | null>('2');
      return (
        <div>
          <RadioGroup.Root aria-label="pets" value={value} onValueChange={setValue}>
            {VALUES.map((v) => (
              <RadioGroup.Item key={v} value={v} aria-label={LABELS[v]}>
                <RadioGroup.Indicator data-testid={`${INDICATOR_TEST_ID}-${v}`} />
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
          <button type="button" onClick={() => setValue(null)}>
            Reset
          </button>
        </div>
      );
    }

    beforeEach(() => {
      render(<ResettableRadioGroup />);
    });

    it('should uncheck every item and hide indicators when value becomes `null`', async () => {
      const radios = screen.getAllByRole(RADIO_ROLE);
      expect(radios[1]).toHaveAttribute('aria-checked', 'true');
      expect(screen.queryByTestId(`${INDICATOR_TEST_ID}-2`)).toBeVisible();

      await act(async () => fireEvent.click(screen.getByText('Reset')));

      radios.forEach((radio) => expect(radio).toHaveAttribute('aria-checked', 'false'));
      expect(screen.queryByTestId(`${INDICATOR_TEST_ID}-2`)).not.toBeInTheDocument();
    });

    it('should allow selecting a new value after being reset', async () => {
      const radios = screen.getAllByRole(RADIO_ROLE);
      await act(async () => fireEvent.click(screen.getByText('Reset')));
      await act(async () => fireEvent.click(radios[0]!));

      expect(radios[0]).toHaveAttribute('aria-checked', 'true');
      expect(screen.queryByTestId(`${INDICATOR_TEST_ID}-1`)).toBeVisible();
    });
  });

  describe('keyboard navigation', () => {
    it('should check an item that receives focus while an arrow key is pressed', async () => {
      render(<ClassicRadioGroup />);
      const radios = screen.getAllByRole(RADIO_ROLE);

      await act(async () => radios[0]!.focus());
      // `RovingFocusGroup` moves focus to the next item on arrow keys; once an
      // item is focused during arrow navigation it should also become checked.
      await act(async () => {
        fireEvent.keyDown(radios[0]!, { key: 'ArrowDown' });
        radios[1]!.focus();
      });

      expect(radios[1]).toHaveAttribute('aria-checked', 'true');
      expect(screen.queryByTestId(`${INDICATOR_TEST_ID}-2`)).toBeVisible();
    });

    it('should not check an item that receives focus without arrow navigation', async () => {
      render(<ClassicRadioGroup />);
      const radios = screen.getAllByRole(RADIO_ROLE);

      await act(async () => radios[1]!.focus());

      expect(radios[1]).toHaveAttribute('aria-checked', 'false');
    });

    it('should not check an item on Enter key', async () => {
      render(<ClassicRadioGroup />);
      const radios = screen.getAllByRole(RADIO_ROLE);
      await act(async () => radios[0]!.focus());
      await act(async () => fireEvent.keyDown(radios[0]!, { key: 'Enter' }));
      expect(radios[0]).toHaveAttribute('aria-checked', 'false');
    });

    it('should call a consumer `onKeyDown` handler passed to an item', async () => {
      const onKeyDown = vi.fn();
      render(
        <RadioGroup.Root aria-label="pets">
          {VALUES.map((value) => (
            <RadioGroup.Item
              key={value}
              value={value}
              aria-label={LABELS[value]}
              onKeyDown={onKeyDown}
            >
              <RadioGroup.Indicator data-testid={`${INDICATOR_TEST_ID}-${value}`} />
            </RadioGroup.Item>
          ))}
        </RadioGroup.Root>,
      );
      const radios = screen.getAllByRole(RADIO_ROLE);
      await act(async () => radios[0]!.focus());
      await act(async () => fireEvent.keyDown(radios[0]!, { key: 'Enter' }));
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('given an uncontrolled RadioGroup in a form', () => {
    it('should bubble a change event with the selected value', () => {
      const onChange = vi.fn();
      render(
        <form onChange={(event) => onChange((event.target as unknown as HTMLInputElement).value)}>
          <ClassicRadioGroup name="pet" />
        </form>,
      );

      const radios = screen.getAllByRole(RADIO_ROLE);
      act(() => fireEvent.click(radios[1]!));
      expect(onChange).toHaveBeenCalledWith('2');
    });

    it('should expose the group as required for native validation', () => {
      const { container } = render(
        <form>
          <ClassicRadioGroup name="pet" required />
        </form>,
      );
      const form = container.querySelector('form')!;
      expect(form.checkValidity()).toBe(false);

      const radios = screen.getAllByRole(RADIO_ROLE);
      act(() => fireEvent.click(radios[0]!));
      expect(form.checkValidity()).toBe(true);
    });
  });

  describe('given a RadioGroup in a form that is reset', () => {
    describe('uncontrolled', () => {
      it('should restore its `defaultValue` selection when the form is reset', () => {
        render(
          <form>
            <ClassicRadioGroup name="pet" defaultValue="1" />
            <button type="reset">Reset</button>
          </form>,
        );

        const radios = screen.getAllByRole(RADIO_ROLE);
        expect(radios[0]).toHaveAttribute('aria-checked', 'true');

        act(() => fireEvent.click(radios[1]!));
        expect(radios[0]).toHaveAttribute('aria-checked', 'false');
        expect(radios[1]).toHaveAttribute('aria-checked', 'true');

        act(() => fireEvent.click(screen.getByText('Reset')));
        expect(radios[0]).toHaveAttribute('aria-checked', 'true');
        expect(radios[1]).toHaveAttribute('aria-checked', 'false');
      });

      it('should restore an empty selection when there is no `defaultValue`', () => {
        render(
          <form>
            <ClassicRadioGroup name="pet" />
            <button type="reset">Reset</button>
          </form>,
        );

        const radios = screen.getAllByRole(RADIO_ROLE);
        act(() => fireEvent.click(radios[1]!));
        expect(radios[1]).toHaveAttribute('aria-checked', 'true');

        act(() => fireEvent.click(screen.getByText('Reset')));
        radios.forEach((radio) => expect(radio).toHaveAttribute('aria-checked', 'false'));
      });
    });

    describe('controlled', () => {
      it('should restore its initial `value` selection when the form is reset', () => {
        function ControlledRadioGroup() {
          const [value, setValue] = React.useState<string | null>('1');
          return (
            <form>
              <RadioGroup.Root aria-label="pets" name="pet" value={value} onValueChange={setValue}>
                {VALUES.map((v) => (
                  <RadioGroup.Item key={v} value={v} aria-label={LABELS[v]}>
                    <RadioGroup.Indicator data-testid={`${INDICATOR_TEST_ID}-${v}`} />
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
              <button type="reset">Reset</button>
            </form>
          );
        }

        render(<ControlledRadioGroup />);

        const radios = screen.getAllByRole(RADIO_ROLE);
        expect(radios[0]).toHaveAttribute('aria-checked', 'true');

        act(() => fireEvent.click(radios[2]!));
        expect(radios[2]).toHaveAttribute('aria-checked', 'true');

        act(() => fireEvent.click(screen.getByText('Reset')));
        expect(radios[0]).toHaveAttribute('aria-checked', 'true');
        expect(radios[2]).toHaveAttribute('aria-checked', 'false');
      });
    });
  });

  describe('given a RadioGroup with external form association that is reset', () => {
    describe('uncontrolled', () => {
      it('should restore its `defaultValue` selection when the external form is reset', () => {
        render(
          <>
            <form id="radio-group-reset-form">
              <button type="reset">Reset</button>
            </form>
            <ClassicRadioGroup name="pet" form="radio-group-reset-form" defaultValue="1" />
          </>,
        );

        const radios = screen.getAllByRole(RADIO_ROLE);
        expect(radios[0]).toHaveAttribute('aria-checked', 'true');

        act(() => fireEvent.click(radios[2]!));
        expect(radios[2]).toHaveAttribute('aria-checked', 'true');

        act(() => fireEvent.click(screen.getByRole('button', { name: 'Reset' })));
        expect(radios[0]).toHaveAttribute('aria-checked', 'true');
        expect(radios[2]).toHaveAttribute('aria-checked', 'false');
      });
    });

    describe('controlled', () => {
      it('should restore its initial `value` selection when the external form is reset', () => {
        function ControlledRadioGroup() {
          const [value, setValue] = React.useState<string | null>('1');
          return (
            <>
              <form id="radio-group-reset-form">
                <button type="reset">Reset</button>
              </form>
              <RadioGroup.Root
                aria-label="pets"
                name="pet"
                form="radio-group-reset-form"
                value={value}
                onValueChange={setValue}
              >
                {VALUES.map((v) => (
                  <RadioGroup.Item key={v} value={v} aria-label={LABELS[v]}>
                    <RadioGroup.Indicator />
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            </>
          );
        }

        render(<ControlledRadioGroup />);

        const radios = screen.getAllByRole(RADIO_ROLE);
        expect(radios[0]).toHaveAttribute('aria-checked', 'true');

        act(() => fireEvent.click(radios[1]!));
        expect(radios[1]).toHaveAttribute('aria-checked', 'true');

        act(() => fireEvent.click(screen.getByRole('button', { name: 'Reset' })));
        expect(radios[0]).toHaveAttribute('aria-checked', 'true');
        expect(radios[1]).toHaveAttribute('aria-checked', 'false');
      });
    });
  });
});

describe('Composable RadioGroup', () => {
  afterEach(cleanup);

  describe('given a default composable RadioGroup', () => {
    let rendered: RenderResult;
    beforeEach(() => {
      rendered = render(<ComposableRadioGroup />);
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should render all items unchecked', () => {
      const radios = screen.getAllByRole(RADIO_ROLE);
      expect(radios).toHaveLength(3);
      radios.forEach((radio) => expect(radio).toHaveAttribute('aria-checked', 'false'));
    });

    it('should check an item and show its indicator when clicked', async () => {
      const radios = screen.getAllByRole(RADIO_ROLE);
      await act(async () => fireEvent.click(radios[0]!));
      expect(radios[0]).toHaveAttribute('aria-checked', 'true');
      expect(screen.queryByTestId(`${INDICATOR_TEST_ID}-1`)).toBeVisible();
    });
  });

  describe('given a composable RadioGroup in a form', () => {
    it('should bubble a change event with the selected value', () => {
      const onChange = vi.fn();
      render(
        <form onChange={(event) => onChange((event.target as unknown as HTMLInputElement).value)}>
          <ComposableRadioGroup name="pet" />
        </form>,
      );

      const radios = screen.getAllByRole(RADIO_ROLE);
      act(() => fireEvent.click(radios[2]!));
      expect(onChange).toHaveBeenCalledWith('3');
    });

    it('should not bubble to the form when propagation is stopped on the trigger', () => {
      const onChange = vi.fn();
      render(
        <form onChange={(event) => onChange((event.target as unknown as HTMLInputElement).value)}>
          <RadioGroup.Root aria-label="pets" name="pet">
            {VALUES.map((value) => (
              <RadioGroup.unstable_ItemProvider key={value} value={value}>
                <RadioGroup.unstable_ItemTrigger
                  aria-label={LABELS[value]}
                  onClick={(event) => event.stopPropagation()}
                >
                  <RadioGroup.Indicator />
                </RadioGroup.unstable_ItemTrigger>
                <RadioGroup.unstable_ItemBubbleInput />
              </RadioGroup.unstable_ItemProvider>
            ))}
          </RadioGroup.Root>
        </form>,
      );

      const radios = screen.getAllByRole(RADIO_ROLE);
      act(() => fireEvent.click(radios[0]!));
      // selection still happens locally
      expect(radios[0]).toHaveAttribute('aria-checked', 'true');
      // but the change does not reach the form
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
