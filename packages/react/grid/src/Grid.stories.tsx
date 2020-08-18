import * as React from 'react';
import { Grid as GridPrimitive, styles } from './Grid';

export default { title: 'Grid' };

export const Basic = () => <Grid>Grid</Grid>;
export const InlineStyle = () => <Grid style={{ backgroundColor: 'gainsboro' }}>Grid</Grid>;

const Grid = (props: React.ComponentProps<typeof GridPrimitive>) => (
  <GridPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);
