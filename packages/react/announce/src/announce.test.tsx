import * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Announce from './announce';

describe('Announce.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Announce.Root
        ref={ref}
        data-testid="announce"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        Message
      </Announce.Root>,
    );

    const announce = screen.getByTestId('announce');
    expect(announce).toHaveClass('custom-class');
    expect(announce.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(announce);

    fireEvent.click(announce);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Announce.Root
        asChild
        ref={ref}
        data-testid="announce"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>Message</article>
      </Announce.Root>,
    );

    const announce = screen.getByTestId('announce');
    expect(announce.tagName).toBe('ARTICLE');
    expect(announce).toHaveClass('custom-class');
    expect(announce.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(announce);

    fireEvent.click(announce);
    expect(onClick).toHaveBeenCalled();
  });
});
