import React from 'react';
import { axe } from 'jest-axe';
import { RenderResult } from '@testing-library/react';
import { render, fireEvent } from '@testing-library/react';
import * as Dialog from './Dialog';

const OPEN_TEXT = 'Open';
const CLOSE_TEXT = 'Close';

const DialogTest = (props: React.ComponentProps<typeof Dialog.Root>) => (
  <Dialog.Root {...props}>
    <Dialog.Trigger>{OPEN_TEXT}</Dialog.Trigger>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Close>{CLOSE_TEXT}</Dialog.Close>
    </Dialog.Content>
  </Dialog.Root>
);

describe('given a default Dialog', () => {
  let rendered: RenderResult;
  let trigger: HTMLElement;
  let closeButton: HTMLElement;
  let consoleWarnMock: jest.SpyInstance;
  let consoleWarnMockFunction: jest.Mock;

  beforeEach(() => {
    // This surpresses React error boundary logs for testing intentionally
    // thrown errors, like in some test cases in this suite. See discussion of
    // this here: https://github.com/facebook/react/issues/11098
    consoleWarnMockFunction = jest.fn();
    consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation(consoleWarnMockFunction);

    rendered = render(<DialogTest />);
    trigger = rendered.getByText(OPEN_TEXT);
  });

  afterEach(() => {
    consoleWarnMock.mockRestore();
    consoleWarnMockFunction.mockClear();
  });

  it('should have no accessibility violations in default state', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('when no description has been provided', () => {
    it('should warn to the console', () => {
      expect(consoleWarnMockFunction).toHaveBeenCalled();
    });
  });

  describe('after clicking the trigger', () => {
    beforeEach(() => {
      fireEvent.click(trigger);
      closeButton = rendered.getByText(CLOSE_TEXT);
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
