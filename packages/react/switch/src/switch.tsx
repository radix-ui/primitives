import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useSize } from '@radix-ui/react-use-size';
import { Primitive } from '@radix-ui/react-primitive';

import type { Scope } from '@radix-ui/react-context';

const SWITCH_NAME = 'Switch';

type ScopedProps<P> = P & { __scopeSwitch?: Scope | undefined };
const [createSwitchContext, createSwitchScope] = createContextScope(SWITCH_NAME);

interface SwitchUserClick {
  requestedChecked: boolean;
  hasConsumerStoppedPropagation: boolean;
}

interface SwitchContextValue {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean | undefined;
  control: HTMLButtonElement | null;
  setControl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  name: string | undefined;
  form: string | undefined;
  value: string | number | readonly string[];
  userClick: SwitchUserClick | null;
  onUserClick: (userClick: SwitchUserClick) => void;
  required: boolean | undefined;
  defaultChecked: boolean | undefined;
  isFormControl: boolean;
  bubbleInput: HTMLInputElement | null;
  setBubbleInput: React.Dispatch<React.SetStateAction<HTMLInputElement | null>>;
}

const [SwitchProviderImpl, useSwitchContext] = createSwitchContext<SwitchContextValue>(SWITCH_NAME);

/* -------------------------------------------------------------------------------------------------
 * SwitchProvider
 * -----------------------------------------------------------------------------------------------*/

interface SwitchProviderProps {
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  required?: boolean | undefined;
  onCheckedChange?: ((checked: boolean) => void) | undefined;
  name?: string | undefined;
  form?: string | undefined;
  disabled?: boolean | undefined;
  value?: string | number | readonly string[] | undefined;
  children?: React.ReactNode | undefined;
}

function SwitchProvider(props: ScopedProps<SwitchProviderProps>) {
  const {
    __scopeSwitch,
    checked: checkedProp,
    children,
    defaultChecked,
    disabled,
    form,
    name,
    onCheckedChange,
    required,
    value = 'on',
    // @ts-expect-error
    internal_do_not_use_render,
  } = props;

  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: SWITCH_NAME,
  });
  const [control, setControl] = React.useState<HTMLButtonElement | null>(null);
  const [bubbleInput, setBubbleInput] = React.useState<HTMLInputElement | null>(null);
  // The latest user click on the trigger. The bubble input dispatches the click
  // to the form once React has handled it, whether or not `checked` changes in
  // the same render.
  const [userClick, setUserClick] = React.useState<SwitchUserClick | null>(null);

  const isFormControl = control
    ? !!form || !!control.closest('form')
    : // We set this to true by default so that events bubble to forms without JS (SSR)
      true;

  const context: SwitchContextValue = {
    checked,
    setChecked,
    disabled,
    control,
    setControl,
    name,
    form,
    value,
    userClick,
    onUserClick: setUserClick,
    required,
    defaultChecked,
    isFormControl,
    bubbleInput,
    setBubbleInput,
  };

  return (
    <SwitchProviderImpl scope={__scopeSwitch} {...context}>
      {isFunction(internal_do_not_use_render) ? internal_do_not_use_render(context) : children}
    </SwitchProviderImpl>
  );
}

