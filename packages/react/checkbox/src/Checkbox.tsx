import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { FormValue } from '@interop-ui/react-form-value';
import {
  createContext,
  createStyleObj,
  forwardRef,
  useControlledState,
} from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_NAME = 'Checkbox';
const CHECKBOX_DEFAULT_TAG = 'button';

type CheckboxDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof CHECKBOX_DEFAULT_TAG>,
  'onChange'
>;
type CheckboxOwnProps = {
  isChecked?: boolean;
  defaultIsChecked?: boolean;
  onChange?: (event: CustomEvent<{ checked: boolean }>) => void;
};
type CheckboxProps = CheckboxDOMProps & CheckboxOwnProps;

const [CheckboxContext, useCheckboxContext] = createContext<boolean>(
  'CheckboxContext',
  CHECKBOX_NAME
);

const Checkbox = forwardRef<typeof CHECKBOX_DEFAULT_TAG, CheckboxProps, CheckboxStaticProps>(
  function Checkbox(props, forwardedRef) {
    const {
      as: Comp = CHECKBOX_DEFAULT_TAG,
      isChecked: isCheckedProp,
      defaultIsChecked,
      children,
      name,
      value = 'on',
      onChange = () => {},
      ...checkboxProps
    } = props;

    const [isChecked = false, setIsChecked] = useControlledState({
      prop: isCheckedProp,
      defaultProp: defaultIsChecked,
    });

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      const button = event.currentTarget;
      const changeEvent = new CustomEvent('change', {
        bubbles: true,
        cancelable: true,
        detail: { checked: !isChecked },
      });

      button.addEventListener('change', (event) => onChange(event as typeof changeEvent), {
        once: true,
      });

      if (button.dispatchEvent(changeEvent)) {
        setIsChecked((prevIsChecked) => !prevIsChecked);
      }
    };

    return (
      <CheckboxContext.Provider value={isChecked}>
        <FormValue name={name} value={isChecked ? value : ''} />
        <Comp
          {...checkboxProps}
          type="button"
          role="checkbox"
          aria-checked={isChecked}
          data-state={isChecked ? 'checked' : undefined}
          onClick={handleClick}
          ref={forwardedRef}
        >
          {children}
        </Comp>
      </CheckboxContext.Provider>
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

Checkbox.Indicator = CheckboxIndicator;

Checkbox.displayName = CHECKBOX_NAME;
Checkbox.Indicator.displayName = INDICATOR_NAME;

interface CheckboxStaticProps {
  Indicator: typeof CheckboxIndicator;
}

const [styles, interopDataAttrObj] = createStyleObj(CHECKBOX_NAME, {
  root: {
    ...cssReset(CHECKBOX_DEFAULT_TAG),
    position: 'relative',
    userSelect: 'none',
    zIndex: 0,
  },
  indicator: {
    ...cssReset(INDICATOR_DEFAULT_TAG),
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1,
  },
});

export type { CheckboxProps, CheckboxIndicatorProps };
export { Checkbox, styles };
