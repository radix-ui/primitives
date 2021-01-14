import * as React from 'react';
import { composeEventHandlers, useId, useCallbackRef } from '@radix-ui/react-utils';
import { getPartDataAttrObj, makeId, isFunction } from '@radix-ui/utils';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';
import { ToggleButton } from '@radix-ui/react-toggle-button';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';

// const __DEV__ = isDev();

/* -------------------------------------------------------------------------------------------------
 * ToggleButton
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'ToggleGroup';
const GROUP_CONTEXT_NAME = GROUP_NAME + 'Context';
const GROUP_DEFAULT_TAG = 'div';

type ToggleGroupOwnProps = {
  /** The controlled value of the toggled button */
  value?: string | null;
  /** The uncontrolled value of the toggled button */
  defaultValue?: string;
  /** A function called when the value of the toggled buttons changes */
  onValueChange?: ((value: string | null) => void) | ((value: string) => void);
  /** Whether or not a selection in the group is required after initial selection */
  required?: boolean;
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
const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(null);
ToggleGroupContext.displayName = GROUP_CONTEXT_NAME;

const ToggleGroup = forwardRefWithAs<typeof GROUP_DEFAULT_TAG, ToggleGroupOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = GROUP_DEFAULT_TAG,
      value: valueProp,
      defaultValue,
      onValueChange,
      children,
      required = false,
      rovingFocus = false,
      ...groupProps
    } = props;

    const [value, setValue] = useControlledState<string | null>({
      prop: valueProp,
      defaultProp: defaultValue || null,
      onChange: onValueChange as (state: string | null) => void,
    });

    const stable_isRequired = useCallbackRef(() => required);

    const handleChange = React.useCallback(
      function handleChange(buttonValue: string) {
        setValue((previousValue) => {
          if (!previousValue) {
            return buttonValue;
          }
          if (stable_isRequired() && previousValue === buttonValue) {
            return previousValue;
          }
          return previousValue === buttonValue ? null : buttonValue;
        });
      },
      [setValue, stable_isRequired]
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
  /** A function called when the button is toggled */
  onToggledChange?(toggled: boolean): void;
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
    const context = React.useContext(ToggleGroupContext);

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

const MultiSelectToggleGroupContext = React.createContext<MultiSelectToggleGroupContextValue | null>(
  null
);
MultiSelectToggleGroupContext.displayName = MULTI_GROUP_CONTEXT_NAME;

type MultiSelectToggleGroupOwnProps = {
  /** The controlled value of the toggled button */
  value?: string[];
  /** The uncontrolled value of the toggled button */
  defaultValue?: string[];
  /** A function called when the value of the toggled buttons changes */
  onValueChange?(value: string[]): void;
  /** Whether or not a selection in the group is required after initial selection */
  required?: boolean;
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
    required = false,
    rovingFocus = false,
    ...groupProps
  } = props;

  const [value = [], setValue] = useControlledState<string[]>({
    prop: valueProp,
    defaultProp: defaultValue || [],
    onChange: onValueChange,
  });

  const stable_isRequired = useCallbackRef(() => required);

  const handleChange = React.useCallback(
    function handleChange(buttonValue: string) {
      setValue((previousValue) => {
        if (!previousValue || previousValue.length < 1) {
          return [buttonValue];
        }

        if (
          stable_isRequired() &&
          previousValue.length === 1 &&
          previousValue.includes(buttonValue)
        ) {
          return previousValue;
        }

        return previousValue.includes(buttonValue)
          ? previousValue.filter((v) => v !== buttonValue)
          : previousValue.concat(buttonValue).sort();
      });
    },
    [setValue, stable_isRequired]
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
  /** A function called when the button is toggled */
  onToggledChange?(toggled: boolean): void;
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
    const context = React.useContext(MultiSelectToggleGroupContext);
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
  Ctx: React.Context<ContextType | null>
): UseToggleGroupReturn<ElementType> {
  const {
    toggled: toggledProp,
    defaultToggled,
    onToggledChange,
    value: valueProp,
    ...otherButtonProps
  } = props;

  const [_toggled = false, _setToggled] = useControlledState<boolean>({
    prop: toggledProp,
    onChange: onToggledChange,
    defaultProp: defaultToggled || false,
  });

  const generatedValue = makeId(`toggle-button`, useId());
  const value = valueProp || generatedValue;
  const context = React.useContext(Ctx);
  const toggled = useInternalToggleButtonState({ context, ownToggledState: _toggled, value });

  const setToggled = React.useCallback(
    function setToggled(state: boolean) {
      if (context) {
        context.handleChange(value);
      } else {
        _setToggled(state);
      }
    },
    [_setToggled, context, value]
  );

  // If the toggle button is in a group, onToggleChange will never fire because we bypass the
  // setter returned from useControlledState since the group is managing its children states. We
  // will explicitly call onToggleChange for grouped toggle buttons only when the toggled value
  // changes.
  const stable_onToggleChange = useCallbackRef(onToggledChange);
  const stable_isGrouped = useCallbackRef(() => !!context);
  const firstRun = React.useRef(true);
  React.useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (stable_isGrouped()) {
      stable_onToggleChange(toggled);
    }
  }, [stable_isGrouped, stable_onToggleChange, toggled]);

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

function useInternalToggleButtonState({
  context,
  ownToggledState,
  value,
}: {
  value: string;
  ownToggledState: boolean;
  context: MultiSelectToggleGroupContextValue | ToggleGroupContextValue | null;
}) {
  const toggled = !!(context?.name === GROUP_CONTEXT_NAME
    ? context.value === value
    : context?.name === MULTI_GROUP_CONTEXT_NAME
    ? context.value?.includes(value)
    : ownToggledState);
  return toggled;
}

// NOTE: I changed this implementation a tiny bit to improve typing somewhat. I think it's a little
// nicer not to include `undefined` in the typing here and always provide a defaultProp value
// whether or not its passed by the consumer. If undefined is an acceptable type it should be added
// explicitly IMO.
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
