import * as React from 'react';
import {
  ToggleGroupItem,
  MultiSelectToggleGroup,
  MultiSelectToggleGroupItem,
  ToggleGroup,
} from './ToggleGroup';
import { styled } from '../../../../stitches.config';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export default {
  title: 'Components/ToggleGroup',
};

export const Styled = () => {
  return (
    <ToggleGroup aria-label="Options" defaultValue="1">
      <ToggleGroupItem value="1" as={StyledItem}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" as={StyledItem}>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem value="3" as={StyledItem}>
        Option 3
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export const Controlled = () => {
  const [value, setValue] = React.useState<string | null>(null);
  function handleChange(value: string | null) {
    setValue((prevValue) => {
      return value == null ? prevValue : value;
    });
  }

  return (
    <ToggleGroup aria-label="Options" value={value} onValueChange={handleChange}>
      <ToggleGroupItem value="1" as={StyledItem}>
        Option 1
      </ToggleGroupItem>
      <ToggleGroupItem value="2" as={StyledItem}>
        Option 2
      </ToggleGroupItem>
      <ToggleGroupItem value="3" as={StyledItem}>
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
        <ToggleGroupItem value="3" as={StyledItem}>
          Option 3
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export const MultiSelect = () => {
  return (
    <div>
      <MultiSelectToggleGroup aria-label="Options" defaultValue={['1']}>
        <MultiSelectToggleGroupItem value="1" as={StyledItem}>
          Option 1
        </MultiSelectToggleGroupItem>
        <MultiSelectToggleGroupItem value="2" as={StyledItem}>
          Option 2
        </MultiSelectToggleGroupItem>
        <MultiSelectToggleGroupItem value="3" as={StyledItem}>
          Option 3
        </MultiSelectToggleGroupItem>
      </MultiSelectToggleGroup>
    </div>
  );
};

export const ControlledMultiSelect = () => {
  const [value, setValue] = React.useState<string[]>([]);
  function handleChange(value: string[]) {
    setValue((prevValue) => {
      return value.length < 1 ? prevValue : value;
    });
  }

  return (
    <div>
      <MultiSelectToggleGroup aria-label="Options" value={value} onValueChange={handleChange}>
        <MultiSelectToggleGroupItem value="1" as={StyledItem}>
          Option 1
        </MultiSelectToggleGroupItem>
        <MultiSelectToggleGroupItem value="2" as={StyledItem}>
          Option 2
        </MultiSelectToggleGroupItem>
        <MultiSelectToggleGroupItem value="3" as={StyledItem}>
          Option 3
        </MultiSelectToggleGroupItem>
      </MultiSelectToggleGroup>
    </div>
  );
};

export const MultiSelectWithRovingFocus = () => {
  return (
    <div>
      <VisuallyHidden id="desc">
        To navigate the buttons within the group, use the arrow keys
      </VisuallyHidden>
      <MultiSelectToggleGroup
        aria-label="Options"
        aria-describedby="desc"
        defaultValue={['1']}
        rovingFocus
      >
        <MultiSelectToggleGroupItem value="1" as={StyledItem}>
          Option 1
        </MultiSelectToggleGroupItem>
        <MultiSelectToggleGroupItem value="2" as={StyledItem}>
          Option 2
        </MultiSelectToggleGroupItem>
        <MultiSelectToggleGroupItem value="3" as={StyledItem}>
          Option 3
        </MultiSelectToggleGroupItem>
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
