import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'div';

type ToggletipDOMProps = React.ComponentProps<typeof DEFAULT_TAG>;
type ToggletipOwnProps = {};
type ToggletipProps = ToggletipDOMProps & ToggletipOwnProps;

const Toggletip = forwardRef<typeof DEFAULT_TAG, ToggletipProps>(function Toggletip(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, ...toggleTipProps } = props;
  return <Comp {...toggleTipProps} {...interopDataAttrObj('ToggleTip')} ref={forwardedRef} />;
});

Toggletip.displayName = 'Toggletip';

const styles: PrimitiveStyles = {
  toggleTip: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { styles, Toggletip };
export type { ToggletipProps };
