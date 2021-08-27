import React from 'react';
import { createContext } from '@radix-ui/react-context';
import { Primitive } from '@radix-ui/react-primitive';
import { RovingFocusGroup, RovingFocusItem } from '@radix-ui/react-roving-focus';
import { Toggle } from '@radix-ui/react-toggle';
import { useControllableState } from '@radix-ui/react-use-controllable-state';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * ToggleGroup
 * -----------------------------------------------------------------------------------------------*/

const TOGGLE_GROUP_NAME = 'ToggleGroup';

type ToggleGroupElement = React.ElementRef<typeof ToggleGroupSingle | typeof ToggleGroupMultiple>;
type ToggleGroupProps =
  | ({ type: 'single' } & Radix.ComponentPropsWithoutRef<typeof ToggleGroupSingle>)
  | ({ type: 'multiple' } & Radix.ComponentPropsWithoutRef<typeof ToggleGroupMultiple>);

const ToggleGroup = React.forwardRef<ToggleGroupElement, ToggleGroupProps>(
  (props, forwardedRef) => {
    if (props.type === 'single') {
      return <ToggleGroupSingle {...props} ref={forwardedRef} />;
    }

    if (props.type === 'multiple') {
      return <ToggleGroupMultiple {...props} ref={forwardedRef} />;
    }

    throw new Error(`Missing prop \`type\` expected on \`${TOGGLE_GROUP_NAME}\``);
  }
);

ToggleGroup.displayName = TOGGLE_GROUP_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupValueContextValue = {
  value: string[];
  onItemActivate(value: string): void;
  onItemDeactivate(value: string): void;
};

const [ToggleGroupValueProvider, useToggleGroupValueContext] =
  createContext<ToggleGroupValueContextValue>(TOGGLE_GROUP_NAME);

type ToggleGroupSingleElement = React.ElementRef<typeof ToggleGroupImpl>;
type ToggleGroupSingleProps = Radix.MergeProps<
  Radix.ComponentPropsWithoutRef<typeof ToggleGroupImpl>,
  {
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
>;

const ToggleGroupSingle = React.forwardRef<ToggleGroupSingleElement, ToggleGroupSingleProps>(
  (props, forwardedRef) => {
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
        value={value ? [value] : []}
        onItemActivate={setValue}
        onItemDeactivate={React.useCallback(() => setValue(''), [setValue])}
      >
        <ToggleGroupImpl {...toggleGroupSingleProps} ref={forwardedRef} />
      </ToggleGroupValueProvider>
    );
  }
);

type ToggleGroupMultipleElement = React.ElementRef<typeof ToggleGroupImpl>;
type ToggleGroupMultipleProps = Radix.MergeProps<
  Radix.ComponentPropsWithoutRef<typeof ToggleGroupImpl>,
  {
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
>;

const ToggleGroupMultiple = React.forwardRef<ToggleGroupMultipleElement, ToggleGroupMultipleProps>(
  (props, forwardedRef) => {
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
      (itemValue) => setValue((prevValue = []) => [...prevValue, itemValue]),
      [setValue]
    );

    const handleButtonDeactivate = React.useCallback(
      (itemValue) => setValue((prevValue = []) => prevValue.filter((value) => value !== itemValue)),
      [setValue]
    );

    return (
      <ToggleGroupValueProvider
        value={value}
        onItemActivate={handleButtonActivate}
        onItemDeactivate={handleButtonDeactivate}
      >
        <ToggleGroupImpl {...toggleGroupMultipleProps} ref={forwardedRef} />
      </ToggleGroupValueProvider>
    );
  }
);

ToggleGroup.displayName = TOGGLE_GROUP_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupContextValue = { rovingFocus: boolean; disabled: boolean };

const [ToggleGroupContext, useToggleGroupContext] =
  createContext<ToggleGroupContextValue>(TOGGLE_GROUP_NAME);

type RovingFocusGroupProps = Radix.ComponentPropsWithoutRef<typeof RovingFocusGroup>;
type ToggleGroupImplElement = React.ElementRef<typeof Primitive.div>;
type ToggleGroupImplProps = Radix.MergeProps<
  Radix.ComponentPropsWithoutRef<typeof Primitive.div>,
  {
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
>;

const ToggleGroupImpl = React.forwardRef<ToggleGroupImplElement, ToggleGroupImplProps>(
  (props, forwardedRef) => {
    const {
      disabled = false,
      rovingFocus = true,
      orientation,
      dir = 'ltr',
      loop = true,
      ...toggleGroupProps
    } = props;
    const commonProps = { role: 'group', dir, ...toggleGroupProps };
    return (
      <ToggleGroupContext rovingFocus={rovingFocus} disabled={disabled}>
        {rovingFocus ? (
          <RovingFocusGroup asChild orientation={orientation} dir={dir} loop={loop}>
            <Primitive.div {...commonProps} ref={forwardedRef} />
          </RovingFocusGroup>
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

type ToggleGroupItemElement = React.ElementRef<typeof ToggleGroupItemImpl>;
type ToggleGroupItemProps = Omit<
  Radix.ComponentPropsWithoutRef<typeof ToggleGroupItemImpl>,
  'pressed'
>;

const ToggleGroupItem = React.forwardRef<ToggleGroupItemElement, ToggleGroupItemProps>(
  (props, forwardedRef) => {
    const valueContext = useToggleGroupValueContext(ITEM_NAME);
    const context = useToggleGroupContext(ITEM_NAME);
    const pressed = valueContext.value.includes(props.value);
    const disabled = context.disabled || props.disabled;
    const commonProps = { ...props, pressed, disabled };
    const ref = React.useRef<HTMLDivElement>(null);
    return context.rovingFocus ? (
      <RovingFocusItem asChild focusable={!disabled} active={pressed} ref={ref}>
        <ToggleGroupItemImpl {...commonProps} ref={forwardedRef} />
      </RovingFocusItem>
    ) : (
      <ToggleGroupItemImpl {...commonProps} ref={forwardedRef} />
    );
  }
);

ToggleGroupItem.displayName = ITEM_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ToggleGroupItemImplElement = React.ElementRef<typeof Toggle>;
type ToggleGroupItemImplProps = Radix.MergeProps<
  Omit<Radix.ComponentPropsWithoutRef<typeof Toggle>, 'defaultPressed' | 'onPressedChange'>,
  {
    /**
     * A string value for the toggle group item. All items within a toggle group should use a unique value.
     */
    value: string;
  }
>;

const ToggleGroupItemImpl = React.forwardRef<ToggleGroupItemImplElement, ToggleGroupItemImplProps>(
  (props, forwardedRef) => {
    const { value, ...itemProps } = props;
    const valueContext = useToggleGroupValueContext(ITEM_NAME);
    return (
      <Toggle
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
  ToggleGroup,
  ToggleGroupItem,
  //
  Root,
  Item,
};
