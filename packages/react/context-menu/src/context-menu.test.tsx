import * as React from 'react';
import { axe } from 'vitest-axe';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as ContextMenu from './context-menu';
import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

const TRIGGER_TEXT = 'Right click here';
const ITEM_TEXT = 'Item';

function ContextMenuTest(props: React.ComponentProps<typeof ContextMenu.Root>) {
  return (
    <ContextMenu.Root {...props}>
      <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content>
          <ContextMenu.Item>{ITEM_TEXT}</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}

describe('rendering and opening', () => {
  afterEach(cleanup);

  it('keeps the content closed by default', () => {
    render(<ContextMenuTest />);
    expect(screen.getByText(TRIGGER_TEXT)).toHaveAttribute('data-state', 'closed');
    expect(screen.queryByText(ITEM_TEXT)).not.toBeInTheDocument();
  });

  it('opens the content on right click', async () => {
    render(<ContextMenuTest />);
    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));

    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
    expect(screen.getByText(ITEM_TEXT)).toBeVisible();
    expect(screen.getByText(TRIGGER_TEXT)).toHaveAttribute('data-state', 'open');
  });

  it('re-anchors the content when re-triggered in a new location while open', async () => {
    render(<ContextMenuTest />);
    const trigger = screen.getByText(TRIGGER_TEXT);

    fireEvent.contextMenu(trigger, { clientX: 10, clientY: 10 });
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    const wrapper = () =>
      document.querySelector('[data-radix-popper-content-wrapper]') as HTMLElement;
    await waitFor(() => expect(wrapper()).toBeTruthy());
    const initialTransform = wrapper().style.transform;

    // Right-click again in a different location while the menu is still open.
    fireEvent.contextMenu(trigger, { clientX: 200, clientY: 150 });

    expect(screen.getByRole('menu')).toBeInTheDocument();
    await waitFor(() => expect(wrapper().style.transform).not.toEqual(initialTransform));
  });

  it('closes the content when pressing escape', async () => {
    render(<ContextMenuTest />);
    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(screen.getByText(TRIGGER_TEXT)).toHaveAttribute('data-state', 'closed');
  });

  it('has no accessibility violations when open', async () => {
    const { container } = render(<ContextMenuTest />);
    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('disabled trigger', () => {
  afterEach(cleanup);

  it('does not open the menu on right click', () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger disabled>{TRIGGER_TEXT}</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content>
            <ContextMenu.Item>{ITEM_TEXT}</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>,
    );

    const trigger = screen.getByText(TRIGGER_TEXT);
    expect(trigger).toHaveAttribute('data-disabled', '');
    fireEvent.contextMenu(trigger);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});

describe('items', () => {
  afterEach(cleanup);

  it('calls `onSelect` and closes the menu when an item is selected', async () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content>
            <ContextMenu.Item onSelect={onSelect}>{ITEM_TEXT}</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>,
    );

    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
    await waitFor(() => expect(screen.getByText(ITEM_TEXT)).toBeVisible());

    fireEvent.click(screen.getByText(ITEM_TEXT));
    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('does not select a disabled item', async () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content>
            <ContextMenu.Item disabled onSelect={onSelect}>
              {ITEM_TEXT}
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>,
    );

    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
    const item = await screen.findByText(ITEM_TEXT);
    expect(item).toHaveAttribute('data-disabled', '');
    expect(item).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(item);
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('keeps the menu open when `onSelect` prevents default', async () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content>
            <ContextMenu.Item onSelect={(event) => event.preventDefault()}>
              Stay open
            </ContextMenu.Item>
            <ContextMenu.Item>Close me</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>,
    );

    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Stay open'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close me'));
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });
});

describe('groups and labels', () => {
  afterEach(cleanup);

  it('renders grouped items with a label', async () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content>
            <ContextMenu.Group>
              <ContextMenu.Label>Fruits</ContextMenu.Label>
              <ContextMenu.Item>Apple</ContextMenu.Item>
              <ContextMenu.Item>Banana</ContextMenu.Item>
            </ContextMenu.Group>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>,
    );

    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());

    const group = screen.getByRole('group');
    expect(group).toBeInTheDocument();
    expect(screen.getByText('Fruits')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });
});

