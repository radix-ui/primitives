import * as React from 'react';
import { styled } from '../../../../stitches.config';
import { Collapsible, CollapsibleButton, CollapsibleContent } from './Collapsible';

export default { title: 'Components/Collapsible' };

export const Styled = () => (
  <Collapsible as={StyledRoot}>
    <CollapsibleButton as={StyledButton}>Button</CollapsibleButton>
    <CollapsibleContent as={StyledContent}>Content 1</CollapsibleContent>
  </Collapsible>
);

const StyledRoot = styled('div', {
  maxWidth: '20em',
  fontFamily: 'sans-serif',
});

const RECOMMENDED_CSS__COLLAPSIBLE__BUTTON: any = {
  // because it's a button, we want to stretch it
  width: '100%',
  // and remove center text alignment in favour of inheriting
  textAlign: 'inherit',
};

const StyledButton = styled('button', {
  ...RECOMMENDED_CSS__COLLAPSIBLE__BUTTON,
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

const StyledContent = styled('div', {
  padding: 10,
  lineHeight: 1.5,
});
