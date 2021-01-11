import * as React from 'react';
import { composeEventHandlers, useId, useCallbackRef } from '@radix-ui/react-utils';
import { getPartDataAttrObj, warning, makeId, isFunction } from '@radix-ui/utils';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';

const __DEV__ = isDev();

// Config 1: Multiple selection, at least one required
// Config 2: Multiple selection, none required
// Config 3: Single selection,  at least one required
// Config 4: Single selection, none required

/* -------------------------------------------------------------------------------------------------
 * ToggleButtonGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'ToggleButtonGroup';
const GROUP_DEFAULT_TAG = 'div';
const GROUP_CONTEXT_NAME = 'ToggleButtonGroupContext';

type ToggleButtonGroupContextValue = {
  value: string[];
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
  handleChange(value: string): void;
  name: typeof GROUP_CONTEXT_NAME;
  rovingFocus: boolean;
};

const ToggleButtonGroupContext = React.createContext<ToggleButtonGroupContextValue | null>(null);
ToggleButtonGroupContext.displayName = GROUP_CONTEXT_NAME;

type ToggleButtonGroupSharedProps = {
  /** Whether or not a selection in the group is required after initial selection */
  selectionIsRequired?: boolean;
  /** Whether or not the group should maintain roving focus of its buttons */
  rovingFocus?: boolean;
};

type ToggleButtonGroupOwnProps = ToggleButtonGroupSharedProps & {
  /** The controlled value of the toggled button */
  value?: string[];
  /** The uncontrolled value of the toggled button */
  defaultValue?: string[];
  /** A function called when the value of the toggled buttons changes */
  onValueChange?(value: string[]): void;
};

const ToggleButtonGroup = forwardRefWithAs<typeof GROUP_DEFAULT_TAG, ToggleButtonGroupOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = GROUP_DEFAULT_TAG,
      value: valueProp,
      defaultValue,
      onValueChange,
      children,
      selectionIsRequired = false,
      rovingFocus = false,
      ...groupProps
    } = props;

    const [value, setValue] = useControlledState<string[]>({
      prop: valueProp,
      defaultProp: defaultValue || [],
      onChange: onValueChange,
      isEqual: stringArraysAreEqual,
    });

    function handleChange(buttonValue: string) {
      if (!value || value.length < 1) {
        return setValue([buttonValue]);
      }

      if (selectionIsRequired && value.length === 1 && value.includes(buttonValue)) {
        return;
      }

      setValue(
        value.includes(buttonValue)
          ? value.filter((v) => v !== buttonValue)
          : value.concat(buttonValue).sort()
      );
    }

    const context: ToggleButtonGroupContextValue = {
      setValue,
      value,
      handleChange,
      rovingFocus,
      name: GROUP_CONTEXT_NAME,
    };

    return (
      <Comp {...getPartDataAttrObj(GROUP_NAME)} role="group" ref={forwardedRef} {...groupProps}>
        <ToggleButtonGroupContext.Provider value={context}>
          <ToggleButtonGroupInner rovingFocus={rovingFocus}>{children}</ToggleButtonGroupInner>
        </ToggleButtonGroupContext.Provider>
      </Comp>
    );
  }
);

function ToggleButtonGroupInner(props: { rovingFocus: boolean; children: React.ReactNode }) {
  return props.rovingFocus ? (
    <RovingFocusGroup loop>{props.children}</RovingFocusGroup>
  ) : (
    <React.Fragment>{props.children}</React.Fragment>
  );
}

/* -------------------------------------------------------------------------------------------------
 * ToggleButtonExclusive
 * -----------------------------------------------------------------------------------------------*/

const GROUP_EXC_NAME = 'ToggleButtonGroupExclusive';
const GROUP_EXC_CONTEXT_NAME = 'ToggleButtonGroupExclusiveContext';

type ToggleButtonGroupExclusiveOwnProps = ToggleButtonGroupSharedProps & {
  /** The controlled value of the toggled button */
  value?: string | null;
  /** The uncontrolled value of the toggled button */
  defaultValue?: string;
  /** A function called when the value of the toggled buttons changes */
  onValueChange?(value: string | null): void;
};

