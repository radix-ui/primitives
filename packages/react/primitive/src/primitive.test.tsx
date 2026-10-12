import * as React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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
