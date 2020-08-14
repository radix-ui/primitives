import * as React from 'react';
import {
  AspectRatio,
  Box,
  Heading as RadixHeading,
  Text,
  Divider as RadixDivider,
} from '@modulz/radix';
import { QuickNavItem } from './QuickNav';

import type { HeadingProps, TextProps } from '@modulz/radix';

function Hero() {
  return (
    <AspectRatio ratio="2:1" sx={{ mt: 7, mb: 9 }}>
      <Box sx={{ bg: 'blue200', borderRadius: '2', height: '100%' }} />
    </AspectRatio>
  );
}

function Title({
  children,
  hideInQuickNav = false,
  ...props
}: HeadingProps & { hideInQuickNav?: boolean }) {
  return (
    <RadixHeading as="h1" size={4} sx={{ lineHeight: 9 }} {...props}>
      {hideInQuickNav ? children : <QuickNavItem label="Description">{children}</QuickNavItem>}
    </RadixHeading>
  );
}

function Description(props: HeadingProps) {
  return (
    <RadixHeading
      as="h2"
      size={2}
      weight="normal"
      sx={{ mb: 6, lineHeight: 3, color: 'gray700' }}
      {...props}
    />
  );
}

function Heading({
  children,
  sx,
  hideInQuickNav = false,
  ...props
}: HeadingProps & { hideInQuickNav?: boolean }) {
  return (
    <RadixHeading as="h3" size={3} sx={{ mt: 9, mb: 3, ...sx }} {...props}>
      {hideInQuickNav ? children : <QuickNavItem>{children}</QuickNavItem>}
    </RadixHeading>
  );
}

function SubHeading({
  children,
  sx,
  hideInQuickNav = false,
  ...props
}: HeadingProps & { hideInQuickNav?: boolean }) {
  return (
    <RadixHeading as="h4" size={1} sx={{ lineHeight: 2, my: 4, ...sx }} {...props}>
      {hideInQuickNav ? children : <QuickNavItem level={1}>{children}</QuickNavItem>}
    </RadixHeading>
  );
}

function Paragraph({ sx, ...props }: TextProps) {
  return <Text as="p" size={4} sx={{ lineHeight: 3, my: 3, ...sx }} {...props} />;
}

function Divider() {
  return <RadixDivider size={2} sx={{ mx: 'auto', my: 8 }} />;
}

export { Hero, Title, Description, Heading, SubHeading, Paragraph, Divider };
