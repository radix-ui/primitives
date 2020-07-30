import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type BoxContextValue = {};
const [BoxContext] = createContext<BoxContextValue>('BoxContext', 'Box');

/* -------------------------------------------------------------------------------------------------
 * Box
 * -----------------------------------------------------------------------------------------------*/

const DEFAULT_TAG = 'span';

type BoxDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type BoxOwnProps = {};
type BoxProps = BoxDOMProps & BoxOwnProps;

const Box = forwardRef<typeof DEFAULT_TAG, BoxProps>(function Box(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...boxProps } = props;
  return (
    <BoxContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj('Box')} ref={forwardedRef} {...boxProps} />
    </BoxContext.Provider>
  );
});

Box.displayName = 'Box';

/* ---------------------------------------------------------------------------------------------- */

const useHasBoxContext = () => useHasContext(BoxContext);

const styles: PrimitiveStyles = {
  box: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Box, styles, useHasBoxContext };
export type { BoxProps };
