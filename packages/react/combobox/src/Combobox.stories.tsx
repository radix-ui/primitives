import * as React from 'react';
import { Combobox as ComboboxPrimitive, styles } from './Combobox';

export default { title: 'Combobox' };

export const Basic = () => (
  <Combobox>
    <ComboboxInput />
    <ComboboxPopover>
      <ComboboxList>
        <ComboboxOption value="one">
          <ComboboxOptionText>One</ComboboxOptionText>
        </ComboboxOption>
        <ComboboxOption value="two">
          <ComboboxOptionText>Two</ComboboxOptionText>
        </ComboboxOption>
        <ComboboxOption value="three">
          <ComboboxOptionText>Three</ComboboxOptionText>
        </ComboboxOption>
        <ComboboxGroup label="Group">
          <ComboboxOption value="four">
            <ComboboxOptionText>Four</ComboboxOptionText>
          </ComboboxOption>
          <ComboboxOption value="five">
            <ComboboxOptionText>Five</ComboboxOptionText>
          </ComboboxOption>
          <ComboboxOption value="six">
            <ComboboxOptionText>Six</ComboboxOptionText>
          </ComboboxOption>
        </ComboboxGroup>
      </ComboboxList>
    </ComboboxPopover>
  </Combobox>
);

export const InlineStyle = () => (
  <Combobox>
    <ComboboxInput style={{ border: '1px solid gainsboro', padding: '5px' }} />
    <ComboboxPopover>
      <ComboboxList style={{ border: '1px solid gainsboro', padding: '5px' }}>
        <ComboboxOption value="one">
          <ComboboxOptionText>One</ComboboxOptionText>
        </ComboboxOption>
        <ComboboxOption value="two">
          <ComboboxOptionText>Two</ComboboxOptionText>
        </ComboboxOption>
        <ComboboxOption value="three">
          <ComboboxOptionText>Three</ComboboxOptionText>
        </ComboboxOption>
        <ComboboxGroup label="Group">
          <ComboboxOption value="four">
            <ComboboxOptionText>Four</ComboboxOptionText>
          </ComboboxOption>
          <ComboboxOption value="five">
            <ComboboxOptionText>Five</ComboboxOptionText>
          </ComboboxOption>
          <ComboboxOption value="six">
            <ComboboxOptionText>Six</ComboboxOptionText>
          </ComboboxOption>
        </ComboboxGroup>
      </ComboboxList>
    </ComboboxPopover>
  </Combobox>
);

const Combobox = (props: React.ComponentProps<typeof ComboboxPrimitive>) => (
  <ComboboxPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);

const ComboboxInput = (props: React.ComponentProps<typeof ComboboxPrimitive.Input>) => (
  <ComboboxPrimitive.Input {...props} style={{ ...styles.input, ...props.style }} />
);

const ComboboxPopover = (props: React.ComponentProps<typeof ComboboxPrimitive.Popover>) => (
  <ComboboxPrimitive.Popover {...props} style={{ ...styles.popover, ...props.style }} />
);

const ComboboxList = (props: React.ComponentProps<typeof ComboboxPrimitive.List>) => (
  <ComboboxPrimitive.List {...props} style={{ ...styles.list, ...props.style }} />
);

const ComboboxOption = (props: React.ComponentProps<typeof ComboboxPrimitive.Option>) => (
  <ComboboxPrimitive.Option {...props} style={{ ...styles.option, ...props.style }} />
);

const ComboboxOptionText = (props: React.ComponentProps<typeof ComboboxPrimitive.OptionText>) => (
  <ComboboxPrimitive.OptionText {...props} style={{ ...styles.optionText, ...props.style }} />
);

const ComboboxGroup = (props: React.ComponentProps<typeof ComboboxPrimitive.Group>) => (
  <ComboboxPrimitive.Group {...props} style={{ ...styles.group, ...props.style }} />
);

// WHere does this go?
// const ComboboxButton = (props: React.ComponentProps<typeof ComboboxPrimitive.Button>) => (
//   <ComboboxPrimitive.Button {...props} style={{ ...styles.button, ...props.style }} />
// );
