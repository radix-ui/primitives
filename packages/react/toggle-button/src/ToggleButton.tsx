import * as React from 'react';
import { useControlledState, composeEventHandlers } from '@radix-ui/react-utils';
import { getSelector, getSelectorObj } from '@radix-ui/utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';

const NAME = 'ToggleButton';
const DEFAULT_TAG = 'button';

type ToggleButtonOwnProps = {
  /**
   * A string to use as the component selector for CSS purposes. It will be added as
   * a data attribute. Pass `null` to remove selector.
   *
   * @defaultValue radix-toggle-button
   */
  selector?: string | null;
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
      selector = getSelector(NAME),
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
        type="button"
        aria-pressed={toggled}
        data-state={toggled ? 'on' : 'off'}
        data-disabled={props.disabled ? '' : undefined}
        {...buttonProps}
        {...getSelectorObj(selector)}
        ref={forwardedRef}
        onClick={composeEventHandlers(onClick, () => {
          if (!props.disabled) {
            setToggled(!toggled);
          }
        })}
      >
        {children}
      </Comp>
    );
  }
);

ToggleButton.displayName = NAME;

const Root = ToggleButton;

export {
  ToggleButton,
  //
  Root,
};
