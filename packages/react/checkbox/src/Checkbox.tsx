import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import {
  createContext,
  createStyleObj,
  composeEventHandlers,
  forwardRef,
  useControlledState,
  useComposedRefs,
} from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Checkbox
 * -----------------------------------------------------------------------------------------------*/

const CHECKBOX_NAME = 'Checkbox';
const CHECKBOX_DEFAULT_TAG = 'input';

type CheckedState = boolean | 'indeterminate';
type CheckboxDOMProps = React.ComponentPropsWithoutRef<typeof CHECKBOX_DEFAULT_TAG>;
type CheckboxOwnProps = {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: CheckboxDOMProps['onChange'];
};
type CheckboxProps = CheckboxOwnProps & Omit<CheckboxDOMProps, keyof CheckboxOwnProps | 'onChange'>;

const [CheckboxContext, useCheckboxContext] = createContext<CheckedState>(
  CHECKBOX_NAME + 'Context',
  CHECKBOX_NAME
);

const Checkbox = forwardRef<typeof CHECKBOX_DEFAULT_TAG, CheckboxProps, CheckboxStaticProps>(
  function Checkbox(props, forwardedRef) {
    const {
      as: Comp = CHECKBOX_DEFAULT_TAG,
      children,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      ...checkboxProps
    } = props;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const ref = useComposedRefs(forwardedRef, inputRef);
    const [checked = false, setChecked] = useControlledState({
      prop: checkedProp,
      defaultProp: defaultChecked,
    });

    React.useEffect(() => {
      const isIndeterminate = checked === 'indeterminate';
      inputRef.current && (inputRef.current.indeterminate = isIndeterminate);
    });

    return (
      <span
        {...interopDataAttrObj('wrapper')}
        // Uses `inline-flex` to prevent extraneous whitespace below input
        style={{ display: 'inline-flex', verticalAlign: 'middle', position: 'relative' }}
      >
        <Comp
          {...checkboxProps}
          {...interopDataAttrObj('root')}
          type="checkbox"
          checked={checked === 'indeterminate' ? false : checked}
          data-state={getState(checked)}
          ref={ref}
          onChange={composeEventHandlers(onCheckedChange, (event) =>
            setChecked(event.target.checked)
          )}
        />
        <CheckboxContext.Provider value={checked}>{children}</CheckboxContext.Provider>
      </span>
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
    const checked = useCheckboxContext(INDICATOR_NAME);
    return checked ? (
      <CheckboxIndicatorImpl {...props} data-state={getState(checked)} ref={forwardedRef} />
    ) : null;
  }
);

const CheckboxIndicatorImpl = forwardRef<typeof INDICATOR_DEFAULT_TAG, CheckboxIndicatorProps>(
  function CheckboxIndicatorImpl(props, forwardedRef) {
    const { as: Comp = INDICATOR_DEFAULT_TAG, ...indicatorProps } = props;
    return <Comp {...indicatorProps} {...interopDataAttrObj('indicator')} ref={forwardedRef} />;
  }
);

/* ---------------------------------------------------------------------------------------------- */

function getState(checked: CheckedState) {
  return checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked';
}

Checkbox.Indicator = CheckboxIndicator;

Checkbox.displayName = CHECKBOX_NAME;
Checkbox.Indicator.displayName = INDICATOR_NAME;

interface CheckboxStaticProps {
  Indicator: typeof CheckboxIndicator;
}

const [styles, interopDataAttrObj] = createStyleObj(CHECKBOX_NAME, {
  wrapper: {},
  root: {
    ...cssReset(CHECKBOX_DEFAULT_TAG),
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
  },
  indicator: {
    ...cssReset(INDICATOR_DEFAULT_TAG),
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
});

export type { CheckboxProps, CheckboxIndicatorProps };
export { Checkbox, styles };
