import * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Label from './label';

describe('Label.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLLabelElement>();
    const onClick = vi.fn();

    render(
      <Label.Root
        ref={ref}
        data-testid="label"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        Label
      </Label.Root>,
    );

    const label = screen.getByTestId('label');
    expect(label).toHaveClass('custom-class');
    expect(label.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(label);

    fireEvent.click(label);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLLabelElement>();
    const onClick = vi.fn();

    render(
      <Label.Root
        asChild
        ref={ref}
        data-testid="label"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <span>Label</span>
      </Label.Root>,
    );

    const label = screen.getByTestId('label');
    expect(label.tagName).toBe('SPAN');
    expect(label).toHaveClass('custom-class');
    expect(label.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(label);

    fireEvent.click(label);
    expect(onClick).toHaveBeenCalled();
  });

  it('calls `onMouseDown` when the mousedown target is the label itself', () => {
    const onMouseDown = vi.fn();

    render(
      <Label.Root data-testid="label" onMouseDown={onMouseDown}>
        Label
      </Label.Root>,
    );

    fireEvent.mouseDown(screen.getByTestId('label'));
    expect(onMouseDown).toHaveBeenCalledTimes(1);
  });

  it('calls `onMouseDown` when the mousedown target is a nested input', () => {
    const onMouseDown = vi.fn();

    render(
      <Label.Root onMouseDown={onMouseDown}>
        Label
        <input data-testid="input" />
      </Label.Root>,
    );

    fireEvent.mouseDown(screen.getByTestId('input'));
    expect(onMouseDown).toHaveBeenCalledTimes(1);
  });

  it('calls `onMouseDown` when the mousedown target is a nested button', () => {
    const onMouseDown = vi.fn();

    render(
      <Label.Root onMouseDown={onMouseDown}>
        Label
        <button type="button" data-testid="button">
          Button
        </button>
      </Label.Root>,
    );

    fireEvent.mouseDown(screen.getByTestId('button'));
    expect(onMouseDown).toHaveBeenCalledTimes(1);
  });

  it('prevents text selection when double clicking the label itself', () => {
    render(<Label.Root data-testid="label">Label</Label.Root>);

    const notPrevented = fireEvent.mouseDown(screen.getByTestId('label'), { detail: 2 });
    expect(notPrevented).toBe(false);
  });

  it('does not prevent the default action when double clicking a nested input', () => {
    const onMouseDown = vi.fn();

    render(
      <Label.Root onMouseDown={onMouseDown}>
        Label
        <input data-testid="input" />
      </Label.Root>,
    );

    const notPrevented = fireEvent.mouseDown(screen.getByTestId('input'), { detail: 2 });
    expect(notPrevented).toBe(true);
    expect(onMouseDown).toHaveBeenCalledTimes(1);
  });

  it('does not prevent the default action when double clicking a nested button', () => {
    const onMouseDown = vi.fn();

    render(
      <Label.Root onMouseDown={onMouseDown}>
        Label
        <button type="button" data-testid="button">
          Button
        </button>
      </Label.Root>,
    );

    const notPrevented = fireEvent.mouseDown(screen.getByTestId('button'), { detail: 2 });
    expect(notPrevented).toBe(true);
    expect(onMouseDown).toHaveBeenCalledTimes(1);
  });
});
