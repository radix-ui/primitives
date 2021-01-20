import * as React from 'react';
import { composeEventHandlers, createContext, useId, useCallbackRef } from '@radix-ui/react-utils';
import { getPartDataAttrObj, makeId, isFunction } from '@radix-ui/utils';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';
import { ToggleButton } from '@radix-ui/react-toggle-button';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * ToggleButton
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'ToggleGroup';
const GROUP_CONTEXT_NAME = GROUP_NAME + 'Context';
const GROUP_DEFAULT_TAG = 'div';

type ToggleGroupOwnProps = {
  /** The controlled value of the toggled button in the group */
  value?: string | null;
  /** The uncontrolled value of the toggled button in the group */
  defaultValue?: string;
  /** A function called when the toggled button changes */
  onValueChange?: ((value: string | null) => void) | ((value: string) => void);
  /** Whether or not the group should maintain roving focus of its buttons */
  rovingFocus?: boolean;
};

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

const ToggleGroup = forwardRefWithAs<typeof GROUP_DEFAULT_TAG, ToggleGroupOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = GROUP_DEFAULT_TAG,
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
      <Comp {...getPartDataAttrObj(GROUP_NAME)} role="group" ref={forwardedRef} {...groupProps}>
        <ToggleGroupContext.Provider value={context}>
          {rovingFocus ? <RovingFocusGroup loop>{children}</RovingFocusGroup> : children}
        </ToggleGroupContext.Provider>
      </Comp>
    ) as any;
  }
);

/* -------------------------------------------------------------------------------------------------
 * ToggleGroupItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'ToggleGroupItem';

type ToggleGroupItemOwnProps = {
  /**
   * A string value for the toggle group item. All items within a toggle group should use a unique
   * value.
   */
  value: string;
};

const ToggleGroupItemImpl = forwardRefWithAs<typeof ToggleButton, ToggleGroupItemOwnProps>(
  (props, forwardedRef) => {
    const { children } = props;
    const {
      props: { button: buttonProps },
    } = useToggleGroupItem(props, ToggleGroupContext);
    return (
      <ToggleButton {...getPartDataAttrObj(ITEM_NAME)} ref={forwardedRef} {...buttonProps}>
        {children}
      </ToggleButton>
    );
  }
);

const ToggleGroupRovingItem = forwardRefWithAs<typeof ToggleButton, ToggleGroupItemOwnProps>(
  (props, forwardedRef) => {
    const { children } = props;
    const {
      props: { button: buttonProps },
      state,
    } = useToggleGroupItem(props, ToggleGroupContext);
    const rovingFocusProps = useRovingFocus({
      disabled: props.disabled,
      active: state.value === 'on',
    });
    const allProps = mergeProps(buttonProps, rovingFocusProps);
    return (
      <ToggleButton {...getPartDataAttrObj(ITEM_NAME)} ref={forwardedRef} {...allProps}>
        {children}
      </ToggleButton>
    );
  }
);

const ToggleGroupItem = forwardRefWithAs<typeof ToggleButton, ToggleGroupItemOwnProps>(
  (props, forwardedRef) => {
    const context = useToggleGroupContext(ITEM_NAME);
    return context?.rovingFocus ? (
      <ToggleGroupRovingItem ref={forwardedRef} {...props} />
    ) : (
      <ToggleGroupItemImpl ref={forwardedRef} {...props} />
    );
  }
);

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

type MultiSelectToggleGroupOwnProps = {
  /** The controlled value of the toggled buttons in the group */
  value?: string[];
  /** The uncontrolled value of the toggled buttons in the group */
  defaultValue?: string[];
  /** A function called when the any of the toggled buttons change */
  onValueChange?(value: string[]): void;
  /** Whether or not the group should maintain roving focus of its buttons */
  rovingFocus?: boolean;
};

const MultiSelectToggleGroup = forwardRefWithAs<
  typeof GROUP_DEFAULT_TAG,
  MultiSelectToggleGroupOwnProps
