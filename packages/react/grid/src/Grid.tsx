import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type GridContextValue = {};
const [GridContext] = createContext<GridContextValue>('GridContext', 'Grid');

/* -------------------------------------------------------------------------------------------------
 * Grid
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Grid';
const DEFAULT_TAG = 'div';

type GridDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type GridOwnProps = {};
type GridProps = GridDOMProps & GridOwnProps;

const Grid = forwardRef<typeof DEFAULT_TAG, GridProps>(function Grid(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...gridProps } = props;
  return (
    <GridContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...gridProps} />
    </GridContext.Provider>
  );
});

Grid.displayName = NAME;

/* ---------------------------------------------------------------------------------------------- */

const useHasGridContext = () => useHasContext(GridContext);

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
    display: 'grid',
  },
};

export { Grid, styles, useHasGridContext };
export type { GridProps };
