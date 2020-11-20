import * as React from 'react';
import {
  Collapsible as CollapsiblePrimitive,
  CollapsibleButtonProps,
  CollapsibleProps,
  CollapsibleContentProps,
} from '@interop-ui/react-collapsible';
import { Arrow as ArrowPrimitive } from '@interop-ui/react-arrow';
import { Button, Box, BoxProps, Text, theme as radixTheme } from '@modulz/radix';

export function Collapsible({ sx, ...props }: CollapsibleProps & { sx?: BoxProps['sx'] }) {
  return (
    <CollapsiblePrimitive
      as={(props) => <Box {...props} sx={{ my: 4, ...sx }} as="div" />}
      {...props}
    />
  );
}

export function CollapsibleButton({
  sx,
  ...props
}: CollapsibleButtonProps & { sx?: BoxProps['sx'] }) {
  return (
    <CollapsiblePrimitive.Button
      as={({ children, ...props }) => (
        <Button
          {...props}
          sx={{
            // background: radixTheme.colors.gray200,
            ...sx,
          }}
          as="button"
        >
          <Box
            as="span"
            aria-hidden
            sx={{
              mr: 1,
              display: 'inline-block',
              '[data-interop-ui-collapsible-button][data-state="closed"] > &': {
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
}: CollapsibleContentProps & { sx?: BoxProps['sx'] }) {
  return (
    <CollapsiblePrimitive.Content
      as={(props) => <Box {...props} sx={{ pt: 2, ...sx }} as="div" />}
      {...props}
    />
  );
}
