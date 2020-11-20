import React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { Link as RadixLink, LinkProps as RadixLinkProps } from '@modulz/radix';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

const nextPropNames = ['href', 'replace', 'scroll', 'shallow', 'prefetch'] as const;

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { as: Comp = RadixLink, ...props },
  ref
) {
  return (
    <NextLink {...pick(props, nextPropNames)} passHref>
      <Comp {...omit(props, nextPropNames)} ref={ref} />
    </NextLink>
  );
});

Link.displayName = 'Link';

type LinkProps = Omit<RadixLinkProps, typeof nextPropNames[number]> &
  Pick<NextLinkProps, typeof nextPropNames[number]>;

export type { LinkProps };
export { Link };
