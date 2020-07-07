import * as React from 'react';
import { cssReset } from '@interop-ui/utils';

type ArrowDOMProps = React.ComponentPropsWithRef<'svg'>;
type ArrowProps = ArrowDOMProps;

const Arrow = React.forwardRef<SVGSVGElement, ArrowProps>(function Arrow(props, forwardedRef) {
  const { style, ...arrowProps } = props;

  return (
    <svg
      {...arrowProps}
      ref={forwardedRef}
      viewBox="0 0 30 10"
      preserveAspectRatio="none"
      style={{
        ...cssReset('svg'),
        ...style,
      }}
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

export { Arrow };
export type { ArrowProps };
