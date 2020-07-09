import * as React from 'react';

type LockDOMProps = React.ComponentProps<'div'>;
type LockOwnProps = {};
type LockProps = LockDOMProps & LockOwnProps;

const Lock = React.forwardRef<HTMLDivElement, LockProps>(function Lock(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Lock.displayName = 'Lock';

export { Lock };
export type { LockProps };
