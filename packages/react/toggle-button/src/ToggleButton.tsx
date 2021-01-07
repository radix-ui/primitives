import * as React from 'react';
import {
  // useControlledState,
  composeEventHandlers,
  useId,
  useCallbackRef,
} from '@radix-ui/react-utils';
import { getPartDataAttrObj, warning, makeId, isFunction } from '@radix-ui/utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';

const __DEV__ = isDev();

/* -------------------------------------------------------------------------------------------------
 * ToggleButtonGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'ToggleButtonGroup';
const GROUP_EXC_NAME = 'ToggleButtonGroupExclusive';
const BUTTON_NAME = 'ToggleButton';
const INCORRECT_CONTEXT_ERROR = `A ${BUTTON_NAME} was used in both ${GROUP_EXC_NAME} and ${GROUP_NAME} components. ${BUTTON_NAME} can be used in either ${GROUP_EXC_NAME} or ${GROUP_NAME}, but not both.`;
const GROUP_DEFAULT_TAG = 'div';

type ToggleButtonGroupContextValue = {
  value: string[];
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
  handleChange(value: string): void;
};

const ToggleButtonGroupContext = React.createContext<ToggleButtonGroupContextValue | null>(null);
ToggleButtonGroupContext.displayName = 'ToggleButtonGroupContext';

type ToggleButtonGroupOwnProps = {
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
      setValue(
        value.includes(buttonValue)
          ? value.filter((v) => v !== buttonValue)
          : value.concat(buttonValue).sort()
      );
    }

    const context: ToggleButtonGroupContextValue = { setValue, value, handleChange };

    return (
      <Comp {...getPartDataAttrObj(GROUP_NAME)} role="group" ref={forwardedRef} {...groupProps}>
        <ToggleButtonGroupContext.Provider value={context}>
          {children}
        </ToggleButtonGroupContext.Provider>
      </Comp>
    );
  }
);

ToggleButtonGroup.displayName = GROUP_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToggleButtonExclusive
 * -----------------------------------------------------------------------------------------------*/

type ToggleButtonGroupExclusiveOwnProps = {
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
};
const ToggleButtonGroupExclusiveContext = React.createContext<ToggleButtonGroupExclusiveContextValue | null>(
  null
);
ToggleButtonGroupExclusiveContext.displayName = 'ToggleButtonGroupExclusiveContext';

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
    ...groupProps
  } = props;

  const [value, setValue] = useControlledState<string | null>({
    prop: valueProp,
    defaultProp: defaultValue || null,
    onChange: onValueChange,
  });

  const context: ToggleButtonGroupExclusiveContextValue = {
    setValue,
    value,
    handleChange: setValue,
  };

  return (
    <Comp {...getPartDataAttrObj(GROUP_EXC_NAME)} role="group" ref={forwardedRef} {...groupProps}>
      <ToggleButtonGroupExclusiveContext.Provider value={context}>
        {children}
      </ToggleButtonGroupExclusiveContext.Provider>
    </Comp>
  ) as any;
});

ToggleButtonGroupExclusive.displayName = GROUP_EXC_NAME;

/* -------------------------------------------------------------------------------------------------
 * ToggleButton
 * -----------------------------------------------------------------------------------------------*/

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

const ToggleButton = forwardRefWithAs<typeof BUTTON_DEFAULT_TAG, ToggleButtonOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = BUTTON_DEFAULT_TAG,
      toggled: toggledProp,
      defaultToggled,
      onClick,
      onToggledChange,
      children,
      value: valueProp,
      ...buttonProps
    } = props;

    const [_toggled = false, _setToggled] = useControlledState<boolean>({
      prop: toggledProp,
      onChange: () => {},
      defaultProp: defaultToggled || false,
    });

    const generatedValue = makeId(`toggle-button`, useId());
    const value = valueProp || generatedValue;

    const singleGroupContext = React.useContext(ToggleButtonGroupExclusiveContext);
    const multipleGroupContext = React.useContext(ToggleButtonGroupContext);
    if (singleGroupContext && multipleGroupContext) {
      throw Error(INCORRECT_CONTEXT_ERROR);
    }

    useButtonStateInGroupWarning({
      toggledProp,
      defaultToggled,
      groupContext: singleGroupContext,
      groupName: 'TODO:',
    });

    const toggled = !!(singleGroupContext
      ? singleGroupContext.value === value
      : multipleGroupContext
      ? multipleGroupContext.value?.includes(value)
      : _toggled);

    function setToggled(state: boolean) {
      if (singleGroupContext || multipleGroupContext) {
        return (singleGroupContext || multipleGroupContext)!.handleChange(value);
      }
      _setToggled(state);
    }

    const initialRender = React.useRef(true);
    const stableOnToggleChange = useCallbackRef(onToggledChange);
    React.useEffect(() => {
      if (initialRender.current) {
        initialRender.current = false;
        return;
      }
      stableOnToggleChange(toggled);
    }, [stableOnToggleChange, toggled]);

    return (
      <Comp
        {...getPartDataAttrObj(BUTTON_NAME)}
        type="button"
        aria-pressed={toggled}
        data-state={toggled ? 'on' : 'off'}
        data-disabled={props.disabled ? '' : undefined}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, () => {
          if (!props.disabled) {
            setToggled(!toggled);
          }
        })}
        {...buttonProps}
      >
        {children}
      </Comp>
    );
  }
);

ToggleButton.displayName = BUTTON_NAME;

const Root = ToggleButton;
const Group = ToggleButtonGroup;
const GroupExclusive = ToggleButtonGroupExclusive;

export { ToggleButton, ToggleButtonGroup, ToggleButtonGroupExclusive, Root, Group, GroupExclusive };

function useButtonStateInGroupWarning({
  toggledProp,
  defaultToggled,
  groupContext,
  groupName,
}: {
  toggledProp: boolean | undefined;
  defaultToggled: boolean | undefined;
  groupContext: ToggleButtonGroupExclusiveContextValue | null;
  groupName: string;
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
  const stableOnChange = useCallbackRef(onChange);
  const stableIsEqual = useCallbackRef(isEqual);
  const [state, setState] = React.useState(prop || defaultProp);
  const stateRef = React.useRef(state);
  const isControlled = useIsControlled(prop);

  const setValue: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
    (value) => {
      function handleChange(value: T) {
        if (!stableIsEqual(stateRef.current, value)) {
          stableOnChange(value);
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
    [stableIsEqual, stableOnChange]
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
