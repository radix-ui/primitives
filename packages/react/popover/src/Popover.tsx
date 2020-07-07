import * as React from 'react';

type PopoverDOMProps = React.ComponentPropsWithRef<'div'>;
type PopoverOwnProps = {};
type PopoverProps = PopoverDOMProps & PopoverOwnProps;

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  props,
  forwardedRef
) {
  return <div ref={forwardedRef} />;
});

Popover.displayName = 'Popover';

export { Popover };
export type { PopoverProps };
