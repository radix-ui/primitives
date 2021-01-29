import * as React from 'react';
import {
  createContext,
  composeEventHandlers,
  useControlledState,
  useComposedRefs,
} from '@radix-ui/react-utils';
import { Primitive } from '@radix-ui/react-primitive';
import { useLabelContext } from '@radix-ui/react-label';
import { getSelector } from '@radix-ui/utils';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Switch
 * -----------------------------------------------------------------------------------------------*/

const SWITCH_NAME = 'Switch';
const SWITCH_DEFAULT_TAG = 'button';

type InputDOMProps = React.ComponentProps<'input'>;
type SwitchOwnProps = Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    checked?: boolean;
    defaultChecked?: boolean;
    required?: InputDOMProps['required'];
    readOnly?: InputDOMProps['readOnly'];
    onCheckedChange?: InputDOMProps['onChange'];
  }
>;

type SwitchPrimitive = Polymorphic.ForwardRefComponent<typeof SWITCH_DEFAULT_TAG, SwitchOwnProps>;

const [SwitchContext, useSwitchContext] = createContext<boolean>(
  SWITCH_NAME + 'Context',
  SWITCH_NAME
);

const Switch = React.forwardRef((props, forwardedRef) => {
  const {
    as = SWITCH_DEFAULT_TAG,
    selector = getSelector(SWITCH_NAME),
    'aria-labelledby': ariaLabelledby,
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
      <SwitchContext.Provider value={checked}>
        <Primitive
          type="button"
          {...switchProps}
          as={as}
          selector={selector}
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
        />
      </SwitchContext.Provider>
    </>
  );
}) as SwitchPrimitive;

Switch.displayName = SWITCH_NAME;

/* -------------------------------------------------------------------------------------------------
 * SwitchThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'SwitchThumb';
const THUMB_DEFAULT_TAG = 'span';

type SwitchThumbOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type SwitchThumbPrimitive = Polymorphic.ForwardRefComponent<
  typeof THUMB_DEFAULT_TAG,
  SwitchThumbOwnProps
>;

const SwitchThumb = React.forwardRef((props, forwardedRef) => {
  const { as = THUMB_DEFAULT_TAG, selector = getSelector(THUMB_NAME), ...thumbProps } = props;
  const checked = useSwitchContext(THUMB_NAME);
  return (
    <Primitive
      {...thumbProps}
      as={as}
      selector={selector}
      ref={forwardedRef}
      data-state={getState(checked)}
    />
  );
}) as SwitchThumbPrimitive;

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
