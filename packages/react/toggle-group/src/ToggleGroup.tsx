import * as React from 'react';
import { composeEventHandlers, createContext, useId, useCallbackRef } from '@radix-ui/react-utils';
import { getSelector, isFunction, makeId } from '@radix-ui/utils';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';
import { ToggleButton } from '@radix-ui/react-toggle-button';
import { Primitive } from '@radix-ui/react-primitive';
import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * ToggleGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'ToggleGroup';
const GROUP_CONTEXT_NAME = GROUP_NAME + 'Context';
const GROUP_DEFAULT_TAG = 'div';

type ToggleGroupOwnProps = Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    /** The controlled value of the toggled button in the group */
    value?: string | null;
    /** The uncontrolled value of the toggled button in the group */
    defaultValue?: string;
    /** A function called when the toggled button changes */
    onValueChange?: ((value: string | null) => void) | ((value: string) => void);
    /** Whether or not the group should maintain roving focus of its buttons */
    rovingFocus?: boolean;
  }
>;

type ToggleGroupPrimitive = Polymorphic.ForwardRefComponent<
  typeof GROUP_DEFAULT_TAG,
  ToggleGroupOwnProps
>;

type ToggleGroupContextValue = {
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  handleChange(value: string | null): void;
  name: typeof GROUP_CONTEXT_NAME;
  rovingFocus: boolean;
};

const [ToggleGroupContext, useToggleGroupContext] = createContext<ToggleGroupContextValue>(
  GROUP_CONTEXT_NAME,
  GROUP_NAME
);

const ToggleGroup = React.forwardRef((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    children,
    rovingFocus = false,
    ...groupProps
  } = props;

  const [value, setValue] = useControlledState<string | null>({
    prop: valueProp,
    defaultProp: defaultValue || null,
    onChange: onValueChange as (state: string | null) => void,
  });

  const handleChange = React.useCallback(
    function handleChange(buttonValue: string) {
      setValue((previousValue) => {
        if (!previousValue) {
          return buttonValue;
        }
        return previousValue === buttonValue ? null : buttonValue;
      });
    },
    [setValue]
  );

  const context: ToggleGroupContextValue = React.useMemo(() => {
    return {
      setValue,
      value,
      handleChange,
      rovingFocus,
      name: GROUP_CONTEXT_NAME,
    };
  }, [handleChange, rovingFocus, setValue, value]);

  return (
    <Primitive
      as={GROUP_DEFAULT_TAG}
      selector={getSelector(GROUP_NAME)}
      role="group"
      ref={forwardedRef}
      {...groupProps}
    >
      <ToggleGroupContext.Provider value={context}>
        {rovingFocus ? <RovingFocusGroup loop>{children}</RovingFocusGroup> : children}
      </ToggleGroupContext.Provider>
    </Primitive>
  ) as any;
}) as ToggleGroupPrimitive;

/* -------------------------------------------------------------------------------------------------
 * ToggleGroupItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ToggleGroupItem';

type ToggleGroupItemOwnProps = Merge<
  Omit<Polymorphic.OwnProps<typeof ToggleButton>, 'onToggledChange' | 'toggled' | 'defaultToggled'>,
  {
    /**
     * A string value for the toggle group item. All items within a toggle group should use a unique
     * value.
     */
    value: string;
  }
>;

type ToggleGroupItemPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ToggleButton>,
  ToggleGroupItemOwnProps
>;

type ToggleGroupItemPrimitiveInternal = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ToggleButton>,
  React.ComponentProps<typeof ToggleButton> & { state: ToggleGroupItemState }
>;

const ToggleGroupDefaultItem = React.forwardRef((props, forwardedRef) => {
  const { state, ...buttonProps } = props;
  return <ToggleButton ref={forwardedRef} {...buttonProps} />;
}) as ToggleGroupItemPrimitiveInternal;