>((props, forwardedRef) => {
  const {
    as: Comp = GROUP_DEFAULT_TAG,
    value: valueProp,
    defaultValue,
    onValueChange,
    children,
    rovingFocus = false,
    ...groupProps
  } = props;

  const [value = [], setValue] = useControlledState<string[]>({
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
    <Comp {...getPartDataAttrObj(MULTI_GROUP_NAME)} role="group" ref={forwardedRef} {...groupProps}>
      <MultiSelectToggleGroupContext.Provider value={context}>
        {rovingFocus ? <RovingFocusGroup loop>{children}</RovingFocusGroup> : children}
      </MultiSelectToggleGroupContext.Provider>
    </Comp>
  );
});

/* -------------------------------------------------------------------------------------------------
 * MultiSelectToggleGroupItem
 * -----------------------------------------------------------------------------------------------*/

const MULTI_ITEM_NAME = 'MultiSelectToggleGroupItem';

type MultiSelectToggleGroupItemOwnProps = {
  /**
   * A string value for the toggle group item. All items within a toggle group should use a unique
   * value.
   */
  value: string;
};

const MultiSelectToggleGroupItemImpl = forwardRefWithAs<
  typeof ToggleButton,
  MultiSelectToggleGroupItemOwnProps
>((props, forwardedRef) => {
  const { children } = props;
  const {
    props: { button: buttonProps },
  } = useToggleGroupItem(props, MultiSelectToggleGroupContext);
  return (
    <ToggleButton {...getPartDataAttrObj(MULTI_ITEM_NAME)} ref={forwardedRef} {...buttonProps}>
      {children}
    </ToggleButton>
  );
});

const MultiSelectToggleGroupRovingItem = forwardRefWithAs<
  typeof ToggleButton,
  ToggleGroupItemOwnProps
>((props, forwardedRef) => {
  const { children } = props;
  const {
    props: { button: buttonProps },
    state,
  } = useToggleGroupItem(props, MultiSelectToggleGroupContext);
  const rovingFocusProps = useRovingFocus({
    disabled: props.disabled,
    active: state.value === 'on',
  });
  const allProps = mergeProps(buttonProps, rovingFocusProps);
  return (
    <ToggleButton {...getPartDataAttrObj(MULTI_ITEM_NAME)} ref={forwardedRef} {...allProps}>
      {children}
    </ToggleButton>
  );
});

const MultiSelectToggleGroupItem = forwardRefWithAs<typeof ToggleButton, ToggleGroupItemOwnProps>(
  (props, forwardedRef) => {
    const context = useMultiSelectToggleGroupContext(MULTI_ITEM_NAME);
    return context?.rovingFocus ? (
      <MultiSelectToggleGroupRovingItem ref={forwardedRef} {...props} />
    ) : (
      <MultiSelectToggleGroupItemImpl ref={forwardedRef} {...props} />
    );
  }
);

/* ----------------------------------------------------------------------------------------------*/

MultiSelectToggleGroup.displayName = MULTI_GROUP_NAME;
MultiSelectToggleGroupItem.displayName = MULTI_ITEM_NAME;

ToggleGroupItem.displayName = ITEM_NAME;
ToggleGroup.displayName = GROUP_NAME;

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

function useToggleGroupItem<
  ContextType extends ToggleGroupContextValue | MultiSelectToggleGroupContextValue,
  ElementType extends keyof JSX.IntrinsicElements | React.ComponentType<any>
>(
  props: ToggleGroupItemOwnProps & React.ComponentProps<ElementType>,
  Ctx: React.Context<ContextType>
): UseToggleGroupReturn<ElementType> {
  const {
    value: valueProp,
    // ignore these props
    toggled: toggledProp,
    defaultToggled,
    onToggledChange,
    ...otherButtonProps
  } = props;

  const generatedValue = makeId(`toggle-button`, useId());
  const value = valueProp || generatedValue;
  const context = React.useContext(Ctx);
  const [toggled, setToggled] = useInternalToggleButtonState(context, props);

  const isGrouped = !!context;
  const buttonProps = {
    toggled,
    onToggledChange: setToggled,
    value: valueProp,
  };

  return {
    state: {
      value: toggled ? 'on' : 'off',
      context: {
        isGrouped,
        valueInGroup: isGrouped ? value : null,
      },
    },
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

type UseRovingToggleGroupReturn<
  ElementType extends keyof JSX.IntrinsicElements | React.ComponentType<any>
> = UseToggleGroupReturn<ElementType> & {
  props: {
    button: UseToggleGroupReturn<ElementType>['props']['button'] & {
      tabIndex: number;
      onMouseDown: (event: React.MouseEvent) => void;
      onFocus: undefined | ((event: React.FocusEvent) => void);
      onKeyDown?: undefined | ((event: React.KeyboardEvent) => void);
    };
  };
};

type UseToggleGroupReturn<
  ElementType extends keyof JSX.IntrinsicElements | React.ComponentType<any>
> = {
  state: {
    value: 'on' | 'off';
    context: {
      isGrouped: boolean;
      valueInGroup: any;
    };
  };
  props: {
    button: ToggleGroupItemOwnProps &
      React.ComponentProps<ElementType> & {
        toggled: boolean;
        onToggledChange: (state: boolean) => void;
        value: string | undefined;
      };
  };
};

type SetStateFn<T> = (prevState?: T) => T;
