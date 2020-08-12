import * as React from 'react';
import { cssReset } from '@interop-ui/utils';
import { forwardRef, createStyleObj } from '@interop-ui/react-utils';

const NAME = 'Link';
const DEFAULT_TAG = 'a';

type LinkDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type LinkOwnProps = {};
type LinkProps = LinkDOMProps & LinkOwnProps;

const Link = forwardRef<typeof DEFAULT_TAG, LinkProps>(function Link(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...linkProps } = props;
  return <Comp {...interopDataAttrObj('root')} ref={forwardedRef} {...linkProps} />;
});

Link.displayName = NAME;

const [styles, interopDataAttrObj] = createStyleObj(NAME, {
  root: {
    ...cssReset(DEFAULT_TAG),
  },
});

export { Link, styles };
export type { LinkProps };
