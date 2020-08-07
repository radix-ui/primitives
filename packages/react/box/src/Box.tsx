import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type BoxContextValue = {};
const [BoxContext] = createContext<BoxContextValue>('BoxContext', 'Box');

/* -------------------------------------------------------------------------------------------------
 * Box
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Box';
const DEFAULT_TAG = 'span';

type BoxDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type BoxOwnProps = {};
type BoxProps = BoxDOMProps & BoxOwnProps;

const Box = forwardRef<typeof DEFAULT_TAG, BoxProps>(function Box(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...boxProps } = props;
  return (
    <BoxContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...boxProps} />
    </BoxContext.Provider>
  );
});

Box.displayName = NAME;

/* ---------------------------------------------------------------------------------------------- */

const useHasBoxContext = () => useHasContext(BoxContext);

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Box, styles, useHasBoxContext };
export type { BoxProps };
