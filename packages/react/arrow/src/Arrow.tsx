import * as React from 'react';

type ArrowDOMProps = React.ComponentPropsWithRef<'div'>;
type ArrowOwnProps = {};
type ArrowProps = ArrowDOMProps & ArrowOwnProps;

const Arrow = React.forwardRef<HTMLDivElement, ArrowProps>(function Arrow(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Arrow.displayName = 'Arrow';

export { Arrow };
export type { ArrowProps };
