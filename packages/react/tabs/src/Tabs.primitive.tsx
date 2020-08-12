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
  composeEventHandlers,
  createContext,
  createStyleObj,
  forwardRef,
  RovingTabIndexProvider,
  useAccessibleMouseDown,
  useComposedRefs,
  useControlledState,
  useId,
  useRovingTabIndex,
  ForwardRefExoticComponentWithAs,
} from '@interop-ui/react-utils';
import { cssReset, makeId } from '@interop-ui/utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type TabsContextValue = {
  tabsId: string;
  selectedId?: string;
  setSelectedId?: (id: string) => void;
  orientation?: TabsProps['orientation'];
  activationMode?: TabsProps['activationMode'];
  shouldLoop?: boolean;
};

const [TabsContext, useTabsContext] = createContext<TabsContextValue>('TabsContext', 'Tabs');

/* -------------------------------------------------------------------------------------------------
 * Tabs
 * -----------------------------------------------------------------------------------------------*/

const TABS_NAME = 'Tabs';
const TABS_DEFAULT_TAG = 'div';

type TabsDOMProps = Omit<React.ComponentProps<typeof TABS_DEFAULT_TAG>, 'onSelect'>;
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

const Tabs = forwardRef<typeof TABS_DEFAULT_TAG, TabsProps>(function Tabs(props, forwardedRef) {
  const {
    as: Comp = TABS_DEFAULT_TAG,
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

  const ctx: TabsContextValue = React.useMemo(
    () => ({
      tabsId,
      selectedId,
      setSelectedId,
      orientation,
      activationMode,
      shouldLoop,
    }),
    [activationMode, orientation, selectedId, setSelectedId, shouldLoop, tabsId]
  );

  return (
    <TabsContext.Provider value={ctx}>
      <Comp {...interopDataAttrObj('tabs')} ref={forwardedRef} id={tabsId} {...tabsProps}>
        {children}
      </Comp>
    </TabsContext.Provider>
  );
}) as ITabs;

/* -------------------------------------------------------------------------------------------------
 * TabsList
 * -----------------------------------------------------------------------------------------------*/

const TAB_LIST_NAME = 'Tabs.List';
const TAB_LIST_DEFAULT_TAG = 'div';

type TabsListProps = React.ComponentProps<typeof TAB_LIST_DEFAULT_TAG>;

const TabsList = forwardRef<typeof TAB_LIST_DEFAULT_TAG, TabsListProps>(function TabsList(
  props,
  forwardedRef
) {
  const { orientation, shouldLoop } = useTabsContext(TAB_LIST_NAME);
  let { as: Comp = TAB_LIST_DEFAULT_TAG, ...otherProps } = props;

  return (
    <RovingTabIndexProvider orientation={orientation} shouldLoop={shouldLoop}>
      <Comp
        {...interopDataAttrObj('tabList')}
        role="tablist"
        aria-orientation={orientation}
        ref={forwardedRef}
        {...otherProps}
      />
    </RovingTabIndexProvider>
  );
});

/* -------------------------------------------------------------------------------------------------
 * TabsTab
 * -----------------------------------------------------------------------------------------------*/

const TAB_NAME = 'Tabs.Tab';
const TAB_DEFAULT_TAG = 'div';

type TabsTabDOMProps = React.ComponentProps<typeof TAB_DEFAULT_TAG>;
type TabsTabOwnProps = {
  id: string;
  disabled?: boolean;
};
type TabsTabProps = TabsTabDOMProps & TabsTabOwnProps;

const TabsTab = forwardRef<typeof TAB_DEFAULT_TAG, TabsTabProps>(function TabsTab(
  props,
  forwardedRef
) {
  const {
    as: Comp = TAB_DEFAULT_TAG,
    id,
    disabled,
    onMouseDown: originalOnMouseDown,
    onKeyDown: originalOnKeyDown,
    onFocus: originalOnFocus,
    ...tabProps
  } = props;

  const { tabsId, selectedId, setSelectedId, activationMode } = useTabsContext(TAB_NAME);

  const tabId = makeTabId(tabsId, id);
  const tabPanelId = makeTabsPanelId(tabsId, id);
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
      {...interopDataAttrObj('tab')}
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

/* -------------------------------------------------------------------------------------------------
 * TabsPanel
 * -----------------------------------------------------------------------------------------------*/

const TAB_PANEL_NAME = 'Tabs.Panel';
const TAB_PANEL_DEFAULT_TAG = 'div';

type TabsPanelProps = React.ComponentProps<typeof TAB_PANEL_DEFAULT_TAG> & { id: string };

const TabsPanel = forwardRef<typeof TAB_PANEL_DEFAULT_TAG, TabsPanelProps>(function TabsPanel(
  props,
  forwardedRef
) {
  const { as: Comp = TAB_PANEL_DEFAULT_TAG, id, ...tabPanelProps } = props;
  const { tabsId, selectedId } = useTabsContext(TAB_PANEL_NAME);
  const tabId = makeTabId(tabsId, id);
  const tabPanelId = makeTabsPanelId(tabsId, id);
  const isSelected = id === selectedId;

  return (
    <Comp
      {...interopDataAttrObj('tabPanel')}
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

/* -------------------------------------------------------------------------------------------------
 * Styles
 * -----------------------------------------------------------------------------------------------*/

const [styles, interopDataAttrObj] = createStyleObj(TABS_NAME, {
  root: {},
  tabList: {
    ...cssReset(TAB_LIST_DEFAULT_TAG),
    flexShrink: 0,
    display: 'flex',
  },
  tab: {
    // reset styles
    ...cssReset(TAB_DEFAULT_TAG),
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: '1',
    cursor: 'default',
    whiteSpace: 'nowrap',

    // enable overlapping adjacent tabs via z-index
    position: 'relative',
  },
  tabPanel: {
    ...cssReset(TAB_PANEL_DEFAULT_TAG),
    flexGrow: 1,
  },
  tabs: {
    ...cssReset(TABS_DEFAULT_TAG),
    display: 'flex',
  },
});

Tabs.Panel = TabsPanel;
Tabs.Tab = TabsTab;
Tabs.List = TabsList;

Tabs.displayName = TABS_NAME;
Tabs.List.displayName = TAB_LIST_NAME;
Tabs.Tab.displayName = TAB_NAME;
Tabs.Panel.displayName = TAB_PANEL_NAME;

export { Tabs, styles };
export type { TabsProps, TabsListProps, TabsTabProps, TabsPanelProps, ITabs };

/* ---------------------------------------------------------------------------------------------- */

function makeTabId(tabsId: string, tabId: string) {
  return makeId(tabsId, 'tab', tabId);
}

function makeTabsPanelId(tabsId: string, tabId: string) {
  return `${tabsId}-tabPanel-${tabId}`;
}

interface ITabs extends ForwardRefExoticComponentWithAs<typeof TABS_DEFAULT_TAG, TabsProps> {
  List: typeof TabsList;
  Tab: typeof TabsTab;
  Panel: typeof TabsPanel;
}
