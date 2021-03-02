import * as React from 'react';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

function extendPrimitive<As extends Polymorphic.ForwardRefComponent<any, any>>(
  Comp: As extends Polymorphic.ForwardRefComponent<infer I, infer P>
    ? Polymorphic.ForwardRefComponent<I, P>
    : As,
  displayName: string
) {
  type ExtendedPrimitive = Polymorphic.ForwardRefComponent<
    Polymorphic.IntrinsicElement<typeof Comp>,
    Polymorphic.OwnProps<typeof Comp>
  >;
  const Extended = React.forwardRef((props, forwardedRef) => {
    const As = Comp as any;
    return <As {...props} ref={forwardedRef} />;
  }) as ExtendedPrimitive;
  Extended.displayName = displayName;
  return Extended;
}

export { extendPrimitive };
