import * as React from 'react';
import { forwardRef } from '@interop-ui/react-utils';
import { getPartDataAttrObj } from '@interop-ui/utils';

const NAME = 'Arrow';
const DEFAULT_TAG = 'svg';

type ArrowDOMProps = React.ComponentPropsWithRef<typeof DEFAULT_TAG>;
type ArrowProps = ArrowDOMProps;

const Arrow = forwardRef<typeof DEFAULT_TAG, ArrowProps>(function Arrow(props, forwardedRef) {
  const { as: Comp = ArrowImpl, ...arrowProps } = props;
  return <Comp {...arrowProps} ref={forwardedRef} />;
});

const ArrowImpl = forwardRef<typeof DEFAULT_TAG, ArrowProps>(function ArrowImpl(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, ...arrowProps } = props;
  return (
    <Comp
      {...getPartDataAttrObj(NAME)}
      {...arrowProps}
      ref={forwardedRef}
      viewBox="0 0 30 10"
      preserveAspectRatio="none"
    >
      <polygon points="0,0 30,0 15,10" />
    </Comp>
  );
});

Arrow.displayName = NAME;
Arrow.defaultProps = {
  width: 10,
  height: 5,
};

export { Arrow };
export type { ArrowProps };
