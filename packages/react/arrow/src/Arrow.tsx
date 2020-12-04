import * as React from 'react';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { getPartDataAttrObj } from '@interop-ui/utils';

const NAME = 'Arrow';
const DEFAULT_TAG = 'svg';

const Arrow = forwardRefWithAs<typeof ArrowImpl>((props, forwardedRef) => {
  const { as: Comp = ArrowImpl, ...arrowProps } = props;
  return <Comp {...arrowProps} ref={forwardedRef} />;
});

const ArrowImpl = forwardRefWithAs<typeof DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = DEFAULT_TAG, width = 10, height = 5, ...arrowProps } = props;
  return (
    <Comp
      {...getPartDataAttrObj(NAME)}
      {...arrowProps}
      ref={forwardedRef}
      viewBox="0 0 30 10"
      width={width}
      height={height}
      preserveAspectRatio="none"
    >
      <polygon points="0,0 30,0 15,10" />
    </Comp>
  );
});

Arrow.displayName = NAME;

export { Arrow, Arrow as Root };
