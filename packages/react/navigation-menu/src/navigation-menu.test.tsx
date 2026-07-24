import * as React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';
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

describe('NavigationMenu activationMode', () => {
  afterEach(cleanup);

  describe('"automatic" activationMode', () => {
    it('opens the item on pointer enter', async () => {
      render(<NavigationMenuTest activationMode="automatic" />);
      const trigger = screen.getByText(TRIGGER_TEXT);
      fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
      fireEvent.pointerMove(trigger, { pointerType: 'mouse' });
      await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('toggles item on click', async () => {
      render(<NavigationMenuTest defaultValue="one" />);
      const trigger = screen.getByText(TRIGGER_TEXT);
      await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());

      fireEvent.click(trigger);
      await waitFor(() => expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument());
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('"manual" activationMode', () => {
    it('does not open on pointer enter', async () => {
      render(<NavigationMenuTest activationMode="manual" />);
      const trigger = screen.getByText(TRIGGER_TEXT);

      fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
      fireEvent.pointerMove(trigger, { pointerType: 'mouse' });

      // Wait past the default open delay to catch a hover-open regression.
      await new Promise((resolve) => setTimeout(resolve, 250));
      expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('toggles item on click', async () => {
      render(<NavigationMenuTest activationMode="manual" />);
      const trigger = screen.getByText(TRIGGER_TEXT);
      expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();

      fireEvent.click(trigger);
      await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());
      expect(trigger).toHaveAttribute('aria-expanded', 'true');

      fireEvent.click(trigger);
      await waitFor(() => expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument());
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });
});

const NavigationMenuSubTest = (props: React.ComponentProps<typeof NavigationMenu.Sub>) => (
  <NavigationMenu.Sub defaultValue="one" {...props}>
    <NavigationMenu.List>
      <NavigationMenu.Item value="one">
        <NavigationMenu.Trigger>{TRIGGER_TEXT}</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Link href="#">{CONTENT_TEXT}</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Sub>
);

describe('NavigationMenuSub activationMode', () => {
  afterEach(cleanup);

  describe('"automatic" activationMode', () => {
    it('opens the item on pointer enter', async () => {
      render(
        <NavigationMenu.Root>
          <NavigationMenuSubTest activationMode="automatic" defaultValue="" />
        </NavigationMenu.Root>,
      );
      const trigger = screen.getByText(TRIGGER_TEXT);
      expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();

      fireEvent.pointerMove(trigger, { pointerType: 'mouse' });
      await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('"manual" activationMode', () => {
    it('does not open on pointer enter', async () => {
      render(
        <NavigationMenu.Root>
          <NavigationMenuSubTest activationMode="manual" defaultValue="" />
        </NavigationMenu.Root>,
      );
      const trigger = screen.getByText(TRIGGER_TEXT);
      expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();

      fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
      fireEvent.pointerMove(trigger, { pointerType: 'mouse' });

      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens the item on click', async () => {
      render(
        <NavigationMenu.Root>
          <NavigationMenuSubTest activationMode="manual" defaultValue="" />
        </NavigationMenu.Root>,
      );
      const trigger = screen.getByText(TRIGGER_TEXT);
      expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();

      fireEvent.click(trigger);
      await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // `activationMode` governs pointer/focus activation, so inheritance is asserted
  // via hover behavior (open on pointer enter) rather than click.
  describe('inheritance', () => {
    it('inherits "manual" from the parent NavigationMenu', async () => {
      render(
        <NavigationMenu.Root activationMode="manual">
          <NavigationMenuSubTest defaultValue="" />
        </NavigationMenu.Root>,
      );
      const trigger = screen.getByText(TRIGGER_TEXT);

      fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
      fireEvent.pointerMove(trigger, { pointerType: 'mouse' });

      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('inherits "automatic" from the parent NavigationMenu', async () => {
      render(
        <NavigationMenu.Root activationMode="automatic">
          <NavigationMenuSubTest defaultValue="" />
        </NavigationMenu.Root>,
      );
      const trigger = screen.getByText(TRIGGER_TEXT);
      expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();

      fireEvent.pointerMove(trigger, { pointerType: 'mouse' });
      await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('overrides inherited "manual" with activationMode="automatic"', async () => {
      render(
        <NavigationMenu.Root activationMode="manual">
          <NavigationMenuSubTest activationMode="automatic" defaultValue="" />
        </NavigationMenu.Root>,
      );
      const trigger = screen.getByText(TRIGGER_TEXT);
      expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();

      fireEvent.pointerMove(trigger, { pointerType: 'mouse' });
      await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('overrides inherited "automatic" with activationMode="manual"', async () => {
      render(
        <NavigationMenu.Root activationMode="automatic">
          <NavigationMenuSubTest activationMode="manual" defaultValue="" />
        </NavigationMenu.Root>,
      );
      const trigger = screen.getByText(TRIGGER_TEXT);

      fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
      fireEvent.pointerMove(trigger, { pointerType: 'mouse' });

      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
  });
});

describe('NavigationMenuSub disableToggle', () => {
  afterEach(cleanup);

  it('does not close an open item when clicking its trigger by default', async () => {
    render(
      <NavigationMenu.Root>
        <NavigationMenuSubTest defaultValue="one" />
      </NavigationMenu.Root>,
    );
    const trigger = screen.getByText(TRIGGER_TEXT);
    await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());

    fireEvent.click(trigger);
    expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps an open item open on click in manual mode by default', async () => {
    render(
      <NavigationMenu.Root activationMode="manual">
        <NavigationMenuSubTest defaultValue="one" />
      </NavigationMenu.Root>,
    );
    const trigger = screen.getByText(TRIGGER_TEXT);
    await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());

    fireEvent.click(trigger);
    expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes an open item when clicking its trigger with disableToggle={false}', async () => {
    render(
      <NavigationMenu.Root>
        <NavigationMenuSubTest defaultValue="one" disableToggle={false} />
      </NavigationMenu.Root>,
    );
    const trigger = screen.getByText(TRIGGER_TEXT);
    await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());

    fireEvent.click(trigger);
    await waitFor(() => expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument());
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes an open item on click with disableToggle={false} in manual mode', async () => {
    render(
      <NavigationMenu.Root activationMode="manual">
        <NavigationMenuSubTest defaultValue="one" disableToggle={false} />
      </NavigationMenu.Root>,
    );
    const trigger = screen.getByText(TRIGGER_TEXT);
    await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());

    fireEvent.click(trigger);
    await waitFor(() => expect(screen.queryByText(CONTENT_TEXT)).not.toBeInTheDocument());
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
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

// Reproduction for https://github.com/radix-ui/primitives/issues/3786
describe('data-state on forceMount viewport content (repro)', () => {
  afterEach(cleanup);

  it('should have data-state on content element with forceMount + Viewport', async () => {
    render(
      <NavigationMenu.Root defaultValue="one">
        <NavigationMenu.List>
          <NavigationMenu.Item value="one">
            <NavigationMenu.Trigger>{TRIGGER_TEXT}</NavigationMenu.Trigger>
            <NavigationMenu.Content forceMount>
              <NavigationMenu.Link href="#">{CONTENT_TEXT}</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Viewport />
      </NavigationMenu.Root>,
    );
    await waitFor(() => expect(screen.getByText(CONTENT_TEXT)).toBeInTheDocument());

    // DismissableLayer (the content element) has data-orientation.
    // Going up from the link, the first [data-orientation] ancestor is the
    // content element itself — not the viewport wrapper further up.
    const contentEl = screen.getByText(CONTENT_TEXT).closest('[data-orientation]');
    expect(contentEl).toHaveAttribute('data-state', 'open');
  });
});
