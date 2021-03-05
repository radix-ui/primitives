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

export const Chromatic = () => (
  <>
    <h1>Without slottable</h1>
    <AsCompWithoutSlottable as={Slot}>
      <b data-slot-element>hello</b>
    </AsCompWithoutSlottable>

    <h1>With slottable</h1>
    <AsCompWithSlottable as={Slot}>
      <b data-slot-element>hello</b>
    </AsCompWithSlottable>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

type AsCompProps = React.ComponentProps<'div'> & { as: React.ElementType };

const AsCompWithoutSlottable = ({ as: Comp = 'div', ...props }: AsCompProps) => <Comp {...props} />;
const AsCompWithSlottable = ({ as: Comp = 'div', children, ...props }: AsCompProps) => (
  <Comp {...props}>
    <Slottable>{children}</Slottable>
    <span>world</span>
  </Comp>
);
