import * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { SlotProvider } from '@radix-ui/react-slot';
import {
  unstable_mergeProps as mergeProps,
  type unstable_MergePropsFunction as MergePropsFunction,
} from '@radix-ui/react-slot/merge-props';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Primitive } from './primitive';

describe('Primitive.div', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Primitive.div
        ref={ref}
        data-testid="div"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        Div
      </Primitive.div>,
    );

    const div = screen.getByTestId('div');
    expect(div.tagName).toBe('DIV');
    expect(div).toHaveClass('custom-class');
    expect(div.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(div);

    fireEvent.click(div);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLDivElement>();
    const onClick = vi.fn();

    render(
      <Primitive.div
        asChild
        ref={ref}
        data-testid="div"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>Div</article>
      </Primitive.div>,
    );

    const div = screen.getByTestId('div');
    expect(div.tagName).toBe('ARTICLE');
    expect(div).toHaveClass('custom-class');
    expect(div.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(div);

    fireEvent.click(div);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Primitive.span', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Primitive.span
        ref={ref}
        data-testid="span"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        Span
      </Primitive.span>,
    );

    const span = screen.getByTestId('span');
    expect(span.tagName).toBe('SPAN');
    expect(span).toHaveClass('custom-class');
    expect(span.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(span);

    fireEvent.click(span);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLSpanElement>();
    const onClick = vi.fn();

    render(
      <Primitive.span
        asChild
        ref={ref}
        data-testid="span"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>Span</article>
      </Primitive.span>,
    );

    const span = screen.getByTestId('span');
    expect(span.tagName).toBe('ARTICLE');
    expect(span).toHaveClass('custom-class');
    expect(span.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(span);

    fireEvent.click(span);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Primitive.button', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Primitive.button
        type="button"
        ref={ref}
        data-testid="button"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        Button
      </Primitive.button>,
    );

    const button = screen.getByTestId('button');
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveClass('custom-class');
    expect(button.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(button);

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLButtonElement>();
    const onClick = vi.fn();

    render(
      <Primitive.button
        asChild
        ref={ref}
        data-testid="button"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <button type="button">Button</button>
      </Primitive.button>,
    );

    const button = screen.getByTestId('button');
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveClass('custom-class');
    expect(button.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(button);

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Primitive.a', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    const onClick = vi.fn();

    render(
      <Primitive.a
        ref={ref}
        data-testid="anchor"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        Link
      </Primitive.a>,
    );

    const anchor = screen.getByTestId('anchor');
    expect(anchor.tagName).toBe('A');
    expect(anchor).toHaveClass('custom-class');
    expect(anchor.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(anchor);

    fireEvent.click(anchor);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    const onClick = vi.fn();

    render(
      <Primitive.a
        asChild
        ref={ref}
        data-testid="anchor"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <article>Link</article>
      </Primitive.a>,
    );

    const anchor = screen.getByTestId('anchor');
    expect(anchor.tagName).toBe('ARTICLE');
    expect(anchor).toHaveClass('custom-class');
    expect(anchor.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(anchor);

    fireEvent.click(anchor);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Primitive.input', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<HTMLInputElement>();
    const onClick = vi.fn();

    render(
      <Primitive.input
        ref={ref}
        data-testid="input"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      />,
    );

    const input = screen.getByTestId('input');
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveClass('custom-class');
    expect(input.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(input);

    fireEvent.click(input);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<HTMLInputElement>();
    const onClick = vi.fn();

    render(
      <Primitive.input
        asChild
        ref={ref}
        data-testid="input"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <input />
      </Primitive.input>,
    );

    const input = screen.getByTestId('input');
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveClass('custom-class');
    expect(input.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(input);

    fireEvent.click(input);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Primitive.svg', () => {
  afterEach(cleanup);

  it('spreads props it does not consume onto the element it renders', () => {
    const ref = React.createRef<SVGSVGElement>();
    const onClick = vi.fn();

    render(
      <Primitive.svg
        ref={ref}
        data-testid="svg"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      />,
    );

    const svg = screen.getByTestId('svg');
    // SVG elements keep their lowercase tag name.
    expect(svg.tagName).toBe('svg');
    expect(svg).toHaveClass('custom-class');
    expect(svg.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(svg);

    fireEvent.click(svg);
    expect(onClick).toHaveBeenCalled();
  });

  it('forwards props to the child element when `asChild` is set', () => {
    const ref = React.createRef<SVGSVGElement>();
    const onClick = vi.fn();

    render(
      <Primitive.svg
        asChild
        ref={ref}
        data-testid="svg"
        className="custom-class"
        style={{ outlineColor: 'rgb(1, 2, 3)' }}
        onClick={onClick}
      >
        <svg />
      </Primitive.svg>,
    );

    const svg = screen.getByTestId('svg');
    expect(svg.tagName).toBe('svg');
    expect(svg).toHaveClass('custom-class');
    expect(svg.style.outlineColor).toBe('rgb(1, 2, 3)');
    expect(ref.current).toBe(svg);

    fireEvent.click(svg);
    expect(onClick).toHaveBeenCalled();
  });
});

describe('Primitive `asChild` with a custom mergeProps from SlotProvider', () => {
  afterEach(cleanup);

  const joinWithUnderscore: MergePropsFunction = (
    slotProps: Record<string, any>,
    childProps: Record<string, any>,
  ) => ({
    ...mergeProps(slotProps, childProps),
    className: [slotProps.className, childProps.className].filter(Boolean).join('__'),
    'data-merge-strategy': 'underscore',
  });

  it('uses the provided mergeProps when merging Primitive props onto the `asChild` element', () => {
    render(
      <SlotProvider unstableMergeProps={joinWithUnderscore}>
        <Primitive.button className="primitive" asChild>
          <a className="child" href="/">
            link
          </a>
        </Primitive.button>
      </SlotProvider>,
    );

    const link = screen.getByRole('link');
    expect(link.getAttribute('class')).toBe('primitive__child');
    expect(link.getAttribute('data-merge-strategy')).toBe('underscore');
  });

  it('applies to multiple, independently created Primitive slots in the same tree', () => {
    render(
      <SlotProvider unstableMergeProps={joinWithUnderscore}>
        <Primitive.div className="outer" asChild>
          <section className="child-outer">
            <Primitive.span className="inner" asChild>
              <em className="child-inner">hi</em>
            </Primitive.span>
          </section>
        </Primitive.div>
      </SlotProvider>,
    );

    expect(document.querySelector('section')?.getAttribute('class')).toBe('outer__child-outer');
    expect(document.querySelector('em')?.getAttribute('class')).toBe('inner__child-inner');
  });

  it('still composes handlers and refs through the custom strategy', () => {
    const order: string[] = [];
    const ref = vi.fn();
    render(
      <SlotProvider unstableMergeProps={joinWithUnderscore}>
        <Primitive.button asChild onClick={() => order.push('primitive')} ref={ref}>
          <button onClick={() => order.push('child')} type="button">
            hi
          </button>
        </Primitive.button>
      </SlotProvider>,
    );

    const button = screen.getByRole('button');
    expect(ref).toHaveBeenCalledWith(button);
    fireEvent.click(button);
    expect(order).toEqual(['child', 'primitive']);
  });

  it('uses the default strategy when no provider is present', () => {
    render(
      <Primitive.button className="primitive" asChild>
        <button className="child" type="button">
          hi
        </button>
      </Primitive.button>,
    );

    const button = screen.getByRole('button');
    expect(button.getAttribute('class')).toBe('primitive child');
    expect(button.getAttribute('data-merge-strategy')).toBeNull();
  });
});
