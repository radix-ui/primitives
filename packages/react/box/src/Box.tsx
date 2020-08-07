import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const NAME = 'Box';
const DEFAULT_TAG = 'span';

type BoxDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type BoxOwnProps = {};
type BoxProps = BoxDOMProps & BoxOwnProps;

const Box = forwardRef<typeof DEFAULT_TAG, BoxProps>(function Box(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...boxProps } = props;
  return <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...boxProps} />;
});

Box.displayName = NAME;

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Box, styles };
export type { BoxProps };