type ToggleButtonGroupExclusiveContextValue = {
  value: string | null;
  setValue:
    | React.Dispatch<React.SetStateAction<string | null>>
    | React.Dispatch<React.SetStateAction<string>>;
  handleChange(value: string | null): void;
  name: typeof GROUP_EXC_CONTEXT_NAME;
  rovingFocus: boolean;
};
const ToggleButtonGroupExclusiveContext = React.createContext<ToggleButtonGroupExclusiveContextValue | null>(
  null
);
ToggleButtonGroupExclusiveContext.displayName = GROUP_EXC_CONTEXT_NAME;

const ToggleButtonGroupExclusive = forwardRefWithAs<
  typeof GROUP_DEFAULT_TAG,
  ToggleButtonGroupExclusiveOwnProps
>((props, forwardedRef) => {
  const {
    as: Comp = GROUP_DEFAULT_TAG,
    value: valueProp,
    defaultValue,
    onValueChange,
    children,
    selectionIsRequired = false,
    rovingFocus = false,
    ...groupProps
  } = props;

  const [value, setValue] = useControlledState<string | null>({
    prop: valueProp,
    defaultProp: defaultValue || null,
    onChange: onValueChange,
  });

  function handleChange(buttonValue: string) {
    if (!value) {
      return setValue(buttonValue);
    }

    if (selectionIsRequired && value === buttonValue) {
      return;
    }

    setValue(value === buttonValue ? null : buttonValue);
  }

  const context: ToggleButtonGroupExclusiveContextValue = {
    setValue,
    value,
    handleChange,
    rovingFocus,
    name: GROUP_EXC_CONTEXT_NAME,
  };

  return (
    <Comp {...getPartDataAttrObj(GROUP_EXC_NAME)} role="group" ref={forwardedRef} {...groupProps}>
      <ToggleButtonGroupExclusiveContext.Provider value={context}>
        <ToggleButtonGroupInner rovingFocus={rovingFocus}>{children}</ToggleButtonGroupInner>
      </ToggleButtonGroupExclusiveContext.Provider>
    </Comp>
  ) as any;
});

/* -------------------------------------------------------------------------------------------------
 * ToggleButton
 * -----------------------------------------------------------------------------------------------*/

const BUTTON_NAME = 'ToggleButton';
const BUTTON_DEFAULT_TAG = 'button';

type ToggleButtonOwnProps = {
  /** Whether the button is toggled or not, if controlled */
  toggled?: boolean;
  /**
   * Whether the button is toggled by default, if uncontrolled
   * (default: false)
   */
  defaultToggled?: boolean;
  /** A function called when the button is toggled */
  onToggledChange?(toggled: boolean): void;
  /**
   * A string value for the toggle button. Optional unless the button is inside of a
   * `ToggleButtonGroup`. All items within a `ToggleButtonGroup` should use a unique value.
   */
  value?: string;
};

const ToggleButtonImpl = forwardRefWithAs<typeof BUTTON_DEFAULT_TAG, ToggleButtonOwnProps>(
  (props, forwardedRef) => {
    const { as: Comp = BUTTON_DEFAULT_TAG, children } = props;
    const {
      props: { button: buttonProps },
    } = useToggleButton<typeof BUTTON_DEFAULT_TAG>(props);
    return (
      <Comp {...getPartDataAttrObj(BUTTON_NAME)} ref={forwardedRef} {...buttonProps}>
        {children}
      </Comp>
    );
  }
);

const RovingToggleButton = forwardRefWithAs<typeof BUTTON_DEFAULT_TAG, ToggleButtonOwnProps>(
  (props, forwardedRef) => {
    const { as: Comp = BUTTON_DEFAULT_TAG, children } = props;
    const {
      props: { button: buttonProps },
      state,
    } = useToggleButton<typeof BUTTON_DEFAULT_TAG>(props);
    const rovingFocusProps = useRovingFocus({
      disabled: props.disabled,
      active: state.value === 'on',
    });
    const allProps = mergeProps<typeof props>(buttonProps, rovingFocusProps);
    return (
      <Comp {...getPartDataAttrObj(BUTTON_NAME)} ref={forwardedRef} {...allProps}>
        {children}
      </Comp>
    );
  }
);

