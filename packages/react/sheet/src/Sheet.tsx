import * as React from 'react';

type SheetDOMProps = React.ComponentPropsWithoutRef<'div'>;
type SheetOwnProps = {};
type SheetProps = SheetDOMProps & SheetOwnProps;

const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(function Sheet(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Sheet.displayName = 'Sheet';

export { Sheet };
export type { SheetProps };
