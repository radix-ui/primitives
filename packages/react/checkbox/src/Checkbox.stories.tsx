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
    <label>
      This is the label{' '}
      <Checkbox as={StyledRoot}>
        <Checkbox.Indicator as={StyledIndicator} />
      </Checkbox>
    </label>
  </>
);

export const Controlled = () => {
  const [checked, setChecked] = React.useState(true);

  return (
    <>
      <p>
        This checkbox is placed adjacent to its label. The box-shadow is styled to appear when the
        checkbox is in focus regardless of the input modality. The state is controlled.
      </p>
      <label htmlFor="randBox">This is the label</label>{' '}
      <Checkbox
        as={StyledRoot}
        checked={checked}
        onCheckedChange={(event) => setChecked(event.target.checked)}
        id="randBox"
      >
        <Checkbox.Indicator as={StyledIndicator} />
      </Checkbox>
    </>
  );
};

export const Indeterminate = () => {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>('indeterminate');

  return (
    <>
      <p>
        <Checkbox
          as={StyledRoot}
          checked={checked}
          onCheckedChange={(event) => setChecked(event.target.checked)}
        >
          <Checkbox.Indicator as={StyledIndicator} indeterminate={checked === 'indeterminate'} />
        </Checkbox>
      </p>

      <button
        type="button"
        onClick={() =>
          setChecked((prevIsChecked) =>
            prevIsChecked === 'indeterminate' ? false : 'indeterminate'
          )
        }
      >
        Toggle indeterminate
      </button>
    </>
  );
};

export const WithinForm = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <form
      onChange={(event) => {
        const input = event.target as HTMLInputElement;
        setChecked(input.checked);
      }}
    >
      <p>checked: {String(checked)}</p>

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

const Indicator = ({ indeterminate, ...props }: any) => (
  <span {...props} style={{ ...styles.indicator, ...props.style }}>
    {indeterminate ? (
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
