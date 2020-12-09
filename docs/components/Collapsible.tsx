import * as React from 'react';
import {
  Collapsible as CollapsiblePrimitive,
  CollapsibleButton as CollapsiblePrimitiveButton,
  CollapsibleContent as CollapsiblePrimitiveContent,
} from '@interop-ui/react-collapsible';
import { Arrow as ArrowPrimitive } from '@interop-ui/react-arrow';
import { Button, Box, BoxProps, Text } from '@modulz/radix';

export function Collapsible({
  sx,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive> & { sx?: BoxProps['sx'] }) {
  return <CollapsiblePrimitive as={(props) => <Box {...props} />} {...props} />;
}

export function CollapsibleButton({
  sx,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitiveButton> & { sx?: BoxProps['sx'] }) {
  return (
    <CollapsiblePrimitiveButton
      as={({ children, ...props }) => (
        <Button {...props} sx={sx}>
          <Box
            as="span"
            aria-hidden
            sx={{
              mr: 1,
              display: 'inline-block',
              '[data-radix-collapsible-button][data-state="closed"] > &': {
                transform: 'rotate(-90deg)',
              },
            }}
          >
            <ArrowPrimitive aria-hidden />
          </Box>
          <Text weight="medium" size={3}>
            {children}
          </Text>
        </Button>
      )}
      {...props}
    />
  );
}

export function CollapsibleContent({
  sx,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitiveContent> & { sx?: BoxProps['sx'] }) {
  return (
    <CollapsiblePrimitiveContent
      as={(props) => <Box {...props} sx={{ pt: 2, ...sx }} />}
      {...props}
    />
  );
}
