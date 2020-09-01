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
type CheckboxContextValue = [boolean, React.Dispatch<React.SetStateAction<boolean>>];

const [CheckboxContext, useCheckboxContext] = createContext<CheckboxContextValue>(
  'CheckboxContext',
  CHECKBOX_NAME
);

const Checkbox = forwardRef<typeof CHECKBOX_DEFAULT_TAG, CheckboxProps, CheckboxStaticProps>(
  function Checkbox(props, forwardedRef) {
    const { as: Comp = CHECKBOX_DEFAULT_TAG, children, ...checkboxProps } = props;
    const isCheckedState = React.useState(false);

    return (
      <Comp {...checkboxProps} {...interopDataAttrObj('root')} ref={forwardedRef}>
        <CheckboxContext.Provider value={isCheckedState}>{children}</CheckboxContext.Provider>
      </Comp>
    );
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
  function CheckboxInput(props, forwardedRef) {
    const {
      as: Comp = INPUT_DEFAULT_TAG,
      checked,
      defaultChecked,
      onChange,
      ...inputProps
    } = props;
    const [, setIsCheckedContext] = useCheckboxContext(INPUT_NAME);

    // Make sure `isChecked` is always a `boolean` and not `boolean | undefined`
    const [isChecked = false, setIsChecked] = useControlledState({
      prop: checked,
      defaultProp: defaultChecked,
    });

    const handleChange = composeEventHandlers(onChange, (event) => {
      setIsChecked(event.target.checked);
    });

    // Make sure the parent context reflects the checked state (including on initial render)
    React.useEffect(() => {
      setIsCheckedContext(isChecked);
    }, [isChecked, setIsCheckedContext]);

    return (
      <Comp
        {...inputProps}
        {...interopDataAttrObj('input')}
        type="checkbox"
        checked={isChecked}
        ref={forwardedRef}
        onChange={handleChange}
      />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * CheckboxBox
 * -----------------------------------------------------------------------------------------------*/

const BOX_NAME = 'Checkbox.Box';
const BOX_DEFAULT_TAG = 'span';

type CheckboxBoxDOMProps = React.ComponentPropsWithoutRef<typeof BOX_DEFAULT_TAG>;
type CheckboxBoxOwnProps = {};
type CheckboxBoxProps = CheckboxBoxDOMProps & CheckboxBoxOwnProps;

const CheckboxBox = forwardRef<typeof BOX_DEFAULT_TAG, CheckboxBoxProps>(function CheckboxBox(
  props,
  forwardedRef
) {
  const { as: Comp = BOX_DEFAULT_TAG, ...boxProps } = props;
  return <Comp {...interopDataAttrObj('box')} ref={forwardedRef} {...boxProps} />;
});

/* -------------------------------------------------------------------------------------------------
 * CheckboxCheckMark
 * -----------------------------------------------------------------------------------------------*/

const CHECKMARK_NAME = 'Checkbox.CheckMark';
const CHECKMARK_DEFAULT_TAG = 'span';

type CheckboxCheckMarkDOMProps = React.ComponentPropsWithoutRef<typeof CHECKMARK_DEFAULT_TAG>;
type CheckboxCheckMarkOwnProps = {};
type CheckboxCheckMarkProps = CheckboxCheckMarkDOMProps & CheckboxCheckMarkOwnProps;

const CheckboxCheckMark = forwardRef<typeof CHECKMARK_DEFAULT_TAG, CheckboxCheckMarkProps>(
  function CheckboxCheckMark(props, forwardedRef) {
    const { as: Comp = CHECKMARK_DEFAULT_TAG, ...checkMarkProps } = props;
    const [isChecked] = useCheckboxContext(CHECKMARK_NAME);

    return isChecked ? (
      <Comp {...checkMarkProps} {...interopDataAttrObj('checkMark')} ref={forwardedRef} />
    ) : null;
  }
);

/* ---------------------------------------------------------------------------------------------- */

Checkbox.Input = CheckboxInput;
Checkbox.Box = CheckboxBox;
Checkbox.CheckMark = CheckboxCheckMark;

Checkbox.displayName = CHECKBOX_NAME;
Checkbox.Input.displayName = INPUT_NAME;
Checkbox.Box.displayName = BOX_NAME;
Checkbox.CheckMark.displayName = CHECKMARK_NAME;

interface CheckboxStaticProps {
  Input: typeof CheckboxInput;
  Box: typeof CheckboxBox;
  CheckMark: typeof CheckboxCheckMark;
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
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
    opacity: 0,
    width: '100%',
    height: '100%',
  },
  box: {
    ...cssReset(BOX_DEFAULT_TAG),
    flex: 1,
  },
  checkMark: {
    ...cssReset(CHECKMARK_DEFAULT_TAG),
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    userSelect: 'none',
  },
});

export type { CheckboxProps, CheckboxInputProps, CheckboxBoxProps, CheckboxCheckMarkProps };
export { Checkbox, styles };
