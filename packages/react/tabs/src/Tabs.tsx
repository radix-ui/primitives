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
  forwardRef,
  useControlledState,
  useId,
  ForwardRefExoticComponentWithAs,
} from '@interop-ui/react-utils';
import { getPartDataAttrObj, makeId } from '@interop-ui/utils';
import { RovingFocusGroup, useRovingFocus } from '@interop-ui/react-roving-focus';

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
  onSelect?: (id: string) => void;
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
      <Comp
        {...getPartDataAttrObj(TABS_NAME)}
        ref={forwardedRef}
        id={tabsId}
        data-orientation={orientation}
        {...tabsProps}
      >
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
  const { as: Comp = TAB_LIST_DEFAULT_TAG, children, ...otherProps } = props;

  return (
    <Comp
      {...getPartDataAttrObj(TAB_LIST_NAME)}
      data-orientation={orientation}
      role="tablist"
      aria-orientation={orientation}
      ref={forwardedRef}
      {...otherProps}
    >
      <RovingFocusGroup orientation={orientation} loop={shouldLoop}>
        {children}
      </RovingFocusGroup>
    </Comp>
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
  const { as: Comp = TAB_DEFAULT_TAG, id, disabled, ...tabProps } = props;
  const { tabsId, selectedId, setSelectedId, activationMode, orientation } = useTabsContext(
    TAB_NAME
  );
  const tabId = makeTabId(tabsId, id);
  const tabPanelId = makeTabsPanelId(tabsId, id);
  const isSelected = id === selectedId;
  const rovingFocusProps = useRovingFocus({ disabled });
  const selectTab = React.useCallback(() => setSelectedId?.(id), [id, setSelectedId]);

  const handleKeyDown = composeEventHandlers(
    tabProps.onKeyDown,
    composeEventHandlers(rovingFocusProps.onKeyDown, (event) => {
      if (!disabled && (event.key === ' ' || event.key === 'Enter')) {
        // prevent active state to be stuck in case focus moves somewhere else before mouseUp
        // event.preventDefault();
        selectTab();
      }
    })
  );

  const handleMouseDown = composeEventHandlers(
    tabProps.onMouseDown,
    composeEventHandlers(rovingFocusProps.onMouseDown, (event) => {
      // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
      // but not when the control key is pressed (avoiding MacOS right click)
      if (!disabled && event.button === 0 && event.ctrlKey === false) {
        selectTab();
      }
    })
  );

  const handleFocus = composeEventHandlers(
    tabProps.onFocus,
    composeEventHandlers(rovingFocusProps.onFocus, () => {
      // handle "automatic" activation if necessary
      // ie. activate tab following focus
      const isAutomaticActivation = activationMode !== 'manual';
      if (!isSelected && !disabled && isAutomaticActivation) {
        selectTab();
      }
    })
  );

  return (
    <Comp
      {...getPartDataAttrObj(TAB_NAME)}
      role="tab"
      aria-selected={isSelected}
      aria-controls={tabPanelId}
      aria-disabled={disabled || undefined}
      {...tabProps}
      {...rovingFocusProps}
      data-state={isSelected ? 'active' : 'inactive'}
      data-disabled={disabled ? '' : undefined}
      data-orientation={orientation}
      data-tab-id={id}
      id={tabId}
      ref={forwardedRef}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onFocus={handleFocus}
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
  const { tabsId, selectedId, orientation } = useTabsContext(TAB_PANEL_NAME);
  const tabId = makeTabId(tabsId, id);
  const tabPanelId = makeTabsPanelId(tabsId, id);
  const isSelected = id === selectedId;

  return (
    <Comp
      {...getPartDataAttrObj(TAB_PANEL_NAME)}
      data-state={isSelected ? 'active' : 'inactive'}
      data-orientation={orientation}
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

Tabs.Panel = TabsPanel;
Tabs.Tab = TabsTab;
Tabs.List = TabsList;

Tabs.displayName = TABS_NAME;
Tabs.List.displayName = TAB_LIST_NAME;
Tabs.Tab.displayName = TAB_NAME;
Tabs.Panel.displayName = TAB_PANEL_NAME;

export { Tabs };
export type { TabsProps, TabsListProps, TabsTabProps, TabsPanelProps, ITabs };
