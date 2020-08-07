import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type OverlayContextValue = {};
const [OverlayContext] = createContext<OverlayContextValue>('OverlayContext', 'Overlay');

/* -------------------------------------------------------------------------------------------------
 * Overlay
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Overlay';
const DEFAULT_TAG = 'div';

type OverlayDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type OverlayOwnProps = {};
type OverlayProps = OverlayDOMProps & OverlayOwnProps;

const Overlay = forwardRef<typeof DEFAULT_TAG, OverlayProps>(function Overlay(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...overlayProps } = props;
  return (
    <OverlayContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...overlayProps} />;
    </OverlayContext.Provider>
  );
});

Overlay.displayName = NAME;

/* ---------------------------------------------------------------------------------------------- */

const useHasOverlayContext = () => useHasContext(OverlayContext);

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
};

export { Overlay, styles, useHasOverlayContext };
export type { OverlayProps };
