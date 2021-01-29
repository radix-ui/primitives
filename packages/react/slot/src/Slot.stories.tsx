import * as React from 'react';
import { Slot, Slottable } from './Slot';

export default { title: 'Components/Slot' };

export const WithoutSlottable = () => (
  <AsCompWithoutSlottable as={Slot}>
    <b data-slot-element>hello</b>
  </AsCompWithoutSlottable>
);

export const WithSlottable = () => (
  <AsCompWithSlottable as={Slot}>
    <b data-slot-element>hello</b>
  </AsCompWithSlottable>
);

type AsCompProps = React.ComponentProps<'div'> & { as: React.ElementType };

const AsCompWithoutSlottable = ({ as: Comp = 'div', ...props }: AsCompProps) => <Comp {...props} />;
const AsCompWithSlottable = ({ as: Comp = 'div', children, ...props }: AsCompProps) => (
  <Comp {...props}>
    <Slottable>{children}</Slottable>
    <span>world</span>
  </Comp>
);
