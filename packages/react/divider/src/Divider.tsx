import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const NAME = 'Divider';
const DEFAULT_TAG = 'hr';

type DividerDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type DividerOwnProps = {};
type DividerProps = DividerDOMProps & DividerOwnProps;

const Divider = forwardRef<typeof DEFAULT_TAG, DividerProps>(function Divider(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...dividerProps } = props;
  return <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...dividerProps} />;
});

Divider.displayName = NAME;

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Divider, styles };
export type { DividerProps };
