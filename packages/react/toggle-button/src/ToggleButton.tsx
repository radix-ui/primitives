import * as React from 'react';
import { useControlledState, composeEventHandlers } from '@radix-ui/react-utils';
import { getSelector } from '@radix-ui/utils';
import { Primitive } from '@radix-ui/react-primitive';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

const NAME = 'ToggleButton';
const DEFAULT_TAG = 'button';

type ToggleButtonOwnProps = Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    /** Whether the button is toggled or not, if controlled */
    toggled?: boolean;
    /**
     * Whether the button is toggled by default, if uncontrolled
     * (default: false)
     */
    defaultToggled?: boolean;
    /** A function called when the button is toggled */
    onToggledChange?(toggled: boolean): void;
  }
>;

type ToggleButtonPrimitive = Polymorphic.ForwardRefComponent<
  typeof DEFAULT_TAG,
  ToggleButtonOwnProps
>;

const ToggleButton = React.forwardRef((props, forwardedRef) => {
  const {
    as = DEFAULT_TAG,
    selector = getSelector(NAME),
    toggled: toggledProp,
    defaultToggled = false,
    onClick,
    onToggledChange,
    ...buttonProps
  } = props;

  const [toggled = false, setToggled] = useControlledState({
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
      selector={selector}
      ref={forwardedRef}
      onClick={composeEventHandlers(onClick, () => {
        if (!props.disabled) {
          setToggled(!toggled);
        }
      })}
    />
  );
}) as ToggleButtonPrimitive;

ToggleButton.displayName = NAME;

const Root = ToggleButton;

export {
  ToggleButton,
  //
  Root,
};
