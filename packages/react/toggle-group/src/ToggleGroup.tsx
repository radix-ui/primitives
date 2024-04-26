// @deno-types="npm:@types/react@^18.2.0"
import React from 'react';
import { createContextScope } from '@radix-ui/react-context';
import { Primitive } from '@radix-ui/react-primitive';
import * as RovingFocusGroup from '@radix-ui/react-roving-focus';
import { createRovingFocusGroupScope } from '@radix-ui/react-roving-focus';
import { Toggle } from '@radix-ui/react-toggle';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useDirection } from '@radix-ui/react-direction';

import type * as Radix from '@radix-ui/react-primitive';
import type { Scope } from '@radix-ui/react-context';

/* -------------------------------------------------------------------------------------------------
 * ToggleGroup
 * -----------------------------------------------------------------------------------------------*/

const TOGGLE_GROUP_NAME = 'ToggleGroup';

type ScopedProps<P> = P & { __scopeToggleGroup?: Scope };
const contextScope: ReturnType<typeof createContextScope> = createContextScope(TOGGLE_GROUP_NAME, [
  createRovingFocusGroupScope,
]);
const createToggleGroupContext = contextScope[0]
const createToggleGroupScope = contextScope[1];
const useRovingFocusGroupScope: ReturnType<typeof createRovingFocusGroupScope> = createRovingFocusGroupScope();

type ToggleGroupElement = ToggleGroupImplSingleElement | ToggleGroupImplMultipleElement;
interface ToggleGroupSingleProps extends ToggleGroupImplSingleProps {
  type: 'single';
}
interface ToggleGroupMultipleProps extends ToggleGroupImplMultipleProps {
  type: 'multiple';
}

const ToggleGroup: React.ForwardRefExoticComponent<(ToggleGroupSingleProps | ToggleGroupMultipleProps) & React.RefAttributes<ToggleGroupElement>>
= React.forwardRef<
  ToggleGroupElement,
  ToggleGroupSingleProps | ToggleGroupMultipleProps
>((props, forwardedRef) => {
  const { type, ...toggleGroupProps } = props;

  if (type === 'single') {
    const singleProps = toggleGroupProps as ToggleGroupImplSingleProps;
    return <ToggleGroupImplSingle {...singleProps} ref={forwardedRef} />;
  }

  if (type === 'multiple') {
    const multipleProps = toggleGroupProps as ToggleGroupImplMultipleProps;
    return <ToggleGroupImplMultiple {...multipleProps} ref={forwardedRef} />;
  }

  throw new Error(`Missing prop \`type\` expected on \`${TOGGLE_GROUP_NAME}\``);
});

ToggleGroup.displayName = TOGGLE_GROUP_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupValueContextValue = {
  type: 'single' | 'multiple';
  value: string[];
  onItemActivate(value: string): void;
  onItemDeactivate(value: string): void;
};

const toggleGroupValueContext: ReturnType<
  typeof createToggleGroupContext<ToggleGroupValueContextValue>
> = createToggleGroupContext<ToggleGroupValueContextValue>(TOGGLE_GROUP_NAME);
const ToggleGroupValueProvider = toggleGroupValueContext[0];
const useToggleGroupValueContext = toggleGroupValueContext[1];

type ToggleGroupImplSingleElement = ToggleGroupImplElement;
interface ToggleGroupImplSingleProps extends ToggleGroupImplProps {
  /**
   * The controlled stateful value of the item that is pressed.
   */
  value?: string;
  /**
   * The value of the item that is pressed when initially rendered. Use
   * `defaultValue` if you do not need to control the state of a toggle group.
   */
  defaultValue?: string;
  /**
   * The callback that fires when the value of the toggle group changes.
   */
  onValueChange?(value: string): void;
}

const ToggleGroupImplSingle: React.ForwardRefExoticComponent<ToggleGroupImplSingleProps & React.RefAttributes<ToggleGroupImplSingleElement>>
= React.forwardRef<
  ToggleGroupImplSingleElement,
  ToggleGroupImplSingleProps