const ToggleButton = forwardRefWithAs<typeof BUTTON_DEFAULT_TAG, ToggleButtonOwnProps>(
  (props, forwardedRef) => {
    const context = useInternalToggleButtonGroupContext({
      toggledProp: props.toggled,
      defaultToggled: props.defaultToggled,
    });

    return context?.rovingFocus ? (
      <RovingToggleButton ref={forwardedRef} {...props} />
    ) : (
      <ToggleButtonImpl ref={forwardedRef} {...props} />
    );
  }
);

ToggleButton.displayName = BUTTON_NAME;
ToggleButtonGroup.displayName = GROUP_NAME;
ToggleButtonGroupExclusive.displayName = GROUP_EXC_NAME;

const Root = ToggleButton;
const Group = ToggleButtonGroup;
const GroupExclusive = ToggleButtonGroupExclusive;

export { ToggleButton, ToggleButtonGroup, ToggleButtonGroupExclusive, Root, Group, GroupExclusive };

/* ---------------------------------------------------------------------------------------------- */

function useToggleButton<
  ElementType extends keyof JSX.IntrinsicElements | React.ComponentType<any>
>(props: ToggleButtonOwnProps & React.ComponentProps<ElementType>) {
  const {
    toggled: toggledProp,
    defaultToggled,
    onClick,
    onToggledChange,
    children,
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
  const context = useInternalToggleButtonGroupContext({ toggledProp, defaultToggled });
  const toggled = useInternalToggleButtonState({ context, ownToggledState: _toggled, value });

  function setToggled(state: boolean) {
    if (context) {
      context.handleChange(value);
    } else {
      _setToggled(state);
    }
  }

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
  const state = {
    value: toggled ? 'on' : 'off',
    context: {
      isGrouped,
      valueInGroup: isGrouped ? value : null,
    },
  } as const;
  const buttonProps = {
    type: 'button',
    'aria-pressed': toggled,
    'data-state': toggled ? 'on' : 'off',
    'data-disabled': props.disabled ? '' : undefined,
    onClick: composeEventHandlers(onClick as (event: React.MouseEvent) => void, () => {
      if (!props.disabled) {
        setToggled(!toggled);
      }
    }),
  } as const;

  return {
    state,
    props: {
      button: {
        ...buttonProps,
        ...otherButtonProps,
      },
    },
  };
}

function useInternalToggleButtonGroupContext({
  toggledProp,
  defaultToggled,
}: {
  defaultToggled: boolean | undefined;
  toggledProp: boolean | undefined;
}): ToggleButtonGroupContextValue | ToggleButtonGroupExclusiveContextValue | null {
  const standardGroupContext = React.useContext(ToggleButtonGroupContext);
  const exclusiveGroupContext = React.useContext(ToggleButtonGroupExclusiveContext);

  useConflictingContextError(standardGroupContext, exclusiveGroupContext);
  useButtonStateInGroupWarning({
    toggledProp,
    defaultToggled,
    groupContext: exclusiveGroupContext || standardGroupContext,
    groupName: standardGroupContext ? GROUP_NAME : exclusiveGroupContext ? GROUP_EXC_NAME : null,
  });
  return standardGroupContext || exclusiveGroupContext || null;
}

function useInternalToggleButtonState({
  context,
  ownToggledState,
  value,
}: {
  value: string;
  ownToggledState: boolean;
  context: ToggleButtonGroupContextValue | ToggleButtonGroupExclusiveContextValue | null;
}) {
  const toggled = !!(context?.name === GROUP_EXC_CONTEXT_NAME
    ? context.value === value
    : context?.name === GROUP_CONTEXT_NAME
    ? context.value?.includes(value)
    : ownToggledState);
  return toggled;
}

function useConflictingContextError(
  standardGroupContext: ToggleButtonGroupContextValue | null,
  exclusiveGroupContext: ToggleButtonGroupExclusiveContextValue | null
) {
  if (exclusiveGroupContext && standardGroupContext) {
    throw Error(
      `A ${BUTTON_NAME} was used in both ${GROUP_EXC_NAME} and ${GROUP_NAME} components. ${BUTTON_NAME} can be used in either ${GROUP_EXC_NAME} or ${GROUP_NAME}, but not both.`
    );
  }
}

function useButtonStateInGroupWarning({
  toggledProp,
  defaultToggled,
  groupContext,
  groupName,
}: {
  toggledProp: boolean | undefined;
  defaultToggled: boolean | undefined;
  groupContext: ToggleButtonGroupContextValue | ToggleButtonGroupExclusiveContextValue | null;
  groupName: string | null;
}) {
  const isControlled = useIsControlled(toggledProp);
  if (__DEV__) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      const propName = isControlled ? '`toggled`' : '`defaultToggled`';
      const toggled = isControlled ? toggledProp : defaultToggled;
      warning(
        !(groupContext && toggled !== undefined),
        `A ${BUTTON_NAME} with an explicit ${propName} prop was used inside of a ${groupName}. When ${BUTTON_NAME} is used inside of a ${groupName}, the ${groupName} component is responsible for managing the toggled state of its nested ${BUTTON_NAME} components. Either remove the ${propName} from ${BUTTON_NAME} or remove the ${groupName} component if the ${BUTTON_NAME} is unrelated to other surrounding buttons.`
      );
    }, [groupContext, toggledProp, defaultToggled, groupName, isControlled]);
  }
}

