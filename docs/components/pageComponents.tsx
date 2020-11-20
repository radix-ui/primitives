import * as React from 'react';
import {
  AspectRatio,
  Box,
  Code,
  Divider as RadixDivider,
  Heading as RadixHeading,
  HeadingProps,
  Text,
  TextProps,
} from '@modulz/radix';
import { QuickNavItem } from './QuickNav';
import { Kbd } from './Kbd';
import { Caption, Table, Th, Thead, Tr, Tbody, Td, Tfoot } from './Table';

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
    <>
      {/* @ts-ignore */}
      <RadixHeading as="h1" size={4} sx={{ lineHeight: 9 }} {...props}>
        {hideInQuickNav ? children : <QuickNavItem label="Description">{children}</QuickNavItem>}
      </RadixHeading>
    </>
  );
}

function Description(props: HeadingProps) {
  return (
    <>
      {/* @ts-ignore */}
      <RadixHeading
        as="h2"
        size={2}
        weight="normal"
        sx={{ mb: 6, lineHeight: 3, color: 'gray700' }}
        {...props}
      />
    </>
  );
}

function Heading({
  children,
  sx,
  hideInQuickNav = false,
  ...props
}: HeadingProps & { hideInQuickNav?: boolean }) {
  return (
    <>
      {/* @ts-ignore */}
      <RadixHeading as="h3" size={3} sx={{ mt: 9, mb: 3, ...sx }} {...props}>
        {hideInQuickNav ? children : <QuickNavItem>{children}</QuickNavItem>}
      </RadixHeading>
    </>
  );
}

function SubHeading({
  children,
  sx,
  hideInQuickNav = false,
  ...props
}: HeadingProps & { hideInQuickNav?: boolean }) {
  return (
    <>
      {/* @ts-ignore */}
      <RadixHeading as="h4" size={1} sx={{ lineHeight: 2, my: 4, ...sx }} {...props}>
        {hideInQuickNav ? children : <QuickNavItem level={1}>{children}</QuickNavItem>}
      </RadixHeading>
    </>
  );
}

function Paragraph({ sx, ...props }: TextProps) {
  return <Text as="p" size={4} sx={{ lineHeight: 3, my: 3, ...sx }} {...props} />;
}

function Divider() {
  return <RadixDivider size={2} sx={{ mx: 'auto', my: 8 }} aria-hidden />;
}

const SAFARI_FIX_TH_STYLES = {
  // Safari aligns th to the center when set to `unset`, other browsers align to the left. should be
  // fixed in Radix
  textAlign: 'left',
} as const;

function KeyboardInteractionTable({
  interactions,
}: {
  interactions: { keys: string[]; description: React.ReactNode }[];
}) {
  return (
    <React.Fragment>
      <Table aria-label="Keyboard interactions">
        <Thead>
          <Tr>
            <Th scope="col" sx={SAFARI_FIX_TH_STYLES}>
              Key
            </Th>
            <Th scope="col" sx={SAFARI_FIX_TH_STYLES}>
              Function
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {interactions.map(({ keys, description }, i) => (
            <Tr key={i}>
              <Td
                // Td doesn't support `as` prop, but this should be a `th` since it's really a
                // column heading. `as` still works but a) gives us a TS error, and b) breaks the
                // style a bit because of how radix uses `&:last-of-type` for the `Td` component. We
                // need to fix this in Radix, but I'm patching the styles for now.
                // @see https://github.com/modulz/radix/issues/285
                // @ts-ignore
                as="th"
                scope="row"
                sx={{
                  ...SAFARI_FIX_TH_STYLES,
                  pr: 2,
                  whiteSpace: 'nowrap',
                  '* + *': {
                    marginLeft: 2,
                  },
                  // See comment above
                  '&:last-of-type': {
                    pr: 2,
                  },
                }}
              >
                {keys.map((key) => (
                  <Kbd key={key}>{key}</Kbd>
                ))}
              </Td>
              <Td>
                <Text as="span" size={3}>
                  {description}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </React.Fragment>
  );
}

export {
  Caption,
  Code,
  Description,
  Divider,
  Heading,
  Hero,
  KeyboardInteractionTable,
  Paragraph,
  SubHeading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tfoot,
  Title,
  Tr,
};
