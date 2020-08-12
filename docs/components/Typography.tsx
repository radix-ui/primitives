import * as React from 'react';
import { Heading, HeadingProps } from '@modulz/radix';
import { QuickNavItem } from './QuickNav';

function PageTitle({ children, ...props }: HeadingProps) {
  return (
    <Heading as="h1" size={4} sx={{ lineHeight: 9 }} {...props}>
      <QuickNavItem label="Description">{children}</QuickNavItem>
    </Heading>
  );
}

function PageDescription(props: HeadingProps) {
  return (
    <Heading
      as="h2"
      size={2}
      weight="normal"
      sx={{ lineHeight: 3, color: 'gray700', mb: 6 }}
      {...props}
    />
  );
}

function PageHeading({ children, ...props }: HeadingProps) {
  return (
    <Heading as="h3" size={3} {...props}>
      <QuickNavItem>{children}</QuickNavItem>
    </Heading>
  );
}

function PageSubHeading({ children, ...props }: HeadingProps) {
  return (
    <Heading as="h4" size={1} sx={{ lineHeight: 2 }} {...props}>
      <QuickNavItem level={1}>{children}</QuickNavItem>
    </Heading>
  );
}

export { PageTitle, PageDescription, PageHeading, PageSubHeading };
