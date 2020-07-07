import * as React from 'react';

type BadgeDOMProps = React.ComponentPropsWithRef<'div'>;
type BadgeOwnProps = {};
type BadgeProps = BadgeDOMProps & BadgeOwnProps;

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(function Badge(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Badge.displayName = 'Badge';

export { Badge };
export type { BadgeProps };
