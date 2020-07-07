import * as React from 'react';

type COMPONENT_NAMEDOMProps = React.ComponentPropsWithRef<'div'>;
type COMPONENT_NAMEOwnProps = {};
type COMPONENT_NAMEProps = COMPONENT_NAMEDOMProps & COMPONENT_NAMEOwnProps;

const COMPONENT_NAMEImpl = React.forwardRef<HTMLDivElement, COMPONENT_NAMEProps>(
  function COMPONENT_NAME(props, forwardedRef) {
    return <div ref={forwardedRef} />;
  }
);

COMPONENT_NAMEImpl.displayName = 'COMPONENT_NAME';

const COMPONENT_NAME = React.memo(COMPONENT_NAMEImpl);

export { COMPONENT_NAME };
export type { COMPONENT_NAMEProps };
