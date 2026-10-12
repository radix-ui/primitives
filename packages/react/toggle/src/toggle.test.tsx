import * as React from 'react';
import type { RenderResult } from '@testing-library/react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as Toggle from './toggle';
import { axe } from 'vitest-axe';
import { afterEach, describe, it, beforeEach, vi, expect } from 'vitest';

const TEXT_CHILD = 'Like';

describe('given a Toggle with text', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<Toggle.Root>{TEXT_CHILD}</Toggle.Root>);
  });

  afterEach(cleanup);

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });

  it('should render with attributes as false/off by default', () => {
    const button = rendered.getByRole('button', { name: TEXT_CHILD });

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('data-state', 'off');
  });

  it('Click event should change pressed attributes to true/on', () => {
    const button = rendered.getByRole('button', { name: TEXT_CHILD });

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-state', 'on');
  });
});

describe('given a Toggle with text and defaultPressed="true"', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<Toggle.Root defaultPressed>{TEXT_CHILD}</Toggle.Root>);
  });

  afterEach(cleanup);

  it('should render with attributes true/on by default', () => {
    const button = rendered.getByRole('button', { name: TEXT_CHILD });

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-state', 'on');
  });

  it('Click event should change attributes back to off/false', () => {
    const button = rendered.getByRole('button', { name: TEXT_CHILD });

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('data-state', 'off');
  });
});

describe('given a Toggle with text and disabled="true"', () => {
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<Toggle.Root disabled>{TEXT_CHILD}</Toggle.Root>);
  });

  afterEach(cleanup);

  it('on click the attributes do not change', () => {
    const button = rendered.getByRole('button', { name: TEXT_CHILD });

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('data-state', 'off');
    expect(button).toHaveAttribute('disabled', '');

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('data-state', 'off');
  });
});

describe('given a controlled Toggle (with pressed and onPressedChange)', () => {
  let rendered: RenderResult;
  const onPressedChangeMock = vi.fn();

  beforeEach(() => {
    rendered = render(
      <Toggle.Root pressed onPressedChange={onPressedChangeMock}>
        {TEXT_CHILD}
      </Toggle.Root>,
    );
  });

  afterEach(cleanup);

  it('Click event should keep the same attributes, and pass the new state to onPressedChange', () => {
    const button = rendered.getByRole('button', { name: TEXT_CHILD });

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-state', 'on');

    fireEvent(
      button,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(onPressedChangeMock).toHaveBeenCalledTimes(1);
    expect(onPressedChangeMock).toHaveBeenCalledWith(false);

    // The attributes do not change, they keep the same
    // because it's a controlled component.
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-state', 'on');
  });
});
describe('Toggle.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Toggle.Root
        defaultPressed
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        Toggle
      </Toggle.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    // Composed with the toggle's own click handler rather than replaced by it.
    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Toggle.Root
        defaultPressed
        asChild
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <button type="button">Toggle</button>
      </Toggle.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.tagName).toBe('BUTTON');
    expect(root).toHaveAttribute('aria-pressed', 'true');
    expect(root).toHaveAttribute('data-state', 'on');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });
});
