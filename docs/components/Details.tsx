import * as React from 'react';
import { Box, BoxProps, Button, ButtonProps } from '@modulz/radix';

export function Details({ sx, ...props }: BoxProps) {
  return (
    <Box
      as="details"
      sx={{
        my: 2,
        ...sx,
      }}
      {...props}
    />
  );
}

export function Summary({ sx, ...props }: ButtonProps) {
  return (
    <Button
      as="summary"
      sx={{
        cursor: 'pointer',
        ...sx,
      }}
      {...props}
    />
  );
}
