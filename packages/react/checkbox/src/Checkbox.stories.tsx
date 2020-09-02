import * as React from 'react';
import { Checkbox as CheckboxPrimitive, styles } from './Checkbox';

export default { title: 'Checkbox' };

export const Basic = () => (
  <Checkbox>
    <CheckboxIndicator />
  </Checkbox>
);

export const InlineStyle = () => (
  <Checkbox style={{ width: 30, height: 30, border: '1px solid gainsboro' }}>
    <CheckboxIndicator
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

export const Controlled = () => {
  const [isChecked, setIsChecked] = React.useState(true);

  return (
    <Checkbox
      style={{ width: 30, height: 30, border: '1px solid gainsboro' }}
      isChecked={isChecked}
      onChange={(event) => setIsChecked(event.detail.checked)}
    >
      <CheckboxIndicator
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
};

const Checkbox = (props: React.ComponentProps<typeof CheckboxPrimitive>) => (
  <CheckboxPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);

const CheckboxIndicator = (props: React.ComponentProps<typeof CheckboxPrimitive.Indicator>) => (
  <CheckboxPrimitive.Indicator {...props} style={{ ...styles.indicator, ...props.style }}>
    <svg viewBox="0 0 32 32" width="60%" height="60%" fill="none" stroke="white">
      <path d="M2 30 L30 2 M30 30 L2 2" />
    </svg>
  </CheckboxPrimitive.Indicator>
);
