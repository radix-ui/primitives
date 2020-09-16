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

type CheckedStates = boolean | 'mixed';
type CheckboxDOMProps = React.ComponentPropsWithoutRef<typeof CHECKBOX_DEFAULT_TAG>;
type CheckboxOwnProps = { isChecked?: CheckedStates; defaultIsChecked?: CheckedStates };
type CheckboxProps = CheckboxOwnProps & Omit<CheckboxDOMProps, 'checked' | 'defaultChecked'>;

const [CheckboxContext, useCheckboxContext] = createContext<CheckedStates>(
  CHECKBOX_NAME + 'Context',
  CHECKBOX_NAME
);

const Checkbox = forwardRef<typeof CHECKBOX_DEFAULT_TAG, CheckboxProps, CheckboxStaticProps>(
  function Checkbox(props, forwardedRef) {
    const {
      as: Comp = CHECKBOX_DEFAULT_TAG,
      children,
      isChecked: isCheckedProp,
      defaultIsChecked,
      onChange,
      ...checkboxProps
    } = props;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const ref = useComposedRefs(forwardedRef, inputRef);
    const [isChecked = false, setIsChecked] = useControlledState({
      prop: isCheckedProp,
      defaultProp: defaultIsChecked,
    });

    React.useEffect(() => {
      const isIndeterminate = isChecked === 'mixed';
      inputRef.current && (inputRef.current.indeterminate = isIndeterminate);
    });

    return (
      <span
        {...interopDataAttrObj('wrapper')}
        style={{ display: 'inline-block', verticalAlign: 'middle', position: 'relative' }}
      >
        <Comp
          {...checkboxProps}
          {...interopDataAttrObj('root')}
          type="checkbox"
          checked={isChecked === 'mixed' || isChecked}
          ref={ref}
          onChange={composeEventHandlers(onChange, (event) => setIsChecked(event.target.checked))}
        />
        <CheckboxContext.Provider value={isChecked}>{children}</CheckboxContext.Provider>
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
    const isChecked = useCheckboxContext(INDICATOR_NAME);
    return isChecked ? <CheckboxIndicatorImpl {...props} ref={forwardedRef} /> : null;
  }
);

const CheckboxIndicatorImpl = forwardRef<typeof INDICATOR_DEFAULT_TAG, CheckboxIndicatorProps>(
  function CheckboxIndicatorImpl(props, forwardedRef) {
    const { as: Comp = INDICATOR_DEFAULT_TAG, ...indicatorProps } = props;
    return <Comp {...indicatorProps} {...interopDataAttrObj('indicator')} ref={forwardedRef} />;
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
