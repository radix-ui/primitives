import * as React from 'react';
import { ToggleButton } from './ToggleButton';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/ToggleButton' };

export const Styled = () => <ToggleButton as={StyledRoot}>Toggle</ToggleButton>;

export const Controlled = () => {
  const [toggled, setToggled] = React.useState(true);

  return (
    <ToggleButton as={StyledRoot} toggled={toggled} onToggledChange={setToggled}>
      {toggled ? 'On' : 'Off'}
    </ToggleButton>
  );
};

const StyledRoot = styled('button', {
  padding: 6,
  lineHeight: 1,
  border: 'none',
  fontFamily: 'sans-serif',
  fontWeight: 'bold',

  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px $black',
  },

  '&[data-state="off"]': {
    backgroundColor: '$red',
    color: '$white',
  },

  '&[data-state="on"]': {
    backgroundColor: '$green',
    color: '$white',
  },
});
