import * as React from 'react';

type ToastDOMProps = React.ComponentPropsWithRef<'div'>;
type ToastOwnProps = {};
type ToastProps = ToastDOMProps & ToastOwnProps;

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(function Toast(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Toast.displayName = 'Toast';

export { Toast };
export type { ToastProps };
