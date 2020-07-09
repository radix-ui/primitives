import * as React from 'react';

type BoxDOMProps = React.ComponentPropsWithoutRef<'div'>;
type BoxOwnProps = {};
type BoxProps = BoxDOMProps & BoxOwnProps;

const Box = React.forwardRef<HTMLDivElement, BoxProps>(function Box(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Box.displayName = 'Box';

export { Box };
export type { BoxProps };
