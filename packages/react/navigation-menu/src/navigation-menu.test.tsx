import * as React from 'react';
import { cleanup, render, screen, waitFor, fireEvent } from '@testing-library/react';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';
import { afterEach, describe, it, expect, vi } from 'vitest';
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

// Regression tests for https://github.com/radix-ui/primitives/issues/3963
describe('NavigationMenu ref stability', () => {
  afterEach(cleanup);

  it('keeps a stable composed ref on the root', () => {
    assertStableComposedRef((ref) => (
      <NavigationMenu.Root ref={ref}>
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
    ));
  });

  // Exercises the viewport content item composed ref (`NavigationMenuViewportItem`).
  it('keeps a stable composed ref on viewport content', () => {
    assertStableComposedRef((ref) => (
      <NavigationMenu.Root defaultValue="one">
        <NavigationMenu.List>
          <NavigationMenu.Item value="one">
            <NavigationMenu.Trigger>{TRIGGER_TEXT}</NavigationMenu.Trigger>
            <NavigationMenu.Content ref={ref}>
              <NavigationMenu.Link href="#">{CONTENT_TEXT}</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Viewport />
      </NavigationMenu.Root>
    ));
  });
});
// See: https://github.com/radix-ui/primitives/issues/3473
describe('focus outside', () => {
  afterEach(cleanup);

  it('should not dismiss an open menu when focus moves between elements outside the menu', async () => {
    const onValueChange = vi.fn();
    render(
      <div>
        <NavigationMenuTest defaultValue="one" onValueChange={onValueChange} />
        <button type="button" data-testid="outside">
          Outside
        </button>
      </div>,
    );
    await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());

    // Mimics an external layer (e.g. a Dialog) auto-focusing an element on open.
    // Focus never originated from within the menu, so it should stay open.
    const outside = screen.getByTestId('outside');
    outside.focus();
    fireEvent.focusIn(outside);

    expect(onValueChange).not.toHaveBeenCalledWith('');
    expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument();
  });

  it('should dismiss an open menu when focus actually leaves the menu', async () => {
    const onValueChange = vi.fn();
    render(
      <div>
        <NavigationMenuTest defaultValue="one" onValueChange={onValueChange} />
        <button type="button" data-testid="outside">
          Outside
        </button>
      </div>,
    );
    await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());

    // Focus leaving the menu content for an outside element should dismiss it.
    const link = screen.getByText(CONTENT_TEXT);
    const outside = screen.getByTestId('outside');
    fireEvent.focusIn(outside, { relatedTarget: link });

    expect(onValueChange).toHaveBeenCalledWith('');
  });
});
