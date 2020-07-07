import * as React from 'react';

type ToggleButtonDOMProps = React.ComponentPropsWithoutRef<'div'>;
type ToggleButtonOwnProps = {};
type ToggleButtonProps = ToggleButtonDOMProps & ToggleButtonOwnProps;

const ToggleButton = React.forwardRef<HTMLDivElement, ToggleButtonProps>(function ToggleButton(
  props,
  forwardedRef
) {
  return <div ref={forwardedRef} />;
});

ToggleButton.displayName = 'ToggleButton';

export { ToggleButton };
export type { ToggleButtonProps };
