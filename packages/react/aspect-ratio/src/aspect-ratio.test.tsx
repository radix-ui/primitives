import * as React from 'react';
import { axe } from 'vitest-axe';
import type { RenderResult } from '@testing-library/react';
import { cleanup, render, fireEvent, screen } from '@testing-library/react';
import * as AspectRatio from './aspect-ratio';
import { afterEach, describe, it, beforeEach, expect, vi } from 'vitest';

const RATIO = 1 / 2;

describe('given a default Arrow', () => {
  let rendered: RenderResult;

  afterEach(cleanup);

  beforeEach(() => {
    rendered = render(
      <div style={{ width: 500 }}>
        <AspectRatio.Root ratio={RATIO}>
          <span>Hello</span>
        </AspectRatio.Root>
      </div>,
    );
  });

  it('should have no accessibility violations', async () => {
    expect(await axe(rendered.container)).toHaveNoViolations();
  });
});

describe('AspectRatio.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <AspectRatio.Root
        ref={ref}
        data-testid="aspect-ratio"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        Content
      </AspectRatio.Root>,
    );

    const aspectRatio = screen.getByTestId('aspect-ratio');
    expect(aspectRatio).toHaveClass('custom-class');
    expect(aspectRatio.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(aspectRatio.style.position).toBe('absolute');
    expect(ref.current).toBe(aspectRatio);

    fireEvent.click(aspectRatio);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <AspectRatio.Root
        asChild
        ref={ref}
        data-testid="aspect-ratio"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>Content</article>
      </AspectRatio.Root>,
    );

    const aspectRatio = screen.getByTestId('aspect-ratio');
    expect(aspectRatio.tagName).toBe('ARTICLE');
    expect(aspectRatio).toHaveClass('custom-class');
    expect(aspectRatio.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(aspectRatio.style.position).toBe('absolute');
    expect(ref.current).toBe(aspectRatio);

    expect(aspectRatio.parentElement).toHaveAttribute('data-radix-aspect-ratio-wrapper');
    fireEvent.click(aspectRatio);
    expect(onClick).toHaveBeenCalled();
  });
});
