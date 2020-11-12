import * as React from 'react';
import { AspectRatio, styles } from './AspectRatio';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/AspectRatio' };

export const Basic = () => (
  <div style={{ width: 500 }}>
    <AspectRatio as={BasicStyledRoot}>
      <div style={{ backgroundColor: '#eee', height: '100%' }}>
        A grey box inside the AspectRatio
      </div>
    </AspectRatio>
  </div>
);

export const Styled = () => (
  <div style={{ width: 500 }}>
    <AspectRatio as={StyledRoot} ratio={16 / 9} />
  </div>
);

const BasicStyledRoot = styled('div', styles.root);

const StyledRoot = styled(BasicStyledRoot, {
  backgroundColor: '$red',
});
