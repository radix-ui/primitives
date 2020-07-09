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
import { forwardRef } from '@interop-ui/react-utils';

type TabsDOMProps = Omit<React.ComponentProps<'div'>, 'onSelect'>;
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
type TabsProps = TabsDOMProps & TabsOwnProps;

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

type TabListProps = React.ComponentProps<'div'>;

const TABLIST_DEFAULT_TAG = 'div';

const TabList = forwardRef<typeof TABLIST_DEFAULT_TAG, TabListProps>(function TabList(
  props,
  forwardedRef
) {
  const { orientation, shouldLoop } = React.useContext(TabsContext);
  let { as: Comp = TABLIST_DEFAULT_TAG, ...otherProps } = props;

  return (
    <RovingTabIndexProvider orientation={orientation} shouldLoop={shouldLoop}>
      <Comp
        data-interop-part-tabs-tab-list=""
        role="tablist"
        aria-orientation={orientation}
        ref={forwardedRef}
        {...otherProps}
      />
    </RovingTabIndexProvider>
  );
});

TabList.displayName = 'Tabs.TabList';

type TabProps = React.ComponentProps<'div'> & {
  id: string;
  disabled?: boolean;
};

const TAB_DEFAULT_TAG = 'div';

const Tab = forwardRef<typeof TAB_DEFAULT_TAG, TabProps>(function Tab(props, forwardedRef) {
  const {
    as: Comp = TAB_DEFAULT_TAG,
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
    <Comp
      data-interop-part-tabs-tab=""
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
      ref={composedRef}
      {...tabProps}
    />
  );
});

Tab.displayName = 'Tabs.Tab';

type TabPanelProps = React.ComponentProps<'div'> & { id: string };

const TAB_PANEL_DEFAULT_TAG = 'div';

const TabPanel = forwardRef<typeof TAB_PANEL_DEFAULT_TAG, TabPanelProps>(function TabPanel(
  props,
  forwardedRef
) {
  const { as: Comp = TAB_PANEL_DEFAULT_TAG, id, ...tabPanelProps } = props;
  const { tabsId, selectedId } = React.useContext(TabsContext);
  const tabId = makeTabId(tabsId, id);
  const tabPanelId = makeTabPanelId(tabsId, id);
  const isSelected = id === selectedId;

  return (
    <Comp
      data-interop-part-tabs-tab-panel=""
      id={tabPanelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      hidden={!isSelected}
      // other props
      ref={forwardedRef}
      {...tabPanelProps}
    />
  );
});

TabPanel.displayName = 'Tabs.Panel';

const TABSL_DEFAULT_TAG = 'div';

const Tabs = forwardRef<typeof TABSL_DEFAULT_TAG, TabsProps>(function Tabs(props, forwardedRef) {
  const {
    as: Comp = TABSL_DEFAULT_TAG,
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
      <Comp data-interop-part-tabs="" ref={forwardedRef} id={tabsId} {...tabsProps}>
        {children}
      </Comp>
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
