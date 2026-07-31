import * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Progress from './progress';

describe('Progress.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Progress.Root
        value={50}
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <Progress.Indicator />
      </Progress.Root>,
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
      <Progress.Root
        value={50}
        asChild
        ref={ref}
        data-testid="root"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>
          <Progress.Indicator />
        </article>
      </Progress.Root>,
    );

    const root = screen.getByTestId('root');
    expect(root.tagName).toBe('ARTICLE');
    expect(root).toHaveAttribute('role', 'progressbar');
    expect(root).toHaveAttribute('aria-valuenow', '50');
    expect(root).toHaveAttribute('data-state', 'loading');
    expect(root).toHaveClass('custom-class');
    expect(root.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(root);

    fireEvent.click(root);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Progress.Indicator', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Progress.Root value={50}>
        <Progress.Indicator
          ref={ref}
          data-testid="indicator"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        />
      </Progress.Root>,
    );

    const indicator = screen.getByTestId('indicator');
    expect(indicator).toHaveClass('custom-class');
    expect(indicator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(indicator);

    fireEvent.click(indicator);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Progress.Root value={50}>
        <Progress.Indicator
          asChild
          ref={ref}
          data-testid="indicator"
          className="custom-class"
          style={{ outlineColor: 'rgb(1, 2, 3)' }}
          onClick={onClick}
        >
          <article />
        </Progress.Indicator>
      </Progress.Root>,
    );

    const indicator = screen.getByTestId('indicator');
    expect(indicator.tagName).toBe('ARTICLE');
    expect(indicator).toHaveAttribute('data-state', 'loading');
    expect(indicator).toHaveAttribute('data-value', '50');
    expect(indicator).toHaveClass('custom-class');
    expect(indicator.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(indicator);

    fireEvent.click(indicator);
    expect(onClick).toHaveBeenCalled();
  });
});
