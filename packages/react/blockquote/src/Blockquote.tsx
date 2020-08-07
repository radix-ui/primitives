import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type BlockquoteContextValue = {};
const [BlockquoteContext] = createContext<BlockquoteContextValue>(
  'BlockquoteContext',
  'Blockquote'
);

/* -------------------------------------------------------------------------------------------------
 * Blockquote
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Blockquote';
const DEFAULT_TAG = 'blockquote';

type BlockquoteDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type BlockquoteOwnProps = {};
type BlockquoteProps = BlockquoteDOMProps & BlockquoteOwnProps;

const Blockquote = forwardRef<typeof DEFAULT_TAG, BlockquoteProps>(function Blockquote(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, ...blockquoteProps } = props;
  return (
    <BlockquoteContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...blockquoteProps} />;
    </BlockquoteContext.Provider>
  );
});

Blockquote.displayName = NAME;

/* ---------------------------------------------------------------------------------------------- */

const useHasBlockquoteContext = () => useHasContext(BlockquoteContext);

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Blockquote, styles, useHasBlockquoteContext };
export type { BlockquoteProps };
