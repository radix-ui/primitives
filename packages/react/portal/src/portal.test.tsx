import * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Portal from './portal';

describe('Portal.Root', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Portal.Root
        ref={ref}
        data-testid="portal"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        Portalled
      </Portal.Root>,
    );

    const portal = screen.getByTestId('portal');
    expect(portal.tagName).toBe('DIV');
    expect(portal.parentElement).toBe(document.body);
    expect(portal).toHaveClass('custom-class');
    expect(portal.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(portal);

    fireEvent.click(portal);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Portal.Root
        asChild
        ref={ref}
        data-testid="portal"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>Portalled</article>
      </Portal.Root>,
    );

    const portal = screen.getByTestId('portal');
    expect(portal.tagName).toBe('ARTICLE');
    expect(portal.parentElement).toBe(document.body);
    expect(portal).toHaveClass('custom-class');
    expect(portal.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(portal);

    fireEvent.click(portal);
    expect(onClick).toHaveBeenCalled();
  });

  it('spreads them onto the element it renders inside a given `container`', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();
    const container = document.createElement('section');
    document.body.append(container);

    render(
      <Portal.Root
        container={container}
        ref={ref}
        data-testid="portal"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        Portalled
      </Portal.Root>,
    );

    const portal = screen.getByTestId('portal');
    expect(portal.parentElement).toBe(container);
    expect(portal).toHaveClass('custom-class');
    expect(portal.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(portal);

    fireEvent.click(portal);
    expect(onClick).toHaveBeenCalled();

    container.remove();
  });
});
