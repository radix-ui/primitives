import * as React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import * as Checkbox from '.';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

const CHECKBOX_ROLE = 'checkbox';
const INDICATOR_TEST_ID = 'checkbox-indicator';

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

describe('Checkbox', () => {
  afterEach(cleanup);

  describe('given a default Checkbox', () => {
    let rendered: RenderResult;
    beforeEach(() => {
      rendered = render(
        <Checkbox.unstable_Provider>
          <Checkbox.unstable_Trigger aria-label="basic checkbox">
            <Checkbox.Indicator data-testid={INDICATOR_TEST_ID} />
          </Checkbox.unstable_Trigger>
        </Checkbox.unstable_Provider>
      );
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should toggle the indicator when clicked', async () => {
      const checkbox = screen.getByRole(CHECKBOX_ROLE);
      await act(async () => fireEvent.click(checkbox));

      let indicator = screen.queryByTestId(INDICATOR_TEST_ID);
      expect(indicator).toBeVisible();

      await act(async () => fireEvent.click(checkbox));
      indicator = screen.queryByTestId(INDICATOR_TEST_ID);
      expect(indicator).not.toBeInTheDocument();
    });
  });

  describe('given a disabled Checkbox', () => {
    let rendered: RenderResult;
    beforeEach(() => {
      rendered = render(
        <Checkbox.unstable_Provider disabled>
          <Checkbox.unstable_Trigger aria-label="basic checkbox">
            <Checkbox.Indicator data-testid={INDICATOR_TEST_ID} />
          </Checkbox.unstable_Trigger>
        </Checkbox.unstable_Provider>
      );
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should not toggle the indicator when clicked', async () => {
      const checkbox = screen.getByRole(CHECKBOX_ROLE);

      await act(async () => fireEvent.click(checkbox));
      const indicator = screen.queryByTestId(INDICATOR_TEST_ID);
      expect(indicator).not.toBeInTheDocument();

      await act(async () => fireEvent.click(checkbox));
      expect(indicator).not.toBeInTheDocument();
    });
  });

  describe('given an uncontrolled `checked` Checkbox', () => {
    const onCheckedChange = vi.fn();
    let rendered: RenderResult;

    beforeEach(() => {
      rendered = render(
        <Checkbox.unstable_Provider defaultChecked onCheckedChange={onCheckedChange}>
          <Checkbox.unstable_Trigger aria-label="basic checkbox">
            <Checkbox.Indicator data-testid={INDICATOR_TEST_ID} />
          </Checkbox.unstable_Trigger>
        </Checkbox.unstable_Provider>
      );
    });

    afterEach(cleanup);

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should render a visible indicator', () => {
      const indicator = screen.queryByTestId(INDICATOR_TEST_ID);
      expect(indicator).toBeVisible();
    });

    it('should toggle the indicator when clicked', async () => {
      const checkbox = screen.getByRole(CHECKBOX_ROLE);
      await act(async () => fireEvent.click(checkbox));
      let indicator = screen.queryByTestId(INDICATOR_TEST_ID);
      expect(indicator).not.toBeInTheDocument();

      await act(async () => fireEvent.click(checkbox));
      indicator = screen.queryByTestId(INDICATOR_TEST_ID);
      expect(indicator).toBeVisible();
    });

    it('should call `onCheckedChange` prop', () => {
      const checkbox = screen.getByRole(CHECKBOX_ROLE);
      fireEvent.click(checkbox);
      waitFor(() => {
        expect(onCheckedChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('given a controlled Checkbox', () => {
    const onCheckedChange = vi.fn();
    let rendered: RenderResult;

    function ControlledCheckbox() {
      const [checked, setChecked] = React.useState(false);
      const [blockToggle, setBlockToggle] = React.useState(false);
      return (
        <div>
          <Checkbox.unstable_Provider
            checked={checked}
            onCheckedChange={(checked) => {
              onCheckedChange(checked);
              if (!blockToggle) {
                setChecked(checked);
              }
            }}
          >
            <Checkbox.unstable_Trigger aria-label="basic checkbox">
              <Checkbox.Indicator data-testid={INDICATOR_TEST_ID} />
            </Checkbox.unstable_Trigger>
          </Checkbox.unstable_Provider>
          <button type="button" onClick={() => setChecked((prev) => !prev)}>
            Toggle checkbox
          </button>
          <button type="button" onClick={() => setBlockToggle((prev) => !prev)}>
            {blockToggle ? 'Unblock' : 'Block'} checkbox
          </button>
        </div>
      );
    }

    beforeEach(() => {
      rendered = render(<ControlledCheckbox />);
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should toggle the indicator', async () => {
      const checkbox = screen.getByRole(CHECKBOX_ROLE);
      await act(async () => fireEvent.click(checkbox));
      const indicator = screen.queryByTestId(INDICATOR_TEST_ID);
      expect(indicator).toBeVisible();
    });

    it('should call `onCheckedChange` prop', async () => {
      const checkbox = screen.getByRole(CHECKBOX_ROLE);
      await act(async () => fireEvent.click(checkbox));
      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('should not toggle unless state is updated', async () => {
      const checkbox = screen.getByRole(CHECKBOX_ROLE);
      const blocker = screen.getByText('Block checkbox');
      await act(async () => fireEvent.click(blocker));
      await act(async () => fireEvent.click(checkbox));
      const indicator = screen.queryByTestId(INDICATOR_TEST_ID);
      expect(indicator).not.toBeInTheDocument();
    });
  });

  describe('given an uncontrolled Checkbox in form with bubble input', () => {
    const onChange = vi.fn();

    it('should receive change event with next state', async () => {
      render(
        <form
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            onChange(target.checked);
          }}
        >
          <Checkbox.unstable_Provider>
            <Checkbox.unstable_Trigger aria-label="basic checkbox">
              <Checkbox.Indicator data-testid={INDICATOR_TEST_ID} />
            </Checkbox.unstable_Trigger>
            <Checkbox.unstable_BubbleInput />
          </Checkbox.unstable_Provider>
        </form>
      );

      const checkbox = screen.getByRole(CHECKBOX_ROLE);
      act(() => fireEvent.click(checkbox));
      expect(onChange).toHaveBeenCalledWith(true);
    });

    describe('when `defaultChecked` is true', () => {
      it('should receive change event with next state', async () => {
        console.log(parseInt(React.version));
        render(
          <form
            onChange={(event) => {
              const target = event.target as HTMLInputElement;
              onChange(target.checked);
            }}
          >
            <Checkbox.unstable_Provider defaultChecked>
              <Checkbox.unstable_Trigger aria-label="basic checkbox">
                <Checkbox.Indicator data-testid={INDICATOR_TEST_ID} />
              </Checkbox.unstable_Trigger>
              <Checkbox.unstable_BubbleInput />
            </Checkbox.unstable_Provider>
          </form>
        );

        const checkbox = screen.getByRole(CHECKBOX_ROLE);
        act(() => fireEvent.click(checkbox));
        expect(onChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('given a controlled Checkbox in form with bubble input', () => {
    const onChange = vi.fn();

    function ControlledCheckbox() {
      const [checked, setChecked] = React.useState(false);
      return (
        <>
          <Checkbox.unstable_Provider checked={checked} onCheckedChange={setChecked as any}>
            <Checkbox.unstable_Trigger aria-label="basic checkbox">
              <Checkbox.Indicator data-testid={INDICATOR_TEST_ID} />
            </Checkbox.unstable_Trigger>
            <Checkbox.unstable_BubbleInput />
          </Checkbox.unstable_Provider>
          <button type="button" onClick={() => setChecked((prev) => !prev)}>
            Toggle checkbox
          </button>
        </>
      );
    }

    it('should receive change event with controlled state when clicked', async () => {
      render(
        <form
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            onChange(target.checked);
          }}
        >
          <ControlledCheckbox />
        </form>
      );

      const checkbox = screen.getByRole(CHECKBOX_ROLE);
      act(() => fireEvent.click(checkbox));
      expect(onChange).toHaveBeenCalledWith(true);

      act(() => fireEvent.click(checkbox));
      expect(onChange).toHaveBeenCalledWith(false);
    });

    it('should receive change event with controlled state when set externally', async () => {
      render(
        <form
          onChange={(event) => {
            const target = event.target as HTMLInputElement;
            onChange(target.checked);
          }}
        >
          <ControlledCheckbox />
        </form>
      );

      const toggleButton = screen.getByText('Toggle checkbox');
      act(() => fireEvent.click(toggleButton));
      expect(onChange).toHaveBeenCalledWith(false);
    });
  });
});

describe('Legacy Checkbox', () => {
  describe('given a default Checkbox', () => {
    let rendered: RenderResult;
    let checkbox: HTMLElement;
    let indicator: HTMLElement | null;

    beforeEach(() => {
      rendered = render(<LegacyCheckbox />);
      checkbox = rendered.getByRole(CHECKBOX_ROLE);
      indicator = rendered.queryByTestId(INDICATOR_TEST_ID);
    });

    afterEach(cleanup);

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    describe('when clicking the checkbox', () => {
      beforeEach(async () => {
        fireEvent.click(checkbox);
        indicator = rendered.queryByTestId(INDICATOR_TEST_ID);
      });

      it('should render a visible indicator', () => {
        expect(indicator).toBeVisible();
      });

      describe('and clicking the checkbox again', () => {
        beforeEach(async () => {
          fireEvent.click(checkbox);
        });

        it('should remove the indicator', () => {
          expect(indicator).not.toBeInTheDocument();
        });
      });
    });
  });

  describe('given a disabled Checkbox', () => {
    let rendered: RenderResult;

    beforeEach(() => {
      rendered = render(<LegacyCheckbox disabled />);
    });

    afterEach(cleanup);

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });
  });

  describe('given an uncontrolled `checked` Checkbox', () => {
    let rendered: RenderResult;
    let checkbox: HTMLElement;
    let indicator: HTMLElement | null;
    const onCheckedChange = vi.fn();

    beforeEach(() => {
      rendered = render(<LegacyCheckbox defaultChecked onCheckedChange={onCheckedChange} />);
      checkbox = rendered.getByRole(CHECKBOX_ROLE);
      indicator = rendered.queryByTestId(INDICATOR_TEST_ID);
    });

    afterEach(cleanup);

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    describe('when clicking the checkbox', () => {
      beforeEach(async () => {
        fireEvent.click(checkbox);
      });

      it('should remove the indicator', () => {
        expect(indicator).not.toBeInTheDocument();
      });

      it('should call `onCheckedChange` prop', () => {
        expect(onCheckedChange).toHaveBeenCalled();
      });
    });
  });

  describe('given a controlled `checked` Checkbox', () => {
    let rendered: RenderResult;
    let checkbox: HTMLElement;
    const onCheckedChange = vi.fn();

    beforeEach(() => {
      rendered = render(<LegacyCheckbox checked onCheckedChange={onCheckedChange} />);
      checkbox = rendered.getByRole(CHECKBOX_ROLE);
    });

    afterEach(cleanup);

    describe('when clicking the checkbox', () => {
      beforeEach(() => {
        fireEvent.click(checkbox);
      });

      it('should call `onCheckedChange` prop', () => {
        expect(onCheckedChange).toHaveBeenCalled();
      });
    });
  });

  describe('given an uncontrolled Checkbox in form', () => {
    afterEach(cleanup);

    describe('when clicking the checkbox', () => {
      it('should receive change event with target `defaultChecked` same as the `defaultChecked` prop of Checkbox', () =>
        new Promise((done) => {
          const rendered = render(
            <form
              onChange={(event) => {
                const target = event.target as HTMLInputElement;
                expect(target.defaultChecked).toBe(true);
              }}
            >
              <LegacyCheckbox defaultChecked />
            </form>
          );
          const checkbox = rendered.getByRole(CHECKBOX_ROLE);
          fireEvent.click(checkbox);
          rendered.rerender(
            <form
              onChange={(event) => {
                const target = event.target as HTMLInputElement;
                expect(target.defaultChecked).toBe(false);
                done(null);
              }}
            >
              <LegacyCheckbox defaultChecked={false} />
            </form>
          );
          fireEvent.click(checkbox);
        }));
    });
  });

  describe('given a controlled Checkbox in a form', () => {
    afterEach(cleanup);

    describe('when clicking the checkbox', () => {
      it('should receive change event with target `defaultChecked` same as initial value of `checked` of Checkbox', () =>
        new Promise((done) => {
          const rendered = render(
            <form
              onChange={(event) => {
                const target = event.target as HTMLInputElement;
                expect(target.defaultChecked).toBe(true);
              }}
            >
              <LegacyCheckbox checked />
            </form>
          );
          const checkbox = rendered.getByRole(CHECKBOX_ROLE);
          fireEvent.click(checkbox);
          rendered.rerender(
            <form
              onChange={(event) => {
                const target = event.target as HTMLInputElement;
                expect(target.defaultChecked).toBe(true);
                done(null);
              }}
            >
              <LegacyCheckbox checked={false} />
            </form>
          );
          fireEvent.click(checkbox);
        }));
    });
  });
});

function LegacyCheckbox(props: React.ComponentProps<typeof Checkbox.Root>) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    // We use the `hidden` attribute to hide the nested input from both sighted users and the
    // accessibility tree. This is perfectly valid so long as users don't override the display of
    // `hidden` in CSS. Unfortunately axe doesn't recognize this, so we get a violation because the
    // input doesn't have a label. This adds an additional `aria-hidden` attribute to the input to
    // get around that.
    // https://developer.paciellogroup.com/blog/2012/05/html5-accessibility-chops-hidden-and-aria-hidden/
    containerRef.current?.querySelector('input')?.setAttribute('aria-hidden', 'true');
  }, []);
  return (
    <div ref={containerRef}>
      <Checkbox.Root aria-label="basic checkbox" {...props}>
        <Checkbox.Indicator data-testid={INDICATOR_TEST_ID} />
      </Checkbox.Root>
    </div>
  );
}