>((props: ScopedProps<ToggleGroupImplSingleProps>, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {},
    ...toggleGroupSingleProps
  } = props;

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  return (
    <ToggleGroupValueProvider
      scope={props.__scopeToggleGroup}
      type="single"
      value={value ? [value] : []}
      onItemActivate={setValue}
      onItemDeactivate={React.useCallback(() => setValue(''), [setValue])}
    >
      <ToggleGroupImpl {...toggleGroupSingleProps} ref={forwardedRef} />
    </ToggleGroupValueProvider>
  );
});

type ToggleGroupImplMultipleElement = ToggleGroupImplElement;
interface ToggleGroupImplMultipleProps extends ToggleGroupImplProps {
  /**
   * The controlled stateful value of the items that are pressed.
   */
  value?: string[];
  /**
   * The value of the items that are pressed when initially rendered. Use
   * `defaultValue` if you do not need to control the state of a toggle group.
   */
  defaultValue?: string[];
  /**
   * The callback that fires when the state of the toggle group changes.
   */
  onValueChange?(value: string[]): void;
}

const ToggleGroupImplMultiple: React.ForwardRefExoticComponent<ToggleGroupImplMultipleProps & React.RefAttributes<ToggleGroupImplMultipleElement>>
= React.forwardRef<
  ToggleGroupImplMultipleElement,
  ToggleGroupImplMultipleProps
>((props: ScopedProps<ToggleGroupImplMultipleProps>, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange = () => {},
    ...toggleGroupMultipleProps
  } = props;

  const [value = [], setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const handleButtonActivate = React.useCallback(
    (itemValue: string) => setValue((prevValue = []) => [...prevValue, itemValue]),
    [setValue]
  );

  const handleButtonDeactivate = React.useCallback(
    (itemValue: string) =>
      setValue((prevValue = []) => prevValue.filter((value) => value !== itemValue)),
    [setValue]
  );

  return (
    <ToggleGroupValueProvider
      scope={props.__scopeToggleGroup}
      type="multiple"
      value={value}
      onItemActivate={handleButtonActivate}
      onItemDeactivate={handleButtonDeactivate}
    >
      <ToggleGroupImpl {...toggleGroupMultipleProps} ref={forwardedRef} />
    </ToggleGroupValueProvider>
  );
});

ToggleGroup.displayName = TOGGLE_GROUP_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupContextValue = { rovingFocus: boolean; disabled: boolean };

const toggleGroupContext: ReturnType<
  typeof createToggleGroupContext<ToggleGroupContextValue>
> = createToggleGroupContext<ToggleGroupContextValue>(TOGGLE_GROUP_NAME);
const ToggleGroupContext = toggleGroupContext[0];
const useToggleGroupContext = toggleGroupContext[1];

type RovingFocusGroupProps = Radix.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>;
type ToggleGroupImplElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface ToggleGroupImplProps extends PrimitiveDivProps {
  /**
   * Whether the group is disabled from user interaction.
   * @defaultValue false
   */
  disabled?: boolean;
  /**
   * Whether the group should maintain roving focus of its buttons.
   * @defaultValue true
   */
  rovingFocus?: boolean;
  loop?: RovingFocusGroupProps['loop'];
  orientation?: RovingFocusGroupProps['orientation'];
  dir?: RovingFocusGroupProps['dir'];
}

