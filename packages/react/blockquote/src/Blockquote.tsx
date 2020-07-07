import * as React from 'react';

type BlockquoteDOMProps = React.ComponentPropsWithRef<'div'>;
type BlockquoteOwnProps = {};
type BlockquoteProps = BlockquoteDOMProps & BlockquoteOwnProps;

const Blockquote = React.forwardRef<HTMLDivElement, BlockquoteProps>(function Blockquote(
  props,
  forwardedRef
) {
  return <div ref={forwardedRef} />;
});

Blockquote.displayName = 'Blockquote';

export { Blockquote };
export type { BlockquoteProps };
