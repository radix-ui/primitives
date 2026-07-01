import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { usePrevious } from '@radix-ui/react-use-previous';
import { useSize } from '@radix-ui/react-use-size';
import {
  Primitive,
  runActionInTransition,
  useActionOptimisticState,
} from '@radix-ui/react-primitive';

import type { Scope } from '@radix-ui/react-context';

const SWITCH_NAME = 'Switch';

type ScopedProps<P> = P & { __scopeSwitch?: Scope };
const [createSwitchContext, createSwitchScope] = createContextScope(SWITCH_NAME);

type SwitchContextValue = {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  resetChecked(checked: boolean): void;
  checkedChangePending: boolean;
  disabled: boolean | undefined;
  control: HTMLButtonElement | null;
  setControl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  name: string | undefined;
  form: string | undefined;
  value: string | number | readonly string[];
  hasConsumerStoppedPropagationRef: React.RefObject<boolean>;
  required: boolean | undefined;
  defaultChecked: boolean | undefined;
  isFormControl: boolean;
  bubbleInput: HTMLInputElement | null;
  setBubbleInput: React.Dispatch<React.SetStateAction<HTMLInputElement | null>>;
};

const [SwitchProviderImpl, useSwitchContext] = createSwitchContext<SwitchContextValue>(SWITCH_NAME);

type SwitchCheckedChangedAction = (checked: boolean) => void | PromiseLike<unknown>;

/* -------------------------------------------------------------------------------------------------
 * SwitchProvider
 * -----------------------------------------------------------------------------------------------*/

interface SwitchProviderProps {
  checked?: boolean;
  defaultChecked?: boolean;
  required?: boolean;
  onCheckedChange?(checked: boolean): void;
  checkedChangedAction?: SwitchCheckedChangedAction;
  name?: string;
  form?: string;
  disabled?: boolean;
  value?: string | number | readonly string[];
  children?: React.ReactNode;
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
    checkedChangedAction,
    required,
    value = 'on',
    // @ts-expect-error
    internal_do_not_use_render,
  } = props;

  const [committedChecked, setCommittedChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked ?? false,
    onChange: onCheckedChange,
    caller: SWITCH_NAME,
  });
  const checkedActionPendingRef = React.useRef(false);
  const [checkedChangePending, setCheckedChangePending] = React.useState(false);
  const [checked, setOptimisticChecked] = useActionOptimisticState(
    committedChecked,
    (_currentChecked, optimisticChecked: boolean) => optimisticChecked,
    checkedChangedAction !== undefined,
    SWITCH_NAME,
    'checkedChangedAction',
  );
  const setChecked = React.useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
    (nextChecked) => {
      const nextCheckedValue = isFunction(nextChecked) ? nextChecked(checked) : nextChecked;

      if (!checkedChangedAction) {
        setCommittedChecked(nextCheckedValue);
        return;
      }

      if (checkedActionPendingRef.current) return;

      const previousChecked = committedChecked;
      setCheckedChangePending(true);
      checkedActionPendingRef.current = true;

      runActionInTransition(
        () => {
          setOptimisticChecked(nextCheckedValue);
          return checkedChangedAction(nextCheckedValue);
        },
        () => {
          checkedActionPendingRef.current = false;
          setCheckedChangePending(false);
          setCommittedChecked(nextCheckedValue);
        },
        () => {
          checkedActionPendingRef.current = false;
          setCheckedChangePending(false);
          setCommittedChecked(previousChecked);
        },
      );
    },
    [checked, checkedChangedAction, committedChecked, setCommittedChecked, setOptimisticChecked],
  );
  const [control, setControl] = React.useState<HTMLButtonElement | null>(null);
  const [bubbleInput, setBubbleInput] = React.useState<HTMLInputElement | null>(null);
  const hasConsumerStoppedPropagationRef = React.useRef(false);
  const isFormControl = control
    ? !!form || !!control.closest('form')
    : // We set this to true by default so that events bubble to forms without JS (SSR)
      true;

  const context: SwitchContextValue = {
    checked,
    setChecked,
    resetChecked: setCommittedChecked,
    checkedChangePending,
    disabled,
    control,
    setControl,
    name,
    form,
    value,
    hasConsumerStoppedPropagationRef,
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
  children?: React.ReactNode;
}

