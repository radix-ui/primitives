import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { usePrevious } from '@radix-ui/react-use-previous';
import { useSize } from '@radix-ui/react-use-size';
import { Primitive } from '@radix-ui/react-primitive';
import { useLabelContext } from '@radix-ui/react-label';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Switch
 * -----------------------------------------------------------------------------------------------*/

const SWITCH_NAME = 'Switch';
const SWITCH_DEFAULT_TAG = 'button';

type InputDOMProps = React.ComponentProps<'input'>;
type SwitchOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    checked?: boolean;
    defaultChecked?: boolean;
    required?: InputDOMProps['required'];
    onCheckedChange?(checked: boolean): void;
  }
>;

type SwitchPrimitive = Polymorphic.ForwardRefComponent<typeof SWITCH_DEFAULT_TAG, SwitchOwnProps>;

type SwitchContextValue = { checked: boolean; disabled?: boolean };

const [SwitchProvider, useSwitchContext] = createContext<SwitchContextValue>(SWITCH_NAME);

const Switch = React.forwardRef((props, forwardedRef) => {
  const {
    as = SWITCH_DEFAULT_TAG,
    'aria-labelledby': ariaLabelledby,
    name,
    checked: checkedProp,
    defaultChecked,
    required,
    disabled,
    value = 'on',
    onCheckedChange,
    ...switchProps
  } = props;
  const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
  const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
  const labelId = useLabelContext(button);
  const labelledBy = ariaLabelledby || labelId;
  const hasConsumerStoppedPropagationRef = React.useRef(false);
  // We set this to true by default so that events bubble to forms without JS (SSR)
  const isFormControl = button ? Boolean(button.closest('form')) : true;
  const [checked = false, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  });

  return (
    <SwitchProvider checked={checked} disabled={disabled}>
      <Primitive
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelledBy}
        aria-required={required}
        data-state={getState(checked)}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        value={value}
        {...switchProps}
        as={as}
        ref={composedRefs}
        onClick={composeEventHandlers(props.onClick, (event) => {
          setChecked((prevChecked) => !prevChecked);
          if (isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            // if switch is in a form, stop propagation from the button so that we only propagate
            // one click event (from the input). We propagate changes from an input so that native
            // form validation works and form events reflect switch updates.
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })}
      />
      {isFormControl && (
        <BubbleInput
          control={button}
          stoppedPropagation={hasConsumerStoppedPropagationRef.current}
          name={name}
          value={value}
          checked={checked}
          required={required}
          disabled={disabled}
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          style={{ transform: 'translateX(-100%)' }}
        />
      )}
    </SwitchProvider>
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
  const { as = THUMB_DEFAULT_TAG, ...thumbProps } = props;
  const context = useSwitchContext(THUMB_NAME);
  return (
    <Primitive
      data-state={getState(context.checked)}
      data-disabled={context.disabled ? '' : undefined}
      {...thumbProps}
      as={as}
      ref={forwardedRef}
    />
  );
}) as SwitchThumbPrimitive;

SwitchThumb.displayName = THUMB_NAME;

/* ---------------------------------------------------------------------------------------------- */

type BubbleInputProps = Omit<React.ComponentProps<'input'>, 'checked'> & {
  checked: boolean;
  control: HTMLElement | null;
  stoppedPropagation: boolean;
};

const BubbleInput = (props: BubbleInputProps) => {
  const { control, checked, stoppedPropagation, ...inputProps } = props;
  const ref = React.useRef<HTMLInputElement>(null);
  const prevChecked = usePrevious(checked);
  const controlSize = useSize(control);

  // Bubble checked change to parents (e.g form change event)
  React.useEffect(() => {
    const input = ref.current!;
    const inputProto = window.HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(inputProto, 'checked') as PropertyDescriptor;
    const setChecked = descriptor.set;
    if (!stoppedPropagation && prevChecked !== checked && setChecked) {
      const event = new Event('click', { bubbles: true });
      setChecked.call(input, checked);
      input.dispatchEvent(event);
    }
  }, [prevChecked, checked, stoppedPropagation]);

  return (
    <input
      type="checkbox"
      {...inputProps}
      tabIndex={-1}
      ref={ref}
      style={{
        ...props.style,
        ...controlSize,
        position: 'absolute',
        pointerEvents: 'none',
        opacity: 0,
        margin: 0,
      }}
    />
  );
};

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
export type { SwitchPrimitive, SwitchThumbPrimitive };
