import React from 'react';
import { axe } from 'jest-axe';
import { RenderResult } from '@testing-library/react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import * as Dialog from './Dialog';
import { getPartDataAttr } from '@radix-ui/utils';

const OPEN_TEXT = 'Open';
const CLOSE_TEXT = 'Close';
const INNER_TEXT = 'Hello from the Dialog';
const OVERLAY_TEST_ID = 'test-overlay';

const DialogTest = (props: React.ComponentProps<typeof Dialog.Root>) => (
  <Dialog.Root {...props}>
    <Dialog.Trigger>{OPEN_TEXT}</Dialog.Trigger>
    <Dialog.Overlay data-testid={OVERLAY_TEST_ID} />
    <Dialog.Content>
      <p>{INNER_TEXT}</p>
      <Dialog.Close>{CLOSE_TEXT}</Dialog.Close>
    </Dialog.Content>
  </Dialog.Root>
);

describe('given a default Dialog', () => {
  let rendered: RenderResult;
  let overlay: HTMLElement;
  let content: HTMLElement;
  let trigger: HTMLButtonElement;
  let closeButton: HTMLButtonElement;

  beforeEach(() => {
    rendered = render(<DialogTest />);
    trigger = rendered.getByText(OPEN_TEXT) as HTMLButtonElement;
  });

  it('should have no accessibility violations in default state', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should have a radix attribute on the trigger', () => {
    const partDataAttr = getPartDataAttr('DialogTrigger');
    expect(trigger).toHaveAttribute(partDataAttr);
  });

  describe('after clicking the trigger', () => {
    beforeEach(async () => {
      fireEvent.click(trigger);
      await waitFor(() => {
        overlay = rendered.getByTestId(OVERLAY_TEST_ID);
        content = rendered.getByText(INNER_TEXT).parentElement!;
        closeButton = rendered.getByText(CLOSE_TEXT) as HTMLButtonElement;
        expect(content).toBeVisible();
      });
    });

    it('should have no accessibility violations when open', async () => {
      expect(await axe(rendered.container)).toHaveNoViolations();
    });

    it('should focus the close button', () => {
      expect(closeButton).toHaveFocus();
    });

    it('should have a radix attribute on the overlay', () => {
      const partDataAttr = getPartDataAttr('DialogOverlay');
      expect(overlay).toHaveAttribute(partDataAttr);
    });

    it('should have a radix attribute on the content', () => {
      const partDataAttr = getPartDataAttr('DialogContent');
      expect(content).toHaveAttribute(partDataAttr);
    });

    it('should have a radix attribute on the close button', () => {
      const partDataAttr = getPartDataAttr('DialogClose');
      expect(closeButton).toHaveAttribute(partDataAttr);
    });

    describe('after pressing escape', () => {
      let innerContent: HTMLElement | null;
      beforeAll(() => {
        fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
        innerContent = rendered.queryByText(INNER_TEXT);
      });

      it('should be closed', () => {
        expect(innerContent).not.toBeInTheDocument();
      });
    });
  });
});
