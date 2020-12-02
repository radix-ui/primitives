import * as React from 'react';
import {
  Tabs as TabsPrimitive,
  TabsList as TabsPrimitiveList,
  TabsTab as TabsPrimitiveTab,
  TabsPanel as TabsPrimitivePanel,
} from '@interop-ui/react-tabs';
import { Button, Box, BoxProps, theme as radixTheme } from '@modulz/radix';

export const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive>,
  React.ComponentProps<typeof TabsPrimitive> & { sx?: BoxProps['sx'] }
>(function Tabs({ sx, ...props }, ref) {
  return (
    <TabsPrimitive
      ref={ref}
      as={React.forwardRef<any, any>((props, ref) => (
        <Box {...props} ref={ref} sx={{ my: 4, ...sx }} as="div" />
      ))}
      {...props}
    />
  );
});

export const TabList = React.memo(
  React.forwardRef<
    React.ElementRef<typeof TabsPrimitiveList>,
    React.ComponentProps<typeof TabsPrimitiveList> & { sx?: BoxProps['sx'] }
  >(function TabList({ sx, children, ...props }, ref) {
    return (
      <TabsPrimitiveList
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
      </TabsPrimitiveList>
    );
  })
);

export const Tab = React.forwardRef<
  React.ElementRef<typeof TabsPrimitiveTab>,
  React.ComponentProps<typeof TabsPrimitiveTab> & { sx?: BoxProps['sx'] }
>(function Tab({ sx, ...props }, ref) {
  return (
    <TabsPrimitiveTab
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
});

export const TabPanels = React.memo(
  React.forwardRef<React.ElementRef<typeof Box>, React.ComponentProps<typeof Box>>(
    function TabPanels({ children, sx, ...props }, ref) {
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
    }
  )
);

export const TabPanel = React.forwardRef<
  React.ElementRef<typeof TabsPrimitivePanel>,
  React.ComponentProps<typeof TabsPrimitivePanel> & { sx?: BoxProps['sx'] }
>(function TabPanel({ sx, ...props }, ref) {
  return (
    <TabsPrimitivePanel
      ref={ref}
      as={React.forwardRef<any, any>((props, ref) => (
        <Box {...props} ref={ref} as="div" sx={{ mt: 2, ...sx }} />
      ))}
      {...props}
    />
  );
});
