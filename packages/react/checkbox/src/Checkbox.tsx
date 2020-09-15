import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import {
  createContext,
  createStyleObj,
  composeEventHandlers,
  forwardRef,
  useControlledState,
} from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_NAME = 'Checkbox';
const CHECKBOX_DEFAULT_TAG = 'span';

type CheckboxDOMProps = React.ComponentPropsWithoutRef<typeof CHECKBOX_DEFAULT_TAG>;
type CheckboxOwnProps = {};
type CheckboxProps = CheckboxDOMProps & CheckboxOwnProps;

const [CheckboxContext, useCheckboxContext] = createContext<boolean>(
  'CheckboxContext',
  CHECKBOX_NAME
);

const Checkbox = forwardRef<typeof CHECKBOX_DEFAULT_TAG, CheckboxProps, CheckboxStaticProps>(
  function Checkbox(props, forwardedRef) {
    const { as: Comp = CHECKBOX_DEFAULT_TAG, ...checkboxProps } = props;
    return <Comp {...checkboxProps} {...interopDataAttrObj('root')} ref={forwardedRef} />;
  }
);

/* -------------------------------------------------------------------------------------------------
 * CheckboxInput
 * -----------------------------------------------------------------------------------------------*/

const INPUT_NAME = 'Checkbox.Input';
const INPUT_DEFAULT_TAG = 'input';

type CheckboxInputDOMProps = React.ComponentPropsWithoutRef<typeof INPUT_DEFAULT_TAG>;
type CheckboxInputOwnProps = {};
type CheckboxInputProps = CheckboxInputDOMProps & CheckboxInputOwnProps;

const CheckboxInput = forwardRef<typeof INPUT_DEFAULT_TAG, CheckboxInputProps>(
  function CheckboxIndicator(props, forwardedRef) {
    const {
      as: Comp = INPUT_DEFAULT_TAG,
      children,
      checked,
      defaultChecked,
      onChange,
      ...checkboxProps
    } = props;
    const [isChecked = false, setIsChecked] = useControlledState({
      prop: checked,
      defaultProp: defaultChecked,
    });

    const handleChange = composeEventHandlers(onChange, (event) => {
      setIsChecked(event.target.checked);
    });

    return (
      <>
        <Comp
          {...checkboxProps}
          {...interopDataAttrObj('input')}
          type="checkbox"
          checked={isChecked}
          ref={forwardedRef}
          onChange={handleChange}
        />
        <CheckboxContext.Provider value={isChecked}>{children}</CheckboxContext.Provider>
      </>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * CheckboxIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'Checkbox.Indicator';
const INDICATOR_DEFAULT_TAG = 'span';

type CheckboxIndicatorDOMProps = React.ComponentPropsWithoutRef<typeof INDICATOR_DEFAULT_TAG>;
type CheckboxIndicatorOwnProps = {};
type CheckboxIndicatorProps = CheckboxIndicatorDOMProps & CheckboxIndicatorOwnProps;

const CheckboxIndicator = forwardRef<typeof INDICATOR_DEFAULT_TAG, CheckboxIndicatorProps>(
  function CheckboxIndicator(props, forwardedRef) {
    const { as: Comp = INDICATOR_DEFAULT_TAG, ...indicatorProps } = props;
    const isChecked = useCheckboxContext(INDICATOR_NAME);

    return isChecked ? (
      <Comp {...indicatorProps} {...interopDataAttrObj('indicator')} ref={forwardedRef} />
    ) : null;
  }
);

/* ---------------------------------------------------------------------------------------------- */

Checkbox.Input = CheckboxInput;
Checkbox.Indicator = CheckboxIndicator;

Checkbox.displayName = CHECKBOX_NAME;
Checkbox.Input.displayName = INPUT_NAME;
Checkbox.Indicator.displayName = INDICATOR_NAME;

interface CheckboxStaticProps {
  Input: typeof CheckboxInput;
  Indicator: typeof CheckboxIndicator;
}

const [styles, interopDataAttrObj] = createStyleObj(CHECKBOX_NAME, {
  root: {
    ...cssReset(CHECKBOX_DEFAULT_TAG),
    display: 'inline-flex',
    position: 'relative',
    verticalAlign: 'middle',
    zIndex: 0,
  },
  input: {
    ...cssReset(INPUT_DEFAULT_TAG),
    flex: '1',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    zIndex: 1,
  },
  indicator: {
    ...cssReset(INDICATOR_DEFAULT_TAG),
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

export type { CheckboxProps, CheckboxIndicatorProps };
export { Checkbox, styles };
