import * as React from 'react';
import {
  createContext,
  composeEventHandlers,
  useControlledState,
  useComposedRefs,
} from '@radix-ui/react-utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import { useLabelContext } from '@radix-ui/react-label';
import { getPartDataAttrObj } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Switch
 * -----------------------------------------------------------------------------------------------*/

const SWITCH_NAME = 'Switch';
const SWITCH_DEFAULT_TAG = 'button';

type InputDOMProps = React.ComponentProps<'input'>;
type SwitchOwnProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  required?: InputDOMProps['required'];
  readOnly?: InputDOMProps['readOnly'];
  onCheckedChange?: InputDOMProps['onChange'];
  onChange: never;
};

const [SwitchContext, useSwitchContext] = createContext<boolean>(
  SWITCH_NAME + 'Context',
  SWITCH_NAME
);

const Switch = forwardRefWithAs<typeof SWITCH_DEFAULT_TAG, SwitchOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = SWITCH_DEFAULT_TAG,
      'aria-labelledby': ariaLabelledby,
      children,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      readOnly,
      value = 'on',
      onCheckedChange,
      ...switchProps
    } = props;
    const inputRef = React.useRef<HTMLInputElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const ref = useComposedRefs(forwardedRef, buttonRef);
    const labelId = useLabelContext(buttonRef);
    const labelledBy = ariaLabelledby || labelId;
    const [checked = false, setChecked] = useControlledState({
      prop: checkedProp,
      defaultProp: defaultChecked,
    });

    return (
      /**
       * The `input` is hidden from non-SR and SR users as it only exists to
       * ensure form events fire when the value changes and that the value
       * updates when clicking an associated label.
       */
      <>
        <input
          ref={inputRef}
          type="checkbox"
          name={name}
          checked={checked}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          value={value}
          hidden
          onChange={composeEventHandlers(onCheckedChange, (event) => {
            setChecked(event.target.checked);
          })}
        />
        <Comp
          type="button"
          {...switchProps}
          {...getPartDataAttrObj(SWITCH_NAME)}
          ref={ref}
          role="switch"
          aria-checked={checked}
          aria-labelledby={labelledBy}
          aria-required={required}
          data-state={getState(checked)}
          data-readonly={readOnly}
          disabled={disabled}
          value={value}
          /**
           * The `input` is hidden, so when the button is clicked we trigger
           * the input manually
           */
          onClick={composeEventHandlers(props.onClick, () => inputRef.current?.click(), {
            checkForDefaultPrevented: false,
          })}
        >
          <SwitchContext.Provider value={checked}>{children}</SwitchContext.Provider>
        </Comp>
      </>
    );
  }
);

Switch.displayName = SWITCH_NAME;

/* -------------------------------------------------------------------------------------------------
 * SwitchThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'SwitchThumb';
const THUMB_DEFAULT_TAG = 'span';

const SwitchThumb = forwardRefWithAs<typeof THUMB_DEFAULT_TAG>((props, forwardedRef) => {
  const checked = useSwitchContext(THUMB_NAME);
  const { as: Comp = THUMB_DEFAULT_TAG, ...thumbProps } = props;
  return (
    <Comp
      {...thumbProps}
      {...getPartDataAttrObj(THUMB_NAME)}
      data-state={getState(checked)}
      ref={forwardedRef}
    />
  );
});

SwitchThumb.displayName = THUMB_NAME;

/* ---------------------------------------------------------------------------------------------- */

function getState(checked: boolean) {
  return checked ? 'checked' : 'unchecked';
}

const Root = Switch;
const Thumb = SwitchThumb;

export {
  Switch,
  SwitchThumb,
  //
  Root,
  Thumb,
};
