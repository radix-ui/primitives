import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { PrimitiveStyles } from '@interop-ui/react-utils';

const NAME = 'Arrow';
const DEFAULT_TAG = 'svg';

type ArrowDOMProps = React.ComponentPropsWithRef<typeof DEFAULT_TAG>;
type ArrowProps = ArrowDOMProps;

const Arrow = React.forwardRef<SVGSVGElement, ArrowProps>(function Arrow(props, forwardedRef) {
  return (
    <svg
      {...interopDataAttrObj(NAME)}
      {...props}
      ref={forwardedRef}
      viewBox="0 0 30 10"
      preserveAspectRatio="none"
    >
      <polygon points="0,0 30,0 15,10" />
    </svg>
  );
});

Arrow.displayName = NAME;
Arrow.defaultProps = {
  width: 10,
  height: 5,
};

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Arrow, styles };
export type { ArrowProps };
