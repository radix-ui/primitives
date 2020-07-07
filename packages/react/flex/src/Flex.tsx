import * as React from 'react';

type FlexDOMProps = React.ComponentPropsWithoutRef<'div'>;
type FlexOwnProps = {};
type FlexProps = FlexDOMProps & FlexOwnProps;

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(function Flex(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Flex.displayName = 'Flex';

export { Flex };
export type { FlexProps };
