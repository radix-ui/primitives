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

describe('NavigationMenu.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLElement>();
    const onClick = vi.fn();

    render(
      <NavigationMenu.Root
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <NavigationMenu.List />
      </NavigationMenu.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLElement>();
    const onClick = vi.fn();

    render(
      <NavigationMenu.Root
        asChild
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>
          <NavigationMenu.List />
        </article>
      </NavigationMenu.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.tagName).toBe('ARTICLE');
    expect(root).toHaveAttribute('aria-label', 'Main');
    expect(root).toHaveAttribute('data-orientation', 'horizontal');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('NavigationMenu.Sub', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <NavigationMenu.Root>
        <NavigationMenu.Sub
          ref={ref}
          data-testid="sub"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <NavigationMenu.List />
        </NavigationMenu.Sub>
      </NavigationMenu.Root>,
    );

    const sub = screen.getByTestId('sub');
    expect(sub).toHaveClass('custom-class');
    expect(sub.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(sub);

    fireEvent.click(sub);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <NavigationMenu.Root>
        <NavigationMenu.Sub
          asChild
          ref={ref}
          data-testid="sub"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article>
            <NavigationMenu.List />
          </article>
        </NavigationMenu.Sub>
      </NavigationMenu.Root>,
    );

    const sub = screen.getByTestId('sub');
    expect(sub.tagName).toBe('ARTICLE');
    expect(sub).toHaveAttribute('data-orientation', 'horizontal');
    expect(sub).toHaveClass('custom-class');
    expect(sub.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(sub);

    fireEvent.click(sub);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('NavigationMenu.List', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLUListElement>();
    const onClick = vi.fn();

    render(
      <NavigationMenu.Root>
        <NavigationMenu.List
          ref={ref}
          data-testid="list"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <NavigationMenu.Item value="one" />
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );

    // The list renders an indicator track around the element it spreads onto,
    // so the props have to land on the inner `ul` rather than on the track.
    const list = screen.getByTestId('list');
    expect(list.tagName).toBe('UL');
    expect(list).toHaveClass('custom-class');
    expect(list.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(list);

    fireEvent.click(list);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLUListElement>();
    const onClick = vi.fn();

    render(
      <NavigationMenu.Root>
        <NavigationMenu.List
          asChild
          ref={ref}
          data-testid="list"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article>
            <NavigationMenu.Item value="one" />
          </article>
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );

    const list = screen.getByTestId('list');
    expect(list.tagName).toBe('ARTICLE');
    expect(list).toHaveAttribute('data-orientation', 'horizontal');
    expect(list).toHaveClass('custom-class');
    expect(list.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(list);

    fireEvent.click(list);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('NavigationMenu.Item', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLLIElement>();
    const onClick = vi.fn();

    render(
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item
            value="one"
            ref={ref}
            data-testid="item"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <NavigationMenu.Trigger>Trigger</NavigationMenu.Trigger>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );

    const item = screen.getByTestId('item');
    expect(item.tagName).toBe('LI');
    expect(item).toHaveClass('custom-class');
    expect(item.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(item);

    fireEvent.click(item);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLLIElement>();
    const onClick = vi.fn();

    render(
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item
            value="one"
            asChild
            ref={ref}
            data-testid="item"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <li>
              <NavigationMenu.Trigger>Trigger</NavigationMenu.Trigger>
            </li>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );

    const item = screen.getByTestId('item');
    expect(item.tagName).toBe('LI');
    expect(item).toHaveClass('custom-class');
    expect(item.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(item);

    fireEvent.click(item);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('NavigationMenu.Trigger', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item value="one">
            <NavigationMenu.Trigger
              ref={ref}
              data-testid="trigger"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Trigger
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    // Composed with the trigger's own click handler rather than replaced by it.
    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item value="one">
            <NavigationMenu.Trigger
              asChild
              ref={ref}
              data-testid="trigger"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <button type="button">Trigger</button>
            </NavigationMenu.Trigger>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('NavigationMenu.Link', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    const onClick = vi.fn();

    render(
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item value="one">
            <NavigationMenu.Link
              href="/"
              active
              ref={ref}
              data-testid="link"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Link
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );

    const link = screen.getByTestId('link');
    expect(link).toHaveClass('custom-class');
    expect(link.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(link);

    fireEvent.click(link);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    const onClick = vi.fn();

    render(
      <NavigationMenu.Root>
        <NavigationMenu.List>
          <NavigationMenu.Item value="one">
            <NavigationMenu.Link
              active
              asChild
              ref={ref}
              data-testid="link"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <a href="/">Link</a>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );

    const link = screen.getByTestId('link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveAttribute('data-active', '');
    expect(link).toHaveClass('custom-class');
    expect(link.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(link);

    fireEvent.click(link);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('NavigationMenu.Content', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    // Open, since the content only mounts while its item is the active one. No
    // `Viewport` is rendered, so the content renders in place rather than being
    // proxied into one.
    render(
      <NavigationMenu.Root defaultValue="one">
        <NavigationMenu.List>
          <NavigationMenu.Item value="one">
            <NavigationMenu.Trigger>Trigger</NavigationMenu.Trigger>
            <NavigationMenu.Content
              ref={ref}
              data-testid="content"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <NavigationMenu.Link href="/">Link</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <NavigationMenu.Root defaultValue="one">
        <NavigationMenu.List>
          <NavigationMenu.Item value="one">
            <NavigationMenu.Trigger>Trigger</NavigationMenu.Trigger>
            <NavigationMenu.Content
              asChild
              ref={ref}
              data-testid="content"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>
                <NavigationMenu.Link href="/">Link</NavigationMenu.Link>
              </article>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveAttribute('data-state', 'open');
    expect(content).toHaveAttribute('data-orientation', 'horizontal');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('NavigationMenu.Indicator', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    // The indicator portals into the track the list renders, and only mounts
    // once it has measured the trigger of the active item, hence the open root
    // and the `waitFor`.
    render(
      <NavigationMenu.Root defaultValue="one">
        <NavigationMenu.List>
          <NavigationMenu.Item value="one">
            <NavigationMenu.Trigger>Trigger</NavigationMenu.Trigger>
          </NavigationMenu.Item>
          <NavigationMenu.Indicator
            ref={ref}
            data-testid="indicator"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          />
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );

    const indicator = await waitFor(() => screen.getByTestId('indicator'));
    expect(indicator).toHaveClass('custom-class');
    // Merged with the positioning styles the indicator sets itself.
    expect(indicator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(indicator.style.position).toBe('absolute');
    expect(ref.current).toBe(indicator);

    fireEvent.click(indicator);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <NavigationMenu.Root defaultValue="one">
        <NavigationMenu.List>
          <NavigationMenu.Item value="one">
            <NavigationMenu.Trigger>Trigger</NavigationMenu.Trigger>
          </NavigationMenu.Item>
          <NavigationMenu.Indicator
            asChild
            ref={ref}
            data-testid="indicator"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article />
          </NavigationMenu.Indicator>
        </NavigationMenu.List>
      </NavigationMenu.Root>,
    );

    const indicator = await waitFor(() => screen.getByTestId('indicator'));
    expect(indicator.tagName).toBe('ARTICLE');
    expect(indicator).toHaveAttribute('data-state', 'visible');
    expect(indicator).toHaveAttribute('data-orientation', 'horizontal');
    expect(indicator).toHaveClass('custom-class');
    expect(indicator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(indicator);

    fireEvent.click(indicator);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('NavigationMenu.Viewport', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    // Open, since the viewport only mounts while a menu is active.
    render(
      <NavigationMenu.Root defaultValue="one">
        <NavigationMenu.List>
          <NavigationMenu.Item value="one">
            <NavigationMenu.Trigger>Trigger</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link href="/">Link</NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Viewport
          ref={ref}
          data-testid="viewport"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        />
      </NavigationMenu.Root>,
    );

    const viewport = screen.getByTestId('viewport');
    expect(viewport).toHaveClass('custom-class');
    expect(viewport.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(viewport);

    fireEvent.click(viewport);
    expect(onClick).toHaveBeenCalled();
  });

  // TODO: Fix bug so this test passes.
  it.todo('forwards props to the child element when `asChild` is set');
});
