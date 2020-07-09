import * as React from 'react';

type LinkDOMProps = React.ComponentPropsWithoutRef<'div'>;
type LinkOwnProps = {};
type LinkProps = LinkDOMProps & LinkOwnProps;

const Link = React.forwardRef<HTMLDivElement, LinkProps>(function Link(props, forwardedRef) {
  return <div ref={forwardedRef} />;
});

Link.displayName = 'Link';

export { Link };
export type { LinkProps };
