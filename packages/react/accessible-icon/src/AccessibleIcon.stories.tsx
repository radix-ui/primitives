import * as React from 'react';
import { AccessibleIcon } from './AccessibleIcon';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/AccessibleIcon' };

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

const RECOMMENDED_CSS__ACCESSIBLE_ICON__ROOT = {
  // ensures child icon is contained correctly, `inline-block` would also work for that
  // but it would create the usual nasty few extra pixels underneath, so `inline-flex` is a better default.
  display: 'inline-flex',
  // better default alignment
  verticalAlign: 'middle',
};

const StyledRoot = styled('span', {
  ...RECOMMENDED_CSS__ACCESSIBLE_ICON__ROOT,
  color: '$red',
});
