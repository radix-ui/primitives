import * as React from 'react';
import { Box, BoxProps, theme as radixTheme } from '@modulz/radix';

export function Kbd({ children, sx, ...props }: BoxProps) {
  return (
    <Box
      as="kbd"
      sx={{
        backgroundColor: radixTheme.colors.gray300,
        borderRadius: '3px',
        border: `1px solid ${radixTheme.colors.gray500}`,
        boxShadow: '0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset',
        color: radixTheme.colors.gray900,
        display: 'inline-block',
        fontSize: '.85em',
        fontWeight: 700,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        py: 0,
        px: '4px',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
