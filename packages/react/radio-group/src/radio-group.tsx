import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { Primitive } from '@radix-ui/react-primitive';
import * as RovingFocusGroup from '@radix-ui/react-roving-focus';
import { createRovingFocusGroupScope } from '@radix-ui/react-roving-focus';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useDirection } from '@radix-ui/react-direction';
import {
  RadioRoot,
  RadioTrigger,
  RadioBubbleInput,
  RadioIndicator,
  createRadioScope,
  useRadioContext,
  useInternalRadioScope,
} from './radio';

import type { Scope } from '@radix-ui/react-context';

const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

/* -------------------------------------------------------------------------------------------------
 * RadioGroup
 * -----------------------------------------------------------------------------------------------*/
const RADIO_GROUP_NAME = 'RadioGroup';

type ScopedProps<P> = P & { __scopeRadioGroup?: Scope };
const [createRadioGroupContext, createRadioGroupScope] = createContextScope(RADIO_GROUP_NAME, [
  createRovingFocusGroupScope,
  createRadioScope,
]);
const useRovingFocusGroupScope = createRovingFocusGroupScope();
const useRadioScope = createRadioScope();

type RadioGroupContextValue = {
  name?: string;
  required: boolean;
  disabled: boolean;
  value: string | null;
  onValueChange(value: string): void;
};

const [RadioGroupProvider, useRadioGroupContext] =
  createRadioGroupContext<RadioGroupContextValue>(RADIO_GROUP_NAME);

type RadioGroupElement = React.ElementRef<typeof Primitive.div>;
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface RadioGroupProps extends PrimitiveDivProps {
  name?: string;
  required?: boolean;
  disabled?: boolean;
  dir?: RovingFocusGroupProps['dir'];
  orientation?: RovingFocusGroupProps['orientation'];
  loop?: RovingFocusGroupProps['loop'];
  defaultValue?: string;
  value?: string | null;
  onValueChange?: RadioGroupContextValue['onValueChange'];
}

const RadioGroup = React.forwardRef<RadioGroupElement, RadioGroupProps>(
  (props: ScopedProps<RadioGroupProps>, forwardedRef) => {
    const {
      __scopeRadioGroup,
      name,
      defaultValue,
      value: valueProp,
      required = false,
      disabled = false,
      orientation,
      dir,
      loop = true,
      onValueChange,
      ...groupProps
    } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? null,
      onChange: onValueChange as (value: string | null) => void,
      caller: RADIO_GROUP_NAME,
    });

    return (
      <RadioGroupProvider
        scope={__scopeRadioGroup}
        name={name}
        required={required}
        disabled={disabled}
        value={value}
        onValueChange={setValue}
      >
        <RovingFocusGroup.Root
          asChild
          {...rovingFocusGroupScope}
          orientation={orientation}
          dir={direction}
          loop={loop}
        >
          <Primitive.div
            role="radiogroup"
            aria-required={required}
            aria-orientation={orientation}
            data-disabled={disabled ? '' : undefined}
            dir={direction}
            {...groupProps}
            ref={forwardedRef}
          />
        </RovingFocusGroup.Root>
      </RadioGroupProvider>
    );
  }
);

RadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItemRoot
 * -----------------------------------------------------------------------------------------------*/

const ITEM_ROOT_NAME = 'RadioGroupItemRoot';

type RadioProviderProps = React.ComponentPropsWithoutRef<typeof RadioRoot>;
interface RadioGroupItemRootProps extends Omit<RadioProviderProps, 'name' | 'required'> {
  value: string;
}

const RadioGroupItemRoot = (props: ScopedProps<RadioGroupItemRootProps>) => {
  const {
    __scopeRadioGroup,
    disabled,
    children,
    checked,
    // @ts-expect-error
    internal_do_not_use_render,
    ...itemProps
  } = props;
  const context = useRadioGroupContext(ITEM_ROOT_NAME, __scopeRadioGroup);
  const radioScope = useRadioScope(__scopeRadioGroup);

  return (
    <RadioRoot
      {...itemProps}
      {...radioScope}
      disabled={context.disabled || disabled}
      required={context.required}
      checked={checked !== undefined ? checked : context.value === itemProps.value}
      name={context.name}
      // @ts-expect-error
      internal_do_not_use_render={({ isFormControl }) => {
        return typeof internal_do_not_use_render === 'function'
          ? internal_do_not_use_render({ ...context, isFormControl })
          : children;
      }}
    />
  );
};

RadioGroupItemRoot.displayName = ITEM_ROOT_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItemTrigger
 * -----------------------------------------------------------------------------------------------*/

const ITEM_TRIGGER_NAME = 'RadioGroupItemTrigger';

type RadioGroupItemTriggerElement = React.ElementRef<typeof RadioTrigger>;
type RadioTriggerProps = React.ComponentPropsWithoutRef<typeof RadioTrigger>;
interface RadioGroupItemTriggerProps
  extends Omit<RadioTriggerProps, 'onCheck' | 'name' | 'value'> {}

const RadioGroupItemTrigger = React.forwardRef<
  RadioGroupItemTriggerElement,
  RadioGroupItemTriggerProps
