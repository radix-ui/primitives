import * as React from 'react';
import { getSelector } from '@radix-ui/utils';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

function extendComponent<As extends Polymorphic.ForwardRefComponent<any, any>>(
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
    const { selector = getSelector(displayName), ...asProps } = props;
    const As = Comp as any;
    return <As {...asProps} selector={selector} ref={forwardedRef} />;
  }) as ExtendedPrimitive;
  Extended.displayName = displayName;
  return Extended;
}

export { extendComponent };
