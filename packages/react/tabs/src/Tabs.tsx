import * as React from 'react';
import { cssReset, getFocusableResetStyles } from '@interop-ui/utils';
import { Tabs as TabsPrimitive, TabsContext } from './Tabs.primitive';
import type { TabProps, TabListProps, TabPanelProps, TabsProps } from './Tabs.primitive';

const TabList = React.forwardRef<HTMLDivElement, TabListProps>(function TabList(
  props,
  forwardedRef
) {
  let { style, ...otherProps } = props;

  return (
    <TabsPrimitive.TabList
      ref={forwardedRef}
      style={{
        ...cssReset('div'),
        flexShrink: 0,
        display: 'flex',
        flexDirection: props['aria-orientation'] === 'vertical' ? 'column' : 'row',
        ...style,
      }}
      {...otherProps}
    />
  );
});

const Tab = React.forwardRef<HTMLDivElement, TabProps>(function Tab(props, forwardedRef) {
  const { style, ...tabProps } = props;
  return (
    <TabsPrimitive.Tab
      {...tabProps}
      ref={forwardedRef}
      style={{
        // reset styles
        ...cssReset('div'),
        ...getFocusableResetStyles(),
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '1',
        cursor: 'default',
        whiteSpace: 'nowrap',

        // enable overlapping adjacent tabs via z-index
        position: 'relative',
        ...style,
      }}
    />
  );
});

const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  props,
  forwardedRef
) {
  const { style, ...tabPanelProps } = props;
  const { selectedId } = React.useContext(TabsContext);
  const isSelected = props.id === selectedId;

  return (
    <TabsPrimitive.Panel
      {...tabPanelProps}
      ref={forwardedRef}
      style={{
        ...cssReset('div'),
        ...getFocusableResetStyles(),
        display: isSelected ? undefined : 'none',
        flexGrow: 1,
        ...style,
      }}
    />
  );
});

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, forwardedRef) {
  const { style, ...tabsProps } = props;

  return (
    <TabsPrimitive
      ref={forwardedRef}
      {...tabsProps}
      style={{
        ...cssReset('div'),
        display: 'flex',
        flexDirection: props.orientation === 'vertical' ? 'row' : 'column',
        ...style,
      }}
    />
  );
}) as typeof TabsPrimitive;

Tabs.Panel = TabPanel;
Tabs.Tab = Tab;
Tabs.TabList = TabList;
Tabs.displayName = 'Tabs';

export { Tabs };
export type { TabsProps, TabListProps, TabProps, TabPanelProps };