const ToggleGroupRovingItem = React.forwardRef((props, forwardedRef) => {
  const { state, ...buttonProps } = props;
  const rovingFocusProps = useRovingFocus({
    disabled: props.disabled,
    active: state.value === 'on',
  });
  const allProps = mergeProps(buttonProps, rovingFocusProps);
  return <ToggleButton ref={forwardedRef} {...allProps} />;
}) as ToggleGroupItemPrimitiveInternal;

const ToggleGroupItem = React.forwardRef((props, forwardedRef) => {
  const context = useToggleGroupContext(ITEM_NAME);
  const {
    state,
    props: { button: buttonProps },
  } = useToggleGroupItem(props, ToggleGroupContext);
  const Comp = context.rovingFocus ? ToggleGroupRovingItem : ToggleGroupDefaultItem;
  return (
    <Comp state={state} selector={getSelector(ITEM_NAME)} ref={forwardedRef} {...buttonProps} />
  );
}) as ToggleGroupItemPrimitive;

/* -------------------------------------------------------------------------------------------------
 * MultiSelectToggleGroup
 * -----------------------------------------------------------------------------------------------*/

const MULTI_GROUP_NAME = 'MultiSelectToggleGroup';
const MULTI_GROUP_CONTEXT_NAME = MULTI_GROUP_NAME + 'Context';

type MultiSelectToggleGroupContextValue = {
  value: string[];
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
  handleChange(value: string): void;
  name: typeof MULTI_GROUP_CONTEXT_NAME;
  rovingFocus: boolean;
};

const [MultiSelectToggleGroupContext, useMultiSelectToggleGroupContext] = createContext<
  MultiSelectToggleGroupContextValue
>(MULTI_GROUP_CONTEXT_NAME, MULTI_GROUP_NAME);

type MultiSelectToggleGroupOwnProps = Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    /** The controlled value of the toggled buttons in the group */
    value?: string[];
    /** The uncontrolled value of the toggled buttons in the group */
    defaultValue?: string[];
    /** A function called when the any of the toggled buttons change */
    onValueChange?(value: string[]): void;
    /** Whether or not the group should maintain roving focus of its buttons */
    rovingFocus?: boolean;
  }
>;

type MultiSelectToggleGroupPrimitive = Polymorphic.ForwardRefComponent<
  typeof GROUP_DEFAULT_TAG,
  MultiSelectToggleGroupOwnProps
>;

const MultiSelectToggleGroup = React.forwardRef((props, forwardedRef) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    children,
    rovingFocus = false,
    ...groupProps
  } = props;

  const [value, setValue] = useControlledState<string[]>({
    prop: valueProp,
    defaultProp: defaultValue || [],
    onChange: onValueChange,
  });

  const handleChange = React.useCallback(
    function handleChange(buttonValue: string) {
      setValue((previousValue) => {
        if (!previousValue || previousValue.length < 1) {
          return [buttonValue];
        }

        return previousValue.includes(buttonValue)
          ? previousValue.filter((v) => v !== buttonValue)
          : previousValue.concat(buttonValue).sort();
      });
    },
    [setValue]
  );

  const context: MultiSelectToggleGroupContextValue = React.useMemo(() => {
    return {
      setValue,
      value,
      handleChange,
      rovingFocus,
      name: MULTI_GROUP_CONTEXT_NAME,
    };
  }, [handleChange, rovingFocus, setValue, value]);

  return (
    <Primitive
      as={GROUP_DEFAULT_TAG}
      selector={getSelector(MULTI_GROUP_NAME)}
      role="group"
      ref={forwardedRef}
      {...groupProps}
    >
      <MultiSelectToggleGroupContext.Provider value={context}>
        {rovingFocus ? <RovingFocusGroup loop>{children}</RovingFocusGroup> : children}
      </MultiSelectToggleGroupContext.Provider>
    </Primitive>
  );
}) as MultiSelectToggleGroupPrimitive;

/* -------------------------------------------------------------------------------------------------
 * MultiSelectToggleGroupItem
 * -----------------------------------------------------------------------------------------------*/

