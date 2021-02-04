import React from 'react';
import { axe } from 'jest-axe';
import { RenderResult } from '@testing-library/react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import * as AlertDialog from './AlertDialog';

const OPEN_TEXT = 'Open';
const CANCEL_TEXT = 'Cancel';
const ACTION_TEXT = 'Do it';
const TITLE_TEXT = 'Warning';
const DESC_TEXT = 'This is a warning';
const OVERLAY_TEST_ID = 'test-overlay';

const DialogTest = (props: React.ComponentProps<typeof AlertDialog.Root>) => (
  <AlertDialog.Root {...props}>
    <AlertDialog.Trigger>{OPEN_TEXT}</AlertDialog.Trigger>
    <AlertDialog.Overlay data-testid={OVERLAY_TEST_ID} />
    <AlertDialog.Content>
      <AlertDialog.Title>{TITLE_TEXT}</AlertDialog.Title>
      <AlertDialog.Description>{DESC_TEXT}</AlertDialog.Description>
      <AlertDialog.Cancel>{CANCEL_TEXT}</AlertDialog.Cancel>
      <AlertDialog.Action>{ACTION_TEXT}</AlertDialog.Action>
    </AlertDialog.Content>
  </AlertDialog.Root>
);

describe('given a default Dialog', () => {
  let rendered: RenderResult;
  let content: HTMLElement;
  let title: HTMLElement;
  let trigger: HTMLButtonElement;
  let cancelButton: HTMLButtonElement;

  beforeEach(() => {
    rendered = render(<DialogTest />);
    trigger = rendered.getByText(OPEN_TEXT) as HTMLButtonElement;
  });

  it('should have no accessibility violations in default state', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  describe('after clicking the trigger', () => {
    beforeEach(async () => {
      fireEvent.click(trigger);
      await waitFor(() => {
        title = rendered.getByText(TITLE_TEXT);
        content = title.parentElement!;
        cancelButton = rendered.getByText(CANCEL_TEXT) as HTMLButtonElement;
        expect(content).toBeVisible();
      });
    });

    it('should have no accessibility violations when open', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should focus the cancel button', () => {
      expect(cancelButton).toHaveFocus();
    });
  });
});
