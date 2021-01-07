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
      <ToggleButton
        value="3"
        as={StyledRoot}
        onToggledChange={() => {
          // Make sure onToggledChange fires even in grouped buttons
          console.log('Button 3 has changed!');
        }}
      >
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
  const [ensureSelection, setEnsureSelection] = React.useState(false);
  const [value, setValue] = React.useState<string | null>(null);
  function handleValueChange(newValue: string | null) {
    setValue((prevValue) => {
      return ensureSelection
        ? newValue || prevValue || '1'
        : newValue === prevValue
        ? null
        : newValue;
    });
  }

  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={ensureSelection}
            onChange={(e) => setEnsureSelection(e.target.checked)}
          />
          <span>Ensure selection</span>
        </label>
      </div>
      <hr />
      <div>
        <ToggleButtonGroupExclusive
          aria-label="Options"
          value={ensureSelection && value == null ? '1' : value}
          onValueChange={handleValueChange}
        >
          <ToggleButton value="1" as={StyledRoot}>
            Option 1
          </ToggleButton>
          <ToggleButton value="2" as={StyledRoot}>
            Option 2
          </ToggleButton>
          <ToggleButton
            value="3"
            as={StyledRoot}
            onToggledChange={() => {
              // Make sure onToggledChange fires even in grouped buttons
              console.log('Button 3 has changed!');
            }}
          >
            Option 3
          </ToggleButton>
        </ToggleButtonGroupExclusive>
      </div>
    </div>
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
