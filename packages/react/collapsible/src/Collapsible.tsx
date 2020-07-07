import * as React from 'react';

type CollapsibleDOMProps = React.ComponentPropsWithRef<'div'>;
type CollapsibleOwnProps = {};
type CollapsibleProps = CollapsibleDOMProps & CollapsibleOwnProps;

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  props,
  forwardedRef
) {
  return <div ref={forwardedRef} />;
});

Collapsible.displayName = 'Collapsible';

export { Collapsible };
export type { CollapsibleProps };
