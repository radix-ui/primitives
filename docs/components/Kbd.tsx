import * as React from 'react';
import { Box, BoxProps, theme as radixTheme } from '@modulz/radix';

export function Kbd({ children, sx, ...props }: BoxProps) {
  return (
    <Box
      as="kbd"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'inherit',
        userSelect: 'none',
        backgroundColor: radixTheme.colors.gray200,
        borderRadius: '5px',
        border: `1px solid ${radixTheme.colors.gray400}`,
        boxShadow: 'none',
        color: radixTheme.colors.gray900,
        fontSize: '.95em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        py: '1px',
        px: '5px',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