const ToggleGroupImpl: React.ForwardRefExoticComponent<ToggleGroupImplProps & React.RefAttributes<ToggleGroupImplElement>> = 
  React.forwardRef<ToggleGroupImplElement, ToggleGroupImplProps>(
  (props: ScopedProps<ToggleGroupImplProps>, forwardedRef) => {
    const {
      __scopeToggleGroup,
      disabled = false,
      rovingFocus = true,
      orientation,
      dir,
      loop = true,
      ...toggleGroupProps
    } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeToggleGroup);
    const direction = useDirection(dir);
    const commonProps = { role: 'group', dir: direction, ...toggleGroupProps };
    return (
      <ToggleGroupContext scope={__scopeToggleGroup} rovingFocus={rovingFocus} disabled={disabled}>
        {rovingFocus ? (
          <RovingFocusGroup.Root
            asChild
            {...rovingFocusGroupScope}
            orientation={orientation}
            dir={direction}
            loop={loop}
          >
            <Primitive.div {...commonProps} ref={forwardedRef} />
          </RovingFocusGroup.Root>
        ) : (
          <Primitive.div {...commonProps} ref={forwardedRef} />
        )}
      </ToggleGroupContext>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * ToggleGroupItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ToggleGroupItem';

type ToggleGroupItemElement = ToggleGroupItemImplElement;
interface ToggleGroupItemProps extends Omit<ToggleGroupItemImplProps, 'pressed'> {}

const ToggleGroupItem: React.ForwardRefExoticComponent<Omit<ToggleGroupItemProps, "ref"> & React.RefAttributes<ToggleGroupItemElement>> = 
  React.forwardRef<ToggleGroupItemElement, ToggleGroupItemProps>(
  (props: ScopedProps<ToggleGroupItemProps>, forwardedRef) => {
    const valueContext = useToggleGroupValueContext(ITEM_NAME, props.__scopeToggleGroup);
    const context = useToggleGroupContext(ITEM_NAME, props.__scopeToggleGroup);
    const rovingFocusGroupScope = useRovingFocusGroupScope(props.__scopeToggleGroup);
    const pressed = valueContext.value.includes(props.value);
    const disabled = context.disabled || props.disabled;
    const commonProps = { ...props, pressed, disabled };
    const ref = React.useRef<HTMLDivElement>(null);
    return context.rovingFocus ? (
      <RovingFocusGroup.Item
        asChild
        {...rovingFocusGroupScope}
        focusable={!disabled}
        active={pressed}
        ref={ref}
      >
        <ToggleGroupItemImpl {...commonProps} ref={forwardedRef} />
      </RovingFocusGroup.Item>
    ) : (
      <ToggleGroupItemImpl {...commonProps} ref={forwardedRef} />
    );
  }
);

ToggleGroupItem.displayName = ITEM_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupItemImplElement = React.ElementRef<typeof Toggle>;
type ToggleProps = Radix.ComponentPropsWithoutRef<typeof Toggle>;
interface ToggleGroupItemImplProps extends Omit<ToggleProps, 'defaultPressed' | 'onPressedChange'> {
  /**
   * A string value for the toggle group item. All items within a toggle group should use a unique value.
   */
  value: string;
}

const ToggleGroupItemImpl: React.ForwardRefExoticComponent<Omit<ToggleGroupItemImplProps, "ref"> & React.RefAttributes<ToggleGroupItemImplElement>>
= React.forwardRef<ToggleGroupItemImplElement, ToggleGroupItemImplProps>(
  (props: ScopedProps<ToggleGroupItemImplProps>, forwardedRef) => {
    const { __scopeToggleGroup, value, ...itemProps } = props;
    const valueContext = useToggleGroupValueContext(ITEM_NAME, __scopeToggleGroup);
    const singleProps = { role: 'radio', 'aria-checked': props.pressed, 'aria-pressed': undefined };
    const typeProps = valueContext.type === 'single' ? singleProps : undefined;
    return (
      <Toggle
        {...typeProps}
        {...itemProps}
        ref={forwardedRef}
        onPressedChange={(pressed) => {
          if (pressed) {
            valueContext.onItemActivate(value);
          } else {
            valueContext.onItemDeactivate(value);
          }
        }}
      />
    );
  }
);

/* -----------------------------------------------------------------------------------------------*/

const Root = ToggleGroup;
const Item = ToggleGroupItem;

export {
  createToggleGroupScope,
  //
  ToggleGroup,
  ToggleGroupItem,
  //
  Root,
  Item,
};
export type { ToggleGroupSingleProps, ToggleGroupMultipleProps, ToggleGroupItemProps };