const SwitchTrigger = React.forwardRef<HTMLButtonElement, SwitchTriggerProps>(
  ({ __scopeSwitch, onClick, ...switchProps }: ScopedProps<SwitchTriggerProps>, forwardedRef) => {
    const {
      control,
      form,
      value,
      disabled,
      checked,
      required,
      setControl,
      setChecked,
      resetChecked,
      checkedChangePending,
      hasConsumerStoppedPropagationRef,
      isFormControl,
      bubbleInput,
    } = useSwitchContext(TRIGGER_NAME, __scopeSwitch);
    const composedRefs = useComposedRefs(forwardedRef, setControl);

    const initialCheckedStateRef = React.useRef(checked);
    React.useEffect(() => {
      const associatedForm = form ? control?.ownerDocument.getElementById(form) : control?.form;
      if (associatedForm instanceof HTMLFormElement) {
        const reset = () => resetChecked(initialCheckedStateRef.current);
        associatedForm.addEventListener('reset', reset);
        return () => associatedForm.removeEventListener('reset', reset);
      }
    }, [control, form, resetChecked]);

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
          if (!checkedChangePending) {
            setChecked((prevChecked) => !prevChecked);
          }
          if (bubbleInput && isFormControl) {
            hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
            // if switch has a bubble input and is a form control, stop
            // propagation from the button so that we only propagate one click
            // event (from the input). We propagate changes from an input so
            // that native form validation works and form events reflect switch
            // updates.
            if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
          }
        })}
      />
    );
  },
);

SwitchTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * Switch
 * -----------------------------------------------------------------------------------------------*/

type SwitchElement = React.ComponentRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface SwitchProps extends Omit<PrimitiveButtonProps, 'checked' | 'defaultChecked'> {
  checked?: boolean;
  defaultChecked?: boolean;
  required?: boolean;
  onCheckedChange?(checked: boolean): void;
  checkedChangedAction?: SwitchCheckedChangedAction;
}

const Switch = React.forwardRef<SwitchElement, SwitchProps>(
  (props: ScopedProps<SwitchProps>, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked,
      defaultChecked,
      required,
      disabled,
      value,
      onCheckedChange,
      checkedChangedAction,
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
        checkedChangedAction={checkedChangedAction}
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

Switch.displayName = SWITCH_NAME;

/* -------------------------------------------------------------------------------------------------
 * SwitchThumb
 * -----------------------------------------------------------------------------------------------*/

const THUMB_NAME = 'SwitchThumb';

type SwitchThumbElement = React.ComponentRef<typeof Primitive.span>;
type PrimitiveSpanProps = React.ComponentPropsWithoutRef<typeof Primitive.span>;
interface SwitchThumbProps extends PrimitiveSpanProps {}

const SwitchThumb = React.forwardRef<SwitchThumbElement, SwitchThumbProps>(
  (props: ScopedProps<SwitchThumbProps>, forwardedRef) => {
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

SwitchThumb.displayName = THUMB_NAME;

/* -------------------------------------------------------------------------------------------------
 * SwitchBubbleInput
 * -----------------------------------------------------------------------------------------------*/

const BUBBLE_INPUT_NAME = 'SwitchBubbleInput';

type InputProps = React.ComponentPropsWithoutRef<typeof Primitive.input>;
interface SwitchBubbleInputProps extends Omit<InputProps, 'checked'> {}

const SwitchBubbleInput = React.forwardRef<HTMLInputElement, SwitchBubbleInputProps>(
  ({ __scopeSwitch, ...props }: ScopedProps<SwitchBubbleInputProps>, forwardedRef) => {
    const {
      control,
      hasConsumerStoppedPropagationRef,
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
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);

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

      const bubbles = !hasConsumerStoppedPropagationRef.current;
      if (prevChecked !== checked && setChecked) {
        const event = new Event('click', { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [bubbleInput, prevChecked, checked, hasConsumerStoppedPropagationRef]);

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

SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;

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
