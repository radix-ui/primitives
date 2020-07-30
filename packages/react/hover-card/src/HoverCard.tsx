import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

// TODO: Not started

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type HoverCardContextValue = {};
const [HoverCardContext] = createContext<HoverCardContextValue>('HoverCardContext', 'HoverCard');

/* -------------------------------------------------------------------------------------------------
 * HoverCard
 * -----------------------------------------------------------------------------------------------*/

const DEFAULT_TAG = 'header';

type HoverCardDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type HoverCardOwnProps = {};
type HoverCardProps = HoverCardDOMProps & HoverCardOwnProps;

const HoverCard = forwardRef<typeof DEFAULT_TAG, HoverCardProps>(function HoverCard(
  props,
  forwardedRef
) {
  const { as: Comp = DEFAULT_TAG, ...domProps } = props;
  return (
    <HoverCardContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj('HoverCard')} ref={forwardedRef} {...domProps} />
    </HoverCardContext.Provider>
  );
});

HoverCard.displayName = 'HoverCard';

/* ---------------------------------------------------------------------------------------------- */

const useHasHoverCardContext = () => useHasContext(HoverCardContext);

const styles: PrimitiveStyles = {
  hoverCard: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { HoverCard, styles, useHasHoverCardContext };
export type { HoverCardProps };
