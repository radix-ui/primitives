import * as React from 'react';

type MenuDOMProps = React.ComponentProps<'div'>;
type MenuOwnProps = {};
type MenuProps = MenuDOMProps & MenuOwnProps;

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(function Menu(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Menu.displayName = 'Menu';

export { Menu };
export type { MenuProps };
