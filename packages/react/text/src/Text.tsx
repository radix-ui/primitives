import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'span';

type TextDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type TextOwnProps = {};
type TextProps = TextDOMProps & TextOwnProps;

const Text = forwardRef<typeof DEFAULT_TAG, TextProps>(function Text(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...textProps } = props;
  return <Comp {...interopDataAttrObj('Text')} ref={forwardedRef} {...textProps} />;
});

Text.displayName = 'Text';

const styles: PrimitiveStyles = {
  text: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Text, styles };
export type { TextProps };
