import * as React from 'react';

type GridDOMProps = React.ComponentProps<'div'>;
type GridOwnProps = {};
type GridProps = GridDOMProps & GridOwnProps;

const Grid = React.forwardRef<HTMLDivElement, GridProps>(function Grid(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Grid.displayName = 'Grid';

export { Grid };
export type { GridProps };
