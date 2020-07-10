import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'blockquote';

type BlockquoteDOMProps = React.ComponentProps<typeof DEFAULT_TAG>;
type BlockquoteOwnProps = {};
type BlockquoteProps = BlockquoteDOMProps & BlockquoteOwnProps;

const Blockquote = forwardRef<typeof DEFAULT_TAG, BlockquoteProps>(function Blockquote(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, ...blockquoteProps } = props;
  return <Comp data-interop-part-blockquote="" ref={forwardedRef} {...blockquoteProps} />;
});

Blockquote.displayName = 'Blockquote';

const styles = {
  blockquote: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Blockquote, styles };
export type { BlockquoteProps };
