import * as React from 'react';
import { Separator } from './Separator';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/Separator' };

export const Styled = () => (
  <>
    <h1>Horizontal</h1>
    <p>The following separator is horizontal and has semantic meaning.</p>
    <Separator as={StyledRoot} orientation="horizontal" />
    <p>
      The following separator is horizontal and is purely decorative. Assistive technology will
      ignore this element.
    </p>
    <Separator as={StyledRoot} orientation="horizontal" decorative />

    <h1>Vertical</h1>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <p>The following separator is vertical and has semantic meaning.</p>
      <Separator as={StyledRoot} orientation="vertical" />
      <p>
        The following separator is vertical and is purely decorative. Assistive technology will
        ignore this element.
      </p>
      <Separator as={StyledRoot} orientation="vertical" decorative />
    </div>
  </>
);

const StyledRoot = styled('div', {
  border: 'none',
  backgroundColor: '$red',

  '&[data-orientation="horizontal"]': {
    height: '1px',
    width: '100%',
    margin: '20px 0',
  },

  '&[data-orientation="vertical"]': {
    height: '100px',
    width: '1px',
    margin: '0 20px',
  },
});
