import * as React from 'react';
import { Button, ButtonProps } from '@modulz/radix';

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
