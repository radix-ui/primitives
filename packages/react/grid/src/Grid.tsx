import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const NAME = 'Grid';
const DEFAULT_TAG = 'div';

type GridDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type GridOwnProps = {};
type GridProps = GridDOMProps & GridOwnProps;

const Grid = forwardRef<typeof DEFAULT_TAG, GridProps>(function Grid(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...gridProps } = props;
  return <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...gridProps} />;
});

Grid.displayName = NAME;

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
    display: 'grid',
  },
};

export { Grid, styles };
export type { GridProps };
