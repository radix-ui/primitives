import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useLabelContext } from '@radix-ui/react-label';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { Primitive } from '@radix-ui/react-primitive';
import * as RovingFocusGroup from '@radix-ui/react-roving-focus';
import { createRovingFocusGroupScope } from '@radix-ui/react-roving-focus';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Radio, RadioIndicator, createRadioScope } from './Radio';

import type * as Radix from '@radix-ui/react-primitive';
import type { Scope } from '@radix-ui/react-context';

/* -------------------------------------------------------------------------------------------------
 * RadioGroup
 * -----------------------------------------------------------------------------------------------*/
const RADIO_GROUP_NAME = 'RadioGroup';

type ScopedProps<P> = P & { __scopeRadioGroup?: Scope };
const [createRadioGroupContet, createRadioGroupScope] = createContextScope(RADIO_GROUP_NAME, [
  createRovingFocusGroupScope,
  createRadioScope,
]);
const useRovingFocusGroupScope = createRovingFocusGroupScope();
const useRadioScope = createRadioScope();

type RadioGroupContextValue = {
  name?: string;
  required: boolean;
  groupRef: React.RefObject<RadioGroupElement>;
  value?: string;
  onValueChange(value: string): void;
};

const [RadioGroupProvider, useRadioGroupContext] =
  createRadioGroupContet<RadioGroupContextValue>(RADIO_GROUP_NAME);

type RadioGroupElement = React.ElementRef<typeof Primitive.div>;
type RovingFocusGroupProps = Radix.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface RadioGroupProps extends PrimitiveDivProps {
  name?: RadioGroupContextValue['name'];
  required?: Radix.ComponentPropsWithoutRef<typeof Radio>['required'];
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
      'aria-labelledby': ariaLabelledby,
      defaultValue,
      value: valueProp,
      required = false,
      orientation,
      dir = 'ltr',
      loop = true,
      onValueChange,
      ...groupProps
    } = props;
    const labelId = useLabelContext();
    const labelledBy = ariaLabelledby || labelId;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const ref = React.useRef<RadioGroupElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    return (
      <RadioGroupProvider
        scope={__scopeRadioGroup}
        name={name}
        required={required}
        groupRef={ref}
        value={value}
        onValueChange={setValue}
      >
        <RovingFocusGroup.Root
          asChild
          {...rovingFocusGroupScope}
          orientation={orientation}
          dir={dir}
          loop={loop}
        >
          <Primitive.div
            role="radiogroup"
            aria-labelledby={labelledBy}
            dir={dir}
            {...groupProps}
            ref={composedRefs}
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
type RadioProps = Radix.ComponentPropsWithoutRef<typeof Radio>;
interface RadioGroupItemProps extends Omit<RadioProps, 'onCheck' | 'name'> {
  value: string;
}

const RadioGroupItem = React.forwardRef<RadioGroupItemElement, RadioGroupItemProps>(
  (props: ScopedProps<RadioGroupItemProps>, forwardedRef) => {
    const { __scopeRadioGroup, disabled, ...itemProps } = props;
    const context = useRadioGroupContext(ITEM_NAME, __scopeRadioGroup);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const radioScope = useRadioScope(__scopeRadioGroup);
    const [isFocusWithinGroup, setIsFocusWithinGroup] = React.useState(false);
    const ref = React.useRef<React.ElementRef<typeof Radio>>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const checked = context.value === itemProps.value;

    React.useEffect(() => {
      const group = context.groupRef.current;
      if (group) {
        let timer = 0;
        const handleFocusIn = (event: FocusEvent) => {
          window.clearTimeout(timer);
          if (event.target !== event.currentTarget) setIsFocusWithinGroup(true);
        };
        const handleFocusOut = () => {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => setIsFocusWithinGroup(false), 300);
        };
        group.addEventListener('focusin', handleFocusIn);
        group.addEventListener('focusout', handleFocusOut);
        return () => {
          window.clearTimeout(timer);
          group.removeEventListener('focusin', handleFocusIn);
          group.removeEventListener('focusout', handleFocusOut);
        };
      }
    }, [context.groupRef]);

    return (
      <RovingFocusGroup.Item
        asChild
        {...rovingFocusGroupScope}
        focusable={!disabled}
        active={checked}
      >
        <Radio
          disabled={disabled}
          required={context.required}
          checked={checked}
          {...radioScope}
          {...itemProps}
          name={context.name}
          ref={composedRefs}
          onCheck={() => context.onValueChange(itemProps.value)}
          onFocusCapture={composeEventHandlers(itemProps.onFocusCapture, () => {
            /**
             * Roving index will focus the radio and we need to check it when this happens.
             * We do this imperatively instead of updating `context.value` because changing via
             * state would not trigger change events (e.g. when in a form).
             *
             * Also, initial focus inside the group should not activate the item (only arrow
             * keypress should) so we verify focus is already within the group before activating.
             */
            if (isFocusWithinGroup) ref.current?.click();
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
type RadioIndicatorProps = Radix.ComponentPropsWithoutRef<typeof RadioIndicator>;
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
