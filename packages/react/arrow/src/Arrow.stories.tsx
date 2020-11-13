import * as React from 'react';
import { Arrow } from './Arrow';

export default { title: 'Components/Arrow' };

const recommendedStyles = {
  // better default alignment
  verticalAlign: 'middle',
};

export const Styled = () => (
  <Arrow style={{ ...recommendedStyles, fill: 'crimson' }} width={20} height={10} />
);

export const CustomSizes = () => (
  <>
    <Arrow style={{ ...recommendedStyles }} width={40} height={10} />
    <Arrow style={{ ...recommendedStyles }} width={50} height={30} />
    <Arrow style={{ ...recommendedStyles }} width={20} height={100} />
  </>
);
