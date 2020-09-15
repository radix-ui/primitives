import * as React from 'react';
import { ForwardRefWithAsRenderFunction, As, ForwardRefExoticComponentWithAs } from './types';

/**
 * This is a convenience wrapper for React.forwardRef to give us the typing we
 * need to properly support typing for the `as` prop.
 */
export function forwardRef<ComponentType extends As, Props = {}, StaticProps = {}>(
  render: ForwardRefWithAsRenderFunction<ComponentType, Props>
) {
  type ComponentWithStaticProps = StaticProps &
    ForwardRefExoticComponentWithAs<ComponentType, Props> & { displayName: string };
  return React.forwardRef(render) as ComponentWithStaticProps;
}
