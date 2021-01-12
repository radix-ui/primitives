import * as React from 'react';
import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupExclusive } from './ToggleButton';
import { styled } from '../../../../stitches.config';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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

export const GroupedWithRovingFocus = () => {
  return (
    <div>
      <VisuallyHidden id="desc">
        To navigate the buttons within the group, use the arrow keys
      </VisuallyHidden>
      <ToggleButtonGroup
        aria-label="Options"
        aria-describedby="desc"
        defaultValue={['1']}
        rovingFocus
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
      </ToggleButtonGroup>
    </div>
  );
};

export const GroupedControlled = () => {
  const [required, setRequired] = React.useState(false);
  const [value, setValue] = React.useState<string[]>(['1']);

  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
          />
          <span>Require selection</span>
        </label>
      </div>
      <hr />
      <div>
        <ToggleButtonGroup
          aria-label="Options"
          value={required && (value == null || value.length < 1) ? ['1'] : value}
          onValueChange={setValue}
          required={required}
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
        </ToggleButtonGroup>
      </div>
    </div>
  );
};

export const GroupedControlledExclusive = () => {
  const [required, setRequired] = React.useState(false);
  const [value, setValue] = React.useState<string | null>(null);

  return (
    <div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
          />
          <span>Require selection</span>
        </label>
      </div>
      <hr />
      <div>
        <ToggleButtonGroupExclusive
          aria-label="Options"
          value={required && value == null ? '1' : value}
          onValueChange={setValue}
          required={required}
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
