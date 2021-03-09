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
    toggled?: boolean;
    /**
     * The state of the toggle when initially rendered. Use `defaultToggled`
     * if you do not need to control the state of the toggle.
     * @defaultValue false
     */
    defaultToggled?: boolean;
    /**
     * The callback that fires when the state of the toggle changes.
     */
    onToggledChange?(toggled: boolean): void;
  }
>;

type TogglePrimitive = Polymorphic.ForwardRefComponent<typeof DEFAULT_TAG, ToggleOwnProps>;

const Toggle = React.forwardRef((props, forwardedRef) => {
  const {
    as = DEFAULT_TAG,
    toggled: toggledProp,
    defaultToggled = false,
    onClick,
    onToggledChange,
    ...buttonProps
  } = props;

  const [toggled = false, setToggled] = useControllableState({
    prop: toggledProp,
    onChange: onToggledChange,
    defaultProp: defaultToggled,
  });

  return (
    <Primitive
      type="button"
      aria-pressed={toggled}
      data-state={toggled ? 'on' : 'off'}
      data-disabled={props.disabled ? '' : undefined}
      {...buttonProps}
      as={as}
      ref={forwardedRef}
      onClick={composeEventHandlers(onClick, () => {
        if (!props.disabled) {
          setToggled(!toggled);
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
