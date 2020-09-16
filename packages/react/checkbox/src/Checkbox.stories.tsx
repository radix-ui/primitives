// Remove this once API is finalized, and we can configure eslint-plugin-jsx-a11y to recognize our
// checkbox as an input
// https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
/* eslint-disable jsx-a11y/label-has-associated-control */

import * as React from 'react';
import { Checkbox, styles } from './Checkbox';

export default { title: 'Checkbox' };

export const Basic = () => (
  <Checkbox as={Root}>
    <Checkbox.Indicator as={Indicator} />
  </Checkbox>
);

export const InlineStyle = () => (
  <>
    <p>
      This checkbox is nested inside a label. The box-shadow is styled to appear when the checkbox
      is in focus regardless of the input modality. The state is uncontrolled.
    </p>
    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Checkbox as={StyledRoot}>
        <Checkbox.Indicator as={StyledIndicator} />
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
        <Checkbox
          as={StyledRoot}
          isChecked={isChecked}
          onChange={(event) => setIsChecked(event.target.checked)}
          id="randBox"
        >
          <Checkbox.Indicator as={StyledIndicator} />
        </Checkbox>
        <label htmlFor="randBox">This is the label</label>
      </div>
    </>
  );
};

export const Indeterminate = () => {
  const [isChecked, setIsChecked] = React.useState<boolean | 'mixed'>('mixed');

  return (
    <>
      <p>
        <Checkbox
          as={StyledRoot}
          isChecked={isChecked}
          onChange={(event) => setIsChecked(event.target.checked)}
        >
          <Checkbox.Indicator as={StyledIndicator} isIndeterminate={isChecked === 'mixed'} />
        </Checkbox>
      </p>

      <button
        type="button"
        onClick={() =>
          setIsChecked((prevIsChecked) => (prevIsChecked === 'mixed' ? false : 'mixed'))
        }
      >
        Toggle indeterminate
      </button>
    </>
  );
};

export const WithinForm = () => {
  const [isChecked, setIsChecked] = React.useState(false);

  return (
    <form
      onChange={(event) => {
        const input = event.target as HTMLInputElement;
        setIsChecked(input.checked);
      }}
    >
      <p>isChecked: {String(isChecked)}</p>

      <Checkbox as={StyledRoot}>
        <Checkbox.Indicator as={StyledIndicator} />
      </Checkbox>
    </form>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Reset components
 * -----------------------------------------------------------------------------------------------*/

const Root = (props: any) => {
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
        ...styles.root,
        ...focusStyles,
        ...props.style,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const Indicator = ({ isIndeterminate, ...props }: any) => (
  <span {...props} style={{ ...styles.indicator, ...props.style }}>
    {isIndeterminate ? (
      <b style={{ paddingBottom: '2px' }}>&mdash;</b>
    ) : (
      <svg viewBox="0 0 32 32" width="60%" height="60%" fill="none" stroke="currentColor">
        <path d="M2 30 L30 2 M30 30 L2 2" />
      </svg>
    )}
  </span>
);

/* -------------------------------------------------------------------------------------------------
 * Styled components
 * -----------------------------------------------------------------------------------------------*/

const StyledRoot = (props: any) => (
  <Root {...props} style={{ border: '1px solid gainsboro', width: 30, height: 30 }} />
);

const StyledIndicator = (props: any) => (
  <Indicator
    {...props}
    style={{
      width: 22,
      height: 22,
      backgroundColor: 'dodgerblue',
      display: 'grid',
      placeItems: 'center',
      color: 'white',
    }}
  />
);
