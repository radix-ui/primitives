import * as React from 'react';
import {
  composeEventHandlers,
  createContext,
  useControlledState,
  useId,
} from '@radix-ui/react-utils';
import { Primitive } from '@radix-ui/react-primitive';
import { getSelector, makeId } from '@radix-ui/utils';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';

import type * as Polymorphic from '@radix-ui/react-polymorphic';
import type { Merge } from '@radix-ui/utils';

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

type TabsOwnProps = Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
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
  }
>;

type TabsPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  TabsOwnProps
>;

const Tabs = React.forwardRef((props, forwardedRef) => {
  const {
    selector = getSelector(TABS_NAME),
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
      <Primitive
        id={tabsId}
        data-orientation={orientation}
        {...tabsProps}
        selector={selector}
        ref={forwardedRef}
      />
    </TabsContext.Provider>
  );
}) as TabsPrimitive;

Tabs.displayName = TABS_NAME;

/* -------------------------------------------------------------------------------------------------
 * TabsList
 * -----------------------------------------------------------------------------------------------*/

const TAB_LIST_NAME = 'TabsList';

type TabsListOwnProps = Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    /**
     * Whether keyboard navigation should loop focus
     * @defaultValue true
     */
    loop?: boolean;
  }
>;

type TabsListPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  TabsListOwnProps
>;

const TabsList = React.forwardRef((props, forwardedRef) => {
  const { selector = getSelector(TAB_LIST_NAME), loop = true, ...otherProps } = props;
  const { orientation } = useTabsContext(TAB_LIST_NAME);

  return (
    <RovingFocusGroup orientation={orientation} loop={loop}>
      <Primitive
        data-orientation={orientation}
        role="tablist"
        aria-orientation={orientation}
        {...otherProps}
        selector={selector}
        ref={forwardedRef}
      />
    </RovingFocusGroup>
  );
}) as TabsListPrimitive;

TabsList.displayName = TAB_LIST_NAME;

/* -------------------------------------------------------------------------------------------------
 * TabsTab
 * -----------------------------------------------------------------------------------------------*/

const TAB_NAME = 'TabsTab';

type TabsTabOwnProps = Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
    value: string;
    disabled?: boolean;
  }
>;

type TabsTabPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  TabsTabOwnProps
>;

const TabsTab = React.forwardRef((props, forwardedRef) => {
  const { selector = getSelector(TAB_NAME), value, disabled, ...tabProps } = props;
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
    <Primitive
      role="tab"
      aria-selected={isSelected}
      aria-controls={tabPanelId}
      aria-disabled={disabled || undefined}
      {...tabProps}
      {...rovingFocusProps}
      selector={selector}
      ref={forwardedRef}
      data-state={isSelected ? 'active' : 'inactive'}
      data-disabled={disabled ? '' : undefined}
      data-orientation={context.orientation}
      id={tabId}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onFocus={handleFocus}
    />
  );
}) as TabsTabPrimitive;

TabsTab.displayName = TAB_NAME;

/* -------------------------------------------------------------------------------------------------
 * TabsPanel
 * -----------------------------------------------------------------------------------------------*/

const TAB_PANEL_NAME = 'TabsPanel';

type TabsPanelPropsOwnProps = Merge<Polymorphic.OwnProps<typeof Primitive>, { value: string }>;
type TabsPanelPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  TabsPanelPropsOwnProps
>;

const TabsPanel = React.forwardRef((props, forwardedRef) => {
  const { selector = getSelector(TAB_PANEL_NAME), value, ...tabPanelProps } = props;
  const context = useTabsContext(TAB_PANEL_NAME);
  const tabId = makeTabId(context.tabsId, value);
  const tabPanelId = makeTabsPanelId(context.tabsId, value);
  const isSelected = value === context.value;

  return (
    <Primitive
      data-state={isSelected ? 'active' : 'inactive'}
      data-orientation={context.orientation}
      id={tabPanelId}
      role="tabpanel"
      aria-labelledby={tabId}
      tabIndex={0}
      hidden={!isSelected}
      {...tabPanelProps}
      selector={selector}
      ref={forwardedRef}
    />
  );
}) as TabsPanelPrimitive;

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

export {
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
  //
  Root,
  List,
  Tab,
  Panel,
};
