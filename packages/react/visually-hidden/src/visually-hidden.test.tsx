import * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as VisuallyHidden from './visually-hidden';

describe('VisuallyHidden.Root', () => {
  afterEach(cleanup);
  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <VisuallyHidden.Root
        ref={ref}
        data-testid="visually-hidden"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        Hidden
      </VisuallyHidden.Root>,
    );

    const visuallyHidden = screen.getByTestId('visually-hidden');
    expect(visuallyHidden).toHaveClass('custom-class');
    expect(visuallyHidden.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(visuallyHidden.style.position).toBe('absolute');
    expect(visuallyHidden.style.overflow).toBe('hidden');
    expect(ref.current).toBe(visuallyHidden);

    fireEvent.click(visuallyHidden);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <VisuallyHidden.Root
        asChild
        ref={ref}
        data-testid="visually-hidden"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>Hidden</article>
      </VisuallyHidden.Root>,
    );

    const visuallyHidden = screen.getByTestId('visually-hidden');
    expect(visuallyHidden.tagName).toBe('ARTICLE');
    expect(visuallyHidden).toHaveClass('custom-class');
    expect(visuallyHidden.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(visuallyHidden.style.position).toBe('absolute');
    expect(visuallyHidden.style.overflow).toBe('hidden');
    expect(ref.current).toBe(visuallyHidden);

    fireEvent.click(visuallyHidden);
    expect(onClick).toHaveBeenCalled();
  });
});
