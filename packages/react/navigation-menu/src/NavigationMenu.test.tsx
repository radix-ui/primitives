import { act, render } from '@testing-library/react';
import * as NavigationMenu from '.';

const TRIGGER = 'Trigger';
const CONTENT = 'Content';

function NavigationMenuTest(): React.ReactElement {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>{TRIGGER}</NavigationMenu.Trigger>
          <NavigationMenu.Content>{CONTENT}</NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

describe('NavigationMenu', () => {
  describe('aria-controls', () => {
    it('should not be defined when the menu is closed', async () => {
      const rendered = render(<NavigationMenuTest />);

      expect(rendered.queryByText(CONTENT)).not.toBeInTheDocument();
      const trigger = rendered.getByText(TRIGGER);
      expect(trigger.getAttribute('aria-controls')).toBeNull();
    });

    it('should be valid when the menu is open', () => {
      const rendered = render(<NavigationMenuTest />);

      const trigger = rendered.getByText(TRIGGER);
      act(() => trigger.click());
      const content = rendered.queryByText(CONTENT);
      expect(content).toBeVisible();

      const ariaControls = trigger.getAttribute('aria-controls');
      expect(ariaControls).not.toBeNull();
      if (content !== null) {
        expect(content.id).toBe(ariaControls);
      }
    });
  });
});
