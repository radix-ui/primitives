import * as React from 'react';
import { Arrow } from '@radix-ui/react-arrow';

export default { title: 'Components/Arrow' };

const RECOMMENDED_CSS__ARROW__ROOT = {
  // better default alignment
  verticalAlign: 'middle',
};

export const Styled = () => (
  <Arrow style={{ ...RECOMMENDED_CSS__ARROW__ROOT, fill: 'crimson' }} width={20} height={10} />
);

export const CustomSizes = () => (
  <>
    <Arrow style={{ ...RECOMMENDED_CSS__ARROW__ROOT }} width={40} height={10} />
    <Arrow style={{ ...RECOMMENDED_CSS__ARROW__ROOT }} width={50} height={30} />
    <Arrow style={{ ...RECOMMENDED_CSS__ARROW__ROOT }} width={20} height={100} />
  </>
);

export const CustomArrow = () => (
  <Arrow asChild>
    <div
      style={{
        width: 20,
        height: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: 'tomato',
      }}
    />
  </Arrow>
);