describe('checkbox items', () => {
  afterEach(cleanup);

  it('toggles a checkbox item and reflects the checked state', async () => {
    function CheckboxTest() {
      const [checked, setChecked] = React.useState(false);
      return (
        <ContextMenu.Root>
          <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.CheckboxItem checked={checked} onCheckedChange={setChecked}>
                Bold
              </ContextMenu.CheckboxItem>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      );
    }

    render(<CheckboxTest />);
    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));

    const checkbox = await screen.findByRole('menuitemcheckbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(checkbox);
    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
    const updated = await screen.findByRole('menuitemcheckbox');
    expect(updated).toHaveAttribute('aria-checked', 'true');
  });

  it('marks a disabled checkbox item as disabled', async () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content>
            <ContextMenu.CheckboxItem disabled>Strikethrough</ContextMenu.CheckboxItem>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>,
    );

    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
    const checkbox = await screen.findByRole('menuitemcheckbox');
    expect(checkbox).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('radio items', () => {
  afterEach(cleanup);

  it('selects a radio item and calls `onValueChange`', async () => {
    const onValueChange = vi.fn();
    function RadioTest() {
      const [value, setValue] = React.useState('index.js');
      return (
        <ContextMenu.Root>
          <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.RadioGroup
                value={value}
                onValueChange={(next) => {
                  onValueChange(next);
                  setValue(next);
                }}
              >
                <ContextMenu.RadioItem value="README.md">README.md</ContextMenu.RadioItem>
                <ContextMenu.RadioItem value="index.js">index.js</ContextMenu.RadioItem>
              </ContextMenu.RadioGroup>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>
      );
    }

    render(<RadioTest />);
    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));

    const radios = await screen.findAllByRole('menuitemradio');
    expect(radios[0]).toHaveAttribute('aria-checked', 'false');
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(radios[0]!);
    expect(onValueChange).toHaveBeenCalledWith('README.md');

    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
    const updated = await screen.findAllByRole('menuitemradio');
    expect(updated[0]).toHaveAttribute('aria-checked', 'true');
    expect(updated[1]).toHaveAttribute('aria-checked', 'false');
  });
});

describe('submenus', () => {
  afterEach(cleanup);

  it('opens a submenu via keyboard', async () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content>
            <ContextMenu.Sub>
              <ContextMenu.SubTrigger>Bookmarks</ContextMenu.SubTrigger>
              <ContextMenu.Portal>
                <ContextMenu.SubContent>
                  <ContextMenu.Item>Inbox</ContextMenu.Item>
                </ContextMenu.SubContent>
              </ContextMenu.Portal>
            </ContextMenu.Sub>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>,
    );

    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
    const subTrigger = await screen.findByText('Bookmarks');
    expect(subTrigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(subTrigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.keyDown(subTrigger, { key: 'ArrowRight' });
    await waitFor(() => expect(screen.getByText('Inbox')).toBeVisible());
    expect(subTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('associates the sub trigger with its content via `aria-controls` only while open', async () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content>
            <ContextMenu.Sub>
              <ContextMenu.SubTrigger>Bookmarks</ContextMenu.SubTrigger>
              <ContextMenu.Portal>
                <ContextMenu.SubContent>
                  <ContextMenu.Item>Inbox</ContextMenu.Item>
                </ContextMenu.SubContent>
              </ContextMenu.Portal>
            </ContextMenu.Sub>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>,
    );

    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
    const subTrigger = await screen.findByText('Bookmarks');
    expect(subTrigger).not.toHaveAttribute('aria-controls');

    fireEvent.keyDown(subTrigger, { key: 'ArrowRight' });
    const subContent = await waitFor(() => screen.getByText('Inbox').closest('[role="menu"]')!);
    expect(subContent).toBeTruthy();
    expect((subContent as HTMLElement).id).toBeTruthy();
    expect(subTrigger).toHaveAttribute('aria-controls', (subContent as HTMLElement).id);
    expect(document.getElementById((subContent as HTMLElement).id)).toBe(subContent);
  });

  it('does not open a disabled submenu', async () => {
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger>{TRIGGER_TEXT}</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content>
            <ContextMenu.Sub>
              <ContextMenu.SubTrigger disabled>History</ContextMenu.SubTrigger>
              <ContextMenu.Portal>
                <ContextMenu.SubContent>
                  <ContextMenu.Item>Github</ContextMenu.Item>
                </ContextMenu.SubContent>
              </ContextMenu.Portal>
            </ContextMenu.Sub>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>,
    );

    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
    const subTrigger = await screen.findByText('History');
    expect(subTrigger).toHaveAttribute('data-disabled', '');

    fireEvent.keyDown(subTrigger, { key: 'ArrowRight' });
    expect(screen.queryByText('Github')).not.toBeInTheDocument();
  });
});

