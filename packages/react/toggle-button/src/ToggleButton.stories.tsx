import * as React from 'react';
import { ToggleButton, styles } from './ToggleButton';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/ToggleButton' };

export const Basic = () => {
  return <ToggleButton as={BasicStyledRoot}>Toggle</ToggleButton>;
};

export const Styled = () => <ToggleButton as={StyledRoot}>Toggle</ToggleButton>;

export const Controlled = () => {
  const [toggled, setToggled] = React.useState(true);

  return (
    <ToggleButton as={StyledRoot} toggled={toggled} onToggle={setToggled}>
      {toggled ? 'On' : 'Off'}
    </ToggleButton>
  );
};

const BasicStyledRoot = styled('button', styles.root);

const StyledRoot = styled(BasicStyledRoot, {
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
