import * as React from 'react';

type TooltipDOMProps = React.ComponentPropsWithRef<'div'>;
type TooltipOwnProps = {};
type TooltipProps = TooltipDOMProps & TooltipOwnProps;

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  props,
  forwardedRef
) {
  return <div ref={forwardedRef} />;
});

Tooltip.displayName = 'Tooltip';

export { Tooltip };
export type { TooltipProps };
