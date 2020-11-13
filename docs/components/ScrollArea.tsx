import React from 'react';
import { Box, BoxProps } from '@modulz/radix';

type ScrollAreaProps = {
  children: React.ReactNode;
  sx?: BoxProps['sx'];
};

export const ScrollArea = (props: ScrollAreaProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        minHeight: 0,
        maxHeight: '100%',
        position: 'relative',
        overflowY: 'scroll',
        scrollbarWidth: 'thin',
        ...props.sx,
      }}
    >
      {props.children}
    </Box>
  );
};
