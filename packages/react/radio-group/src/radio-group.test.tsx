/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, fireEvent, screen, waitFor, act } from '@testing-library/react';
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

describe('RadioGroup', () => {
  afterEach(cleanup);

  describe('given a default RadioGroup', () => {
    let rendered: RenderResult;
    beforeEach(() => {
      rendered = render(
        <>
          <span id="label">Items</span>
          <RadioGroup.Root aria-labelledby="label">
            <label>
              <RadioGroup.unstable_ItemRoot value="1">
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>One</span>
            </label>
            <label>
              <RadioGroup.unstable_ItemRoot value="2">
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>Two</span>
            </label>
            <label>
              <RadioGroup.unstable_ItemRoot value="3">
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>Three</span>
            </label>
          </RadioGroup.Root>
        </>
      );
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should toggle the indicator when clicked', async () => {
      const radioOne = screen.getByRole(RADIO_ROLE, { name: 'One' });
      const radioTwo = screen.getByRole(RADIO_ROLE, { name: 'Two' });
      await act(async () => fireEvent.click(radioOne));

      const indicator = radioOne.querySelector(`[data-testid="${INDICATOR_TEST_ID}"]`);
      expect(indicator).toBeVisible();

      await act(async () => fireEvent.click(radioTwo));
      expect(indicator).not.toBeInTheDocument();
    });
  });

  describe('given a disabled RadioGroup', () => {
    let rendered: RenderResult;
    beforeEach(() => {
      rendered = render(
        <>
          <span id="label">Items</span>
          <RadioGroup.Root aria-labelledby="label" disabled>
            <label>
              <RadioGroup.unstable_ItemRoot value="1">
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>One</span>
            </label>
            <label>
              <RadioGroup.unstable_ItemRoot value="2">
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>Two</span>
            </label>
            <label>
              <RadioGroup.unstable_ItemRoot value="3">
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>Three</span>
            </label>
          </RadioGroup.Root>
        </>
      );
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should not toggle the indicator when clicked', async () => {
      const radioOne = screen.getByRole(RADIO_ROLE, { name: 'One' });
      const radioTwo = screen.getByRole(RADIO_ROLE, { name: 'Two' });
      await act(async () => fireEvent.click(radioOne));

      const indicator = radioOne.querySelector(`[data-testid="${INDICATOR_TEST_ID}"]`);
      expect(indicator).not.toBeInTheDocument();

      await act(async () => fireEvent.click(radioTwo));
      expect(indicator).not.toBeInTheDocument();
    });
  });

  describe('given an uncontrolled RadioGroup with a disabled Radio', () => {
    let rendered: RenderResult;
    beforeEach(() => {
      rendered = render(
        <>
          <span id="label">Items</span>
          <RadioGroup.Root aria-labelledby="label">
            <label>
              <RadioGroup.unstable_ItemRoot value="1">
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>One</span>
            </label>
            <label>
              <RadioGroup.unstable_ItemRoot value="2" disabled>
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>Two</span>
            </label>
            <label>
              <RadioGroup.unstable_ItemRoot value="3">
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>Three</span>
            </label>
          </RadioGroup.Root>
        </>
      );
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should not toggle the disabled indicator when clicked', async () => {
      const radioOne = screen.getByRole(RADIO_ROLE, { name: 'One' });
      const radioTwo = screen.getByRole(RADIO_ROLE, { name: 'Two' });
      await act(async () => fireEvent.click(radioOne));

      const indicator = radioOne.querySelector(`[data-testid="${INDICATOR_TEST_ID}"]`);
      expect(indicator).toBeVisible();

      await act(async () => fireEvent.click(radioTwo));
      expect(indicator).toBeVisible();
      const indicatorTwo = radioTwo.querySelector(`[data-testid="${INDICATOR_TEST_ID}"]`);
      expect(indicatorTwo).not.toBeInTheDocument();
    });
  });

  describe('given an uncontrolled RadioGroup with `checked` Radio', () => {
    const onValueChange = vi.fn();
    let rendered: RenderResult;

    beforeEach(() => {
      rendered = render(
        <>
          <span id="label">Items</span>
          <RadioGroup.Root aria-labelledby="label" defaultValue="1" onValueChange={onValueChange}>
            <label>
              <RadioGroup.unstable_ItemRoot value="1">
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>One</span>
            </label>
            <label>
              <RadioGroup.unstable_ItemRoot value="2">
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>Two</span>
            </label>
            <label>
              <RadioGroup.unstable_ItemRoot value="3">
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>Three</span>
            </label>
          </RadioGroup.Root>
        </>
      );
    });

    afterEach(cleanup);

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should render a visible indicator', () => {
      const radioOne = screen.getByRole(RADIO_ROLE, { name: 'One' });
      const indicator = radioOne.querySelector(`[data-testid="${INDICATOR_TEST_ID}"]`);
      expect(indicator).toBeVisible();
    });

    it('should toggle the indicator when clicked', async () => {
      const radioOne = screen.getByRole(RADIO_ROLE, { name: 'One' });
      const radioTwo = screen.getByRole(RADIO_ROLE, { name: 'Two' });

      const indicator = radioOne.querySelector(`[data-testid="${INDICATOR_TEST_ID}"]`);
      expect(indicator).toBeVisible();

      await act(async () => fireEvent.click(radioTwo));
      expect(indicator).not.toBeInTheDocument();
    });

    it('should call `onValueChange` prop', () => {
      const radioTwo = screen.getByRole(RADIO_ROLE, { name: 'Two' });
      fireEvent.click(radioTwo);
      waitFor(() => {
        expect(onValueChange).toHaveBeenCalledWith('2');
      });
    });
  });

  describe('given a controlled RadioGroup', () => {
    const onValueChange = vi.fn();
    let rendered: RenderResult;

    function ControlledRadioGroup() {
      const [value, setValue] = React.useState<null | string>(null);
      const [blockToggle, setBlockToggle] = React.useState(false);
      return (
        <div>
          <RadioGroup.Root
            value={value}
            onValueChange={(value) => {
              onValueChange(value);
              if (!blockToggle) {
                setValue(value);
              }
            }}
          >
            <label>
              <RadioGroup.unstable_ItemRoot value="1">
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>One</span>
            </label>
            <label>
              <RadioGroup.unstable_ItemRoot value="2">
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>Two</span>
            </label>
            <label>
              <RadioGroup.unstable_ItemRoot value="3">
                <RadioGroup.unstable_ItemTrigger>
                  <RadioGroup.Indicator data-testid={INDICATOR_TEST_ID} />
                </RadioGroup.unstable_ItemTrigger>
              </RadioGroup.unstable_ItemRoot>
              <span>Three</span>
            </label>
          </RadioGroup.Root>
          <button type="button" onClick={() => setValue(null)}>
            Clear selection
          </button>
          <button type="button" onClick={() => setBlockToggle((prev) => !prev)}>
            {blockToggle ? 'Unblock' : 'Block'} radio
          </button>
        </div>
      );
    }

    beforeEach(() => {
      rendered = render(<ControlledRadioGroup />);
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should toggle the indicator when clicked', async () => {
      const radioOne = screen.getByRole(RADIO_ROLE, { name: 'One' });
      const radioTwo = screen.getByRole(RADIO_ROLE, { name: 'Two' });
      await act(async () => fireEvent.click(radioOne));

      const indicator = radioOne.querySelector(`[data-testid="${INDICATOR_TEST_ID}"]`);
      expect(indicator).toBeVisible();

      await act(async () => fireEvent.click(radioTwo));
      expect(indicator).not.toBeInTheDocument();
    });

    it('should call `onValueChange` prop', async () => {
      const radioTwo = screen.getByRole(RADIO_ROLE, { name: 'Two' });
      await act(async () => fireEvent.click(radioTwo));
      waitFor(() => {
        expect(onValueChange).toHaveBeenCalledWith('2');
      });
    });

    it('should not toggle unless state is updated', async () => {
      const radioOne = screen.getByRole(RADIO_ROLE, { name: 'One' });
      const blocker = screen.getByText('Block radio');
      await act(async () => fireEvent.click(blocker));
      await act(async () => fireEvent.click(radioOne));
      const indicator = radioOne.querySelector(`[data-testid="${INDICATOR_TEST_ID}"]`);
      expect(indicator).not.toBeInTheDocument();
    });
  });
});
