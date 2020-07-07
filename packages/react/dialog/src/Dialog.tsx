import * as React from 'react';

type DialogDOMProps = React.ComponentPropsWithoutRef<'div'>;
type DialogOwnProps = {};
type DialogProps = DialogDOMProps & DialogOwnProps;

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(function Dialog(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Dialog.displayName = 'Dialog';

export { Dialog };
export type { DialogProps };
