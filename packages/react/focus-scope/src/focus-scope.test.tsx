import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { cleanup, render, waitFor } from '@testing-library/react';
import { FocusScope, getTabbableCandidates } from './focus-scope';
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
        </div>,
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
        </div>,
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

  describe('getTabbableCandidates', () => {
    it('should find tabbable elements inside shadow DOM', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      // Regular input
      const regularInput = document.createElement('input');
      regularInput.type = 'text';
      container.appendChild(regularInput);

      // Shadow host with an input inside
      const shadowHost = document.createElement('div');
      container.appendChild(shadowHost);
      const shadow = shadowHost.attachShadow({ mode: 'open' });
      const shadowInput = document.createElement('input');
      shadowInput.type = 'text';
      shadow.appendChild(shadowInput);

      const candidates = getTabbableCandidates(container);
      expect(candidates).toContain(regularInput);
      expect(candidates).toContain(shadowInput);
      expect(candidates).toHaveLength(2);

      document.body.removeChild(container);
    });

    it('should find tabbable elements in nested shadow DOMs', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      // Outer shadow host
      const outerHost = document.createElement('div');
      container.appendChild(outerHost);
      const outerShadow = outerHost.attachShadow({ mode: 'open' });

      const outerInput = document.createElement('input');
      outerInput.type = 'text';
      outerShadow.appendChild(outerInput);

      // Inner shadow host inside outer shadow
      const innerHost = document.createElement('div');
      outerShadow.appendChild(innerHost);
      const innerShadow = innerHost.attachShadow({ mode: 'open' });
      const innerInput = document.createElement('input');
      innerInput.type = 'text';
      innerShadow.appendChild(innerInput);

      const candidates = getTabbableCandidates(container);
      expect(candidates).toContain(outerInput);
      expect(candidates).toContain(innerInput);
      expect(candidates).toHaveLength(2);

      document.body.removeChild(container);
    });

    it('should skip disabled and hidden elements inside shadow DOM', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const shadowHost = document.createElement('div');
      container.appendChild(shadowHost);
      const shadow = shadowHost.attachShadow({ mode: 'open' });

      const disabledInput = document.createElement('input');
      disabledInput.type = 'text';
      disabledInput.disabled = true;
      shadow.appendChild(disabledInput);

      const hiddenInput = document.createElement('input');
      hiddenInput.type = 'hidden';
      shadow.appendChild(hiddenInput);

      const visibleInput = document.createElement('input');
      visibleInput.type = 'text';
      shadow.appendChild(visibleInput);

      const candidates = getTabbableCandidates(container);
      expect(candidates).not.toContain(disabledInput);
      expect(candidates).not.toContain(hiddenInput);
      expect(candidates).toContain(visibleInput);
      expect(candidates).toHaveLength(1);

      document.body.removeChild(container);
    });
  });

  describe('given a FocusScope with shadow DOM elements', () => {
    let rendered: RenderResult;
    let tabbableFirst: HTMLButtonElement;
    let tabbableLast: HTMLInputElement;

    beforeEach(async () => {
      rendered = render(
        <div>
          <FocusScope asChild loop trapped>
            <form>
              <button>Close</button>
              <ShadowHostField />
            </form>
          </FocusScope>
        </div>,
      );
      tabbableFirst = rendered.getByText('Close') as HTMLButtonElement;
      // Wait for the useEffect inside ShadowHostField to attach the shadow root
      await waitFor(() => {
        const host = rendered.container.querySelector('[data-shadow-host]');
        expect(host?.shadowRoot?.querySelector('input')).not.toBeNull();
      });
      tabbableLast = rendered.container
        .querySelector('[data-shadow-host]')!
        .shadowRoot!.querySelector('input') as HTMLInputElement;
    });

    it('should focus the first element in scope on tab from the last shadow DOM element', () => {
      tabbableLast.focus();
      userEvent.tab();
      waitFor(() => expect(tabbableFirst).toHaveFocus());
    });

    it('should focus the last shadow DOM element on shift+tab from the first element in scope', () => {
      tabbableFirst.focus();
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
        </div>,
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

function ShadowHostField() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || el.shadowRoot) return;
    const shadow = el.attachShadow({ mode: 'open' });
    const input = document.createElement('input');
    input.type = 'text';
    shadow.appendChild(input);
  }, []);
  return <div ref={ref} data-shadow-host="" />;
}
