import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'div';

type ToastDOMProps = React.ComponentProps<typeof DEFAULT_TAG>;
type ToastOwnProps = {};
type ToastProps = ToastDOMProps & ToastOwnProps;

const Toast = forwardRef<typeof DEFAULT_TAG, ToastProps>(function Toast(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...toastProps } = props;
  return <Comp {...toastProps} {...interopDataAttrObj('Toast')} ref={forwardedRef} />;
});

Toast.displayName = 'Toast';

const styles: PrimitiveStyles = {
  toast: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { styles, Toast };
export type { ToastProps };
