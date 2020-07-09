import * as React from 'react';

type DebugContextDOMProps = React.ComponentProps<'div'>;
type DebugContextOwnProps = {};
type DebugContextProps = DebugContextDOMProps & DebugContextOwnProps;

const DebugContext = React.forwardRef<HTMLDivElement, DebugContextProps>(function DebugContext(
  props,
  forwardedRef
) {
  return <div ref={forwardedRef} />;
});

DebugContext.displayName = 'DebugContext';

export { DebugContext };
export type { DebugContextProps };
