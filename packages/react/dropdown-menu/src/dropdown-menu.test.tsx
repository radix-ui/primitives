import * as React from 'react';
import ReactDOM from 'react-dom';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { assertStableComposedRef } from '@repo/test-utils/ref-stability';
import * as DropdownMenu from './dropdown-menu';

const TRIGGER_TEXT = 'Open';
const ITEM_TEXT = 'Item';
const SUB_TRIGGER_TEXT = 'Sub';
const SUB_ITEM_TEXT = 'Sub Item';

const DropdownMenuTest = (props: React.ComponentProps<typeof DropdownMenu.Root>) => (
  <DropdownMenu.Root {...props}>
    <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content>
        <DropdownMenu.Item>{ITEM_TEXT}</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

const DropdownMenuWithSubTest = (props: React.ComponentProps<typeof DropdownMenu.Root>) => (
  <DropdownMenu.Root {...props}>
    <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content>
        <DropdownMenu.Item>{ITEM_TEXT}</DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>{SUB_TRIGGER_TEXT}</DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item>{SUB_ITEM_TEXT}</DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

describe('aria-controls', () => {
  afterEach(cleanup);

  it('should not reference a non-existent element while closed', () => {
    render(<DropdownMenuTest />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
  });

  it('should reference the rendered content while open', async () => {
    render(<DropdownMenuTest />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    fireEvent.keyDown(trigger, { key: 'Enter' });

    const content = await waitFor(() => screen.getByRole('menu'));
    expect(content.id).toBeTruthy();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', content.id);
    expect(document.getElementById(content.id)).toBe(content);
  });
});

describe('closing on window blur', () => {
  afterEach(cleanup);

  it('should close the menu and any open submenus when the window loses focus', async () => {
    render(<DropdownMenuWithSubTest />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    fireEvent.keyDown(trigger, { key: 'Enter' });

    const subTrigger = await waitFor(() => screen.getByText(SUB_TRIGGER_TEXT));
    fireEvent.keyDown(subTrigger, { key: 'ArrowRight' });

    await waitFor(() => expect(screen.getByText(SUB_ITEM_TEXT)).toBeInTheDocument());

    act(() => {
      window.dispatchEvent(new FocusEvent('blur'));
    });

    await waitFor(() => expect(screen.queryByText(SUB_ITEM_TEXT)).not.toBeInTheDocument());
    expect(screen.queryByText(ITEM_TEXT)).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

// Regression tests for https://github.com/radix-ui/primitives/issues/3124
describe('given a mouse press on the trigger', () => {
  afterEach(cleanupModal);

  it('opens on press and closes when released outside the trigger and content', () => {
    const onOpenChange = vi.fn();
    render(
      <>
        <DropdownMenuTest onOpenChange={onOpenChange} />
        <button type="button">outside</button>
      </>,
    );
    const trigger = screen.getByText(TRIGGER_TEXT);

    fireEvent.pointerDown(trigger, { button: 0, pointerId: 1, pointerType: 'mouse' });
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    // jsdom has no layout, so release at a point away from the trigger's empty box
    fireEvent.pointerUp(screen.getByText('outside'), {
      button: 0,
      pointerId: 1,
      pointerType: 'mouse',
      clientX: 500,
      clientY: 500,
    });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes a controlled menu when released outside the trigger and content', () => {
    const ControlledDropdownMenuTest = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <DropdownMenuTest open={open} onOpenChange={setOpen} />
          <button type="button">outside</button>
        </>
      );
    };
    render(<ControlledDropdownMenuTest />);
    const trigger = screen.getByText(TRIGGER_TEXT);

    fireEvent.pointerDown(trigger, { button: 0, pointerId: 1, pointerType: 'mouse' });
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.pointerUp(screen.getByText('outside'), {
      button: 0,
      pointerId: 1,
      pointerType: 'mouse',
      clientX: 500,
      clientY: 500,
    });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('stays open when released over the trigger', () => {
    render(<DropdownMenuTest />);
    const trigger = screen.getByText(TRIGGER_TEXT);

    fireEvent.pointerDown(trigger, { button: 0, pointerId: 1, pointerType: 'mouse' });
    fireEvent.pointerUp(trigger, { button: 0, pointerId: 1, pointerType: 'mouse' });

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('stays open when released over the trigger box while pointer events are disabled', () => {
    render(<DropdownMenuTest />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue(
      DOMRect.fromRect({ x: 10, y: 10, width: 80, height: 30 }),
    );

    fireEvent.pointerDown(trigger, { button: 0, pointerId: 1, pointerType: 'mouse' });
    // A modal menu sets `pointer-events: none` on the body, so the release targets the root element
    fireEvent.pointerUp(document.documentElement, {
      button: 0,
      pointerId: 1,
      pointerType: 'mouse',
      clientX: 40,
      clientY: 20,
    });

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('stays open when released over the content', () => {
    render(<DropdownMenuTest />);
    const trigger = screen.getByText(TRIGGER_TEXT);

    fireEvent.pointerDown(trigger, { button: 0, pointerId: 1, pointerType: 'mouse' });
    fireEvent.pointerUp(screen.getByRole('menu'), {
      button: 0,
      pointerId: 1,
      pointerType: 'mouse',
    });

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('still selects an item with a press, drag and release from the trigger', () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Item onSelect={onSelect}>{ITEM_TEXT}</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );
    const trigger = screen.getByText(TRIGGER_TEXT);

    fireEvent.pointerDown(trigger, { button: 0, pointerId: 1, pointerType: 'mouse' });
    fireEvent.pointerUp(screen.getByText(ITEM_TEXT), {
      button: 0,
      pointerId: 1,
      pointerType: 'mouse',
    });

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('stays open when the press is cancelled', () => {
    render(
      <>
        <DropdownMenuTest />
        <button type="button">outside</button>
      </>,
    );
    const trigger = screen.getByText(TRIGGER_TEXT);
    const outside = screen.getByText('outside');

    fireEvent.pointerDown(trigger, { button: 0, pointerId: 1, pointerType: 'mouse' });
    fireEvent.pointerCancel(outside, { pointerId: 1, pointerType: 'mouse' });
    fireEvent.pointerUp(outside, {
      button: 0,
      pointerId: 1,
      pointerType: 'mouse',
      clientX: 500,
      clientY: 500,
    });

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('ignores the release of a different pointer', () => {
    render(
      <>
        <DropdownMenuTest />
        <button type="button">outside</button>
      </>,
    );
    const trigger = screen.getByText(TRIGGER_TEXT);

    fireEvent.pointerDown(trigger, { button: 0, pointerId: 1, pointerType: 'mouse' });
    fireEvent.pointerUp(screen.getByText('outside'), {
      button: 0,
      pointerId: 2,
      pointerType: 'mouse',
      clientX: 500,
      clientY: 500,
    });

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('does not close a keyboard-opened menu on a pointer release outside', () => {
    render(
      <>
        <DropdownMenuTest />
        <button type="button">outside</button>
      </>,
    );
    const trigger = screen.getByText(TRIGGER_TEXT);

    fireEvent.keyDown(trigger, { key: 'Enter' });
    fireEvent.pointerUp(screen.getByText('outside'), {
      button: 0,
      pointerId: 1,
      pointerType: 'mouse',
      clientX: 500,
      clientY: 500,
    });

    expect(screen.getByRole('menu')).toBeInTheDocument();
  });
});

// Regression tests for https://github.com/radix-ui/primitives/issues/3232
describe('keys from focusable descendants', () => {
  afterEach(cleanup);

  const MenuWithPortaledInput = () => (
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={(event) => event.preventDefault()}>
            {ITEM_TEXT}
            {ReactDOM.createPortal(<input data-testid="input" defaultValue="" />, document.body)}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  it('does not intercept Space/Enter typed into a portaled focusable descendant', async () => {
    render(<MenuWithPortaledInput />);
    const input = await waitFor(() => screen.getByTestId('input'));
    input.focus();
    // `fireEvent` returns `false` when `preventDefault` was called on the event.
    expect(fireEvent.keyDown(input, { key: ' ' })).toBe(true);
    expect(fireEvent.keyDown(input, { key: 'Enter' })).toBe(true);
  });

  it('still selects the item via Space/Enter when the item itself is focused', async () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Item onSelect={onSelect}>{ITEM_TEXT}</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );
    const item = await waitFor(() => screen.getByText(ITEM_TEXT));
    item.focus();
    fireEvent.keyDown(item, { key: 'Enter' });
    await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(1));
  });
});

// Regression tests for https://github.com/radix-ui/primitives/issues/4195
describe('pointer movement while closing', () => {
  afterEach(cleanupModal);

  // `forceMount` keeps the content mounted after it closes, as an exit animation does.
  const ClosingMenu = ({ open }: { open: boolean }) => (
    <>
      <DropdownMenu.Root open={open}>
        <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
        <DropdownMenu.Portal forceMount>
          <DropdownMenu.Content forceMount>
            <DropdownMenu.Item>{ITEM_TEXT}</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <input data-testid="input" />
    </>
  );

  async function renderClosed() {
    const { rerender } = render(<ClosingMenu open />);
    const item = await waitFor(() => screen.getByText(ITEM_TEXT));
    rerender(<ClosingMenu open={false} />);
    const input = screen.getByTestId('input');
    input.focus();
    return { item, input };
  }

  it('does not take focus when the pointer leaves an item', async () => {
    const { item, input } = await renderClosed();
    fireEvent.pointerLeave(item, { pointerType: 'mouse' });
    expect(input).toHaveFocus();
  });

  it('does not focus an item the pointer moves over', async () => {
    const { item, input } = await renderClosed();
    fireEvent.pointerMove(item, { pointerType: 'mouse' });
    expect(input).toHaveFocus();
  });

  const MenuWithClosingSub = ({ subOpen }: { subOpen: boolean }) => (
    <DropdownMenu.Root open>
      <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content>
          <DropdownMenu.Item>{ITEM_TEXT}</DropdownMenu.Item>
          <DropdownMenu.Sub open={subOpen}>
            <DropdownMenu.SubTrigger>{SUB_TRIGGER_TEXT}</DropdownMenu.SubTrigger>
            <DropdownMenu.Portal forceMount>
              <DropdownMenu.SubContent forceMount>
                <DropdownMenu.Item>{SUB_ITEM_TEXT}</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );

  async function renderClosedSub() {
    const { rerender } = render(<MenuWithClosingSub subOpen />);
    const subItem = await waitFor(() => screen.getByText(SUB_ITEM_TEXT));
    rerender(<MenuWithClosingSub subOpen={false} />);
    const item = screen.getByText(ITEM_TEXT);
    item.focus();
    return { item, subItem };
  }

  it('does not take focus when the pointer leaves an item in a closed submenu', async () => {
    const { item, subItem } = await renderClosedSub();
    fireEvent.pointerLeave(subItem, { pointerType: 'mouse' });
    expect(item).toHaveFocus();
  });

  it('does not focus an item the pointer moves over in a closed submenu', async () => {
    const { item, subItem } = await renderClosedSub();
    fireEvent.pointerMove(subItem, { pointerType: 'mouse' });
    expect(item).toHaveFocus();
  });
});

describe('given a DropdownMenu with `asChild` on the Content', () => {
  afterEach(cleanupModal);

  it.each([{ modal: true }, { modal: false }])(
    'forwards content props and the ref to the child (modal: $modal)',
    async ({ modal }) => {
      const contentRef = React.createRef<HTMLDivElement>();

      render(
        <DropdownMenu.Root defaultOpen modal={modal}>
          <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content asChild className="content" ref={contentRef}>
              <section data-testid="content">
                <DropdownMenu.Item>{ITEM_TEXT}</DropdownMenu.Item>
              </section>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>,
      );

      const content = await waitFor(() => screen.getByTestId('content'));
      expect(content.tagName).toBe('SECTION');
      expect(content).toHaveAttribute('role', 'menu');
      expect(content).toHaveAttribute('data-state', 'open');
      expect(content).toHaveAttribute('data-radix-menu-content', '');
      expect(content).toHaveClass('content');
      expect(contentRef.current).toBe(content);
    },
  );
});

// Regression tests for https://github.com/radix-ui/primitives/issues/3963
describe('ref stability', () => {
  afterEach(cleanup);

  it('keeps a stable composed ref on the Trigger', () => {
    assertStableComposedRef((ref) => (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger ref={ref}>{TRIGGER_TEXT}</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Item>{ITEM_TEXT}</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    ));
  });

  // Exercises the underlying `@radix-ui/react-menu` `MenuSubTrigger` fix.
  it('keeps a stable composed ref on the SubTrigger', () => {
    assertStableComposedRef((ref) => (
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>{TRIGGER_TEXT}</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger ref={ref}>{SUB_TRIGGER_TEXT}</DropdownMenu.SubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item>{SUB_ITEM_TEXT}</DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    ));
  });
});

describe('DropdownMenu.Trigger', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Open
        </DropdownMenu.Trigger>
      </DropdownMenu.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          asChild
          ref={ref}
          data-testid="trigger"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <button type="button">Open</button>
        </DropdownMenu.Trigger>
      </DropdownMenu.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('DropdownMenu.Content', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <DropdownMenu.Item>Item</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
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
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            asChild
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>
              <DropdownMenu.Item>Item</DropdownMenu.Item>
            </article>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveAttribute('role', 'menu');
    expect(content).toHaveAttribute('data-state', 'open');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });

  // A non-modal menu renders a different tree: no scroll lock and an untrapped focus scope, so it
  // needs covering separately.
  it('forwards props to the child element when `asChild` is set on a non-modal menu', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen modal={false}>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            asChild
            ref={ref}
            data-testid="content"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>
              <DropdownMenu.Item>Item</DropdownMenu.Item>
            </article>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveAttribute('role', 'menu');
    expect(content).toHaveAttribute('data-state', 'open');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('DropdownMenu.Group', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Group
              ref={ref}
              data-testid="group"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <DropdownMenu.Item>Item</DropdownMenu.Item>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const group = screen.getByTestId('group');
    expect(group).toHaveClass('custom-class');
    expect(group.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(group);

    fireEvent.click(group);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Group
              asChild
              ref={ref}
              data-testid="group"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>
                <DropdownMenu.Item>Item</DropdownMenu.Item>
              </article>
            </DropdownMenu.Group>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const group = screen.getByTestId('group');
    expect(group.tagName).toBe('ARTICLE');
    expect(group).toHaveAttribute('role', 'group');
    expect(group).toHaveClass('custom-class');
    expect(group.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(group);

    fireEvent.click(group);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('DropdownMenu.Label', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Label
              ref={ref}
              data-testid="label"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Label
            </DropdownMenu.Label>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const label = screen.getByTestId('label');
    expect(label).toHaveClass('custom-class');
    expect(label.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(label);

    fireEvent.click(label);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Label
              asChild
              ref={ref}
              data-testid="label"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>Label</article>
            </DropdownMenu.Label>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const label = screen.getByTestId('label');
    expect(label.tagName).toBe('ARTICLE');
    expect(label).toHaveClass('custom-class');
    expect(label.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(label);

    fireEvent.click(label);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('DropdownMenu.Item', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              ref={ref}
              data-testid="item"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Item
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const item = screen.getByTestId('item');
    expect(item).toHaveClass('custom-class');
    expect(item.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(item);

    // Composed with the item's own handler rather than replaced
    fireEvent.click(item);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Item
              asChild
              ref={ref}
              data-testid="item"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>Item</article>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const item = screen.getByTestId('item');
    expect(item.tagName).toBe('ARTICLE');
    expect(item).toHaveAttribute('role', 'menuitem');
    expect(item).toHaveClass('custom-class');
    expect(item.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(item);

    fireEvent.click(item);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('DropdownMenu.CheckboxItem', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem
              checked
              ref={ref}
              data-testid="checkbox-item"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              Checkbox item
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const checkboxItem = screen.getByTestId('checkbox-item');
    expect(checkboxItem).toHaveClass('custom-class');
    expect(checkboxItem.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(checkboxItem);

    fireEvent.click(checkboxItem);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem
              checked
              asChild
              ref={ref}
              data-testid="checkbox-item"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>Checkbox item</article>
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const checkboxItem = screen.getByTestId('checkbox-item');
    expect(checkboxItem.tagName).toBe('ARTICLE');
    expect(checkboxItem).toHaveAttribute('role', 'menuitemcheckbox');
    expect(checkboxItem).toHaveAttribute('aria-checked', 'true');
    expect(checkboxItem).toHaveAttribute('data-state', 'checked');
    expect(checkboxItem).toHaveClass('custom-class');
    expect(checkboxItem.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(checkboxItem);

    fireEvent.click(checkboxItem);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('DropdownMenu.RadioGroup', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup
              value="one"
              ref={ref}
              data-testid="radio-group"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <DropdownMenu.RadioItem value="one">Radio item</DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const radioGroup = screen.getByTestId('radio-group');
    expect(radioGroup).toHaveClass('custom-class');
    expect(radioGroup.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(radioGroup);

    fireEvent.click(radioGroup);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup
              value="one"
              asChild
              ref={ref}
              data-testid="radio-group"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>
                <DropdownMenu.RadioItem value="one">Radio item</DropdownMenu.RadioItem>
              </article>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const radioGroup = screen.getByTestId('radio-group');
    expect(radioGroup.tagName).toBe('ARTICLE');
    expect(radioGroup).toHaveAttribute('role', 'group');
    expect(radioGroup).toHaveClass('custom-class');
    expect(radioGroup.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(radioGroup);

    fireEvent.click(radioGroup);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('DropdownMenu.RadioItem', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup value="one">
              <DropdownMenu.RadioItem
                value="one"
                ref={ref}
                data-testid="radio-item"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                Radio item
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const radioItem = screen.getByTestId('radio-item');
    expect(radioItem).toHaveClass('custom-class');
    expect(radioItem.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(radioItem);

    fireEvent.click(radioItem);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.RadioGroup value="one">
              <DropdownMenu.RadioItem
                value="one"
                asChild
                ref={ref}
                data-testid="radio-item"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>Radio item</article>
              </DropdownMenu.RadioItem>
            </DropdownMenu.RadioGroup>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const radioItem = screen.getByTestId('radio-item');
    expect(radioItem.tagName).toBe('ARTICLE');
    expect(radioItem).toHaveAttribute('role', 'menuitemradio');
    expect(radioItem).toHaveAttribute('aria-checked', 'true');
    expect(radioItem).toHaveClass('custom-class');
    expect(radioItem.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(radioItem);

    fireEvent.click(radioItem);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('DropdownMenu.ItemIndicator', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem checked>
              <DropdownMenu.ItemIndicator
                ref={ref}
                data-testid="item-indicator"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                Indicator
              </DropdownMenu.ItemIndicator>
              Checkbox item
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const itemIndicator = screen.getByTestId('item-indicator');
    expect(itemIndicator).toHaveClass('custom-class');
    expect(itemIndicator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(itemIndicator);

    fireEvent.click(itemIndicator);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.CheckboxItem checked>
              <DropdownMenu.ItemIndicator
                asChild
                ref={ref}
                data-testid="item-indicator"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>Indicator</article>
              </DropdownMenu.ItemIndicator>
              Checkbox item
            </DropdownMenu.CheckboxItem>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const itemIndicator = screen.getByTestId('item-indicator');
    expect(itemIndicator.tagName).toBe('ARTICLE');
    expect(itemIndicator).toHaveAttribute('data-state', 'checked');
    expect(itemIndicator).toHaveClass('custom-class');
    expect(itemIndicator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(itemIndicator);

    fireEvent.click(itemIndicator);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('DropdownMenu.Separator', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Separator
              ref={ref}
              data-testid="separator"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('custom-class');
    expect(separator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(separator);

    fireEvent.click(separator);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Separator
              asChild
              ref={ref}
              data-testid="separator"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article />
            </DropdownMenu.Separator>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const separator = screen.getByTestId('separator');
    expect(separator.tagName).toBe('ARTICLE');
    expect(separator).toHaveAttribute('role', 'separator');
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
    expect(separator).toHaveClass('custom-class');
    expect(separator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(separator);

    fireEvent.click(separator);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('DropdownMenu.Arrow', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<SVGSVGElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item</DropdownMenu.Item>
            <DropdownMenu.Arrow
              ref={ref}
              data-testid="arrow"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const arrow = screen.getByTestId('arrow');
    expect(arrow).toHaveClass('custom-class');
    expect(arrow.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(arrow);

    fireEvent.click(arrow);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<SVGSVGElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Item</DropdownMenu.Item>
            <DropdownMenu.Arrow
              asChild
              ref={ref}
              data-testid="arrow"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <svg />
            </DropdownMenu.Arrow>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const arrow = screen.getByTestId('arrow');
    // SVG elements report their tag name in lower case.
    expect(arrow.tagName).toBe('svg');
    expect(arrow).toHaveAttribute('viewBox', '0 0 30 10');
    expect(arrow).toHaveClass('custom-class');
    expect(arrow.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(arrow);

    fireEvent.click(arrow);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('DropdownMenu.SubTrigger', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger
                ref={ref}
                data-testid="sub-trigger"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                Sub trigger
              </DropdownMenu.SubTrigger>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const subTrigger = screen.getByTestId('sub-trigger');
    expect(subTrigger).toHaveClass('custom-class');
    expect(subTrigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(subTrigger);

    fireEvent.click(subTrigger);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger
                asChild
                ref={ref}
                data-testid="sub-trigger"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>Sub trigger</article>
              </DropdownMenu.SubTrigger>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const subTrigger = screen.getByTestId('sub-trigger');
    expect(subTrigger.tagName).toBe('ARTICLE');
    expect(subTrigger).toHaveAttribute('role', 'menuitem');
    expect(subTrigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(subTrigger).toHaveClass('custom-class');
    expect(subTrigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(subTrigger);

    fireEvent.click(subTrigger);
    expect(onClick).toHaveBeenCalled();
  });
});

// A submenu closes itself as soon as the parent content takes focus on mount, and the portal's
// `Presence` gates on the submenu's open state too, so `forceMount` on the portal is what keeps the
// sub content rendered.
describe('DropdownMenu.SubContent', () => {
  afterEach(cleanupModal);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>Sub trigger</DropdownMenu.SubTrigger>
              <DropdownMenu.Portal forceMount>
                <DropdownMenu.SubContent
                  ref={ref}
                  data-testid="sub-content"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  <DropdownMenu.Item>Sub item</DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const subContent = screen.getByTestId('sub-content');
    expect(subContent).toHaveClass('custom-class');
    expect(subContent.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(subContent);

    fireEvent.click(subContent);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <DropdownMenu.Root defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>Sub trigger</DropdownMenu.SubTrigger>
              <DropdownMenu.Portal forceMount>
                <DropdownMenu.SubContent
                  asChild
                  ref={ref}
                  data-testid="sub-content"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  <article>
                    <DropdownMenu.Item>Sub item</DropdownMenu.Item>
                  </article>
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>,
    );

    const subContent = screen.getByTestId('sub-content');
    expect(subContent.tagName).toBe('ARTICLE');
    expect(subContent).toHaveAttribute('role', 'menu');
    expect(subContent).toHaveClass('custom-class');
    expect(subContent.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(subContent);

    fireEvent.click(subContent);
    expect(onClick).toHaveBeenCalled();
  });
});

function cleanupModal() {
  cleanup();
  // Modal menus set this on the `body` and only restore it on close.
  document.body.style.pointerEvents = '';
}
