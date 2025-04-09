import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { Primitive } from '@radix-ui/react-primitive';
import * as RovingFocusGroup from '@radix-ui/react-roving-focus';
import { createRovingFocusGroupScope } from '@radix-ui/react-roving-focus';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useDirection } from '@radix-ui/react-direction';
import { Radio, RadioIndicator, createRadioScope } from './radio';

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
  value: string;
  onValueChange(value: string): void;
};

const [RadioGroupProvider, useRadioGroupContext] =
  createRadioGroupContext<RadioGroupContextValue>(RADIO_GROUP_NAME);

type RadioGroupElement = React.ElementRef<typeof Primitive.div>;
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
  value?: RadioGroupContextValue['value'];
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
      defaultProp: defaultValue ?? '',
      onChange: onValueChange,
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
 * RadioGroupItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'RadioGroupItem';

type RadioGroupItemElement = React.ElementRef<typeof Radio>;
type RadioProps = React.ComponentPropsWithoutRef<typeof Radio>;
interface RadioGroupItemProps extends Omit<RadioProps, 'onCheck' | 'name'> {
  value: string;
}

const RadioGroupItem = React.forwardRef<RadioGroupItemElement, RadioGroupItemProps>(
  (props: ScopedProps<RadioGroupItemProps>, forwardedRef) => {
    const { __scopeRadioGroup, disabled, ...itemProps } = props;
    const context = useRadioGroupContext(ITEM_NAME, __scopeRadioGroup);
    const isDisabled = context.disabled || disabled;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const radioScope = useRadioScope(__scopeRadioGroup);
    const ref = React.useRef<React.ElementRef<typeof Radio>>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const checked = context.value === itemProps.value;
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
        <Radio
          disabled={isDisabled}
          required={context.required}
          checked={checked}
          {...radioScope}
          {...itemProps}
          name={context.name}
          ref={composedRefs}
          onCheck={() => context.onValueChange(itemProps.value)}
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
            if (isArrowKeyPressedRef.current) ref.current?.click();
          })}
        />
      </RovingFocusGroup.Item>
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

const Root = RadioGroup;
const Item = RadioGroupItem;
const Indicator = RadioGroupIndicator;

export {
  createRadioGroupScope,
  //
  RadioGroup,
  RadioGroupItem,
  RadioGroupIndicator,
  //
  Root,
  Item,
  Indicator,
};
export type { RadioGroupProps, RadioGroupItemProps, RadioGroupIndicatorProps };
