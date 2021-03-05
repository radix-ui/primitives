import * as React from 'react';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

function extendPrimitive<As extends Polymorphic.ForwardRefComponent<any, any>>(
  Comp: As extends Polymorphic.ForwardRefComponent<infer I, infer P>
    ? Polymorphic.ForwardRefComponent<I, P>
    : As,
  config: { displayName?: string; defaultProps?: Partial<React.ComponentProps<typeof Comp>> }
) {
  const Extended = React.forwardRef((props, forwardedRef) => {
    const As = Comp as any;
    const propsWithDefaults = { ...config.defaultProps, ...props };
    return <As {...propsWithDefaults} ref={forwardedRef} />;
  }) as As;
  Extended.displayName = config.displayName || 'Extended' + Comp.displayName;
  return Extended;
}

export { extendPrimitive };
