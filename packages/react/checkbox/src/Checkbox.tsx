import * as React from 'react';

type CheckboxDOMProps = React.ComponentPropsWithoutRef<'div'>;
type CheckboxOwnProps = {};
type CheckboxProps = CheckboxDOMProps & CheckboxOwnProps;

const Checkbox = React.forwardRef<HTMLDivElement, CheckboxProps>(function Checkbox(
  props,
  forwardedRef
) {
  return <div ref={forwardedRef} />;
});

Checkbox.displayName = 'Checkbox';

export { Checkbox };
export type { CheckboxProps };
