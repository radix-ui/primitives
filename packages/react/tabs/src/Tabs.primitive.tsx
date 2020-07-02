// Eventually, when we have our dream of cross-framework bliss, this file would
// construct a working primitive React component from our definition and state
// chart in @interop-ui/primitives

// We could potentially abstract this into an interpreter package, something
// like React DOM interprets React for the DOM. This seems like it would get
// pretty complex and may not be a worthwhile goal in the end. But having the
// state and props centrally defined and consumed by all of our framework
// packages could still be achieved in this manner.

import * as React from 'react';
import {
  RovingTabIndexProvider,
  useAccessibleMouseDown,
  useControlledState,
  useId,
  useRovingTabIndex,
} from '@interop-ui/react-utils';
import { composeEventHandlers, useComposedRefs } from '@interop-ui/utils';

type TabsDOMProps = Omit<React.ComponentPropsWithRef<'div'>, 'onSelect'>;
type TabsOwnProps = {
  /** The id of the selected tab, if controlled */
  selectedId?: string;
  /** The id of the tab to select by default, if uncontrolled */
  defaultSelectedId?: string;
  /** A function called when a new tab is selected */
  onSelect?: (id?: string) => void;
  /**
   * The orientation the tabs are layed out.
   * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
   * (default: horizontal)
   */
  orientation?: React.AriaAttributes['aria-orientation'];
  /** Whether a tab is activated automatically or manually (default: automatic) */
  activationMode?: 'automatic' | 'manual';
  /** Whether tab navigation loops around or not (default: true) */
  shouldLoop?: boolean;
};
type TabsProps = TabsDOMProps & TabsOwnProps & { as?: React.ElementType<any> };

const TabsContext = React.createContext<{
  tabsId: string;
  selectedId?: string;
  setSelectedId?: (id: string) => void;
  orientation?: TabsProps['orientation'];
  activationMode?: TabsProps['activationMode'];
  shouldLoop?: boolean;
}>({
  tabsId: '',
});

type TabListProps = React.ComponentPropsWithRef<'div'>;

const TabList = React.forwardRef<HTMLDivElement, TabListProps>(function TabList(
  props,
  forwardedRef
) {
  const { orientation, shouldLoop } = React.useContext(TabsContext);
  let { ...otherProps } = props;

  return (
    <RovingTabIndexProvider orientation={orientation} shouldLoop={shouldLoop}>
      <div
        {...props}
        // accessibility
        role="tablist"
        aria-orientation={orientation}
        // other props
        ref={forwardedRef}
        {...otherProps}
      />
    </RovingTabIndexProvider>
  );
});

TabList.displayName = 'Tabs.TabList';

type TabProps = React.ComponentPropsWithRef<'div'> & {
  id: string;
  disabled?: boolean;
};

const Tab = React.forwardRef<HTMLDivElement, TabProps>(function Tab(props, forwardedRef) {
  const {
    id,
    disabled,
    onMouseDown: originalOnMouseDown,
    onKeyDown: originalOnKeyDown,
    onFocus: originalOnFocus,
    ...tabProps
  } = props;

  const { tabsId, selectedId, setSelectedId, activationMode } = React.useContext(TabsContext);

  const tabId = makeTabId(tabsId, id);
  const tabPanelId = makeTabPanelId(tabsId, id);
  const isSelected = id === selectedId;
  const ref = React.useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(forwardedRef, ref);

  const selectTab = React.useCallback(() => setSelectedId?.(id), [id, setSelectedId]);

  const {
    onFocus: rovingTabIndexFocusHandler,
    onKeyDown: rovingTabIndexKeyDownHandler,
    tabIndex,
  } = useRovingTabIndex({
    id: tabId,
    isSelected: Boolean(isSelected),
    elementRef: ref,
    onFocus: originalOnFocus,
    onKeyDown: originalOnKeyDown,
  });

  // handle "automatic" activation if necessary
  // ie. activate tab following focus
  function handleFocus() {
    const isAutomaticActivation = activationMode !== 'manual';
    if (!isSelected && !disabled && isAutomaticActivation) {
      selectTab();
    }
  }

  return (
    <div
      {...tabProps}
      // accessibility
      id={tabId}
      role="tab"
      aria-selected={isSelected}
      aria-controls={tabPanelId}
      aria-disabled={disabled ? true : undefined}
      tabIndex={tabIndex}
      onFocus={composeEventHandlers(rovingTabIndexFocusHandler, handleFocus, {
        checkForDefaultPrevented: false,
      })}
      {...useAccessibleMouseDown(selectTab, {
        isDisabled: disabled,
        onMouseDown: originalOnMouseDown,
        onKeyDown: rovingTabIndexKeyDownHandler,
      })}
      // other props
      ref={composedRef}
    />
  );
});

Tab.displayName = 'Tabs.Tab';

type TabPanelProps = React.ComponentPropsWithRef<'div'> & { id: string };

const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  props,
  forwardedRef
) {
  const { id, ...tabPanelProps } = props;
  const { tabsId, selectedId } = React.useContext(TabsContext);
  const tabId = makeTabId(tabsId, id);
  const tabPanelId = makeTabPanelId(tabsId, id);
  const isSelected = id === selectedId;

  return (
    <div
      {...tabPanelProps}
      // accessibility
      id={tabPanelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      hidden={!isSelected}
      // other props
      ref={forwardedRef}
    />
  );
});

TabPanel.displayName = 'Tabs.Panel';

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, forwardedRef) {
  const {
    children,
    id,
    selectedId: selectedIdProp,
    onSelect,
    defaultSelectedId,
    orientation = 'horizontal',
    activationMode = 'automatic',
    shouldLoop = true,
    ...tabsProps
  } = props;

  const generatedTabsId = `tabs-${useId()}`;
  const tabsId = id || generatedTabsId;

  const [selectedId, setSelectedId] = useControlledState({
    prop: selectedIdProp,
    onChange: onSelect,
    defaultProp: defaultSelectedId,
  });

  return (
    <TabsContext.Provider
      value={{
        tabsId,
        selectedId,
        setSelectedId,
        orientation,
        activationMode,
        shouldLoop,
      }}
    >
      <div {...tabsProps} ref={forwardedRef} id={tabsId}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}) as ITabs;

Tabs.Panel = TabPanel;
Tabs.Tab = Tab;
Tabs.TabList = TabList;
Tabs.displayName = 'Tabs';

export { Tabs, TabsContext };
export type { TabsProps, TabListProps, TabProps, TabPanelProps, ITabs };

function makeTabId(tabsId: string, tabId: string) {
  return `${tabsId}-tab-${tabId}`;
}

function makeTabPanelId(tabsId: string, tabId: string) {
  return `${tabsId}-tabPanel-${tabId}`;
}

interface ITabs extends React.ForwardRefExoticComponent<TabsProps> {
  TabList: typeof TabList;
  Tab: typeof Tab;
  Panel: typeof TabPanel;
}
