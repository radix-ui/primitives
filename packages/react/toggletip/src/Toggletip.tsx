import * as React from 'react';

type ToggletipDOMProps = React.ComponentPropsWithoutRef<'div'>;
type ToggletipOwnProps = {};
type ToggletipProps = ToggletipDOMProps & ToggletipOwnProps;

const Toggletip = React.forwardRef<HTMLDivElement, ToggletipProps>(function Toggletip(
  props,
  forwardedRef
) {
  return <div ref={forwardedRef} />;
});

Toggletip.displayName = 'Toggletip';

export { Toggletip };
export type { ToggletipProps };
