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
  type Radio,
  RadioProvider,
  RadioTrigger,
  RadioBubbleInput,
  RadioIndicator,
  createRadioScope,
  useRadioContext,
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

type RadioGroupElement = React.ComponentRef<typeof Primitive.div>;
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface RadioGroupProps extends PrimitiveDivProps {
  name?: RadioGroupContextValue['name'];
  required?: React.ComponentPropsWithoutRef<typeof Radio>['required'];
  disabled?: React.ComponentPropsWithoutRef<typeof Radio>['disabled'];
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
            aria-disabled={disabled}
            data-disabled={disabled ? '' : undefined}
            dir={direction}
            {...groupProps}
            ref={forwardedRef}
          />
        </RovingFocusGroup.Root>
      </RadioGroupProvider>
    );
  },
);

RadioGroup.displayName = RADIO_GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItemProvider
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'RadioGroupItem';
const ITEM_PROVIDER_NAME = 'RadioGroupItemProvider';
const ITEM_TRIGGER_NAME = 'RadioGroupItemTrigger';
const ITEM_BUBBLE_INPUT_NAME = 'RadioGroupItemBubbleInput';

interface RadioGroupItemProviderProps {
  value: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

function RadioGroupItemProvider(props: ScopedProps<RadioGroupItemProviderProps>) {
  const {
    __scopeRadioGroup,
    value,
    disabled,
    children,
    // @ts-expect-error
    internal_do_not_use_render,
  } = props;
  const context = useRadioGroupContext(ITEM_PROVIDER_NAME, __scopeRadioGroup);
  const radioScope = useRadioScope(__scopeRadioGroup);
  const isDisabled = context.disabled || disabled;

  return (
    <RadioProvider
      {...radioScope}
      checked={context.value === value}
      disabled={isDisabled}
      required={context.required}
      name={context.name}
      value={value}
      onCheck={() => context.onValueChange(value)}
      // @ts-expect-error
      internal_do_not_use_render={internal_do_not_use_render}
    >
      {children}
    </RadioProvider>
  );
}

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItemTrigger
 * -----------------------------------------------------------------------------------------------*/

type RadioGroupItemTriggerElement = React.ComponentRef<typeof RadioTrigger>;
interface RadioGroupItemTriggerProps extends React.ComponentPropsWithoutRef<typeof RadioTrigger> {}

const RadioGroupItemTrigger = React.forwardRef<
  RadioGroupItemTriggerElement,
  RadioGroupItemTriggerProps
>((props: ScopedProps<RadioGroupItemTriggerProps>, forwardedRef) => {
  const { __scopeRadioGroup, ...triggerProps } = props;
  const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
  const radioScope = useRadioScope(__scopeRadioGroup);
  const { checked, disabled } = useRadioContext(ITEM_TRIGGER_NAME, radioScope.__scopeRadio);
  const ref = React.useRef<RadioGroupItemTriggerElement>(null);
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
      focusable={!disabled}
      active={checked}
    >
      <RadioTrigger
        {...radioScope}
        {...triggerProps}
        ref={composedRefs}
        onKeyDown={composeEventHandlers(triggerProps.onKeyDown, (event) => {
          // According to WAI ARIA, radio groups don't activate items on enter
          // keypress
          if (event.key === 'Enter') event.preventDefault();
        })}
        onFocus={composeEventHandlers(triggerProps.onFocus, () => {
          /**
           * Our `RovingFocusGroup` will focus the radio when navigating with
           * arrow keys and we need to "check" it in that case. We click it to
           * "check" it (instead of updating `context.value`) so that the radio
           * change event fires.
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
 * RadioGroupItem
 * -----------------------------------------------------------------------------------------------*/

type RadioGroupItemElement = React.ComponentRef<typeof Radio>;
type RadioProps = React.ComponentPropsWithoutRef<typeof Radio>;
interface RadioGroupItemProps extends Omit<RadioProps, 'onCheck' | 'name'> {
  value: string;
}

const RadioGroupItem = React.forwardRef<RadioGroupItemElement, RadioGroupItemProps>(
  (props: ScopedProps<RadioGroupItemProps>, forwardedRef) => {
    const { __scopeRadioGroup, value, disabled, ...itemProps } = props;

    return (
      <RadioGroupItemProvider
        __scopeRadioGroup={__scopeRadioGroup}
        value={value}
        disabled={disabled}
        // @ts-expect-error
        internal_do_not_use_render={({ isFormControl }: { isFormControl: boolean }) => (
          <>
            <RadioGroupItemTrigger
              {...itemProps}
              ref={forwardedRef}
              // @ts-expect-error
              __scopeRadioGroup={__scopeRadioGroup}
            />
            {isFormControl && (
              <RadioGroupItemBubbleInput
                // @ts-expect-error
                __scopeRadioGroup={__scopeRadioGroup}
              />
            )}
          </>
        )}
      />
    );
  },
);

RadioGroupItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioGroupItemBubbleInput
 * -----------------------------------------------------------------------------------------------*/

type RadioGroupItemBubbleInputElement = React.ComponentRef<typeof RadioBubbleInput>;
interface RadioGroupItemBubbleInputProps extends React.ComponentPropsWithoutRef<
  typeof RadioBubbleInput
> {}

const RadioGroupItemBubbleInput = React.forwardRef<
  RadioGroupItemBubbleInputElement,
  RadioGroupItemBubbleInputProps
>((props: ScopedProps<RadioGroupItemBubbleInputProps>, forwardedRef) => {
  const { __scopeRadioGroup, ...bubbleProps } = props;
  const radioScope = useRadioScope(__scopeRadioGroup);
  return <RadioBubbleInput {...radioScope} {...bubbleProps} ref={forwardedRef} />;
});

RadioGroupItemBubbleInput.displayName = ITEM_BUBBLE_INPUT_NAME;

/* -------------------------------------------------------------------------------------------------
 * RadioGroupIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'RadioGroupIndicator';

type RadioGroupIndicatorElement = React.ComponentRef<typeof RadioIndicator>;
type RadioIndicatorProps = React.ComponentPropsWithoutRef<typeof RadioIndicator>;
interface RadioGroupIndicatorProps extends RadioIndicatorProps {}

const RadioGroupIndicator = React.forwardRef<RadioGroupIndicatorElement, RadioGroupIndicatorProps>(
  (props: ScopedProps<RadioGroupIndicatorProps>, forwardedRef) => {
    const { __scopeRadioGroup, ...indicatorProps } = props;
    const radioScope = useRadioScope(__scopeRadioGroup);
    return <RadioIndicator {...radioScope} {...indicatorProps} ref={forwardedRef} />;
  },
);

RadioGroupIndicator.displayName = INDICATOR_NAME;

/* ---------------------------------------------------------------------------------------------- */

export {
  createRadioGroupScope,
  //
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemProvider,
  RadioGroupItemTrigger,
  RadioGroupItemBubbleInput,
  RadioGroupIndicator,
  //
  RadioGroup as Root,
  RadioGroupItem as Item,
  RadioGroupItemProvider as ItemProvider,
  RadioGroupItemTrigger as ItemTrigger,
  RadioGroupItemBubbleInput as ItemBubbleInput,
  RadioGroupIndicator as Indicator,
};
export type {
  RadioGroupProps,
  RadioGroupItemProps,
  RadioGroupItemProviderProps,
  RadioGroupItemTriggerProps,
  RadioGroupItemBubbleInputProps,
  RadioGroupIndicatorProps,
};
