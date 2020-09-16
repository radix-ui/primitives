import * as React from 'react';
import { cssReset, isFunction } from '@interop-ui/utils';
import {
  forwardRef,
  createStyleObj,
  useControlledState,
  composeEventHandlers,
} from '@interop-ui/react-utils';

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
  children: React.ReactNode | ((props: { toggled: boolean }) => React.ReactNode);
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
    disabled,
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
      {...interopDataAttrObj('root')}
      type="button"
      aria-pressed={toggled}
      data-state={toggled ? 'on' : 'off'}
      ref={forwardedRef}
      onClick={composeEventHandlers(onClick, () => {
        if (!disabled) {
          setToggled(!toggled);
        }
      })}
      {...buttonProps}
    >
      {isFunction(children) ? children({ toggled }) : children}
    </Comp>
  );
});

ToggleButton.displayName = NAME;

const [styles, interopDataAttrObj] = createStyleObj(NAME, {
  root: {
    ...cssReset(DEFAULT_TAG),
  },
});

export { ToggleButton, styles };
export type { ToggleButtonProps };