function stringArraysAreEqual(arr1: string[] | undefined, arr2: string[] | undefined) {
  if (arr1 === undefined && arr2 === undefined) return true;
  if (arr1 === undefined) return false;
  if (arr2 === undefined) return false;
  return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort());
}

// NOTE: I changed this implementation a tiny bit to improve typing somewhat. I think it's a little
// nicer not to include `undefined` in the typing here and always provide a defaultProp value
// whether or not its passed by the consumer. If undefined is an acceptable type it should be added
// explicitly IMO. Also added an option to override the equality check so we can handle arrays,
// objects, etc. If we're ok with these changes I can update it in the utils package as a separate
// PR.
function useControlledState<T>({
  prop,
  defaultProp,
  onChange,
  isEqual = defaultIsEqual,
}: {
  prop?: T;
  defaultProp: T;
  onChange?: (value: T) => void;
  isEqual?: (prevState: any, nextState: any) => boolean;
}): [T, React.Dispatch<React.SetStateAction<T>>] {
  const stable_onChange = useCallbackRef(onChange);
  const stable_isEqual = useCallbackRef(isEqual);
  const [state, setState] = React.useState(prop || defaultProp);
  const stateRef = React.useRef(state);
  const isControlled = useIsControlled(prop);

  const setValue: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
    (value) => {
      function handleChange(value: T) {
        if (!stable_isEqual(stateRef.current, value)) {
          stable_onChange(value);
        }
        if (!isControlled) {
          stateRef.current = value;
        }
      }

      if (isFunction(value)) {
        setState((oldValue) => {
          const newValue = value((isControlled ? stateRef.current : oldValue) as any);
          handleChange(newValue);
          return isControlled ? oldValue : newValue;
        });
      } else {
        if (!isControlled) {
          setState(value);
        }
        handleChange(value);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stable_isEqual, stable_onChange]
  );

  const value = isControlled ? prop! : state;
  if (isControlled) {
    stateRef.current = prop!;
  }

  return [value, setValue];
}

function useIsControlled(controlledProp: any): boolean {
  const controlledTrackingRef = React.useRef(controlledProp !== undefined);
  const wasControlled = controlledTrackingRef.current;
  const isControlled = controlledProp !== undefined;
  if (__DEV__) {
    warning(
      wasControlled === isControlled,
      `A component is changing from ${wasControlled ? 'controlled' : 'uncontrolled'} to ${
        isControlled ? 'controlled' : 'uncontrolled'
      }. Components should not switch from controlled to uncontrolled (or vice versa) during its lifetime.`
    );
  }
  controlledTrackingRef.current = isControlled;
  return isControlled;
}

function defaultIsEqual(a: any, b: any): boolean {
  return a === b;
}

function isDev() {
  return process && process.env && process.env.NODE_ENV
    ? process.env.NODE_ENV === 'development'
    : true;
}

// mergeProps composes any event handlers by default
// Consider moving to utils
interface Props {
  [key: string]: any;
}

type TupleTypes<T> = { [P in keyof T]: T[P] } extends { [key: number]: infer V } ? V : never;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

export function mergeProps<T extends Props>(...args: T[]): UnionToIntersection<TupleTypes<T>> {
  const result: Props = {};
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

  return result as UnionToIntersection<TupleTypes<T>>;
}
