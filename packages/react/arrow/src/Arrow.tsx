import * as React from 'react';
import { cssReset } from '@interop-ui/utils';

type ArrowDOMProps = React.ComponentPropsWithRef<'svg'>;
type ArrowProps = ArrowDOMProps;

const Arrow = React.forwardRef<SVGSVGElement, ArrowProps>(function Arrow(props, forwardedRef) {
  return (
    <svg
      data-interop-part-arrow=""
      {...props}
      ref={forwardedRef}
      viewBox="0 0 30 10"
      preserveAspectRatio="none"
    >
      <polygon points="0,0 30,0 15,10" />
    </svg>
  );
});

Arrow.displayName = 'Arrow';
Arrow.defaultProps = {
  width: 10,
  height: 5,
};

const style = {
  arrow: {
    ...cssReset('svg'),
  },
};

export { Arrow, style };
export type { ArrowProps };
