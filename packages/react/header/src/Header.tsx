import * as React from 'react';

type HeaderDOMProps = React.ComponentPropsWithRef<'div'>;
type HeaderOwnProps = {};
type HeaderProps = HeaderDOMProps & HeaderOwnProps;

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(function Header(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Header.displayName = 'Header';

export { Header };
export type { HeaderProps };
