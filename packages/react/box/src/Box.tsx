import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'span';

type BoxDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type BoxOwnProps = {};
type BoxProps = BoxDOMProps & BoxOwnProps;

const Box = forwardRef<typeof DEFAULT_TAG, BoxProps>(function Box(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...boxProps } = props;
  return <Comp {...interopDataAttrObj('Box')} ref={forwardedRef} {...boxProps} />;
});

Box.displayName = 'Box';

const styles: PrimitiveStyles = {
  box: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Box, styles };
export type { BoxProps };