/* -------------------------------------------------------------------------------------------------
 * SwitchTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'SwitchTrigger';

interface SwitchTriggerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Primitive.button>,
  keyof SwitchProviderProps
> {
  children?: React.ReactNode | undefined;
}

const SwitchTrigger = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, SwitchTriggerProps>(
  function SwitchTrigger(
    { __scopeSwitch, onClick, ...switchProps }: ScopedProps<SwitchTriggerProps>,
    forwardedRef,
  ) {
    const {
      control,
      form,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      onUserClick,
      isFormControl,
      bubbleInput,
    } = useSwitchContext(TRIGGER_NAME, __scopeSwitch);
    const composedRefs = useComposedRefs(forwardedRef, setControl);

    const initialCheckedStateRef = React.useRef(checked);
    React.useEffect(() => {
      const associatedForm = form ? control?.ownerDocument.getElementById(form) : control?.form;
      if (associatedForm instanceof HTMLFormElement) {
        const reset = () => setChecked(initialCheckedStateRef.current);
        associatedForm.addEventListener('reset', reset);
        return () => associatedForm.removeEventListener('reset', reset);
      }
    }, [control, form, setChecked]);

    return (
      <Primitive.button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-required={required}
        data-state={getState(checked)}
        data-disabled={disabled ? '' : undefined}
        disabled={disabled}
        value={value}
        {...switchProps}
        ref={composedRefs}
        onClick={composeEventHandlers(onClick, (event) => {
          const hasConsumerStoppedPropagation = event.isPropagationStopped();
          onUserClick({ requestedChecked: !checked, hasConsumerStoppedPropagation });
          setChecked((prevChecked) => !prevChecked);
          if (bubbleInput && isFormControl) {
            // if switch has a bubble input and is a form control, stop
            // propagation from the button so that we only propagate one click
            // event. We propagate changes from an input so that native form
            // validation works and form events reflect switch updates.
            if (!hasConsumerStoppedPropagation) {
              event.stopPropagation();
            }
          }
        })}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * Switch
 * -----------------------------------------------------------------------------------------------*/

type SwitchElement = React.ComponentRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface SwitchProps extends Omit<PrimitiveButtonProps, 'checked' | 'defaultChecked'> {
  checked?: boolean | undefined;
  defaultChecked?: boolean | undefined;
  required?: boolean | undefined;
  onCheckedChange?: ((checked: boolean) => void) | undefined;
}

