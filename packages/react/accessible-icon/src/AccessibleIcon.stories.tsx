import * as React from 'react';
import { AccessibleIcon, styles } from './AccessibleIcon';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/AccessibleIcon' };

export const Basic = () => (
  <AccessibleIcon label="Close" as={BasicStyledRoot}>
    <CrossIcon />
  </AccessibleIcon>
);

export const Styled = () => (
  <AccessibleIcon label="Close" as={StyledRoot}>
    <CrossIcon />
  </AccessibleIcon>
);

const CrossIcon = () => (
  <svg viewBox="0 0 32 32" width={24} height={24} fill="none" stroke="currentColor">
    <path d="M2 30 L30 2 M30 30 L2 2" />
  </svg>
);

const BasicStyledRoot = styled('span', styles.root);

const StyledRoot = styled(BasicStyledRoot, {
  color: '$red',
});
