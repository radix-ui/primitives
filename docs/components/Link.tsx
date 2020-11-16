import React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { Link as RadixLink, LinkProps as RadixLinkProps } from '@modulz/radix';
import pick from 'lodash/pick';
import omit from 'lodash/omit';

const nextPropNames = ['href', 'replace', 'scroll', 'shallow', 'prefetch'] as const;

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { as: Comp = RadixLink, passHref = true, ...props },
  ref
) {
  const [isExternal, setIsExternal] = React.useState(false);
  React.useEffect(() => {
    if (props.href !== window.location.host) {
      setIsExternal(true);
    }
  }, [props.href]);
  const rel = props.rel || isExternal ? 'nofollow noreferrer' : undefined;
  const target = props.target || isExternal ? '_blank' : undefined;
  return isExternal ? (
    <Comp
      {...omit(props, nextPropNames)}
      ref={ref}
      href={props.href as string}
      rel={rel}
      target={target}
    />
  ) : (
    <NextLink {...pick(props, nextPropNames)} passHref={passHref}>
      <Comp {...omit(props, nextPropNames)} ref={ref} />
    </NextLink>
  );
});

Link.displayName = 'Link';

type LinkProps = Omit<RadixLinkProps, typeof nextPropNames[number]> &
  Pick<NextLinkProps, typeof nextPropNames[number]> & {
    passHref?: NextLinkProps['passHref'];
  };

export type { LinkProps };
export { Link };
