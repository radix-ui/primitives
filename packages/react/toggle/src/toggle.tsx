import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Toggle
 * -----------------------------------------------------------------------------------------------*/

const NAME = 'Toggle';

type ToggleElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface ToggleProps extends PrimitiveButtonProps {
  /**
   * The controlled state of the toggle.
   */
  pressed?: boolean;
  /**
   * The state of the toggle when initially rendered. Use `defaultPressed`
   * if you do not need to control the state of the toggle.
   * @defaultValue false
   */
  defaultPressed?: boolean;
  /**
   * The callback that fires when the state of the toggle changes.
   */
  onPressedChange?(pressed: boolean): void;
}

const Toggle = React.forwardRef<ToggleElement, ToggleProps>((props, forwardedRef) => {
  const { pressed: pressedProp, defaultPressed, onPressedChange, ...buttonProps } = props;

  const [pressed, setPressed] = useControllableState({
    prop: pressedProp,
    onChange: onPressedChange,
    defaultProp: defaultPressed ?? false,
    caller: NAME,
  });

  return (
    <Primitive.button
      type="button"
      aria-pressed={pressed}
      data-state={pressed ? 'on' : 'off'}
      data-disabled={props.disabled ? '' : undefined}
      {...buttonProps}
      ref={forwardedRef}
      onClick={composeEventHandlers(props.onClick, () => {
        if (!props.disabled) {
          setPressed(!pressed);
        }
      })}
    />
  );
});

Toggle.displayName = NAME;

/* ---------------------------------------------------------------------------------------------- */

const Root = Toggle;

export {
  Toggle,
  //
  Root,
};
export type { ToggleProps };
