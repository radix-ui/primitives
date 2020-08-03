import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'div';

type GridDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type GridOwnProps = {};
type GridProps = GridDOMProps & GridOwnProps;

const Grid = forwardRef<typeof DEFAULT_TAG, GridProps>(function Grid(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...gridProps } = props;
  return <Comp {...interopDataAttrObj('Grid')} ref={forwardedRef} {...gridProps} />;
});

Grid.displayName = 'Grid';

const styles: PrimitiveStyles = {
  grid: {
    ...cssReset(DEFAULT_TAG),
    display: 'grid',
  },
};

export { Grid, styles };
export type { GridProps };
