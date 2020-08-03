import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'hr';

type DividerDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type DividerOwnProps = {};
type DividerProps = DividerDOMProps & DividerOwnProps;

const Divider = forwardRef<typeof DEFAULT_TAG, DividerProps>(function Divider(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...dividerProps } = props;
  return <Comp {...interopDataAttrObj('Divider')} ref={forwardedRef} {...dividerProps} />;
});

Divider.displayName = 'Divider';

const styles: PrimitiveStyles = {
  divider: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Divider, styles };
export type { DividerProps };
