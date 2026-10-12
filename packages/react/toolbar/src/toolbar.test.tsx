import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { cleanup, render, fireEvent, getByText, screen } from '@testing-library/react';
import * as Toolbar from './toolbar';
import { afterEach, describe, it, vi, expect } from 'vitest';

const component = (props: any) => {
  return render(
    <Toolbar.Root>
      <Toolbar.ToggleGroup type="single">
        <Toolbar.ToggleItem value="left" onClick={props.onClick}>
          Left
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
    </Toolbar.Root>,
  );
};

describe('given a default Toolbar', () => {
  afterEach(cleanup);
  it('Click event should be called just once', async () => {
    const spy = vi.fn();

    const rendered = component({
      onClick: spy,
    });

    fireEvent(
      getByText(rendered.container, 'Left'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(spy).toHaveBeenCalledTimes(1);
  });
});

// Regression tests for https://github.com/radix-ui/primitives/issues/3232
describe('keys from focusable descendants', () => {
  afterEach(cleanup);

  it('does not activate a ToolbarLink from Space typed into a portaled focusable descendant', () => {
    const onClick = vi.fn();
    render(
      <Toolbar.Root>
        <Toolbar.Link href="#" onClick={onClick}>
          Link
          {ReactDOM.createPortal(<input data-testid="input" defaultValue="" />, document.body)}
        </Toolbar.Link>
      </Toolbar.Root>,
    );
    const input = screen.getByTestId('input');
    input.focus();
    fireEvent.keyDown(input, { key: ' ' });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('still activates the ToolbarLink via Space when the link itself is focused', () => {
    const onClick = vi.fn();
    render(
      <Toolbar.Root>
        <Toolbar.Link href="#" onClick={onClick}>
          Link
        </Toolbar.Link>
      </Toolbar.Root>,
    );
    const link = screen.getByText('Link');
    link.focus();
    fireEvent.keyDown(link, { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe('Toolbar.Root', () => {
  afterEach(cleanup);
  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Toolbar.Root
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <Toolbar.Button>Button</Toolbar.Button>
      </Toolbar.Root>,
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
      <Toolbar.Root
        asChild
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>
          <Toolbar.Button>Button</Toolbar.Button>
        </article>
      </Toolbar.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.tagName).toBe('ARTICLE');
    expect(root).toHaveAttribute('role', 'toolbar');
    expect(root).toHaveAttribute('aria-orientation', 'horizontal');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Toolbar.Separator', () => {
  afterEach(cleanup);
  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Toolbar.Root>
        <Toolbar.Separator
          ref={ref}
          data-testid="separator"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        />
      </Toolbar.Root>,
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
      <Toolbar.Root>
        <Toolbar.Separator
          asChild
          ref={ref}
          data-testid="separator"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article />
        </Toolbar.Separator>
      </Toolbar.Root>,
    );

    const separator = screen.getByTestId('separator');
    expect(separator.tagName).toBe('ARTICLE');
    expect(separator).toHaveAttribute('role', 'separator');
    // A separator in a horizontal toolbar is itself vertical.
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
    expect(separator).toHaveClass('custom-class');
    expect(separator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(separator);

    fireEvent.click(separator);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Toolbar.Button', () => {
  afterEach(cleanup);
  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Toolbar.Root>
        <Toolbar.Button
          ref={ref}
          data-testid="button"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Button
        </Toolbar.Button>
      </Toolbar.Root>,
    );

    const button = screen.getByTestId('button');
    expect(button).toHaveClass('custom-class');
    expect(button.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(button);

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Toolbar.Root>
        <Toolbar.Button
          asChild
          ref={ref}
          data-testid="button"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <button type="button">Button</button>
        </Toolbar.Button>
      </Toolbar.Root>,
    );

    const button = screen.getByTestId('button');
    expect(button.tagName).toBe('BUTTON');
    // Contributed by the `RovingFocusGroup.Item` the button is rendered inside.
    expect(button).toHaveAttribute('data-orientation', 'horizontal');
    expect(button).toHaveClass('custom-class');
    expect(button.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(button);

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Toolbar.Link', () => {
  afterEach(cleanup);
  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    const onClick = vi.fn();

    render(
      <Toolbar.Root>
        <Toolbar.Link
          href="/"
          ref={ref}
          data-testid="link"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Link
        </Toolbar.Link>
      </Toolbar.Root>,
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
      <Toolbar.Root>
        <Toolbar.Link
          asChild
          ref={ref}
          data-testid="link"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <a href="/">Link</a>
        </Toolbar.Link>
      </Toolbar.Root>,
    );

    const link = screen.getByTestId('link');
    expect(link.tagName).toBe('A');
    // Contributed by the `RovingFocusGroup.Item` the link is rendered inside.
    expect(link).toHaveAttribute('data-orientation', 'horizontal');
    expect(link).toHaveClass('custom-class');
    expect(link.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(link);

    fireEvent.click(link);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Toolbar.ToggleGroup', () => {
  afterEach(cleanup);
  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Toolbar.Root>
        <Toolbar.ToggleGroup
          type="single"
          ref={ref}
          data-testid="toggle-group"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <Toolbar.ToggleItem value="one">Item</Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>
      </Toolbar.Root>,
    );

    const toggleGroup = screen.getByTestId('toggle-group');
    expect(toggleGroup).toHaveClass('custom-class');
    expect(toggleGroup.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(toggleGroup);

    fireEvent.click(toggleGroup);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Toolbar.Root>
        <Toolbar.ToggleGroup
          type="single"
          asChild
          ref={ref}
          data-testid="toggle-group"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article>
            <Toolbar.ToggleItem value="one">Item</Toolbar.ToggleItem>
          </article>
        </Toolbar.ToggleGroup>
      </Toolbar.Root>,
    );

    const toggleGroup = screen.getByTestId('toggle-group');
    expect(toggleGroup.tagName).toBe('ARTICLE');
    expect(toggleGroup).toHaveAttribute('role', 'radiogroup');
    expect(toggleGroup).toHaveAttribute('data-orientation', 'horizontal');
    expect(toggleGroup).toHaveClass('custom-class');
    expect(toggleGroup.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(toggleGroup);

    fireEvent.click(toggleGroup);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Toolbar.ToggleItem', () => {
  afterEach(cleanup);
  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Toolbar.Root>
        <Toolbar.ToggleGroup type="single">
          <Toolbar.ToggleItem
            value="one"
            ref={ref}
            data-testid="toggle-item"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Item
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>
      </Toolbar.Root>,
    );

    const toggleItem = screen.getByTestId('toggle-item');
    expect(toggleItem).toHaveClass('custom-class');
    expect(toggleItem.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(toggleItem);

    fireEvent.click(toggleItem);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Toolbar.Root>
        <Toolbar.ToggleGroup type="single">
          <Toolbar.ToggleItem
            value="one"
            asChild
            ref={ref}
            data-testid="toggle-item"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <button type="button">Item</button>
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>
      </Toolbar.Root>,
    );

    const toggleItem = screen.getByTestId('toggle-item');
    expect(toggleItem.tagName).toBe('BUTTON');
    expect(toggleItem).toHaveAttribute('role', 'radio');
    expect(toggleItem).toHaveAttribute('aria-checked', 'false');
    expect(toggleItem).toHaveAttribute('data-state', 'off');
    expect(toggleItem).toHaveClass('custom-class');
    expect(toggleItem.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(toggleItem);

    fireEvent.click(toggleItem);
    expect(onClick).toHaveBeenCalled();
  });
});
