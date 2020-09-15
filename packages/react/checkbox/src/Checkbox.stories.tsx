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
  <Checkbox as={Container}>
    <Checkbox.Input as={StyledInput}>
      <Checkbox.Indicator as={StyledIndicator} />
    </Checkbox.Input>
  </Checkbox>
);

export const Controlled = () => {
  const [isChecked, setIsChecked] = React.useState(true);

  return (
    <Checkbox as={Container}>
      <Checkbox.Input
        as={StyledInput}
        checked={isChecked}
        onChange={(event) => setIsChecked(event.target.checked)}
      >
        <Checkbox.Indicator as={StyledIndicator} />
      </Checkbox.Input>
    </Checkbox>
  );
};

const Container = (props: any) => <span {...props} style={{ ...styles.root, ...props.style }} />;
const Input = (props: any) => <input {...props} style={{ ...styles.input, ...props.style }} />;
const Indicator = (props: any) => (
  <span {...props} style={{ ...styles.indicator, ...props.style }}>
    <svg viewBox="0 0 32 32" width="60%" height="60%" fill="none" stroke="white">
      <path d="M2 30 L30 2 M30 30 L2 2" />
    </svg>
  </span>
);

const StyledInput = (props: any) => (
  <input
    {...props}
    style={{ ...styles.input, border: '1px solid gainsboro', width: 30, height: 30 }}
  />
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
