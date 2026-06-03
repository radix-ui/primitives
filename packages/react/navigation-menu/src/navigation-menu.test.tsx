import * as React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it, expect } from 'vitest';
import * as NavigationMenu from './navigation-menu';

const TRIGGER_TEXT = 'Item One';
const CONTENT_TEXT = 'Content One';

const NavigationMenuTest = (props: React.ComponentProps<typeof NavigationMenu.Root>) => (
  <NavigationMenu.Root {...props}>
    <NavigationMenu.List>
      <NavigationMenu.Item value="one">
        <NavigationMenu.Trigger>{TRIGGER_TEXT}</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Link href="#">{CONTENT_TEXT}</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>
    <NavigationMenu.Viewport />
  </NavigationMenu.Root>
);

describe('aria-controls', () => {
  afterEach(cleanup);

  it('should not reference a non-existent element while closed', () => {
    render(<NavigationMenuTest />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
  });

  it('should reference the rendered content while open', async () => {
    render(<NavigationMenuTest defaultValue="one" />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const contentId = trigger.getAttribute('aria-controls');
    expect(contentId).toBeTruthy();
    const content = document.getElementById(contentId!);
    expect(content).not.toBeNull();
    expect(content).toContainElement(screen.getByText(CONTENT_TEXT));
  });
});
