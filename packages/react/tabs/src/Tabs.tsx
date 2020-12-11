import * as React from 'react';
import {
  composeEventHandlers,
  createContext,
  useControlledState,
  useId,
} from '@interop-ui/react-utils';
import { forwardRefWithAs } from '@interop-ui/react-polymorphic';
import { getPartDataAttrObj, makeId } from '@interop-ui/utils';
import { RovingFocusGroup, useRovingFocus } from '@interop-ui/react-roving-focus';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type TabsContextValue = {
  tabsId: string;
  value?: string;
  setValue?: (value: string) => void;
  orientation?: TabsOwnProps['orientation'];
  activationMode?: TabsOwnProps['activationMode'];
};

const [TabsContext, useTabsContext] = createContext<TabsContextValue>('TabsContext', 'Tabs');

/* -------------------------------------------------------------------------------------------------
 * Tabs
 * -----------------------------------------------------------------------------------------------*/

const TABS_NAME = 'Tabs';
const TABS_DEFAULT_TAG = 'div';

type TabsOwnProps = {
  /** The value for the selected tab, if controlled */
  value?: string;
  /** The value of the tab to select by default, if uncontrolled */
  defaultValue?: string;
  /** A function called when a new tab is selected */
  onValueChange?: (value: string) => void;
  /**
   * The orientation the tabs are layed out.
   * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
   * (default: horizontal)
   */
  orientation?: React.AriaAttributes['aria-orientation'];
  /** Whether a tab is activated automatically or manually (default: automatic) */
  activationMode?: 'automatic' | 'manual';
};

const Tabs = forwardRefWithAs<typeof TABS_DEFAULT_TAG, TabsOwnProps>((props, forwardedRef) => {
  const {
    as: Comp = TABS_DEFAULT_TAG,
    children,
    id,
    value: valueProp,
    onValueChange,
    defaultValue,
    orientation = 'horizontal',
    activationMode = 'automatic',
    ...tabsProps
  } = props;

  const generatedTabsId = `tabs-${useId()}`;
  const tabsId = id || generatedTabsId;

  const [value, setValue] = useControlledState({
    prop: valueProp,
    onChange: onValueChange,
    defaultProp: defaultValue,
  });

  const ctx: TabsContextValue = React.useMemo(
    () => ({ tabsId, value, setValue, orientation, activationMode }),
    [activationMode, orientation, value, setValue, tabsId]
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
});

Tabs.displayName = TABS_NAME;

/* -------------------------------------------------------------------------------------------------
 * TabsList
 * -----------------------------------------------------------------------------------------------*/

const TAB_LIST_NAME = 'TabsList';
const TAB_LIST_DEFAULT_TAG = 'div';

type TabsListOwnProps = {
  /**
   * Whether keyboard navigation should loop focus
   * @defaultValue true
   */
  loop?: boolean;
};

const TabsList = forwardRefWithAs<typeof TAB_LIST_DEFAULT_TAG, TabsListOwnProps>(
  (props, forwardedRef) => {
    const { orientation } = useTabsContext(TAB_LIST_NAME);
    const { as: Comp = TAB_LIST_DEFAULT_TAG, loop = true, children, ...otherProps } = props;

    return (
      <Comp
        {...getPartDataAttrObj(TAB_LIST_NAME)}
        data-orientation={orientation}
        role="tablist"
        aria-orientation={orientation}
        ref={forwardedRef}
        {...otherProps}
      >
        <RovingFocusGroup orientation={orientation} loop={loop}>
          {children}
        </RovingFocusGroup>
      </Comp>
    );
  }
);

TabsList.displayName = TAB_LIST_NAME;

/* -------------------------------------------------------------------------------------------------
 * TabsTab
 * -----------------------------------------------------------------------------------------------*/

const TAB_NAME = 'TabsTab';
const TAB_DEFAULT_TAG = 'div';

type TabsTabOwnProps = {
  value: string;
  disabled?: boolean;
};

const TabsTab = forwardRefWithAs<typeof TAB_DEFAULT_TAG, TabsTabOwnProps>((props, forwardedRef) => {
  const { as: Comp = TAB_DEFAULT_TAG, value, disabled, ...tabProps } = props;
  const context = useTabsContext(TAB_NAME);
  const tabId = makeTabId(context.tabsId, value);
  const tabPanelId = makeTabsPanelId(context.tabsId, value);
  const isSelected = value === context.value;
  const rovingFocusProps = useRovingFocus({ disabled, active: isSelected });
  const selectTab = React.useCallback(() => context.setValue?.(value), [context.setValue, value]);

  const handleKeyDown = composeEventHandlers(
    tabProps.onKeyDown,
    composeEventHandlers(rovingFocusProps.onKeyDown, (event) => {
      if (!disabled && (event.key === ' ' || event.key === 'Enter')) {
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
      const isAutomaticActivation = context.activationMode !== 'manual';
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
      data-orientation={context.orientation}
      id={tabId}
      ref={forwardedRef}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onFocus={handleFocus}
    />
  );
});

TabsTab.displayName = TAB_NAME;

/* -------------------------------------------------------------------------------------------------
 * TabsPanel
 * -----------------------------------------------------------------------------------------------*/

const TAB_PANEL_NAME = 'TabsPanel';
const TAB_PANEL_DEFAULT_TAG = 'div';

type TabsPanelPropsOwnProps = { value: string };

const TabsPanel = forwardRefWithAs<typeof TAB_PANEL_DEFAULT_TAG, TabsPanelPropsOwnProps>(
  (props, forwardedRef) => {
    const { as: Comp = TAB_PANEL_DEFAULT_TAG, value, ...tabPanelProps } = props;
    const context = useTabsContext(TAB_PANEL_NAME);
    const tabId = makeTabId(context.tabsId, value);
    const tabPanelId = makeTabsPanelId(context.tabsId, value);
    const isSelected = value === context.value;

    return (
      <Comp
        {...getPartDataAttrObj(TAB_PANEL_NAME)}
        data-state={isSelected ? 'active' : 'inactive'}
        data-orientation={context.orientation}
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
  }
);

TabsPanel.displayName = TAB_PANEL_NAME;

/* ---------------------------------------------------------------------------------------------- */

function makeTabId(tabsId: string, value: string) {
  return makeId(tabsId, 'tab', value);
}

function makeTabsPanelId(tabsId: string, value: string) {
  return `${tabsId}-tabPanel-${value}`;
}

const Root = Tabs;
const List = TabsList;
const Tab = TabsTab;
const Panel = TabsPanel;

export { Tabs, TabsList, TabsTab, TabsPanel, Root, List, Tab, Panel };
