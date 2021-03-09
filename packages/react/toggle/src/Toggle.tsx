import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

const NAME = 'Toggle';
const DEFAULT_TAG = 'button';

type ToggleOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
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
>;

type TogglePrimitive = Polymorphic.ForwardRefComponent<typeof DEFAULT_TAG, ToggleOwnProps>;

const Toggle = React.forwardRef((props, forwardedRef) => {
  const {
    as = DEFAULT_TAG,
    pressed: pressedProp,
    defaultPressed = false,
    onClick,
    onPressedChange,
    ...buttonProps
  } = props;

  const [pressed = false, setPressed] = useControllableState({
    prop: pressedProp,
    onChange: onPressedChange,
    defaultProp: defaultPressed,
  });

  return (
    <Primitive
      type="button"
      aria-pressed={pressed}
      data-state={pressed ? 'on' : 'off'}
      data-disabled={props.disabled ? '' : undefined}
      {...buttonProps}
      as={as}
      ref={forwardedRef}
      onClick={composeEventHandlers(onClick, () => {
        if (!props.disabled) {
          setPressed(!pressed);
        }
      })}
    />
  );
}) as TogglePrimitive;

Toggle.displayName = NAME;

const Root = Toggle;

export {
  Toggle,
  //
  Root,
};
