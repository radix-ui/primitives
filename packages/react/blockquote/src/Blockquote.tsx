import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'blockquote';

type BlockquoteDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type BlockquoteOwnProps = {};
type BlockquoteProps = BlockquoteDOMProps & BlockquoteOwnProps;

const Blockquote = forwardRef<typeof DEFAULT_TAG, BlockquoteProps>(function Blockquote(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, ...blockquoteProps } = props;
  return <Comp {...interopDataAttrObj('Blockquote')} ref={forwardedRef} {...blockquoteProps} />;
});

Blockquote.displayName = 'Blockquote';

const styles: PrimitiveStyles = {
  blockquote: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Blockquote, styles };
export type { BlockquoteProps };
