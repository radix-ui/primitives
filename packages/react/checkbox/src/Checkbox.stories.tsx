import * as React from 'react';
import { Checkbox as CheckboxPrimitive, styles } from './Checkbox';

export default { title: 'Checkbox' };

export const Basic = () => (
  <Checkbox>
    <CheckboxIndicator />
  </Checkbox>
);

export const InlineStyle = () => {
  return (
    <>
      <p>
        This checkbox is nested inside a label. The box-shadow is styled to appear when the checkbox
        is in focus regardless of the input modality. The state is uncontrolled.
      </p>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Checkbox>
          {({ isFocusVisible, isFocused }) => (
            <CheckboxBox
              style={{
                width: 30,
                height: 30,
                border: '1px solid gainsboro',
                borderRadius: 3,
                boxShadow: isFocused ? '0 0 0 2px red' : undefined,
                outline: 'none',
              }}
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
            </CheckboxBox>
          )}
        </Checkbox>
        <span>This is the label</span>
      </label>
    </>
  );
};

export const Controlled = () => {
  const [isChecked, setIsChecked] = React.useState(true);

  return (
    <>
      <p>
        This checkbox is placed adjacent to its label. The box-shadow is styled to appear when the
        checkbox is in focus via keyboard input (heuristics are similar to{' '}
        <code>:focus-visible</code> in CSS). The state is controlled.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Checkbox
          id="randBox"
          checked={isChecked}
          onChange={setIsChecked as any}
          renderHiddenInput={() => <CheckboxPrimitive.HiddenInput />}
        >
          {({ isFocusVisible, isFocused }) => (
            <CheckboxBox
              style={{
                width: 30,
                height: 30,
                border: '1px solid gainsboro',
                borderRadius: 3,
                boxShadow: isFocusVisible ? '0 0 0 2px red' : undefined,
                outline: 'none',
              }}
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
            </CheckboxBox>
          )}
        </Checkbox>
        <label htmlFor="randBox">This is the label</label>
      </div>
    </>
  );
};

const Checkbox = (props: React.ComponentProps<typeof CheckboxPrimitive>) => (
  <CheckboxPrimitive {...props} />
);

const CheckboxBox = (props: React.ComponentProps<typeof CheckboxPrimitive.Box>) => (
  <CheckboxPrimitive.Box {...props} style={{ ...styles.box, ...props.style }} />
);

const CheckboxIndicator = (props: React.ComponentProps<typeof CheckboxPrimitive.Indicator>) => (
  <CheckboxPrimitive.Indicator {...props} style={{ ...styles.indicator, ...props.style }}>
    <svg viewBox="0 0 32 32" width="60%" height="60%" fill="none" stroke="white">
      <path d="M2 30 L30 2 M30 30 L2 2" />
    </svg>
  </CheckboxPrimitive.Indicator>
);
