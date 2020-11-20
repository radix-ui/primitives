import * as React from 'react';
import { Button, ButtonProps } from '@modulz/radix';

export function Summary({ sx, ...props }: ButtonProps) {
  return (
    <Button
      as="summary"
      sx={{
        cursor: 'pointer',
        // WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
        // fontFamily:
        //   '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        // color: 'rgb(0, 109, 255)',
        // fontWeight: '500',
        // textDecoration: 'none',
        // display: 'inline-block',
        // padding: '0.5em 1.5em',
        // cursor: 'pointer',
        ...sx,
      }}
      {...props}
    />
  );
}
