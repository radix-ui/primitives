import React from 'react';
import { axe } from 'jest-axe';
import { RenderResult } from '@testing-library/react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import * as AlertDialog from './AlertDialog';
import { getSelector } from '@radix-ui/utils';

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
  let overlay: HTMLElement;
  let content: HTMLElement;
  let title: HTMLElement;
  let description: HTMLElement;
  let trigger: HTMLButtonElement;
  let cancelButton: HTMLButtonElement;
  let actionButton: HTMLButtonElement;

  beforeEach(() => {
    rendered = render(<DialogTest />);
    trigger = rendered.getByText(OPEN_TEXT) as HTMLButtonElement;
  });

  it('should have no accessibility violations in default state', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have a radix attribute on the trigger', () => {
    const partDataAttr = `data-${getSelector('AlertDialogTrigger')}`;
    expect(trigger).toHaveAttribute(partDataAttr);
  });

  describe('after clicking the trigger', () => {
    beforeEach(async () => {
      fireEvent.click(trigger);
      await waitFor(() => {
        overlay = rendered.getByTestId(OVERLAY_TEST_ID);
        title = rendered.getByText(TITLE_TEXT);
        description = rendered.getByText(DESC_TEXT);
        content = title.parentElement!;
        cancelButton = rendered.getByText(CANCEL_TEXT) as HTMLButtonElement;
        actionButton = rendered.getByText(ACTION_TEXT) as HTMLButtonElement;
        expect(content).toBeVisible();
      });
    });

    it('should have no accessibility violations when open', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should focus the cancel button', () => {
      expect(cancelButton).toHaveFocus();
    });

    it('should have a radix attribute on the overlay', () => {
      const partDataAttr = `data-${getSelector('AlertDialogOverlay')}`;
      expect(overlay).toHaveAttribute(partDataAttr);
    });

    it('should have a radix attribute on the content', () => {
      const partDataAttr = `data-${getSelector('AlertDialogContent')}`;
      expect(content).toHaveAttribute(partDataAttr);
    });

    it('should have a radix attribute on the title', () => {
      const partDataAttr = `data-${getSelector('AlertDialogTitle')}`;
      expect(title).toHaveAttribute(partDataAttr);
    });

    it('should have a radix attribute on the description', () => {
      const partDataAttr = `data-${getSelector('AlertDialogDescription')}`;
      expect(description).toHaveAttribute(partDataAttr);
    });

    it('should have a radix attribute on the cancel button', () => {
      const partDataAttr = `data-${getSelector('AlertDialogCancel')}`;
      expect(cancelButton).toHaveAttribute(partDataAttr);
    });

    it('should have a radix attribute on the action button', () => {
      const partDataAttr = `data-${getSelector('AlertDialogAction')}`;
      expect(actionButton).toHaveAttribute(partDataAttr);
    });
  });
});
