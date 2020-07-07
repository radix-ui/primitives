import * as React from 'react';

type SelectDOMProps = React.ComponentPropsWithoutRef<'div'>;
type SelectOwnProps = {};
type SelectProps = SelectDOMProps & SelectOwnProps;

const Select = React.forwardRef<HTMLDivElement, SelectProps>(function Select(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Select.displayName = 'Select';

export { Select };
export type { SelectProps };
