import * as React from 'react';

type VisuallyHiddenDOMProps = React.ComponentPropsWithRef<'div'>;
type VisuallyHiddenOwnProps = {};
type VisuallyHiddenProps = VisuallyHiddenDOMProps & VisuallyHiddenOwnProps;

const VisuallyHidden = React.forwardRef<HTMLDivElement, VisuallyHiddenProps>(
  function VisuallyHidden(props, forwardedRef) {
    return <div ref={forwardedRef} />;
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';

export { VisuallyHidden };
export type { VisuallyHiddenProps };
