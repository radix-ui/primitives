import * as React from 'react';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import type { ForwardRefExoticComponentWithAs } from '@radix-ui/react-polymorphic';
import { getSelector } from '@radix-ui/utils';

function extendComponent<As extends ForwardRefExoticComponentWithAs<any, any>, OwnProps = {}>(
  Comp: As extends ForwardRefExoticComponentWithAs<infer I, infer P>
    ? ForwardRefExoticComponentWithAs<I, P>
    : As,
  displayName: string
) {
  const Extended = forwardRefWithAs<typeof Comp, OwnProps>((props, forwardedRef) => {
    const { selector = getSelector(displayName), ...restProps } = props as any;
    const As = Comp as any;
    return <As {...restProps} selector={selector} ref={forwardedRef} />;
  });
  Extended.displayName = displayName;
  return Extended;
}

export { extendComponent };
