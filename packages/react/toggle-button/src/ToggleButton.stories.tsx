import * as React from 'react';
import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupExclusive } from './ToggleButton';
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
    <ToggleButtonGroup aria-label="Options" defaultValue={['1']}>
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
    <ToggleButtonGroup
      aria-label="Options"
      value={value}
      onValueChange={(val) => setValue(val as any)}
    >
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

export const GroupedControlledExclusive = () => {
  const [value, setValue] = React.useState<string | null>(null);
  function handleValueChange(newValue: string | null) {
    if (newValue === value) {
      setValue(null);
    } else {
      setValue(newValue);
    }
  }

  return (
    <ToggleButtonGroupExclusive
      aria-label="Options"
      value={value}
      onValueChange={handleValueChange}
    >
      <ToggleButton value="1" as={StyledRoot}>
        Option 1
      </ToggleButton>
      <ToggleButton value="2" as={StyledRoot}>
        Option 2
      </ToggleButton>
      <ToggleButton value="3" as={StyledRoot}>
        Option 3
      </ToggleButton>
    </ToggleButtonGroupExclusive>
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
