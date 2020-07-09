import * as React from 'react';

type COMPONENT_NAMEDOMProps = React.ComponentPropsWithoutRef<'div'>;
type COMPONENT_NAMEOwnProps = {};
type COMPONENT_NAMEProps = COMPONENT_NAMEDOMProps & COMPONENT_NAMEOwnProps;

const COMPONENT_NAME: React.FC<COMPONENT_NAMEProps> = (props) => {
  return <div />;
};

COMPONENT_NAME.displayName = 'COMPONENT_NAME';

export { COMPONENT_NAME };
export type { COMPONENT_NAMEProps };
