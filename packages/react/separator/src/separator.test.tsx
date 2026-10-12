import * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Separator from './separator';

describe('Separator.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Separator.Root
        ref={ref}
        data-testid="separator"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      />,
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
      <Separator.Root
        asChild
        ref={ref}
        data-testid="separator"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article />
      </Separator.Root>,
    );

    const separator = screen.getByTestId('separator');
    expect(separator.tagName).toBe('ARTICLE');
    expect(separator).toHaveAttribute('role', 'separator');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    expect(separator).toHaveClass('custom-class');
    expect(separator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(separator);

    fireEvent.click(separator);
    expect(onClick).toHaveBeenCalled();
  });

  // `orientation` and `decorative` change which attributes the part owns, so the vertical decorative
  // variant gets its own slotted case.
  it('forwards props to the child element when `asChild` is set on a vertical decorative separator', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Separator.Root
        orientation="vertical"
        decorative
        asChild
        ref={ref}
        data-testid="separator"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article />
      </Separator.Root>,
    );

    const separator = screen.getByTestId('separator');
    expect(separator.tagName).toBe('ARTICLE');
    expect(separator).toHaveAttribute('role', 'none');
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
    expect(separator).toHaveClass('custom-class');
    expect(separator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(separator);

    fireEvent.click(separator);
    expect(onClick).toHaveBeenCalled();
  });
});
