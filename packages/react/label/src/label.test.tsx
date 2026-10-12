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
});
