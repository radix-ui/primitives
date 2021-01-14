import * as React from 'react';
import { ToggleGroupItem, MultiSelectToggleGroup, ToggleGroup } from './ToggleGroup';
import { styled } from '../../../../stitches.config';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export default { title: 'Components/ToggleGroup' };

export const Styled = () => {
  return (
    <ToggleGroup aria-label="Options" defaultValue="1">
      <ToggleGroupItem value="1" as={StyledItem}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" as={StyledItem}>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem
        value="3"
        as={StyledItem}
        onToggledChange={() => {
          // Make sure onToggledChange fires even in grouped buttons
          console.log('Button 3 has changed!');
        }}
      >
        Option 3
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export const Controlled = () => {
  const [value, setValue] = React.useState('1');

  return (
    <ToggleGroup aria-label="Options" value={value} onValueChange={setValue}>
      <ToggleGroupItem value="1" as={StyledItem}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" as={StyledItem}>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem
        value="3"
        as={StyledItem}
        onToggledChange={() => {
          // Make sure onToggledChange fires even in grouped buttons
          console.log('Button 3 has changed!');
        }}
      >
        Option 3
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export const WithRovingFocus = () => {
  return (
    <div>
      <VisuallyHidden id="desc">
        To navigate the buttons within the group, use the arrow keys
      </VisuallyHidden>
      <ToggleGroup aria-label="Options" aria-describedby="desc" defaultValue="1" rovingFocus>
        <ToggleGroupItem value="1" as={StyledItem}>
          Option 1
        </ToggleGroupItem>
        <ToggleGroupItem value="2" as={StyledItem}>
          Option 2
        </ToggleGroupItem>
        <ToggleGroupItem
          value="3"
          as={StyledItem}
          onToggledChange={() => {
            // Make sure onToggledChange fires even in grouped buttons
            console.log('Button 3 has changed!');
          }}
        >
          Option 3
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export const ControlledMultiSelect = () => {
  const [value, setValue] = React.useState<string[]>([]);

  return (
    <div>
      <MultiSelectToggleGroup aria-label="Options" value={value} onValueChange={setValue}>
        <ToggleGroupItem value="1" as={StyledItem}>
          Option 1
        </ToggleGroupItem>
        <ToggleGroupItem value="2" as={StyledItem}>
          Option 2
        </ToggleGroupItem>
        <ToggleGroupItem
          value="3"
          as={StyledItem}
          onToggledChange={() => {
            // Make sure onToggledChange fires even in grouped buttons
            console.log('Button 3 has changed!');
          }}
        >
          Option 3
        </ToggleGroupItem>
      </MultiSelectToggleGroup>
    </div>
  );
};

const StyledItem = styled('button', {
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
