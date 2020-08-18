import * as React from 'react';
import { Checkbox as CheckboxPrimitive, styles } from './Checkbox';

export default { title: 'Checkbox' };

export const Basic = () => (
  <Checkbox>
    <CheckboxIcon />
  </Checkbox>
);

export const InlineStyle = () => (
  <Checkbox style={{ border: '1px solid gainsboro', width: 30, height: 30 }}>
    <CheckboxIcon
      style={{
        width: 22,
        height: 22,
        backgroundColor: 'dodgerblue',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  </Checkbox>
);

const Checkbox = ({ children, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) => (
  <CheckboxPrimitive.Root {...props} style={{ ...styles.root, ...props.style }}>
    <CheckboxPrimitive.Input style={styles.input} />
    {children}
  </CheckboxPrimitive.Root>
);

const CheckboxIcon = (props: React.ComponentProps<typeof CheckboxPrimitive.Icon>) => (
  <CheckboxPrimitive.Icon {...props} style={{ ...styles.icon, ...props.style }}>
    <svg viewBox="0 0 32 32" width="60%" height="60%" fill="none" stroke="white">
      <path d="M2 30 L30 2 M30 30 L2 2" />
    </svg>
  </CheckboxPrimitive.Icon>
);