const Switch = /* @__PURE__ */ React.forwardRef<SwitchElement, SwitchProps>(
  // blank line to reduce diff noise
  function Switch(props: ScopedProps<SwitchProps>, forwardedRef) {
    const {
      __scopeSwitch,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      form,
      ...switchProps
    } = props;

    return (
      <SwitchProvider
        __scopeSwitch={__scopeSwitch}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        required={required}
        onCheckedChange={onCheckedChange}
        name={name}
        form={form}
        value={value}
        // @ts-expect-error
        internal_do_not_use_render={({ isFormControl }: SwitchContextValue) => (
          <>
            <SwitchTrigger
              {...switchProps}
              ref={forwardedRef}
              // @ts-expect-error
              __scopeSwitch={__scopeSwitch}
            />
            {isFormControl && (
              <SwitchBubbleInput
                // @ts-expect-error
                __scopeSwitch={__scopeSwitch}
              />
            )}
          </>
        )}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * SwitchThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'SwitchThumb';

type SwitchThumbElement = React.ComponentRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface SwitchThumbProps extends PrimitiveSpanProps {}

const SwitchThumb = /* @__PURE__ */ React.forwardRef<SwitchThumbElement, SwitchThumbProps>(
  function SwitchThumb(props: ScopedProps<SwitchThumbProps>, forwardedRef) {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return (
      <Primitive.span
        data-state={getState(context.checked)}
        data-disabled={context.disabled ? '' : undefined}
        {...thumbProps}
        ref={forwardedRef}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * SwitchBubbleInput
 * -----------------------------------------------------------------------------------------------*/

const BUBBLE_INPUT_NAME = 'SwitchBubbleInput';

type InputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
interface SwitchBubbleInputProps extends Omit<InputProps, 'checked'> {}

const SwitchBubbleInput = /* @__PURE__ */ React.forwardRef<
  HTMLInputElement,
  SwitchBubbleInputProps
>(
  // blank line to reduce diff noise
  function SwitchBubbleInput(
    { __scopeSwitch, onClick, ...props }: ScopedProps<SwitchBubbleInputProps>,
    forwardedRef,
  ) {
    const {
      control,
      userClick,
      checked,
      defaultChecked,
      required,
      disabled,
      name,
      value,
      form,
      bubbleInput,
      setBubbleInput,
    } = useSwitchContext(BUBBLE_INPUT_NAME, __scopeSwitch);

    const composedRefs = useComposedRefs(forwardedRef, setBubbleInput);
    const controlSize = useSize(control);
    // When the checked change is not driven by a user interaction (e.g. a
    // controlled `checked` update), the `click` event we dispatch to notify
    // forms must not reach ancestor `onClick` handlers. We can't simply make it
    // non-bubbling because React derives the switch's `change` event from a
    // bubbling `click`. Instead we stop propagation of the synthetic click,
    // which still lets the `change` event reach the form.
    const shouldStopClickPropagationRef = React.useRef(false);

    const prevCheckedRef = React.useRef(checked);
    // The user click this input last dispatched, so each click is dispatched
    // once.
    const handledUserClickRef = React.useRef(userClick);
    // A dispatched user click whose `checked` change hasn't been applied yet
    // (e.g. a controlled parent applying it later). When it is applied, it
    // must still respect the consumer stopping the click's propagation.
    const pendingUserClickRef = React.useRef<SwitchUserClick | null>(null);

    // Bubble checked change to parents (e.g form change event)
    React.useEffect(() => {
      const input = bubbleInput;
      if (!input) return;

      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        'checked',
      ) as PropertyDescriptor;
      const setChecked = descriptor.set;
      if (!setChecked) {
        return;
      }

      const checkedChanged = prevCheckedRef.current !== checked;
      prevCheckedRef.current = checked;
      const isNewUserClick = userClick !== null && userClick !== handledUserClickRef.current;
      handledUserClickRef.current = userClick;

      if (isNewUserClick) {
        // Dispatch the user's click even if `checked` hasn't changed yet, so
        // ancestors are notified of every click on the trigger.
        pendingUserClickRef.current = checkedChanged ? null : userClick;
        if (checkedChanged) {
          setChecked.call(input, checked);
        }
        input.dispatchEvent(
          new Event('click', { bubbles: !userClick.hasConsumerStoppedPropagation }),
        );
      } else if (checkedChanged) {
        const pendingUserClick = pendingUserClickRef.current;
        pendingUserClickRef.current = null;
        const isPendingUserChange = pendingUserClick?.requestedChecked === checked;
        // The user's click already reached ancestors, and programmatic
        // updates never do, so this click only notifies the form.
        shouldStopClickPropagationRef.current = true;
        setChecked.call(input, checked);
        input.dispatchEvent(
          new Event('click', {
            bubbles: !(isPendingUserChange && pendingUserClick.hasConsumerStoppedPropagation),
          }),
        );
        shouldStopClickPropagationRef.current = false;
      }
    }, [bubbleInput, checked, userClick]);

    const defaultCheckedRef = React.useRef(checked);
    return (
      <Primitive.input
        type="checkbox"
        aria-hidden
        defaultChecked={defaultChecked ?? defaultCheckedRef.current}
        required={required}
        disabled={disabled}
        name={name}
        value={value}
        form={form}
        {...props}
        tabIndex={-1}
        ref={composedRefs}
        onClick={composeEventHandlers(onClick, (event) => {
          // Prevent the synthetic click dispatched on controlled/programmatic
          // updates from triggering ancestor `onClick` handlers, while still
          // allowing the resulting `change` event to reach the form.
          if (shouldStopClickPropagationRef.current) {
            event.stopPropagation();
          }
        })}
        style={{
          ...props.style,
          ...controlSize,
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0,
          margin: 0,
          // We transform because the input is absolutely positioned but we have
          // rendered it **after** the button. This pulls it back to sit on top
          // of the button.
          transform: 'translateX(-100%)',
        }}
      />
    );
  },
);

/* -----------------------------------------------------------------------------------------------*/

function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
}

function getState(checked: boolean) {
  return checked ? 'checked' : 'unchecked';
}

export {
  createSwitchScope,
  //
  Switch,
  SwitchProvider,
  SwitchTrigger,
  SwitchThumb,
  SwitchBubbleInput,
  //
  Switch as Root,
  SwitchProvider as Provider,
  SwitchTrigger as Trigger,
  SwitchThumb as Thumb,
  SwitchBubbleInput as BubbleInput,
};
export type {
  SwitchProps,
  SwitchProviderProps,
  SwitchTriggerProps,
  SwitchThumbProps,
  SwitchBubbleInputProps,
};