describe('modality', () => {
  afterEach(cleanupModal);

  it('disables pointer events on the body while a modal menu is open', async () => {
    render(<ContextMenuTest />);
    expect(document.body.style.pointerEvents).toBe('');

    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
    await waitFor(() => expect(document.body.style.pointerEvents).toBe('none'));

    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    await waitFor(() => expect(document.body.style.pointerEvents).toBe(''));
  });

  it('does not disable pointer events on the body for a non-modal menu', async () => {
    render(<ContextMenuTest modal={false} />);
    fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
    await waitFor(() => expect(screen.getByRole('menu')).toBeInTheDocument());
    expect(document.body.style.pointerEvents).toBe('');
  });
});

describe('controlled `open` state', () => {
  let consoleWarnMock: MockInstance;

  beforeEach(() => {
    consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    consoleWarnMock.mockRestore();
  });

  it('opens on right click and reflects the open state via `onOpenChange`', async () => {
    const onOpenChange = vi.fn();
    render(<ContextMenuTest onOpenChange={onOpenChange} />);

    const trigger = screen.getByText(TRIGGER_TEXT);
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(screen.queryByText(ITEM_TEXT)).not.toBeInTheDocument();

    fireEvent.contextMenu(trigger);

    await waitFor(() => expect(screen.getByText(ITEM_TEXT)).toBeVisible());
    expect(trigger).toHaveAttribute('data-state', 'open');
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('respects a controlled `open={false}` value and does not open on right click', async () => {
    const onOpenChange = vi.fn();
    render(<ContextMenuTest open={false} onOpenChange={onOpenChange} />);

    const trigger = screen.getByText(TRIGGER_TEXT);
    fireEvent.contextMenu(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(screen.queryByText(ITEM_TEXT)).not.toBeInTheDocument();
  });

  it('can be closed programmatically while controlled', async () => {
    function ControlledContextMenu() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(false)}>close</button>
          <ContextMenuTest open={open} onOpenChange={setOpen} />
        </>
      );
    }

    render(<ControlledContextMenu />);
    const trigger = screen.getByText(TRIGGER_TEXT);

    fireEvent.contextMenu(trigger);
    await waitFor(() => expect(screen.getByText(ITEM_TEXT)).toBeVisible());

    fireEvent.click(screen.getByText('close'));
    await waitFor(() => expect(screen.queryByText(ITEM_TEXT)).not.toBeInTheDocument());
    expect(trigger).toHaveAttribute('data-state', 'closed');
  });

  it('calls `onOpenChange` with `false` when dismissed via Escape', async () => {
    const onOpenChange = vi.fn();
    function ControlledContextMenu() {
      const [open, setOpen] = React.useState(false);
      return (
        <ContextMenuTest
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        />
      );
    }

    render(<ControlledContextMenu />);
    const trigger = screen.getByText(TRIGGER_TEXT);

    fireEvent.contextMenu(trigger);
    await waitFor(() => expect(screen.getByText(ITEM_TEXT)).toBeVisible());
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByText(ITEM_TEXT)).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  describe('dev warning when opened before interaction', () => {
    it('warns when `open` is `true` before the user has interacted with the trigger', () => {
      render(<ContextMenuTest open={true} />);
      expect(consoleWarnMock).toHaveBeenCalledTimes(1);
      expect(consoleWarnMock.mock.calls[0]![0]).toEqual(
        expect.stringContaining('The `open` prop has been set to `true`'),
      );
    });

    it('does not warn for an uncontrolled menu', () => {
      render(<ContextMenuTest />);
      fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
      expect(consoleWarnMock).not.toHaveBeenCalled();
    });

    it('does not warn when the menu is opened through user interaction', async () => {
      function ControlledContextMenu() {
        const [open, setOpen] = React.useState(false);
        return <ContextMenuTest open={open} onOpenChange={setOpen} />;
      }

      render(<ControlledContextMenu />);
      fireEvent.contextMenu(screen.getByText(TRIGGER_TEXT));
      await waitFor(() => expect(screen.getByText(ITEM_TEXT)).toBeVisible());
      expect(consoleWarnMock).not.toHaveBeenCalled();
    });
  });
});

describe('prop spreading', () => {
  // `ContextMenu` has no `defaultOpen`, so the controlled `open` prop is the
  // only way to render the content declaratively. It warns because the trigger
  // has not been right-clicked, which leaves the menu's position indeterminate.
  // This is irrelevant for testing.
  let consoleWarnMock: MockInstance;

  beforeAll(() => {
    consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleWarnMock.mockRestore();
  });

  afterEach(cleanupModal);

  describe('ContextMenu.Trigger', () => {
    it('spreads props it does not consume onto the element it renders', () => {
      const ref = React.createRef<HTMLSpanElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root>
          <ContextMenu.Trigger
            ref={ref}
            data-testid="trigger"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Right click here
          </ContextMenu.Trigger>
        </ContextMenu.Root>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveClass('custom-class');
      expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
      expect(ref.current).toBe(trigger);

      fireEvent.click(trigger);
      expect(onClick).toHaveBeenCalled();
    });

    it('forwards props to the child element when `asChild` is set', () => {
      const ref = React.createRef<HTMLSpanElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root>
          <ContextMenu.Trigger
            asChild
            ref={ref}
            data-testid="trigger"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <article>Right click here</article>
          </ContextMenu.Trigger>
        </ContextMenu.Root>,
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger.tagName).toBe('ARTICLE');
      expect(trigger).toHaveAttribute('data-state', 'closed');
      expect(trigger).toHaveClass('custom-class');
      // The trigger sets `WebkitTouchCallout` itself, so this also shows the two are merged.
      expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
      expect(ref.current).toBe(trigger);

      fireEvent.click(trigger);
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('ContextMenu.Content', () => {
    it('spreads props it does not consume onto the element it renders', () => {
      const ref = React.createRef<HTMLDivElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content
              ref={ref}
              data-testid="content"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <ContextMenu.Item>Item</ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content
              asChild
              ref={ref}
              data-testid="content"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>
                <ContextMenu.Item>Item</ContextMenu.Item>
              </article>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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

    it('forwards props to the child element when `asChild` is set on a non-modal menu', () => {
      const ref = React.createRef<HTMLDivElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root open modal={false}>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content
              asChild
              ref={ref}
              data-testid="content"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>
                <ContextMenu.Item>Item</ContextMenu.Item>
              </article>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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

  describe('ContextMenu.Group', () => {
    it('spreads props it does not consume onto the element it renders', () => {
      const ref = React.createRef<HTMLDivElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Group
                ref={ref}
                data-testid="group"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <ContextMenu.Item>Item</ContextMenu.Item>
              </ContextMenu.Group>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Group
                asChild
                ref={ref}
                data-testid="group"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>
                  <ContextMenu.Item>Item</ContextMenu.Item>
                </article>
              </ContextMenu.Group>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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

  describe('ContextMenu.Label', () => {
    it('spreads props it does not consume onto the element it renders', () => {
      const ref = React.createRef<HTMLDivElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Label
                ref={ref}
                data-testid="label"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                Label
              </ContextMenu.Label>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Label
                asChild
                ref={ref}
                data-testid="label"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>Label</article>
              </ContextMenu.Label>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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

  describe('ContextMenu.Item', () => {
    it('spreads props it does not consume onto the element it renders', () => {
      const ref = React.createRef<HTMLDivElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Item
                ref={ref}
                data-testid="item"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                Item
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Item
                asChild
                ref={ref}
                data-testid="item"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>Item</article>
              </ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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

  describe('ContextMenu.CheckboxItem', () => {
    it('spreads props it does not consume onto the element it renders', () => {
      const ref = React.createRef<HTMLDivElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.CheckboxItem
                checked
                ref={ref}
                data-testid="checkbox-item"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                Checkbox item
              </ContextMenu.CheckboxItem>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.CheckboxItem
                checked
                asChild
                ref={ref}
                data-testid="checkbox-item"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>Checkbox item</article>
              </ContextMenu.CheckboxItem>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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

  describe('ContextMenu.RadioGroup', () => {
    it('spreads props it does not consume onto the element it renders', () => {
      const ref = React.createRef<HTMLDivElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.RadioGroup
                value="one"
                ref={ref}
                data-testid="radio-group"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <ContextMenu.RadioItem value="one">Radio item</ContextMenu.RadioItem>
              </ContextMenu.RadioGroup>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.RadioGroup
                value="one"
                asChild
                ref={ref}
                data-testid="radio-group"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>
                  <ContextMenu.RadioItem value="one">Radio item</ContextMenu.RadioItem>
                </article>
              </ContextMenu.RadioGroup>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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

  describe('ContextMenu.RadioItem', () => {
    it('spreads props it does not consume onto the element it renders', () => {
      const ref = React.createRef<HTMLDivElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.RadioGroup value="one">
                <ContextMenu.RadioItem
                  value="one"
                  ref={ref}
                  data-testid="radio-item"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  Radio item
                </ContextMenu.RadioItem>
              </ContextMenu.RadioGroup>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.RadioGroup value="one">
                <ContextMenu.RadioItem
                  value="one"
                  asChild
                  ref={ref}
                  data-testid="radio-item"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  <article>Radio item</article>
                </ContextMenu.RadioItem>
              </ContextMenu.RadioGroup>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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

  describe('ContextMenu.ItemIndicator', () => {
    it('spreads props it does not consume onto the element it renders', () => {
      const ref = React.createRef<HTMLSpanElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.CheckboxItem checked>
                <ContextMenu.ItemIndicator
                  ref={ref}
                  data-testid="item-indicator"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  Indicator
                </ContextMenu.ItemIndicator>
                Checkbox item
              </ContextMenu.CheckboxItem>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.CheckboxItem checked>
                <ContextMenu.ItemIndicator
                  asChild
                  ref={ref}
                  data-testid="item-indicator"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  <article>Indicator</article>
                </ContextMenu.ItemIndicator>
                Checkbox item
              </ContextMenu.CheckboxItem>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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

  describe('ContextMenu.Separator', () => {
    it('spreads props it does not consume onto the element it renders', () => {
      const ref = React.createRef<HTMLDivElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Separator
                ref={ref}
                data-testid="separator"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              />
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Separator
                asChild
                ref={ref}
                data-testid="separator"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article />
              </ContextMenu.Separator>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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

  describe('ContextMenu.Arrow', () => {
    it('spreads props it does not consume onto the element it renders', () => {
      const ref = React.createRef<SVGSVGElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Item>Item</ContextMenu.Item>
              <ContextMenu.Arrow
                ref={ref}
                data-testid="arrow"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              />
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Item>Item</ContextMenu.Item>
              <ContextMenu.Arrow
                asChild
                ref={ref}
                data-testid="arrow"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <svg />
              </ContextMenu.Arrow>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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

  describe('ContextMenu.SubTrigger', () => {
    it('spreads props it does not consume onto the element it renders', () => {
      const ref = React.createRef<HTMLDivElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger
                  ref={ref}
                  data-testid="sub-trigger"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  Sub trigger
                </ContextMenu.SubTrigger>
              </ContextMenu.Sub>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger
                  asChild
                  ref={ref}
                  data-testid="sub-trigger"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  <article>Sub trigger</article>
                </ContextMenu.SubTrigger>
              </ContextMenu.Sub>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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

  describe('ContextMenu.SubContent', () => {
    // A submenu closes itself as soon as the parent content takes focus on
    // mount, and the portal's `Presence` gates on the submenu's open state.
    // `forceMount` on the portal is what keeps the sub content rendered so we
    // can test it.
    const FORCE_MOUNT_PORTAL = true;

    it('spreads props it does not consume onto the element it renders', () => {
      const ref = React.createRef<HTMLDivElement>();
      const onClick = vi.fn();

      render(
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger>Sub trigger</ContextMenu.SubTrigger>
                <ContextMenu.Portal forceMount={FORCE_MOUNT_PORTAL}>
                  <ContextMenu.SubContent
                    ref={ref}
                    data-testid="sub-content"
                    className="custom-class"
                    style={{ outlineColor: 'rgb(1, 2, 3)' }}
                    onClick={onClick}
                  >
                    <ContextMenu.Item>Sub item</ContextMenu.Item>
                  </ContextMenu.SubContent>
                </ContextMenu.Portal>
              </ContextMenu.Sub>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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
        <ContextMenu.Root open>
          <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content>
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger>Sub trigger</ContextMenu.SubTrigger>
                <ContextMenu.Portal forceMount={FORCE_MOUNT_PORTAL}>
                  <ContextMenu.SubContent
                    asChild
                    ref={ref}
                    data-testid="sub-content"
                    className="custom-class"
                    style={{ outlineColor: 'rgb(1, 2, 3)' }}
                    onClick={onClick}
                  >
                    <article>
                      <ContextMenu.Item>Sub item</ContextMenu.Item>
                    </article>
                  </ContextMenu.SubContent>
                </ContextMenu.Portal>
              </ContextMenu.Sub>
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
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
});

function cleanupModal() {
  cleanup();
  // Modal menus set this on the `body` and only restore it on close.
  document.body.style.pointerEvents = '';
}
