import * as React from 'react';
import { As, FunctionComponentWithAs, MemoExoticComponentWithAs } from './types';

/**
 * This is a convenience wrapper for React.memo to give us the typing we need to
 * properly support typing for the `as` prop.
 */
export function memo<Props, ComponentType extends As = 'div'>(
  Component: FunctionComponentWithAs<ComponentType, Props>,
  propsAreEqual?: (
    prevProps: Readonly<React.PropsWithChildren<Props>>,
    nextProps: Readonly<React.PropsWithChildren<Props>>
  ) => boolean
) {
  return React.memo(Component, propsAreEqual) as MemoExoticComponentWithAs<ComponentType, Props>;
}
