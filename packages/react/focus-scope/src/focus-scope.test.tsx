import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { cleanup, render, waitFor } from '@testing-library/react';
import { FocusScope } from './focus-scope';
import type { RenderResult } from '@testing-library/react';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

const INNER_NAME_INPUT_LABEL = 'Name';
const INNER_EMAIL_INPUT_LABEL = 'Email';
const INNER_SUBMIT_LABEL = 'Submit';

describe('FocusScope', () => {
  afterEach(cleanup);

  describe('given a default FocusScope', () => {
    let rendered: RenderResult;
    let tabbableFirst: HTMLInputElement;
    let tabbableSecond: HTMLInputElement;
    let tabbableLast: HTMLButtonElement;

    beforeEach(() => {
      rendered = render(
        <div>
          <FocusScope asChild loop trapped>
            <form>
              <TestField label={INNER_NAME_INPUT_LABEL} />
              <TestField label={INNER_EMAIL_INPUT_LABEL} />
              <button>{INNER_SUBMIT_LABEL}</button>
            </form>
          </FocusScope>
          <TestField label="other" />
          <button>some outer button</button>
        </div>
      );
      tabbableFirst = rendered.getByLabelText(INNER_NAME_INPUT_LABEL) as HTMLInputElement;
      tabbableSecond = rendered.getByLabelText(INNER_EMAIL_INPUT_LABEL) as HTMLInputElement;
      tabbableLast = rendered.getByText(INNER_SUBMIT_LABEL) as HTMLButtonElement;
    });

    it('should focus the next element in the scope on tab', () => {
      tabbableFirst.focus();
      userEvent.tab();
      waitFor(() => expect(tabbableSecond).toHaveFocus());
    });

    it('should focus the last element in the scope on shift+tab from the first element in scope', () => {
      tabbableFirst.focus();
      userEvent.tab({ shift: true });
      waitFor(() => expect(tabbableLast).toHaveFocus());
    });

    it('should focus the first element in scope on tab from the last element in scope', async () => {
      tabbableLast.focus();
      userEvent.tab();
      waitFor(() => expect(tabbableFirst).toHaveFocus());
    });
  });

  describe('given a FocusScope where the first focusable has a negative tabindex', () => {
    let rendered: RenderResult;
    let tabbableSecond: HTMLInputElement;
    let tabbableLast: HTMLButtonElement;

    beforeEach(() => {
      rendered = render(
        <div>
          <FocusScope asChild loop trapped>
            <form>
              <TestField label={INNER_NAME_INPUT_LABEL} tabIndex={-1} />
              <TestField label={INNER_EMAIL_INPUT_LABEL} />
              <button>{INNER_SUBMIT_LABEL}</button>
            </form>
          </FocusScope>
          <TestField label="other" />
          <button>some outer button</button>
        </div>
      );
      tabbableSecond = rendered.getByLabelText(INNER_EMAIL_INPUT_LABEL) as HTMLInputElement;
      tabbableLast = rendered.getByText(INNER_SUBMIT_LABEL) as HTMLButtonElement;
    });

    it('should skip the element with a negative tabindex on tab', () => {
      tabbableLast.focus();
      userEvent.tab();
      waitFor(() => expect(tabbableSecond).toHaveFocus());
    });

    it('should skip the element with a negative tabindex on shift+tab', () => {
      tabbableSecond.focus();
      userEvent.tab({ shift: true });
      waitFor(() => expect(tabbableLast).toHaveFocus());
    });
  });

  describe('given a FocusScope with internal focus handlers', () => {
    const handleLastFocusableElementBlur = vi.fn();
    let rendered: RenderResult;
    let tabbableFirst: HTMLInputElement;
    beforeEach(() => {
      rendered = render(
        <div>
          <FocusScope asChild loop trapped>
            <form>
              <TestField label={INNER_NAME_INPUT_LABEL} />
              <button onBlur={handleLastFocusableElementBlur}>{INNER_SUBMIT_LABEL}</button>
            </form>
          </FocusScope>
        </div>
      );
      tabbableFirst = rendered.getByLabelText(INNER_NAME_INPUT_LABEL) as HTMLInputElement;
    });

    it('should properly blur the last element in the scope before cycling back', async () => {
      // Tab back and then tab forward to cycle through the scope
      tabbableFirst.focus();
      userEvent.tab({ shift: true });
      userEvent.tab();
      waitFor(() => expect(handleLastFocusableElementBlur).toHaveBeenCalledTimes(1));
    });
  });
});

function TestField({ label, ...props }: { label: string } & React.ComponentProps<'input'>) {
  return (
    <label>
      <span>{label}</span>
      <input type="text" name={label.toLowerCase()} {...props} />
    </label>
  );
}
