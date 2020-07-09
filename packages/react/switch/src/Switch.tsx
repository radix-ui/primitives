import * as React from 'react';

type SwitchDOMProps = React.ComponentProps<'div'>;
type SwitchOwnProps = {};
type SwitchProps = SwitchDOMProps & SwitchOwnProps;

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(function Switch(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Switch.displayName = 'Switch';

export { Switch };
export type { SwitchProps };
