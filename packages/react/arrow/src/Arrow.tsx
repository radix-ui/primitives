import * as React from 'react';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { Primitive } from '@radix-ui/react-primitive';
import { getSelector } from '@radix-ui/utils';

import type { OwnProps } from '@radix-ui/react-polymorphic';

const NAME = 'Arrow';
const DEFAULT_TAG = 'svg';

/**
 * We pass `ArrowImpl` in the `as` prop so that the whole svg
 * is replaced when consumer passes an `as` prop
 */
const Arrow = forwardRefWithAs<typeof DEFAULT_TAG, OwnProps<typeof Primitive>>(
  (props, forwardedRef) => {
    return <Primitive as={ArrowImpl} selector={getSelector(NAME)} {...props} ref={forwardedRef} />;
  }
);

const ArrowImpl = React.forwardRef<SVGSVGElement, React.ComponentProps<typeof DEFAULT_TAG>>(
  (props, forwardedRef) => (
    <svg
      width={10}
      height={5}
      {...props}
      ref={forwardedRef}
      viewBox="0 0 30 10"
      preserveAspectRatio="none"
    >
      <polygon points="0,0 30,0 15,10" />
    </svg>
  )
);

Arrow.displayName = NAME;

const Root = Arrow;

export {
  Arrow,
  //
  Root,
};
