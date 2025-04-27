import * as React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, fireEvent } from '@testing-library/react';
import { Checkbox, CheckboxIndicator } from './checkbox';
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

describe('given a default Checkbox', () => {
  let rendered: RenderResult;
  let checkbox: HTMLElement;
  let indicator: HTMLElement | null;

  beforeEach(() => {
    rendered = render(<CheckboxTest />);
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
    rendered = render(<CheckboxTest disabled />);
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
    rendered = render(<CheckboxTest defaultChecked onCheckedChange={onCheckedChange} />);
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
    rendered = render(<CheckboxTest checked onCheckedChange={onCheckedChange} />);
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
            <CheckboxTest defaultChecked />
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
            <CheckboxTest defaultChecked={false} />
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
            <CheckboxTest checked />
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
            <CheckboxTest checked={false} />
          </form>
        );
        fireEvent.click(checkbox);
      }));
  });
});

function CheckboxTest(props: React.ComponentProps<typeof Checkbox>) {
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
      <Checkbox aria-label="basic checkbox" {...props}>
        <CheckboxIndicator data-testid={INDICATOR_TEST_ID} />
      </Checkbox>
    </div>
  );
}
