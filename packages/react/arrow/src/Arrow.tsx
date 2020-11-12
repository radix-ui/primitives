import * as React from 'react';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';

const NAME = 'Arrow';
const DEFAULT_TAG = 'svg';

type ArrowDOMProps = React.ComponentPropsWithRef<typeof DEFAULT_TAG>;
type ArrowProps = ArrowDOMProps;

const Arrow = forwardRef<typeof DEFAULT_TAG, ArrowProps>(function Arrow(props, forwardedRef) {
  const { as: Comp = ArrowImpl, ...arrowProps } = props;
  return <Comp {...arrowProps} />;
});

const ArrowImpl = forwardRef<typeof DEFAULT_TAG, ArrowProps>(function Arrow(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...arrowProps } = props;
  return (
    <Comp
      {...interopDataAttrObj('root')}
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

const [styles, interopDataAttrObj] = createStyleObj(NAME, {
  root: {},
});

export { Arrow, styles };
export type { ArrowProps };
