import * as React from 'react';
import {
  Tabs as TabsPrimitive,
  TabsProps,
  TabsTabProps,
  TabsPanelProps,
  TabsListProps,
} from '@interop-ui/react-tabs';
import { Button, Box, BoxProps, theme as radixTheme } from '@modulz/radix';

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps & { sx?: BoxProps['sx'] }>(
  function Tabs({ sx, ...props }, ref) {
    return (
      <TabsPrimitive
        ref={ref}
        as={React.forwardRef<any, any>((props, ref) => (
          <Box {...props} ref={ref} sx={{ my: 4, ...sx }} as="div" />
        ))}
        {...props}
      />
    );
  }
);

export const TabList = React.memo(
  React.forwardRef<HTMLDivElement, TabsListProps & { sx?: BoxProps['sx'] }>(function TabList(
    { sx, children, ...props },
    ref
  ) {
    return (
      <TabsPrimitive.List
        ref={ref}
        as={React.forwardRef<any, any>((props, ref) => (
          <Box
            {...props}
            ref={ref}
            sx={{
              display: 'inline-flex',
              mb: 2,
              '> * + *': { ml: 2 },
              ...sx,
            }}
            as="div"
          />
        ))}
        {...props}
      >
        {children}
      </TabsPrimitive.List>
    );
  })
);

export const Tab = React.forwardRef<HTMLDivElement, TabsTabProps & { sx?: BoxProps['sx'] }>(
  function Tab({ sx, ...props }, ref) {
    return (
      <TabsPrimitive.Tab
        ref={ref}
        as={React.forwardRef<any, any>((props, ref) => (
          <Button
            {...props}
            ref={ref}
            as="div"
            sx={{
              '&:focus': {
                outline: 'none',
              },
              '&[data-state="active"]': {
                boxShadow: `0 0 0 2px ${radixTheme.colors.blue600}`,
              },
              '&[data-state="active"]:focus': {
                boxShadow: `0 0 0 3px ${radixTheme.colors.blue600}`,
              },
              ...sx,
            }}
          />
        ))}
        {...props}
      />
    );
  }
);

export const TabPanels = React.memo(
  React.forwardRef<HTMLDivElement, BoxProps>(function TabPanels({ children, sx, ...props }, ref) {
    return (
      <Box
        as="div"
        ref={ref}
        sx={{ borderTop: `1px solid ${radixTheme.colors.gray400}`, ...sx }}
        {...props}
      >
        {children}
      </Box>
    );
  })
);

export const TabPanel = React.forwardRef<HTMLDivElement, TabsPanelProps & { sx?: BoxProps['sx'] }>(
  function TabPanel({ sx, ...props }, ref) {
    return (
      <TabsPrimitive.Panel
        ref={ref}
        as={React.forwardRef<any, any>((props, ref) => (
          <Box {...props} ref={ref} as="div" sx={{ mt: 2, ...sx }} />
        ))}
        {...props}
      />
    );
  }
);
