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
