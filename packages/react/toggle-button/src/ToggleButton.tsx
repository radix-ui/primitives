import * as React from 'react';
import { useControlledState, composeEventHandlers } from '@interop-ui/react-utils';
import { getPartDataAttrObj } from '@interop-ui/utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';

const NAME = 'ToggleButton';
const DEFAULT_TAG = 'button';

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
};

const ToggleButton = forwardRefWithAs<typeof DEFAULT_TAG, ToggleButtonOwnProps>(
  (props, forwardedRef) => {
    const {
      as: Comp = DEFAULT_TAG,
      toggled: toggledProp,
      defaultToggled = false,
      onClick,
      onToggledChange,
      children,
      ...buttonProps
    } = props;

    const [toggled = false, setToggled] = useControlledState({
      prop: toggledProp,
      onChange: onToggledChange,
      defaultProp: defaultToggled,
    });

    return (
      <Comp
        {...getPartDataAttrObj(NAME)}
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

ToggleButton.displayName = NAME;

const Root = ToggleButton;

export { ToggleButton, Root };
