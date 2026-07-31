import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as Tabs from './tabs';

// Regression test for https://github.com/radix-ui/primitives/issues/3600
describe('blur of focusable descendants when switching tabs', () => {
  afterEach(cleanup);

  const TabsWithInput = ({
    onInputBlur,
    ...props
  }: React.ComponentProps<typeof Tabs.Root> & { onInputBlur?: () => void }) => (
    <Tabs.Root defaultValue="one" {...props}>
      <Tabs.List>
        <Tabs.Trigger value="one">One</Tabs.Trigger>
        <Tabs.Trigger value="two">Two</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">
        <input data-testid="input" onBlur={onInputBlur} />
      </Tabs.Content>
      <Tabs.Content value="two">Two content</Tabs.Content>
    </Tabs.Root>
  );

  it('fires onBlur on an input inside the active tab when clicking another trigger', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<TabsWithInput onInputBlur={onBlur} />);

    const input = screen.getByTestId('input');
    input.focus();
    expect(input).toHaveFocus();

    await user.click(screen.getByText('Two'));

    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Two content')).toBeVisible();
  });

  it('still activates a tab on mousedown (before the click completes)', () => {
    const onValueChange = vi.fn();
    render(<TabsWithInput activationMode="manual" onValueChange={onValueChange} />);

    fireEvent.mouseDown(screen.getByText('Two'), { button: 0 });
    expect(onValueChange).toHaveBeenCalledWith('two');
  });
});

// Regression tests for https://github.com/radix-ui/primitives/issues/3232
describe('keys from focusable descendants', () => {
  afterEach(cleanup);

  const TabsWithPortaledInput = (props: React.ComponentProps<typeof Tabs.Root>) => (
    <Tabs.Root defaultValue="one" activationMode="manual" {...props}>
      <Tabs.List>
        <Tabs.Trigger value="one">One</Tabs.Trigger>
        <Tabs.Trigger value="two">
          Two
          {ReactDOM.createPortal(<input data-testid="input" defaultValue="" />, document.body)}
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">One content</Tabs.Content>
      <Tabs.Content value="two">Two content</Tabs.Content>
    </Tabs.Root>
  );

  it('does not activate a tab from Space/Enter typed into a portaled focusable descendant', () => {
    const onValueChange = vi.fn();
    render(<TabsWithPortaledInput onValueChange={onValueChange} />);
    const input = screen.getByTestId('input');
    input.focus();
    fireEvent.keyDown(input, { key: ' ' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('still activates the tab via Space/Enter when the trigger itself is focused', () => {
    const onValueChange = vi.fn();
    render(<TabsWithPortaledInput onValueChange={onValueChange} />);
    const trigger = screen.getByText('Two');
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('two');
  });
});

// Regression test for https://github.com/radix-ui/primitives/issues/2915
describe('keys from an editable descendant trigger', () => {
  afterEach(cleanup);

  const TabsWithEditableTriggers = (props: React.ComponentProps<typeof Tabs.Root>) => (
    <Tabs.Root defaultValue="one" activationMode="manual" {...props}>
      <Tabs.List>
        <Tabs.Trigger value="one" asChild>
          <div>
            <input data-testid="input-one" defaultValue="Foo" />
          </div>
        </Tabs.Trigger>
        <Tabs.Trigger value="two" asChild>
          <div>
            <input data-testid="input-two" defaultValue="Bar" />
          </div>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="one">One content</Tabs.Content>
      <Tabs.Content value="two">Two content</Tabs.Content>
    </Tabs.Root>
  );

  it('does not activate a tab from Space typed into a nested editable input', () => {
    const onValueChange = vi.fn();
    render(<TabsWithEditableTriggers onValueChange={onValueChange} />);
    const inputTwo = screen.getByTestId('input-two');
    inputTwo.focus();
    fireEvent.keyDown(inputTwo, { key: ' ' });
    fireEvent.keyDown(inputTwo, { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('Tabs.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Tabs.Root
        defaultValue="one"
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <Tabs.List />
      </Tabs.Root>,
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
      <Tabs.Root
        defaultValue="one"
        asChild
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>
          <Tabs.List />
        </article>
      </Tabs.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.tagName).toBe('ARTICLE');
    expect(root).toHaveAttribute('data-orientation', 'horizontal');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Tabs.List', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Tabs.Root defaultValue="one">
        <Tabs.List
          ref={ref}
          data-testid="list"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <Tabs.Trigger value="one">Trigger</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    );

    const list = screen.getByTestId('list');
    expect(list).toHaveClass('custom-class');
    expect(list.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(list);

    fireEvent.click(list);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Tabs.Root defaultValue="one">
        <Tabs.List
          asChild
          ref={ref}
          data-testid="list"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article>
            <Tabs.Trigger value="one">Trigger</Tabs.Trigger>
          </article>
        </Tabs.List>
      </Tabs.Root>,
    );

    const list = screen.getByTestId('list');
    expect(list.tagName).toBe('ARTICLE');
    expect(list).toHaveAttribute('role', 'tablist');
    expect(list).toHaveAttribute('aria-orientation', 'horizontal');
    expect(list).toHaveClass('custom-class');
    expect(list.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(list);

    fireEvent.click(list);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Tabs.Trigger', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Trigger
            value="one"
            ref={ref}
            data-testid="trigger"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            Trigger
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
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
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Trigger
            value="one"
            asChild
            ref={ref}
            data-testid="trigger"
            className="custom-class"
            style={{ outlineColor: 'rgb(1, 2, 3)' }}
            onClick={onClick}
          >
            <button type="button">Trigger</button>
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    );

    const trigger = screen.getByTestId('trigger');
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('role', 'tab');
    expect(trigger).toHaveAttribute('aria-selected', 'true');
    expect(trigger).toHaveAttribute('data-state', 'active');
    expect(trigger).toHaveClass('custom-class');
    expect(trigger.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(trigger);

    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Tabs.Content', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Tabs.Root defaultValue="one">
        <Tabs.Content
          value="one"
          ref={ref}
          data-testid="content"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          Content
        </Tabs.Content>
      </Tabs.Root>,
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
      <Tabs.Root defaultValue="one">
        <Tabs.Content
          value="one"
          asChild
          ref={ref}
          data-testid="content"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article>Content</article>
        </Tabs.Content>
      </Tabs.Root>,
    );

    const content = screen.getByTestId('content');
    expect(content.tagName).toBe('ARTICLE');
    expect(content).toHaveAttribute('role', 'tabpanel');
    expect(content).toHaveAttribute('data-state', 'active');
    expect(content).toHaveClass('custom-class');
    expect(content.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(content);

    fireEvent.click(content);
    expect(onClick).toHaveBeenCalled();
  });
});
