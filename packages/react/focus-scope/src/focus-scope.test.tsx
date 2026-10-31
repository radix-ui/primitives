import * as React from 'react';
import userEvent from '@testing-library/user-event';
import { act, cleanup, render, waitFor, fireEvent, screen } from '@testing-library/react';
import * as FocusScope from './focus-scope';
import type { RenderResult } from '@testing-library/react';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';

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
          <FocusScope.Root asChild loop trapped>
            <form>
              <TestField label={INNER_NAME_INPUT_LABEL} />
              <TestField label={INNER_EMAIL_INPUT_LABEL} />
              <button>{INNER_SUBMIT_LABEL}</button>
            </form>
          </FocusScope.Root>
          <TestField label="other" />
          <button>some outer button</button>
        </div>,
      );
      tabbableFirst = rendered.getByLabelText(INNER_NAME_INPUT_LABEL) as HTMLInputElement;
      tabbableSecond = rendered.getByLabelText(INNER_EMAIL_INPUT_LABEL) as HTMLInputElement;
      tabbableLast = rendered.getByText(INNER_SUBMIT_LABEL) as HTMLButtonElement;
    });

    it('should focus the next element in the scope on tab', async () => {
      tabbableFirst.focus();
      await userEvent.tab();
      await waitFor(() => expect(tabbableSecond).toHaveFocus());
    });

    it('should focus the last element in the scope on shift+tab from the first element in scope', async () => {
      tabbableFirst.focus();
      await userEvent.tab({ shift: true });
      await waitFor(() => expect(tabbableLast).toHaveFocus());
    });

    it('should focus the first element in scope on tab from the last element in scope', async () => {
      tabbableLast.focus();
      await userEvent.tab();
      await waitFor(() => expect(tabbableFirst).toHaveFocus());
    });

    it('should wrap focus on a plain shift+tab keydown from the first element in scope', () => {
      tabbableFirst.focus();
      const notCancelled = fireEvent.keyDown(tabbableFirst, {
        key: 'Tab',
        shiftKey: true,
        keyCode: 9,
      });
      expect(notCancelled).toBe(false);
      expect(tabbableLast).toHaveFocus();
    });

    it('should leave a tab that belongs to an IME composition to the input method', () => {
      tabbableFirst.focus();
      const notCancelled = fireEvent.keyDown(tabbableFirst, {
        key: 'Tab',
        shiftKey: true,
        isComposing: true,
      });
      expect(notCancelled).toBe(true);
      expect(tabbableFirst).toHaveFocus();
    });

    it('should leave a tab the IME processed (keyCode 229) to the input method', () => {
      tabbableFirst.focus();
      const notCancelled = fireEvent.keyDown(tabbableFirst, {
        key: 'Tab',
        shiftKey: true,
        keyCode: 229,
      });
      expect(notCancelled).toBe(true);
      expect(tabbableFirst).toHaveFocus();
    });
  });

  describe('given a FocusScope where the first focusable has a negative tabindex', () => {
    let rendered: RenderResult;
    let tabbableSecond: HTMLInputElement;
    let tabbableLast: HTMLButtonElement;

    beforeEach(() => {
      rendered = render(
        <div>
          <FocusScope.Root asChild loop trapped>
            <form>
              <TestField label={INNER_NAME_INPUT_LABEL} tabIndex={-1} />
              <TestField label={INNER_EMAIL_INPUT_LABEL} />
              <button>{INNER_SUBMIT_LABEL}</button>
            </form>
          </FocusScope.Root>
          <TestField label="other" />
          <button>some outer button</button>
        </div>,
      );
      tabbableSecond = rendered.getByLabelText(INNER_EMAIL_INPUT_LABEL) as HTMLInputElement;
      tabbableLast = rendered.getByText(INNER_SUBMIT_LABEL) as HTMLButtonElement;
    });

    it('should skip the element with a negative tabindex on tab', async () => {
      tabbableLast.focus();
      await userEvent.tab();
      await waitFor(() => expect(tabbableSecond).toHaveFocus());
    });

    it('should skip the element with a negative tabindex on shift+tab', async () => {
      tabbableSecond.focus();
      await userEvent.tab({ shift: true });
      await waitFor(() => expect(tabbableLast).toHaveFocus());
    });
  });

  describe('given a trapped FocusScope with branches', () => {
    function BranchHarness({ withBranch }: { withBranch: boolean }) {
      const [branch, setBranch] = React.useState<HTMLElement | null>(null);
      return (
        <div>
          <FocusScope.Root asChild loop trapped branches={withBranch && branch ? [branch] : []}>
            <form>
              <TestField label={INNER_NAME_INPUT_LABEL} />
              <button>{INNER_SUBMIT_LABEL}</button>
            </form>
          </FocusScope.Root>
          {/* Simulates portalled content of a nested layer living outside the scope's subtree */}
          <div ref={setBranch}>
            <input aria-label="branch-input" />
          </div>
        </div>
      );
    }

    it('reclaims focus moved into an unregistered outside node', async () => {
      const rendered = render(<BranchHarness withBranch={false} />);
      const inner = rendered.getByLabelText(INNER_NAME_INPUT_LABEL) as HTMLInputElement;
      const branchInput = rendered.getByLabelText('branch-input') as HTMLInputElement;
      inner.focus();
      branchInput.focus();
      await waitFor(() => expect(inner).toHaveFocus());
      expect(branchInput).not.toHaveFocus();
    });

    it('keeps focus when it moves into a registered branch', async () => {
      const rendered = render(<BranchHarness withBranch />);
      const inner = rendered.getByLabelText(INNER_NAME_INPUT_LABEL) as HTMLInputElement;
      const branchInput = rendered.getByLabelText('branch-input') as HTMLInputElement;
      inner.focus();
      branchInput.focus();
      await waitFor(() => expect(branchInput).toHaveFocus());
    });
  });

  // Regression tests for https://github.com/radix-ui/primitives/issues/4261
  describe('when the focused element is removed', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('recovers focus immediately while the document has focus', async () => {
      vi.spyOn(document, 'hasFocus').mockReturnValue(true);
      render(
        <FocusScope.Root trapped data-testid="scope">
          <input aria-label="removable" />
        </FocusScope.Root>,
      );
      const input = screen.getByLabelText('removable');
      expect(input).toHaveFocus();

      await act(async () => input.remove());

      expect(screen.getByTestId('scope')).toHaveFocus();
    });

    it('waits for the document to regain focus and keeps subsequent tabbing trapped', async () => {
      const hasFocus = vi.spyOn(document, 'hasFocus').mockReturnValue(true);
      render(
        <>
          <FocusScope.Root trapped loop data-testid="scope">
            <input aria-label="removable" />
            <input aria-label="remaining" />
            <button>Last</button>
          </FocusScope.Root>
          <input aria-label="outside" />
        </>,
      );
      const scope = screen.getByTestId('scope');
      const focus = vi.spyOn(scope, 'focus');
      hasFocus.mockReturnValue(false);
      fireEvent(window, new FocusEvent('blur'));

      await act(async () => screen.getByLabelText('removable').remove());

      expect(document.body).toHaveFocus();
      expect(focus).not.toHaveBeenCalled();

      hasFocus.mockReturnValue(true);
      fireEvent(window, new FocusEvent('focus'));
      expect(scope).toHaveFocus();

      await userEvent.tab();
      expect(screen.getByLabelText('remaining')).toHaveFocus();
      await userEvent.tab();
      expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();
      await userEvent.tab();
      expect(screen.getByLabelText('remaining')).toHaveFocus();
      screen.getByLabelText('outside').focus();
      expect(screen.getByLabelText('remaining')).toHaveFocus();
    });

    it('preserves a control already focused when the document regains focus', async () => {
      const hasFocus = vi.spyOn(document, 'hasFocus').mockReturnValue(true);
      render(
        <FocusScope.Root trapped data-testid="scope">
          <input aria-label="removable" />
          <input aria-label="remaining" />
        </FocusScope.Root>,
      );
      const focus = vi.spyOn(screen.getByTestId('scope'), 'focus');
      hasFocus.mockReturnValue(false);
      await act(async () => screen.getByLabelText('removable').remove());
      expect(focus).not.toHaveBeenCalled();

      hasFocus.mockReturnValue(true);
      screen.getByLabelText('remaining').focus();
      fireEvent(window, new FocusEvent('focus'));

      expect(screen.getByLabelText('remaining')).toHaveFocus();
      expect(focus).not.toHaveBeenCalled();
    });

    it('does not let a paused scope recover focus from a newer scope', async () => {
      vi.spyOn(document, 'hasFocus').mockReturnValue(true);
      render(
        <FocusScope.Root trapped data-testid="paused-scope">
          <input aria-label="removable" />
        </FocusScope.Root>,
      );
      const pausedFocus = vi.spyOn(screen.getByTestId('paused-scope'), 'focus');
      render(
        <FocusScope.Root trapped onMountAutoFocus={(event) => event.preventDefault()}>
          <input aria-label="new-scope" />
        </FocusScope.Root>,
      );

      await act(async () => screen.getByLabelText('removable').remove());
      fireEvent(window, new FocusEvent('focus'));

      expect(pausedFocus).not.toHaveBeenCalled();
    });

    it('cancels deferred recovery when trapping is disabled', async () => {
      const hasFocus = vi.spyOn(document, 'hasFocus').mockReturnValue(true);
      const rendered = render(
        <FocusScope.Root trapped data-testid="scope">
          <input aria-label="removable" />
        </FocusScope.Root>,
      );
      const focus = vi.spyOn(screen.getByTestId('scope'), 'focus');
      hasFocus.mockReturnValue(false);
      await act(async () => screen.getByLabelText('removable').remove());
      expect(focus).not.toHaveBeenCalled();

      rendered.rerender(
        <FocusScope.Root trapped={false} data-testid="scope">
          <input aria-label="removable" />
        </FocusScope.Root>,
      );
      hasFocus.mockReturnValue(true);
      fireEvent(window, new FocusEvent('focus'));

      expect(focus).not.toHaveBeenCalled();
    });

    it('recovers focus when a nested scope unmounts and the parent resumes', async () => {
      vi.spyOn(document, 'hasFocus').mockReturnValue(true);
      function Example({ open }: { open: boolean }) {
        return (
          <FocusScope.Root trapped data-testid="scope">
            <input aria-label="remaining" />
            {open && (
              <FocusScope.Root onUnmountAutoFocus={(event) => event.preventDefault()}>
                <input aria-label="removable" />
              </FocusScope.Root>
            )}
          </FocusScope.Root>
        );
      }
      const rendered = render(<Example open={false} />);
      rendered.rerender(<Example open />);
      expect(screen.getByLabelText('removable')).toHaveFocus();

      rendered.rerender(<Example open={false} />);

      await waitFor(() => expect(screen.getByTestId('scope')).toHaveFocus());
      await userEvent.tab();
      expect(screen.getByLabelText('remaining')).toHaveFocus();
    });
  });

  describe('given a FocusScope with internal focus handlers', () => {
    const handleLastFocusableElementBlur = vi.fn();
    let rendered: RenderResult;
    let tabbableFirst: HTMLInputElement;
    beforeEach(() => {
      rendered = render(
        <div>
          <FocusScope.Root asChild loop trapped>
            <form>
              <TestField label={INNER_NAME_INPUT_LABEL} />
              <button onBlur={handleLastFocusableElementBlur}>{INNER_SUBMIT_LABEL}</button>
            </form>
          </FocusScope.Root>
        </div>,
      );
      tabbableFirst = rendered.getByLabelText(INNER_NAME_INPUT_LABEL) as HTMLInputElement;
    });

    it('should properly blur the last element in the scope before cycling back', async () => {
      // Tab back and then tab forward to cycle through the scope
      tabbableFirst.focus();
      await userEvent.tab({ shift: true });
      await userEvent.tab();
      await waitFor(() => expect(handleLastFocusableElementBlur).toHaveBeenCalledTimes(1));
    });
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/3963
  describe('ref stability', () => {
    it('keeps a stable composed ref (no infinite render loop)', () => {
      assertStableComposedRef((ref) => (
        <FocusScope.Root asChild ref={ref}>
          <button type="button">Click me</button>
        </FocusScope.Root>
      ));
    });
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/4148
  describe('unmount timer', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
      vi.useRealTimers();
    });

    it('does not read realm globals after the environment has been torn down', () => {
      vi.useFakeTimers();
      const onUnmountAutoFocus = vi.fn();
      const rendered = render(
        <FocusScope.Root trapped onUnmountAutoFocus={onUnmountAutoFocus}>
          <TestField label={INNER_NAME_INPUT_LABEL} />
        </FocusScope.Root>,
      );
      const body = document.body;

      rendered.unmount();

      // Simulate a test runner restoring Node's globals once the test file has finished (vitest +
      // jsdom): the container's document still exists, but the globals no longer belong to it.
      // Node's `CustomEvent` isn't a jsdom `Event`, so dispatching one would throw.
      class NodeCustomEvent {
        constructor(public type: string) {}
      }
      vi.stubGlobal('CustomEvent', NodeCustomEvent);
      vi.stubGlobal('HTMLInputElement', undefined);
      vi.stubGlobal('document', undefined);

      expect(() => vi.runAllTimers()).not.toThrow();
      expect(onUnmountAutoFocus).toHaveBeenCalledTimes(1);
      expect(body.ownerDocument.activeElement).toBe(body);
    });

    it('still restores focus and honours `preventDefault` after unmount', () => {
      vi.useFakeTimers();
      const outer = document.createElement('input');
      document.body.appendChild(outer);
      outer.focus();

      const rendered = render(
        <FocusScope.Root trapped>
          <TestField label={INNER_NAME_INPUT_LABEL} />
        </FocusScope.Root>,
      );
      expect(rendered.getByLabelText(INNER_NAME_INPUT_LABEL)).toHaveFocus();
      rendered.unmount();
      vi.runAllTimers();
      expect(outer).toHaveFocus();

      const prevented = render(
        <FocusScope.Root trapped onUnmountAutoFocus={(event) => event.preventDefault()}>
          <TestField label={INNER_EMAIL_INPUT_LABEL} />
        </FocusScope.Root>,
      );
      const inner = prevented.getByLabelText(INNER_EMAIL_INPUT_LABEL);
      expect(inner).toHaveFocus();
      prevented.unmount();
      vi.runAllTimers();
      expect(outer).not.toHaveFocus();

      outer.remove();
    });
  });

  describe('given a FocusScope with hidden elements', () => {
    let rendered: RenderResult;
    let visibleFirst: HTMLInputElement;
    let visibleLast: HTMLButtonElement;

    beforeEach(() => {
      rendered = render(
        <div>
          <FocusScope.Root asChild loop trapped>
            <form>
              <TestField label={INNER_NAME_INPUT_LABEL} />
              <TestField label="hidden-display" style={{ display: 'none' }} />
              <TestField label="hidden-visibility" style={{ visibility: 'hidden' }} />
              <button>{INNER_SUBMIT_LABEL}</button>
            </form>
          </FocusScope.Root>
        </div>,
      );
      visibleFirst = rendered.getByLabelText(INNER_NAME_INPUT_LABEL) as HTMLInputElement;
      visibleLast = rendered.getByText(INNER_SUBMIT_LABEL) as HTMLButtonElement;
    });

    it('should skip elements with display: none when looping backward', async () => {
      visibleFirst.focus();
      await userEvent.tab({ shift: true });
      await waitFor(() => expect(visibleLast).toHaveFocus());
    });

    it('should skip elements with visibility: hidden when looping forward', async () => {
      visibleLast.focus();
      await userEvent.tab();
      await waitFor(() => expect(visibleFirst).toHaveFocus());
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

describe('FocusScope.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <FocusScope.Root
        ref={ref}
        data-testid="scope"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        Scope
      </FocusScope.Root>,
    );

    const scope = screen.getByTestId('scope');
    expect(scope.tagName).toBe('DIV');
    expect(scope).toHaveClass('custom-class');
    expect(scope.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(scope);

    fireEvent.click(scope);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <FocusScope.Root
        asChild
        ref={ref}
        data-testid="scope"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>Scope</article>
      </FocusScope.Root>,
    );

    const scope = screen.getByTestId('scope');
    expect(scope.tagName).toBe('ARTICLE');
    // The scope's own `tabIndex` has to land on the slotted element too, since it is what makes the
    // container focusable when it holds no tabbable candidates.
    expect(scope).toHaveAttribute('tabindex', '-1');
    expect(scope).toHaveClass('custom-class');
    expect(scope.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(scope);

    fireEvent.click(scope);
    expect(onClick).toHaveBeenCalled();
  });

  // A trapped scope adds focus listeners and a mutation observer around the same element, so it is
  // worth checking that the props still reach it.
  it('forwards props to the child element when `asChild` is set on a trapped, looping scope', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <FocusScope.Root
        trapped
        loop
        asChild
        ref={ref}
        data-testid="scope"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>
          <button type="button">Inside</button>
        </article>
      </FocusScope.Root>,
    );

    const scope = screen.getByTestId('scope');
    expect(scope.tagName).toBe('ARTICLE');
    expect(scope).toHaveClass('custom-class');
    expect(scope.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(scope);

    fireEvent.click(scope);
    expect(onClick).toHaveBeenCalled();
  });
});
