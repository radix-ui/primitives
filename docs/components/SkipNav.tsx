// @see https://reach.tech/skip-nav#skipnavlink
import * as React from 'react';
import { Link, Box, theme as radixTheme, BoxProps, Text, LinkProps } from '@modulz/radix';

const defaultId = 'radix-skip-nav';

export const SkipNavLink: React.FC<SkipNavLinkProps> = function SkipNavLink({
  children,
  contentId,
  sx = {},
  ...props
}) {
  const id = contentId || defaultId;
  return (
    <Link
      {...props}
      href={`#${id}`}
      sx={{
        ...sx,
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: '1px',
        width: '1px',
        margin: '-1px',
        padding: 0,
        overflow: 'hidden',
        position: 'absolute',
        ...sx,
        '&:focus': {
          display: 'block',
          padding: radixTheme.sizes[2],
          position: 'fixed',
          top: radixTheme.sizes[2],
          left: radixTheme.sizes[2],
          background: radixTheme.colors.white,
          zIndex: 999,
          width: 'auto',
          height: 'auto',
          clip: 'auto',
          border: `2px solid ${radixTheme.colors.gray500}`,
          color: radixTheme.colors.gray900,
          lineHeight: 1,
          // @ts-ignore
          ...sx['&:focus'],
        },
      }}
    >
      {children || (
        <Text size={3} weight="medium">
          Skip to content
        </Text>
      )}
    </Link>
  );
};

export type SkipNavLinkProps = {
  children?: React.ReactNode;
  contentId?: string;
} & Omit<LinkProps, 'href'>;

export const SkipNavContent: React.FC<SkipNavContentProps> = function SkipNavContent({
  id: idProp,
  sx,
  ...props
}) {
  const id = idProp || defaultId;
  return <Box {...props} id={id} sx={{ my: 0, mx: 0, py: 0, px: 0, ...sx }} />;
};

export type SkipNavContentProps = {
  children?: React.ReactNode;
} & BoxProps;
