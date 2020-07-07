import * as React from 'react';

type AlertDOMProps = React.ComponentPropsWithRef<'div'>;
type AlertOwnProps = {};
type AlertProps = AlertDOMProps & AlertOwnProps;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Alert.displayName = 'Alert';

export { Alert };
export type { AlertProps };
