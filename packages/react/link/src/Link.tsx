import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { forwardRef } from '@interop-ui/react-utils';

const DEFAULT_TAG = 'a';

type LinkDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type LinkOwnProps = {};
type LinkProps = LinkDOMProps & LinkOwnProps;

const Link = forwardRef<typeof DEFAULT_TAG, LinkProps>(function Link(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...linkProps } = props;
  return <Comp {...interopDataAttrObj('Link')} ref={forwardedRef} {...linkProps} />;
});

Link.displayName = 'Link';

const styles = {
  link: {
    ...cssReset(DEFAULT_TAG),
  },
  'link.state.hover': {},
  'link.state.focus': {},
  'link.state.active': {},
};

export { Link, styles };
export type { LinkProps };
