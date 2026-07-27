import * as React from 'react';
import { axe } from 'vitest-axe';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as ContextMenu from './context-menu';
import type { MockInstance } from 'vitest';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

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

afterEach(cleanup);

describe('rendering and opening', () => {
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
  afterEach(() => {
    document.body.style.pointerEvents = '';
  });

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