>((props: ScopedProps<RadioGroupItemTriggerProps>, forwardedRef) => {
  const { __scopeRadioGroup, ...itemProps } = props;
  const context = useRadioGroupContext(ITEM_TRIGGER_NAME, __scopeRadioGroup);
  const radioScope = useRadioScope(__scopeRadioGroup);
  const {
    checked,
    disabled: isDisabled,
    value,
  } = useRadioContext(ITEM_TRIGGER_NAME, useInternalRadioScope(ITEM_TRIGGER_NAME));

  const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);

  const ref = React.useRef<RadioGroupItemTriggerElement | null>(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const isArrowKeyPressedRef = React.useRef(false);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (ARROW_KEYS.includes(event.key)) {
        isArrowKeyPressedRef.current = true;
      }
    };
    const handleKeyUp = () => (isArrowKeyPressedRef.current = false);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <RovingFocusGroup.Item
      asChild
      {...rovingFocusGroupScope}
      focusable={!isDisabled}
      active={checked}
    >
      <RadioTrigger
        {...radioScope}
        {...itemProps}
        ref={composedRefs}
        onCheck={() => context.onValueChange(value)}
        onKeyDown={composeEventHandlers((event) => {
          // According to WAI ARIA, radio groups don't activate items on enter keypress
          if (event.key === 'Enter') event.preventDefault();
        })}
        onFocus={composeEventHandlers(itemProps.onFocus, () => {
          /**
           * Our `RovingFocusGroup` will focus the radio when navigating with arrow keys
           * and we need to "check" it in that case. We click it to "check" it (instead
           * of updating `context.value`) so that the radio change event fires.
           */
          if (isArrowKeyPressedRef.current) {
            ref.current?.click();
          }
        })}
      />
    </RovingFocusGroup.Item>
  );
});

RadioGroupItemTrigger.displayName = ITEM_TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItemBubbleInput
 * -----------------------------------------------------------------------------------------------*/

const ITEM_BUBBLE_INPUT_NAME = 'RadioGroupItemBubbleInput';

type RadioGroupItemBubbleInputElement = HTMLInputElement;
type RadioBubbleInputProps = React.ComponentPropsWithoutRef<typeof RadioBubbleInput>;
interface RadioGroupItemBubbleInputProps extends RadioBubbleInputProps {}

const RadioGroupItemBubbleInput = React.forwardRef<
  RadioGroupItemBubbleInputElement,
  RadioGroupItemBubbleInputProps
>((props: ScopedProps<RadioGroupItemBubbleInputProps>, forwardedRef) => {
  const { __scopeRadioGroup, ...inputProps } = props;
  const radioScope = useRadioScope(__scopeRadioGroup);
  return <RadioBubbleInput {...radioScope} {...inputProps} ref={forwardedRef} />;
});

RadioGroupItemBubbleInput.displayName = ITEM_BUBBLE_INPUT_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'RadioGroupItem';

type RadioGroupItemElement = React.ElementRef<typeof RadioTrigger>;

interface RadioGroupItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Primitive.button>, 'name'> {
  checked?: boolean;
  required?: boolean;
  form?: string;
  disabled?: boolean;
  value: string;
  children?: React.ReactNode;
  onCheck?: () => void;
}

const RadioGroupItem = React.forwardRef<RadioGroupItemElement, RadioGroupItemProps>(
  (props: ScopedProps<RadioGroupItemProps>, forwardedRef) => {
    const {
      __scopeRadioGroup,
      disabled,
      value,
      checked: checkedProp,
      form,
      required,
      ...triggerProps
    } = props;

    const radioScope = useRadioScope(__scopeRadioGroup);

    return (
      <RadioGroupItemRoot
        {...radioScope}
        value={value}
        checked={checkedProp}
        disabled={disabled}
        form={form}
        // @ts-expect-error
        internal_do_not_use_render={({ isFormControl }: RadioContextValue) => (
          <>
            <RadioGroupItemTrigger {...triggerProps} {...radioScope} ref={forwardedRef} />
            {isFormControl && <RadioBubbleInput {...radioScope} />}
          </>
        )}
      />
    );
  }
);

RadioGroupItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioGroupIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'RadioGroupIndicator';

type RadioGroupIndicatorElement = React.ElementRef<typeof RadioIndicator>;
type RadioIndicatorProps = React.ComponentPropsWithoutRef<typeof RadioIndicator>;
interface RadioGroupIndicatorProps extends RadioIndicatorProps {}

const RadioGroupIndicator = React.forwardRef<RadioGroupIndicatorElement, RadioGroupIndicatorProps>(
  (props: ScopedProps<RadioGroupIndicatorProps>, forwardedRef) => {
    const { __scopeRadioGroup, ...indicatorProps } = props;
    const radioScope = useRadioScope(__scopeRadioGroup);
    return <RadioIndicator {...radioScope} {...indicatorProps} ref={forwardedRef} />;
  }
);

RadioGroupIndicator.displayName = INDICATOR_NAME;

/* ---------------------------------------------------------------------------------------------- */

export {
  createRadioGroupScope,
  //
  RadioGroup,
  RadioGroupItemRoot,
  RadioGroupItemTrigger,
  RadioGroupItemBubbleInput,
  RadioGroupItem,
  RadioGroupIndicator,
  //
  RadioGroup as Root,
  RadioGroupItemRoot as ItemRoot,
  RadioGroupItemTrigger as ItemTrigger,
  RadioGroupItemBubbleInput as ItemBubbleInput,
  RadioGroupItem as Item,
  RadioGroupIndicator as Indicator,
};
export type {
  RadioGroupProps,
  RadioGroupItemRootProps,
  RadioGroupItemTriggerProps,
  RadioGroupItemBubbleInputProps,
  RadioGroupItemProps,
  RadioGroupIndicatorProps,
};
