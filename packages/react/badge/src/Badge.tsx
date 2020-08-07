import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type BadgeContextValue = {};
const [BadgeContext] = createContext<BadgeContextValue>('BadgeContext', 'Badge');

/* -------------------------------------------------------------------------------------------------
 * Badge
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Badge';
const DEFAULT_TAG = 'span';

type BadgeDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type BadgeOwnProps = {};
type BadgeProps = BadgeDOMProps & BadgeOwnProps;

const Badge = forwardRef<typeof DEFAULT_TAG, BadgeProps>(function Badge(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...badgeProps } = props;
  return (
    <BadgeContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...badgeProps} />
    </BadgeContext.Provider>
  );
});

Badge.displayName = NAME;

/* ---------------------------------------------------------------------------------------------- */

const useHasBadgeContext = () => useHasContext(BadgeContext);

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
    display: 'inline-flex',
    alignItems: 'center',
    verticalAlign: 'middle',
    lineHeight: '1',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
};

export { Badge, styles, useHasBadgeContext };
export type { BadgeProps };
