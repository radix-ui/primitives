import * as React from 'react';
import { Radio as RadioPrimitive, styles } from './Radio';

export default { title: 'Radio' };

export const Basic = () => (
  <Radio>
    <RadioIcon />
  </Radio>
);

export const InlineStyle = () => (
  <Radio style={{ border: '1px solid gainsboro', width: 30, height: 30, borderRadius: '9999px' }}>
    <RadioIcon
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
  </Radio>
);

const Radio = ({ children, ...props }: React.ComponentProps<typeof RadioPrimitive.Root>) => (
  <RadioPrimitive.Root {...props} style={{ ...styles.root, ...props.style }}>
    <RadioPrimitive.Input style={styles.input} />
    {children}
  </RadioPrimitive.Root>
);

const RadioIcon = (props: React.ComponentProps<typeof RadioPrimitive.Icon>) => (
  <RadioPrimitive.Icon {...props} style={{ ...styles.icon, ...props.style }} />
);
