import * as React from 'react';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import type { ForwardRefExoticComponentWithAs } from '@radix-ui/react-polymorphic';
import { getPartDataAttrObj } from '@radix-ui/utils';

function extendComponent<As extends ForwardRefExoticComponentWithAs<any, any>>(
  Comp: As extends ForwardRefExoticComponentWithAs<infer I, infer P>
    ? ForwardRefExoticComponentWithAs<I, P>
    : As,
  displayName: string
) {
  const Extended = forwardRefWithAs<typeof Comp>((props, forwardedRef) => {
    const As = Comp as any;
    return <As {...getPartDataAttrObj(displayName)} {...props} ref={forwardedRef} />;
  });
  Extended.displayName = displayName;
  return Extended;
}

export { extendComponent };
