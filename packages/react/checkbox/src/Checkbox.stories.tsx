import * as React from 'react';
import { Checkbox as CheckboxPrimitive, styles } from './Checkbox';

export default { title: 'Checkbox' };

export const Basic = () => (
  <Checkbox>
    <CheckboxInput />
    <CheckboxBox>
      <CheckboxCheckMark />
    </CheckboxBox>
  </Checkbox>
);

export const InlineStyle = () => (
  <Checkbox style={{ width: 30, height: 30 }}>
    <CheckboxInput />
    <CheckboxBox style={{ border: '1px solid gainsboro' }}>
      <CheckboxCheckMark
        style={{
          width: 22,
          height: 22,
          backgroundColor: 'dodgerblue',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </CheckboxBox>
  </Checkbox>
);

export const Controlled = () => {
  const [isChecked, setIsChecked] = React.useState(true);

  return (
    <Checkbox style={{ width: 30, height: 30 }}>
      <CheckboxInput checked={isChecked} onChange={(event) => setIsChecked(event.target.checked)} />
      <CheckboxBox style={{ border: '1px solid gainsboro' }}>
        <CheckboxCheckMark
          style={{
            width: 22,
            height: 22,
            backgroundColor: 'dodgerblue',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </CheckboxBox>
    </Checkbox>
  );
};

const Checkbox = (props: React.ComponentProps<typeof CheckboxPrimitive>) => (
  <CheckboxPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);

const CheckboxInput = (props: React.ComponentProps<typeof CheckboxPrimitive.Input>) => (
  <CheckboxPrimitive.Input {...props} style={{ ...styles.input, ...props.style }} />
);

const CheckboxBox = (props: React.ComponentProps<typeof CheckboxPrimitive.Box>) => (
  <CheckboxPrimitive.Box {...props} style={{ ...styles.box, ...props.style }} />
);

const CheckboxCheckMark = (props: React.ComponentProps<typeof CheckboxPrimitive.CheckMark>) => (
  <CheckboxPrimitive.CheckMark {...props} style={{ ...styles.checkMark, ...props.style }}>
    <svg viewBox="0 0 32 32" width="60%" height="60%" fill="none" stroke="white">
      <path d="M2 30 L30 2 M30 30 L2 2" />
    </svg>
  </CheckboxPrimitive.CheckMark>
);
