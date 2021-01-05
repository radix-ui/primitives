import * as React from 'react';
import { ToggleButton, ToggleButtonGroup } from './ToggleButton';
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

export const Grouped = () => {
  return (
    <ToggleButtonGroup defaultValue={['1']}>
      <ToggleButton value="1" as={StyledRoot}>
        Option 1
      </ToggleButton>
      <ToggleButton value="2" as={StyledRoot}>
        Option 2
      </ToggleButton>
      <ToggleButton value="3" as={StyledRoot}>
        Option 3
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export const GroupedControlled = () => {
  const [value, setValue] = React.useState<string[]>(['1']);

  return (
    <ToggleButtonGroup value={value} onValueChange={setValue}>
      <ToggleButton value="1" as={StyledRoot}>
        Option 1
      </ToggleButton>
      <ToggleButton value="2" as={StyledRoot}>
        Option 2
      </ToggleButton>
      <ToggleButton value="3" as={StyledRoot}>
        Option 3
      </ToggleButton>
    </ToggleButtonGroup>
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
