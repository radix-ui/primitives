import * as React from 'react';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

type ExtendedPrimitive<C, As> = Polymorphic.ForwardRefComponent<As, Polymorphic.OwnProps<C>>;
type DefaultProps<C, As> = { as?: As } & Omit<
  Partial<React.ComponentProps<ExtendedPrimitive<C, As>>>,
  'as'
>;

function extendPrimitive<
  C extends Polymorphic.ForwardRefComponent<any, any>,
  DefaultAs extends React.ElementType = Polymorphic.IntrinsicElement<C>
>(Comp: C, config: { displayName?: string; defaultProps?: DefaultProps<C, DefaultAs> }) {
  const Extended = React.forwardRef((props, forwardedRef) => {
    const As = Comp as any;
    const propsWithDefaults = { ...config.defaultProps, ...props };
    return <As {...propsWithDefaults} ref={forwardedRef} />;
  });

  Extended.displayName = config.displayName || 'Extended' + Comp.displayName;
  return Extended as ExtendedPrimitive<C, DefaultAs>;
}

export { extendPrimitive };
