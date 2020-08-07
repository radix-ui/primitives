import * as React from 'react';
import { cssReset, interopDataAttrObj, interopSelector } from '@interop-ui/utils';
import { forwardRef, PrimitiveStyles } from '@interop-ui/react-utils';

const NAME = 'Link';
const DEFAULT_TAG = 'a';

type LinkDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type LinkOwnProps = {};
type LinkProps = LinkDOMProps & LinkOwnProps;

const Link = forwardRef<typeof DEFAULT_TAG, LinkProps>(function Link(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...linkProps } = props;
  return <Comp {...interopDataAttrObj(NAME)} ref={forwardedRef} {...linkProps} />;
});

Link.displayName = NAME;

const styles: PrimitiveStyles = {
  [interopSelector(NAME)]: {
    ...cssReset(DEFAULT_TAG),
  },
};

export { Link, styles };
export type { LinkProps };