const MULTI_ITEM_NAME = 'MultiSelectToggleGroupItem';

type MultiSelectToggleGroupItemOwnProps = Merge<
  Omit<Polymorphic.OwnProps<typeof ToggleButton>, 'onToggledChange' | 'toggled' | 'defaultToggled'>,
  {
    /**
     * A string value for the toggle group item. All items within a toggle group should use a unique
     * value.
     */
    value: string;
  }
>;

type MultiSelectToggleGroupItemPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ToggleButton>,
  MultiSelectToggleGroupItemOwnProps
>;

type MultiSelectToggleGroupItemPrimitiveInternal = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof ToggleButton>,
  React.ComponentProps<typeof ToggleButton> & { state: ToggleGroupItemState }
>;

const MultiSelectToggleGroupDefaultItem = React.forwardRef((props, forwardedRef) => {
  const { state, ...buttonProps } = props;
  return <ToggleButton ref={forwardedRef} {...buttonProps} />;
}) as MultiSelectToggleGroupItemPrimitiveInternal;

const MultiSelectToggleGroupRovingItem = React.forwardRef((props, forwardedRef) => {
  const { state, ...buttonProps } = props;
  const rovingFocusProps = useRovingFocus({
    disabled: props.disabled,
    active: state.value === 'on',
  });
  const allProps = mergeProps(buttonProps, rovingFocusProps);
  return <ToggleButton ref={forwardedRef} {...allProps} />;
}) as MultiSelectToggleGroupItemPrimitiveInternal;

const MultiSelectToggleGroupItem = React.forwardRef((props, forwardedRef) => {
  const context = useMultiSelectToggleGroupContext(MULTI_ITEM_NAME);
  const {
    state,
    props: { button: buttonProps },
  } = useToggleGroupItem(props, MultiSelectToggleGroupContext);
  const Comp = context.rovingFocus
    ? MultiSelectToggleGroupRovingItem
    : MultiSelectToggleGroupDefaultItem;
  return (
    <Comp
      state={state}
      selector={getSelector(MULTI_ITEM_NAME)}
      ref={forwardedRef}
      {...buttonProps}
    />
  );
}) as MultiSelectToggleGroupItemPrimitive;

/* ----------------------------------------------------------------------------------------------*/

ToggleGroup.displayName = GROUP_NAME;
ToggleGroupItem.displayName = ITEM_NAME;

MultiSelectToggleGroup.displayName = MULTI_GROUP_NAME;
MultiSelectToggleGroupItem.displayName = MULTI_ITEM_NAME;

const Root = ToggleGroup;
const Item = ToggleGroupItem;
const MultiSelectRoot = MultiSelectToggleGroup;
const MultiSelectItem = MultiSelectToggleGroupItem;

export {
  ToggleGroup,
  ToggleGroupItem,
  MultiSelectToggleGroup,
  MultiSelectToggleGroupItem,
  //
  Root,
  Item,
  MultiSelectRoot,
  MultiSelectItem,
};

/* ---------------------------------------------------------------------------------------------- */

function getToggledStateValue(toggled: boolean): ToggleGroupItemState['value'] {
  return toggled ? 'on' : 'off';
}

function getToggledStateBoolean(value: ToggleGroupItemState['value']): boolean {
  return value === 'on' ? true : false;
}

function useInternalToggleGroupItemState<
  ContextType extends ToggleGroupContextValue | MultiSelectToggleGroupContextValue
>(
  props: ToggleGroupItemOwnProps,
  Ctx: React.Context<ContextType>
): [ToggleGroupItemState, (toggled: boolean) => void] {
  const {
    value: valueProp,
    // ignore these props
  } = props;

  const generatedValue = makeId(`toggle-button`, useId());
  const value = valueProp || generatedValue;
  const context = React.useContext(Ctx);
  const [toggled, setToggled] = useInternalToggleButtonState(context, props);

  const isGrouped = !!context;

  const itemState: ToggleGroupItemState = {
    value: getToggledStateValue(toggled),
    context: {
      isGrouped,
      valueInGroup: isGrouped ? value : null,
    },
  };

  return [itemState, setToggled];
}

