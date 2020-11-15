import * as React from 'react';
import { forwardRef, useControlledState, composeEventHandlers } from '@interop-ui/react-utils';
import { getPartDataAttrObj } from '@interop-ui/utils';

const NAME = 'ToggleButton';
const DEFAULT_TAG = 'button';

type ToggleButtonDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type ToggleButtonOwnProps = {
  /** Whether the button is toggled or not, if controlled */
  toggled?: boolean;
  /**
   * Whether the button is toggled by default, if uncontrolled
   * (default: false)
   */
  defaultToggled?: boolean;
  /** A function called when the button is toggled */
  onToggle?(toggled: boolean): void;
};
type ToggleButtonProps = ToggleButtonDOMProps & ToggleButtonOwnProps;

const ToggleButton = forwardRef<typeof DEFAULT_TAG, ToggleButtonProps>(function ToggleButton(
  props,
  forwardedRef
) {
  const {
    as: Comp = DEFAULT_TAG,
    toggled: toggledProp,
    defaultToggled = false,
    onClick,
    onToggle,
    children,
    ...buttonProps
  } = props;

  const [toggled = false, setToggled] = useControlledState({
    prop: toggledProp,
    onChange: onToggle,
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
});

ToggleButton.displayName = NAME;

export { ToggleButton };
export type { ToggleButtonProps };
