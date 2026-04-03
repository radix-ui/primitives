import React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import * as Dialog from './dialog';
import type { Mock, MockInstance } from 'vitest';
import { describe, it, afterEach, beforeEach, vi, expect } from 'vitest';

const OPEN_TEXT = 'Open';
const CLOSE_TEXT = 'Close';
const TITLE_TEXT = 'Title';

const NoLabelDialogTest = (props: React.ComponentProps<typeof Dialog.Root>) => (
  <Dialog.Root {...props}>
    <Dialog.Trigger>{OPEN_TEXT}</Dialog.Trigger>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Close>{CLOSE_TEXT}</Dialog.Close>
    </Dialog.Content>
  </Dialog.Root>
);

const UndefinedDescribedByDialog = (props: React.ComponentProps<typeof Dialog.Root>) => (
  <Dialog.Root {...props}>
    <Dialog.Trigger>{OPEN_TEXT}</Dialog.Trigger>
    <Dialog.Overlay />
    <Dialog.Content aria-describedby={undefined}>
      <Dialog.Title>{TITLE_TEXT}</Dialog.Title>
      <Dialog.Close>{CLOSE_TEXT}</Dialog.Close>
    </Dialog.Content>
  </Dialog.Root>
);

const DialogTest = (props: React.ComponentProps<typeof Dialog.Root>) => (
  <Dialog.Root {...props}>
    <Dialog.Trigger>{OPEN_TEXT}</Dialog.Trigger>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>{TITLE_TEXT}</Dialog.Title>
      <Dialog.Close>{CLOSE_TEXT}</Dialog.Close>
    </Dialog.Content>
  </Dialog.Root>
);

function renderAndClickDialogTrigger(Dialog: any) {
  fireEvent.click(render(Dialog).getByText(OPEN_TEXT));
}

describe('given a default Dialog', () => {
  let rendered: RenderResult;
  let trigger: HTMLElement;
  let closeButton: HTMLElement;
  let consoleWarnMock: MockInstance;
  let consoleWarnMockFunction: Mock;
  let consoleErrorMock: MockInstance;
  let consoleErrorMockFunction: Mock;

  beforeEach(() => {
    // This surpresses React error boundary logs for testing intentionally
    // thrown errors, like in some test cases in this suite. See discussion of
    // this here: https://github.com/facebook/react/issues/11098
    consoleWarnMockFunction = vi.fn();
    consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(consoleWarnMockFunction);
    consoleErrorMockFunction = vi.fn();
    consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(consoleErrorMockFunction);

    rendered = render(<DialogTest />);
    trigger = rendered.getByText(OPEN_TEXT);
  });

  afterEach(() => {
    cleanup();
    consoleWarnMock.mockRestore();
    consoleWarnMockFunction.mockClear();
    consoleErrorMock.mockRestore();
    consoleErrorMockFunction.mockClear();
  });

  it('should have no accessibility violations in default state', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('after clicking the trigger', () => {
    beforeEach(() => {
      fireEvent.click(trigger);
      closeButton = rendered.getByText(CLOSE_TEXT);
    });

    describe('when no description has been provided', () => {
      it('should warn to the console', () => {
        expect(consoleWarnMockFunction).toHaveBeenCalledTimes(1);
      });
    });

    describe('when no title has been provided', () => {
      beforeEach(() => {
        cleanup();
      });
      it('should display an error in the console', () => {
        consoleErrorMockFunction.mockClear();

        renderAndClickDialogTrigger(<NoLabelDialogTest />);
        expect(consoleErrorMockFunction).toHaveBeenCalled();
      });
    });

    describe('when aria-describedby is set to undefined', () => {
      beforeEach(() => {
        cleanup();
      });
      it('should not warn to the console', () => {
        consoleWarnMockFunction.mockClear();

        renderAndClickDialogTrigger(<UndefinedDescribedByDialog />);
        expect(consoleWarnMockFunction).not.toHaveBeenCalled();
      });
    });

    it('should open the content', () => {
      expect(closeButton).toBeVisible();
    });

    it('should have no accessibility violations', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should focus the close button', () => {
      expect(closeButton).toHaveFocus();
    });

    describe('when pressing escape', () => {
      beforeEach(() => {
        fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      });

      it('should close the content', () => {
        expect(closeButton).not.toBeInTheDocument();
      });
    });
  });
});

describe('scroll lock cleanup on forced unmount', () => {
  /**
   * Regression test for: https://github.com/radix-ui/primitives/issues/3797
   *
   * When a Dialog is open and its parent component is forcefully unmounted
   * (e.g. during SPA route navigation), the `data-scroll-locked` attribute
   * should be removed from `document.body` synchronously, preventing the
   * page from remaining in a non-scrollable state.
   *
   * We use ReactDOM.createRoot directly to avoid @testing-library/react's
   * dependency on the deprecated ReactDOM.act from react-dom/test-utils.
   */
  let container: HTMLDivElement;
  let root: import('react-dom/client').Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Ensure no leftover attributes between tests
    document.body.removeAttribute('data-scroll-locked');
    if (root) {
      root.unmount();
    }
    container.remove();
  });

  it('should remove data-scroll-locked when the open Dialog is force-unmounted', async () => {
    const { createRoot } = await import('react-dom/client');
    root = createRoot(container);

    // Render a dialog in open state (simulating a route with open dialog)
    await new Promise<void>((resolve) => {
      root.render(
        React.createElement(Dialog.Root, { open: true },
          React.createElement(Dialog.Overlay),
          React.createElement(Dialog.Content, null,
            React.createElement(Dialog.Title, null, 'Title')
          )
        )
      );
      // Allow layout effects and async effects to run
      setTimeout(resolve, 50);
    });

    // The dialog is open, scroll should be locked
    expect(document.body).toHaveAttribute('data-scroll-locked');

    // Simulate router navigation: forcefully unmount the entire tree
    // while the dialog is still open (no onOpenChange(false) was called)
    root.unmount();

    // Scroll lock should be cleared synchronously (via useLayoutEffect)
    expect(document.body).not.toHaveAttribute('data-scroll-locked');
  });
});