function useToggleGroupItem<
  ContextType extends ToggleGroupContextValue | MultiSelectToggleGroupContextValue
>(props: ToggleGroupItemOwnProps, Ctx: React.Context<ContextType>): UseToggleGroupReturn {
  const [state, setToggled] = useInternalToggleGroupItemState(props, Ctx);

  // prettier-ignore
  const {
    value: valueProp,
    // @ts-ignore in case user is writing without type checking
    toggled: toggledProp, defaultToggled, onToggledChange,
    ...otherButtonProps
  } = props;

  const toggled = getToggledStateBoolean(state.value);
  const buttonProps = {
    toggled,
    onToggledChange: setToggled,
    value: valueProp,
  };

  return {
    state,
    props: {
      button: mergeProps(otherButtonProps, buttonProps),
    },
  };
}

function useInternalToggleButtonState(
  context: MultiSelectToggleGroupContextValue | ToggleGroupContextValue,
  props: ToggleGroupItemOwnProps | MultiSelectToggleGroupItemOwnProps
): [boolean, (toggled: boolean) => void] {
  const { value } = props;
  const toggled = !!(context.name === GROUP_CONTEXT_NAME
    ? context.value === value
    : context.name === MULTI_GROUP_CONTEXT_NAME
    ? context.value?.includes(value)
    : false);

  const setToggled = useCallbackRef(function setToggled(state: boolean) {
    context.handleChange(value);
  });

  return [toggled, setToggled];
}

// NOTE: I changed this this just a tiny bit to improve typing somewhat. I think it's a little nicer
// not to include `undefined` in the typing here and always provide a defaultProp value whether or
// not its passed by the consumer. If undefined is an acceptable type it should be added explicitly
// IMO. Otherwise implementation is identical to what we have in utils. Would like to PR this
// separately if we agree here.
function useControlledState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: {
  prop?: T;
  defaultProp: T;
  onChange?: (state: T) => void;
}) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({ defaultProp, onChange });
  const isControlled = prop !== undefined;
  const value = isControlled ? (prop as T) : uncontrolledProp;
  const handleChange = useCallbackRef(onChange);

  const setValue: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
    (nextValue) => {
      if (isControlled) {
        const setter = nextValue as SetStateFn<T>;
        const value = typeof nextValue === 'function' ? setter(prop) : nextValue;
        if (value !== prop) handleChange(value as T);
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, handleChange]
  );

  return [value, setValue] as const;
}

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: {
  defaultProp: T;
  onChange?: (state: T) => void;
}) {
  const uncontrolledState = React.useState<T>(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = React.useRef(value);
  const handleChange = useCallbackRef(onChange);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef, handleChange]);

  return uncontrolledState;
}

// TODO: Typing here is probably needed if we are OK with this as a generic utility, but I couldn't
// get it working without lots of casting when composing props from multiple hooks
export function mergeProps(...args: any[]): any {
  const result: any = {};
  for (const props of args) {
    for (const key in result) {
      // Compose event handlers
      if (/^on[A-Z]/.test(key) && isFunction(result[key]) && isFunction(props[key])) {
        result[key] = composeEventHandlers(result[key], props[key]);
      } else {
        result[key] = props[key] !== undefined ? props[key] : result[key];
      }
    }

    for (const key in props) {
      if (result[key] === undefined) {
        result[key] = props[key];
      }
    }
  }

  return result;
}

interface ToggleGroupItemState {
  value: 'on' | 'off';
  context: {
    isGrouped: boolean;
    valueInGroup: any;
  };
}

interface ToggleGroupItemAllProps {
  button: React.ComponentProps<typeof ToggleButton>;
}

type UseToggleGroupReturn = {
  state: ToggleGroupItemState;
  props: ToggleGroupItemAllProps;
};

type SetStateFn<T> = (prevState?: T) => T;
