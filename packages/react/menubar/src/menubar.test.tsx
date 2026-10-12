import * as React from 'react';
import { cleanup, render, screen, waitFor, fireEvent } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import * as Menubar from './menubar';

const TRIGGER_TEXT = 'File';
const ITEM_TEXT = 'New';

const MenubarTest = (props: React.ComponentProps<typeof Menubar.Root>) => (
  <Menubar.Root {...props}>
    <Menubar.Menu value="file">
      <Menubar.Trigger>{TRIGGER_TEXT}</Menubar.Trigger>
      <Menubar.Portal>
        <Menubar.Content>
          <Menubar.Item>{ITEM_TEXT}</Menubar.Item>
        </Menubar.Content>
      </Menubar.Portal>
    </Menubar.Menu>
  </Menubar.Root>
);

describe('aria-controls', () => {
  afterEach(cleanup);

  it('should not reference a non-existent element while closed', () => {
    render(<MenubarTest />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
  });

  it('should reference the rendered content while open', async () => {
    render(<MenubarTest defaultValue="file" />);
    const trigger = screen.getByText(TRIGGER_TEXT);
    const content = await waitFor(() => screen.getByRole('menu'));

    expect(content.id).toBeTruthy();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', content.id);
    expect(document.getElementById(content.id)).toBe(content);
  });
});

describe('Menubar.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
        </Menubar.Menu>
      </Menubar.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root
        asChild
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>
          <Menubar.Menu value="file">
            <Menubar.Trigger>File</Menubar.Trigger>
          </Menubar.Menu>
        </article>
      </Menubar.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.tagName).toBe('ARTICLE');
    expect(root).toHaveAttribute('role', 'menubar');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Menubar.Trigger', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root>
        <Menubar.Menu value="file">
          <Menubar.Trigger
            ref={ref}
            data-testid="trigger"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            File
          </Menubar.Trigger>
        </Menubar.Menu>
      </Menubar.Root>,
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
      <Menubar.Root>
        <Menubar.Menu value="file">
          <Menubar.Trigger
            asChild
            ref={ref}
            data-testid="trigger"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <button type="button">File</button>
          </Menubar.Trigger>
        </Menubar.Menu>
      </Menubar.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('role', 'menuitem');
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Menubar.Content', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content
              ref={ref}
              data-testid="content"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <Menubar.Item>New</Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content
              asChild
              ref={ref}
              data-testid="content"
              className="custom-class"
              style={{ outlineColor: 'rgb(1, 2, 3)' }}
              onClick={onClick}
            >
              <article>
                <Menubar.Item>New</Menubar.Item>
              </article>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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

describe('Menubar.Group', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.Group
                ref={ref}
                data-testid="group"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <Menubar.Item>New</Menubar.Item>
              </Menubar.Group>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.Group
                asChild
                ref={ref}
                data-testid="group"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>
                  <Menubar.Item>New</Menubar.Item>
                </article>
              </Menubar.Group>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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

describe('Menubar.Label', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.Label
                ref={ref}
                data-testid="label"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                Label
              </Menubar.Label>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.Label
                asChild
                ref={ref}
                data-testid="label"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>Label</article>
              </Menubar.Label>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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

describe('Menubar.Item', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.Item
                ref={ref}
                data-testid="item"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                New
              </Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.Item
                asChild
                ref={ref}
                data-testid="item"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>New</article>
              </Menubar.Item>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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

describe('Menubar.CheckboxItem', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.CheckboxItem
                checked
                ref={ref}
                data-testid="checkbox-item"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                Checkbox item
              </Menubar.CheckboxItem>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.CheckboxItem
                checked
                asChild
                ref={ref}
                data-testid="checkbox-item"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>Checkbox item</article>
              </Menubar.CheckboxItem>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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

describe('Menubar.RadioGroup', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.RadioGroup
                value="one"
                ref={ref}
                data-testid="radio-group"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <Menubar.RadioItem value="one">Radio item</Menubar.RadioItem>
              </Menubar.RadioGroup>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.RadioGroup
                value="one"
                asChild
                ref={ref}
                data-testid="radio-group"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article>
                  <Menubar.RadioItem value="one">Radio item</Menubar.RadioItem>
                </article>
              </Menubar.RadioGroup>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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

describe('Menubar.RadioItem', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.RadioGroup value="one">
                <Menubar.RadioItem
                  value="one"
                  ref={ref}
                  data-testid="radio-item"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  Radio item
                </Menubar.RadioItem>
              </Menubar.RadioGroup>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.RadioGroup value="one">
                <Menubar.RadioItem
                  value="one"
                  asChild
                  ref={ref}
                  data-testid="radio-item"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  <article>Radio item</article>
                </Menubar.RadioItem>
              </Menubar.RadioGroup>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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

describe('Menubar.ItemIndicator', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.CheckboxItem checked>
                <Menubar.ItemIndicator
                  ref={ref}
                  data-testid="item-indicator"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  Indicator
                </Menubar.ItemIndicator>
                Checkbox item
              </Menubar.CheckboxItem>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.CheckboxItem checked>
                <Menubar.ItemIndicator
                  asChild
                  ref={ref}
                  data-testid="item-indicator"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  <article>Indicator</article>
                </Menubar.ItemIndicator>
                Checkbox item
              </Menubar.CheckboxItem>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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

describe('Menubar.Separator', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.Separator
                ref={ref}
                data-testid="separator"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              />
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.Separator
                asChild
                ref={ref}
                data-testid="separator"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <article />
              </Menubar.Separator>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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

describe('Menubar.Arrow', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<SVGSVGElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.Item>New</Menubar.Item>
              <Menubar.Arrow
                ref={ref}
                data-testid="arrow"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              />
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.Item>New</Menubar.Item>
              <Menubar.Arrow
                asChild
                ref={ref}
                data-testid="arrow"
                className="custom-class"
                style={{ outlineColor: 'rgb(1, 2, 3)' }}
                onClick={onClick}
              >
                <svg />
              </Menubar.Arrow>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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

describe('Menubar.SubTrigger', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.Sub>
                <Menubar.SubTrigger
                  ref={ref}
                  data-testid="sub-trigger"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  Sub trigger
                </Menubar.SubTrigger>
              </Menubar.Sub>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.Sub>
                <Menubar.SubTrigger
                  asChild
                  ref={ref}
                  data-testid="sub-trigger"
                  className="custom-class"
                  style={{ outlineColor: 'rgb(1, 2, 3)' }}
                  onClick={onClick}
                >
                  <article>Sub trigger</article>
                </Menubar.SubTrigger>
              </Menubar.Sub>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
    );

    const subTrigger = screen.getByTestId('sub-trigger');
    expect(subTrigger.tagName).toBe('ARTICLE');
    expect(subTrigger).toHaveAttribute('role', 'menuitem');
    expect(subTrigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(subTrigger).toHaveAttribute('data-radix-menubar-subtrigger', '');
    expect(subTrigger).toHaveClass('custom-class');
    expect(subTrigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(subTrigger);

    fireEvent.click(subTrigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Menubar.SubContent', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.Sub>
                <Menubar.SubTrigger>Sub trigger</Menubar.SubTrigger>
                <Menubar.Portal forceMount>
                  <Menubar.SubContent
                    ref={ref}
                    data-testid="sub-content"
                    className="custom-class"
                    style={{ outlineColor: 'rgb(1, 2, 3)' }}
                    onClick={onClick}
                  >
                    <Menubar.Item>Sub item</Menubar.Item>
                  </Menubar.SubContent>
                </Menubar.Portal>
              </Menubar.Sub>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
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
      <Menubar.Root defaultValue="file">
        <Menubar.Menu value="file">
          <Menubar.Trigger>File</Menubar.Trigger>
          <Menubar.Portal>
            <Menubar.Content>
              <Menubar.Sub>
                <Menubar.SubTrigger>Sub trigger</Menubar.SubTrigger>
                <Menubar.Portal forceMount>
                  <Menubar.SubContent
                    asChild
                    ref={ref}
                    data-testid="sub-content"
                    className="custom-class"
                    style={{ outlineColor: 'rgb(1, 2, 3)' }}
                    onClick={onClick}
                  >
                    <article>
                      <Menubar.Item>Sub item</Menubar.Item>
                    </article>
                  </Menubar.SubContent>
                </Menubar.Portal>
              </Menubar.Sub>
            </Menubar.Content>
          </Menubar.Portal>
        </Menubar.Menu>
      </Menubar.Root>,
    );

    const subContent = screen.getByTestId('sub-content');
    expect(subContent.tagName).toBe('ARTICLE');
    expect(subContent).toHaveAttribute('role', 'menu');
    expect(subContent).toHaveAttribute('data-radix-menubar-content', '');
    expect(subContent).toHaveClass('custom-class');
    expect(subContent.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(subContent);

    fireEvent.click(subContent);
    expect(onClick).toHaveBeenCalled();
  });
});
