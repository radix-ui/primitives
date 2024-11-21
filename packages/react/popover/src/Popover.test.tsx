import { act, render } from '@testing-library/react';
import * as Popover from '.';

const OPEN_TEXT = 'Open';
const CONTENT_TEXT = 'Content';

function PopoverTest(): React.ReactElement {
  return (
    <Popover.Root>
      <Popover.Trigger>{OPEN_TEXT}</Popover.Trigger>
      <Popover.Content>{CONTENT_TEXT}</Popover.Content>
    </Popover.Root>
  );
}

describe('Popover', () => {
  describe('aria-controls', () => {
    it('should not be defined when the popover is closed', async () => {
      const rendered = render(<PopoverTest />);

      expect(rendered.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();
      const trigger = rendered.getByText(OPEN_TEXT);
      expect(trigger.getAttribute('aria-controls')).toBeNull();
    });

    it('should be valid when the popover is open', () => {
      const rendered = render(<PopoverTest />);

      const trigger = rendered.getByText(OPEN_TEXT);
      act(() => trigger.click());
      const ariaControls = trigger.getAttribute('aria-controls');
      expect(ariaControls).not.toBeNull();

      const dialog = rendered.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog.id).toBe(ariaControls);
    });
  });
});
