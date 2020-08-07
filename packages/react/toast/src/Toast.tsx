import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const NAME = 'Toast';
const DEFAULT_TAG = 'div';

type ToastDOMProps = React.ComponentProps<typeof DEFAULT_TAG>;
type ToastOwnProps = {};
type ToastProps = ToastDOMProps & ToastOwnProps;

const Toast = forwardRef<typeof DEFAULT_TAG, ToastProps>(function Toast(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...toastProps } = props;
  return <Comp {...toastProps} {...interopDataAttrObj(NAME)} ref={forwardedRef} />;
});

Toast.displayName = NAME;

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { styles, Toast };
export type { ToastProps };
