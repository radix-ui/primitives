import * as React from 'react';
import { RadioGroup as RadioGroupPrimitive, styles } from './RadioGroup';

export default { title: 'RadioGroup' };

export const Basic = () => (
  <RadioGroup>
    <RadioGroupItem value="1">
      <RadioGroupIcon />
    </RadioGroupItem>
    <RadioGroupItem value="2">
      <RadioGroupIcon />
    </RadioGroupItem>
    <RadioGroupItem value="3">
      <RadioGroupIcon />
    </RadioGroupItem>
  </RadioGroup>
);

export const InlineStyle = (props: React.ComponentProps<typeof RadioGroup>) => (
  <RadioGroup {...props}>
    <StyledRadioGroupItem value="1" />
    <StyledRadioGroupItem value="2" />
    <StyledRadioGroupItem value="3" />
  </RadioGroup>
);

export const Controlled = () => <InlineStyle value="2" />;
export const Uncontrolled = () => <InlineStyle defaultValue="2" />;

const RadioGroup = (props: React.ComponentProps<typeof RadioGroupPrimitive>) => (
  <RadioGroupPrimitive {...props} />
);

const RadioGroupItem = ({
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) => (
  <RadioGroupPrimitive.Item {...props} style={{ ...styles.item, ...props.style }}>
    <RadioGroupPrimitive.Input style={styles.input} />
    {children}
  </RadioGroupPrimitive.Item>
);

const RadioGroupIcon = (props: React.ComponentProps<typeof RadioGroupPrimitive.Icon>) => (
  <RadioGroupPrimitive.Icon {...props} style={{ ...styles.icon, ...props.style }} />
);

const StyledRadioGroupItem = (props: React.ComponentProps<typeof RadioGroupItem>) => (
  <RadioGroupItem
    {...props}
    name="radio"
    style={{ border: '1px solid gainsboro', width: 30, height: 30, borderRadius: '9999px' }}
  >
    <RadioGroupIcon
      style={{
        width: 15,
        height: 15,
        backgroundColor: 'dodgerblue',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'inherit',
      }}
    />
  </RadioGroupItem>
);
