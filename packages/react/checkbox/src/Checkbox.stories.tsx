// Remove this once API is finalized, and we can configure eslint-plugin-jsx-a11y to recognize our
// checkbox as an input
// https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
/* eslint-disable jsx-a11y/label-has-associated-control */

import * as React from 'react';
import { Checkbox, styles } from './Checkbox';

export default { title: 'Checkbox' };

export const Basic = () => (
  <Checkbox as={Container}>
    <Checkbox.Input as={Input}>
      <Checkbox.Indicator as={Indicator} />
    </Checkbox.Input>
  </Checkbox>
);

export const InlineStyle = () => (
  <>
    <p>
      This checkbox is nested inside a label. The box-shadow is styled to appear when the checkbox
      is in focus regardless of the input modality. The state is uncontrolled.
    </p>
    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Checkbox as={Container}>
        <Checkbox.Input as={StyledInput}>
          <Checkbox.Indicator as={StyledIndicator} />
        </Checkbox.Input>
      </Checkbox>
      <span>This is the label</span>
    </label>
  </>
);

export const Controlled = () => {
  const [isChecked, setIsChecked] = React.useState(true);

  return (
    <>
      <p>
        This checkbox is placed adjacent to its label. The box-shadow is styled to appear when the
        checkbox is in focus regardless of the input modality. The state is controlled.
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Checkbox as={Container}>
          <Checkbox.Input
            as={StyledInput}
            checked={isChecked}
            onChange={(event) => setIsChecked(event.target.checked)}
            id="randBox"
          >
            <Checkbox.Indicator as={StyledIndicator} />
          </Checkbox.Input>
        </Checkbox>
        <label htmlFor="randBox">This is the label</label>
      </div>
    </>
  );
};

const Container = (props: any) => <span {...props} style={{ ...styles.root, ...props.style }} />;
const Input = (props: any) => {
  // NOTE: We can remove this when we add stitches as a dev dependency and handle focus styles there
  //       This is just for testing quickly with inline styles.
  const [focused, setFocused] = React.useState(false);
  const focusStyles = {
    boxShadow: 'none',
    outline: focused ? '2px solid crimson' : undefined,
  };
  return (
    <input
      {...props}
      style={{
        ...styles.input,
        ...focusStyles,
        ...props.style,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};
const Indicator = (props: any) => (
  <span {...props} style={{ ...styles.indicator, ...props.style }}>
    <svg viewBox="0 0 32 32" width="60%" height="60%" fill="none" stroke="white">
      <path d="M2 30 L30 2 M30 30 L2 2" />
    </svg>
  </span>
);

const StyledInput = (props: any) => (
  <Input {...props} style={{ border: '1px solid gainsboro', width: 30, height: 30 }} />
);

const StyledIndicator = (props: any) => (
  <Indicator
    {...props}
    style={{
      width: 22,
      height: 22,
      backgroundColor: 'dodgerblue',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  />
);
