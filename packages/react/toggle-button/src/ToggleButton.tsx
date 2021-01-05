import * as React from 'react';
import { useControlledState, composeEventHandlers, useId } from '@radix-ui/react-utils';
import { getPartDataAttrObj, warning, makeId } from '@radix-ui/utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * ToggleButtonGroup
 * -----------------------------------------------------------------------------------------------*/

const GROUP_NAME = 'ToggleButtonGroup';
const GROUP_DEFAULT_TAG = 'div';

type SelectionMode = 'multiple' | 'exclusive';

type ToggleButtonGroupContextValue = {
  value: string[] | undefined;
  setValue: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  selectionMode: SelectionMode;
};

const ToggleButtonGroupContext = React.createContext<ToggleButtonGroupContextValue>(null as any);
ToggleButtonGroupContext.displayName = GROUP_NAME + 'Context';

type ToggleButtonGroupOwnProps = {
  /**
   * Controls how buttons within a group are selected. If set to `"multiple"`, any number of buttons
   * in a group may be toggled at a time (similar to a checkbox). If `"exclusive"`, only a single
   * button within a group can be toggled at a time (similar to a radio group).
   *
   * (default: `"multiple"`)
   * */
  selectionMode?: SelectionMode;
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
      selectionMode = 'multiple',
      ...groupProps
    } = props;

    const [value, setValue] = useControlledState<string[]>({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    const context: ToggleButtonGroupContextValue = React.useMemo(
      () => ({
        selectionMode,
        setValue,
        value,
      }),
      [selectionMode, setValue, value]
    );

    useGroupSelectionModeWarning({ selectionMode, valueProp, defaultValue });

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

const ToggleButton = forwardRefWithAs<typeof BUTTON_DEFAULT_TAG, ToggleButtonOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = BUTTON_DEFAULT_TAG,
      toggled: toggledProp,
      defaultToggled = false,
      onClick,
      onToggledChange,
      children,
      value: valueProp,
      ...buttonProps
    } = props;

    const [_toggled = false, _setToggled] = useControlledState<boolean>({
      prop: toggledProp,
      onChange: onToggledChange,
      defaultProp: defaultToggled,
    });

    const generatedValue = makeId(`toggle-button`, useId());
    const value = valueProp || generatedValue;

    const groupContext = React.useContext(ToggleButtonGroupContext);
    const toggled = groupContext ? groupContext.value?.includes(value) : _toggled;
    const setToggled = groupContext
      ? (toggled: boolean) =>
          groupContext.setValue((prevValues) =>
            toggled
              ? (prevValues || []).filter((val) => val !== value)
              : groupContext.selectionMode === 'exclusive'
              ? [value]
              : (prevValues || []).concat(value)
          )
      : _setToggled;

    useButtonStateInGroupWarning({ toggledProp, defaultToggled, groupContext });

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

export { ToggleButton, ToggleButtonGroup, Group, Root };

function useGroupSelectionModeWarning({
  valueProp,
  defaultValue,
  selectionMode,
}: {
  valueProp: string[] | undefined;
  defaultValue: string[] | undefined;
  selectionMode: SelectionMode;
}) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      const isControlled = valueProp !== undefined;
      const propName = isControlled ? '`value`' : '`defaultValue`';
      const value = isControlled ? valueProp : defaultValue;
      warning(
        !(selectionMode === 'exclusive' && value?.length && value.length > 1),
        `When \`selectionMode\` is set to \`'exclusive'\`, only a single value can be passed to the ${propName} prop in ${GROUP_NAME}. Check to make sure multiple values are not included in the ${propName} array, or change \`selectionMode\` to \`'inclusive'\` to allow multiple toggled buttons in a ${GROUP_NAME}.`
      );
    }, [defaultValue, selectionMode, valueProp]);
  }
}

function useButtonStateInGroupWarning({
  toggledProp,
  defaultToggled,
  groupContext,
}: {
  toggledProp: boolean | undefined;
  defaultToggled: boolean | undefined;
  groupContext: ToggleButtonGroupContextValue | null;
}) {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      const isControlled = toggledProp !== undefined;
      const propName = isControlled ? '`toggled`' : '`defaultToggled`';
      const toggled = isControlled ? toggledProp : defaultToggled;
      warning(
        !(groupContext && toggled !== undefined),
        `A ${BUTTON_NAME} with an explicit ${propName} prop was used inside of a ${GROUP_NAME}. When ${BUTTON_NAME} is used inside of a ${GROUP_NAME}, the ${GROUP_NAME} component is responsible for managing the toggled state of its nested ${BUTTON_NAME} components. Either remove the ${propName} from ${BUTTON_NAME} or remove the ${GROUP_NAME} component if the ${BUTTON_NAME} is unrelated to other surrounding buttons.`
      );
    }, [groupContext, toggledProp, defaultToggled]);
  }
}
