import * as React from 'react';
import { cssReset, interopDataAttrObj } from '@interop-ui/utils';
import { createContext, forwardRef, PrimitiveStyles, useHasContext } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type LinkContextValue = {};
const [LinkContext] = createContext<LinkContextValue>('LinkContext', 'Link');

/* -------------------------------------------------------------------------------------------------
 * Link
 * -----------------------------------------------------------------------------------------------*/

const DEFAULT_TAG = 'a';

type LinkDOMProps = React.ComponentPropsWithoutRef<typeof DEFAULT_TAG>;
type LinkOwnProps = {};
type LinkProps = LinkDOMProps & LinkOwnProps;

const Link = forwardRef<typeof DEFAULT_TAG, LinkProps>(function Link(props, forwardedRef) {
  const { as: Comp = DEFAULT_TAG, ...linkProps } = props;
  return (
    <LinkContext.Provider value={React.useMemo(() => ({}), [])}>
      <Comp {...interopDataAttrObj('Link')} ref={forwardedRef} {...linkProps} />;
    </LinkContext.Provider>
  );
});

Link.displayName = 'Link';

/* ---------------------------------------------------------------------------------------------- */

const useHasLinkContext = () => useHasContext(LinkContext);

const styles: PrimitiveStyles = {
  link: {
    ...cssReset(DEFAULT_TAG),
  },
  'link.state.hover': {},
  'link.state.focus': {},
  'link.state.active': {},
};

export { Link, styles, useHasLinkContext };
export type { LinkProps };
