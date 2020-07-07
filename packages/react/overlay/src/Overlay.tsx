import * as React from 'react';

type OverlayDOMProps = React.ComponentPropsWithRef<'div'>;
type OverlayOwnProps = {};
type OverlayProps = OverlayDOMProps & OverlayOwnProps;

const Overlay = React.forwardRef<HTMLDivElement, OverlayProps>(function Overlay(
  props,
  forwardedRef
) {
  return <div ref={forwardedRef} />;
});

Overlay.displayName = 'Overlay';

export { Overlay };
export type { OverlayProps };
