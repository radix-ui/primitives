import * as React from 'react';
import { Collapsible, styles } from './Collapsible';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/Collapsible' };

export const Basic = () => (
  <Collapsible as={BasicStyledRoot}>
    <Collapsible.Button as={BasicStyledButton}>Button</Collapsible.Button>
    <Collapsible.Content as={BasicStyledContent}>Content 1</Collapsible.Content>
  </Collapsible>
);

export const Styled = () => (
  <Collapsible as={StyledRoot}>
    <Collapsible.Button as={StyledButton}>Button</Collapsible.Button>
    <Collapsible.Content as={StyledContent}>Content 1</Collapsible.Content>
  </Collapsible>
);

const BasicStyledRoot = styled('div', styles.root);
const BasicStyledButton = styled('button', styles.button);
const BasicStyledContent = styled('div', styles.content);

const StyledRoot = styled(BasicStyledRoot, {
  maxWidth: '20em',
  fontFamily: 'sans-serif',
});

const StyledButton = styled(BasicStyledButton, {
  boxSizing: 'border-box',
  appearance: 'none',
  border: 'none',
  padding: 10,
  backgroundColor: '$black',
  color: 'white',
  fontFamily: 'inherit',
  fontSize: '1.2em',

  '--shadow-color': 'crimson',

  '&:focus': {
    outline: 'none',
    boxShadow: 'inset 0 -5px 0 0 var(--shadow-color)',
    color: '$red',
  },

  '&:disabled': {
    color: '$gray300',
  },

  '&[data-state="open"]': {
    backgroundColor: '$red',
    color: '$white',

    '&:focus': {
      '--shadow-color': '#111',
      color: '$black',
    },
  },
});

const StyledContent = styled(BasicStyledContent, {
  padding: 10,
  lineHeight: 1.5,
});
