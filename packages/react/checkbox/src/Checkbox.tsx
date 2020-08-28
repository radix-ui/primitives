import * as React from 'react';
import { cssReset, isUndefined } from '@interop-ui/utils';
import {
  createContext,
  createStyleObj,
  composeEventHandlers,
  forwardRef,
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
    const { as: Comp = CHECKBOX_DEFAULT_TAG, ...checkboxRootProps } = props;
    const isCheckedState = React.useState(false);

    return (
      <CheckboxContext.Provider value={isCheckedState}>
        <Comp {...checkboxRootProps} {...interopDataAttrObj('root')} ref={forwardedRef} />
      </CheckboxContext.Provider>
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

function isControlled(checked: boolean | undefined): checked is boolean {
  return !isUndefined(checked);
}

const CheckboxInput = forwardRef<typeof INPUT_DEFAULT_TAG, CheckboxInputProps>(
  function CheckboxInput(props, forwardedRef) {
    const { as: Comp = INPUT_DEFAULT_TAG, ...checkboxInputProps } = props;
    const [, setIsChecked] = useCheckboxContext(INPUT_NAME);
    const checked = props.checked ?? props.defaultChecked ?? false;

    React.useEffect(() => {
      setIsChecked(checked);
    }, [checked, setIsChecked]);

    const handleChange = composeEventHandlers(props.onChange, (event) => {
      if (!isControlled(props.checked)) setIsChecked(event.target.checked);
    });

    return (
      <Comp
        {...checkboxInputProps}
        {...interopDataAttrObj('input')}
        type="checkbox"
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
  const { as: Comp = BOX_DEFAULT_TAG, ...checkboxBoxProps } = props;
  return <Comp {...interopDataAttrObj('box')} ref={forwardedRef} {...checkboxBoxProps} />;
});

/* -------------------------------------------------------------------------------------------------
 * CheckboxCheckMark
 * -----------------------------------------------------------------------------------------------*/

const ICON_NAME = 'Checkbox.CheckMark';
const ICON_DEFAULT_TAG = 'span';

type CheckboxCheckMarkDOMProps = React.ComponentPropsWithoutRef<typeof ICON_DEFAULT_TAG>;
type CheckboxCheckMarkOwnProps = {};
type CheckboxCheckMarkProps = CheckboxCheckMarkDOMProps & CheckboxCheckMarkOwnProps;

const CheckboxCheckMark = forwardRef<typeof ICON_DEFAULT_TAG, CheckboxCheckMarkProps>(
  function CheckboxCheckMark(props, forwardedRef) {
    const { as: Comp = ICON_DEFAULT_TAG, ...iconProps } = props;
    const [isChecked] = useCheckboxContext(ICON_NAME);

    return isChecked ? (
      <Comp {...iconProps} {...interopDataAttrObj('icon')} ref={forwardedRef} />
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
Checkbox.CheckMark.displayName = ICON_NAME;

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
  icon: {
    ...cssReset(ICON_DEFAULT_TAG),
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
