import * as React from 'react';

type COMPONENT_NAMEDOMProps = React.ComponentPropsWithoutRef<'div'>;
type COMPONENT_NAMEOwnProps = {};
type COMPONENT_NAMEProps = COMPONENT_NAMEDOMProps & COMPONENT_NAMEOwnProps;

type COMPONENT_NAMEState = {};

class COMPONENT_NAME extends React.Component<
  COMPONENT_NAMEProps,
  COMPONENT_NAMEState,
  COMPONENT_NAMEState
> {
  render() {
    return <div />;
  }
}

export { COMPONENT_NAME };
export type { COMPONENT_NAMEProps, COMPONENT_NAMEState };
