import * as React from 'react';
import { VisuallyHidden, styles } from './VisuallyHidden';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/VisuallyHidden' };

export const Basic = () => (
  <button>
    <VisuallyHidden as={BasicStyledRoot}>Save the file</VisuallyHidden>
    <span aria-hidden>💾</span>
  </button>
);

const BasicStyledRoot = styled('span', styles.root);
