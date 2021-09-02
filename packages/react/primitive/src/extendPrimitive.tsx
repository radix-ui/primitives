import * as React from 'react';

function extendPrimitive<C extends React.ForwardRefExoticComponent<any>>(
  component: C,
  config: { displayName?: string; defaultProps?: Partial<React.ComponentProps<C>> }
) {
  const Comp = component as any;
  const Extended = React.forwardRef((props, forwardedRef) => {
    const propsWithDefaults = { ...config.defaultProps, ...props };
    return <Comp {...propsWithDefaults} ref={forwardedRef} />;
  });
  Extended.displayName = config.displayName || 'Extended' + Comp.displayName;
  return Extended as React.ForwardRefExoticComponent<React.ComponentProps<C>>;
}

export { extendPrimitive };
