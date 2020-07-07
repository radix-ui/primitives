import * as React from 'react';

type DividerDOMProps = React.ComponentPropsWithoutRef<'div'>;
type DividerOwnProps = {};
type DividerProps = DividerDOMProps & DividerOwnProps;

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(function Divider(
  props,
  forwardedRef
) {
  return <div ref={forwardedRef} />;
});

Divider.displayName = 'Divider';

export { Divider };
export type { DividerProps };
