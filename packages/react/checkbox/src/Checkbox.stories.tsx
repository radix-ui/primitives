import * as React from 'react';
import { Label as LabelPrimitive, styles as labelStyles } from '@interop-ui/react-label';
import { Checkbox, styles } from './Checkbox';

export default { title: 'Components/Checkbox' };

export const Basic = () => (
  <Checkbox style={styles.root}>
    <Checkbox.Indicator style={styles.indicator} />
  </Checkbox>
);

export const InlineStyle = () => (
  <>
    <p>
      This checkbox is nested inside a label. The box-shadow is styled to appear when the checkbox
      is in focus regardless of the input modality. The state is uncontrolled.
    </p>
    <Label>
      Label{' '}
      <Checkbox as={Root}>
        <Checkbox.Indicator as={Indicator} />
      </Checkbox>
    </Label>
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
      <Label htmlFor="randBox">Label</Label>{' '}
      <Checkbox
        as={Root}
        checked={checked}
        onCheckedChange={(event) => setChecked(event.target.checked)}
        id="randBox"
      >
        <Checkbox.Indicator as={Indicator} />
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
          as={Root}
          checked={checked}
          onCheckedChange={(event) => setChecked(event.target.checked)}
        >
          <Checkbox.Indicator as={Indicator} indeterminate={checked === 'indeterminate'} />
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

      <Checkbox as={Root}>
        <Checkbox.Indicator as={Indicator} />
      </Checkbox>
    </form>
  );
};

/* -------------------------------------------------------------------------------------------------
 * Label
 * -----------------------------------------------------------------------------------------------*/

const Label = (props: any) => <LabelPrimitive {...props} style={labelStyles.root} />;

/* -------------------------------------------------------------------------------------------------
 * Styled components
 * -----------------------------------------------------------------------------------------------*/

const Root = React.forwardRef((props: any, forwardedRef) => {
  // NOTE: We can remove this when we add stitches as a dev dependency and handle focus styles there
  //       This is just for testing quickly with inline styles.
  const [focused, setFocused] = React.useState(false);
  const focusStyles = {
    boxShadow: 'none',
    outline: focused ? '2px solid crimson' : undefined,
  };
  return (
    <button
      {...props}
      type="button"
      ref={forwardedRef}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...styles.root,
        ...focusStyles,
        border: '1px solid gainsboro',
        width: 30,
        height: 30,
        padding: 4,
      }}
    />
  );
});

const Indicator = ({ indeterminate, ...props }: any) => (
  <span
    {...props}
    style={{
      ...styles.indicator,
      width: 20,
      height: 20,
      backgroundColor: 'dodgerblue',
      display: 'grid',
      placeItems: 'center',
      color: 'white',
    }}
  >
    {indeterminate ? (
      <b style={{ paddingBottom: '2px' }}>&mdash;</b>
    ) : (
      <svg viewBox="0 0 32 32" width="60%" height="60%" fill="none" stroke="currentColor">
        <path d="M2 30 L30 2 M30 30 L2 2" />
      </svg>
    )}
  </span>
);
