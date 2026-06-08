import * as React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { SlotProvider, mergeProps } from '@radix-ui/react-slot';
import type { MergePropsFunction } from '@radix-ui/react-slot';
import { Primitive } from './primitive';
import { afterEach, describe, it, expect, vi } from 'vitest';

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
      <SlotProvider mergeProps={joinWithUnderscore}>
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
      <SlotProvider mergeProps={joinWithUnderscore}>
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
      <SlotProvider mergeProps={joinWithUnderscore}>
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
