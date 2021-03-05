import * as React from 'react';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

const NAME = 'Arrow';
const DEFAULT_TAG = 'svg';

type ArrowOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type ArrowPrimitive = Polymorphic.ForwardRefComponent<typeof DEFAULT_TAG, ArrowOwnProps>;

/**
 * We pass `ArrowImpl` in the `as` prop so that the whole svg
 * is replaced when consumer passes an `as` prop
 */
const Arrow = React.forwardRef((props, forwardedRef) => {
  const { as = ArrowImpl, ...arrowProps } = props;
  return <Primitive {...arrowProps} as={as} ref={forwardedRef} />;
}) as ArrowPrimitive;

const ArrowImpl = React.forwardRef<SVGSVGElement, React.ComponentProps<typeof DEFAULT_TAG>>(
  (props, forwardedRef) => {
    const { width = 10, height = 5, ...arrowProps } = props;
    return (
      <svg
        {...arrowProps}
        ref={forwardedRef}
        width={width}
        height={height}
        viewBox="0 0 30 10"
        preserveAspectRatio="none"
      >
        <polygon points="0,0 30,0 15,10" />
      </svg>
    );
  }
);

Arrow.displayName = NAME;

const Root = Arrow;

export {
  Arrow,
  //
  Root,
};
