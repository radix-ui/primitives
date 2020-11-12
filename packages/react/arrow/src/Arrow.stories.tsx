import * as React from 'react';
import { Arrow, styles } from './Arrow';

export default { title: 'Components/Arrow' };

export const Basic = () => <Arrow style={styles.root} />;

export const Styled = () => (
  <Arrow style={{ ...styles.root, fill: 'crimson' }} width={20} height={10} />
);
