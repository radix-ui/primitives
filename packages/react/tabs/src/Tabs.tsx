import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContext } from '@radix-ui/react-context';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';
import { RovingFocusGroup, useRovingFocus } from '@radix-ui/react-roving-focus';
import { useId } from '@radix-ui/react-id';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

type RovingFocusGroupProps = React.ComponentProps<typeof RovingFocusGroup>;

/* -------------------------------------------------------------------------------------------------
 * Tabs
 * -----------------------------------------------------------------------------------------------*/

const TABS_NAME = 'Tabs';

type TabsContextValue = {
  baseId: string;
  value?: string;
  onValueChange: (value: string) => void;
  orientation?: TabsOwnProps['orientation'];
  dir?: TabsOwnProps['dir'];
  activationMode?: TabsOwnProps['activationMode'];
};

const [TabsProvider, useTabsContext] = createContext<TabsContextValue>(TABS_NAME);

type TabsOwnProps = Polymorphic.Merge<
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
    /**
     * The direction of navigation between toolbar items.
     *
     * @defaultValue ltr
     */
    dir?: RovingFocusGroupProps['dir'];
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
    value: valueProp,
    onValueChange,
    defaultValue,
    orientation = 'horizontal',
    dir = 'ltr',
    activationMode = 'automatic',
    ...tabsProps
  } = props;

  const baseId = useId();

  const [value, setValue] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
    defaultProp: defaultValue,
  });

  return (
    <TabsProvider
      baseId={baseId}
      value={value}
      onValueChange={setValue}
      orientation={orientation}
      dir={dir}
      activationMode={activationMode}
    >
      <Primitive data-orientation={orientation} {...tabsProps} ref={forwardedRef} />
    </TabsProvider>
  );
}) as TabsPrimitive;

Tabs.displayName = TABS_NAME;

/* -------------------------------------------------------------------------------------------------
 * TabsList
 * -----------------------------------------------------------------------------------------------*/

const TAB_LIST_NAME = 'TabsList';

type TabsListOwnProps = Polymorphic.Merge<
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
  const { loop = true, ...otherProps } = props;
  const context = useTabsContext(TAB_LIST_NAME);

  return (
    <RovingFocusGroup orientation={context.orientation} loop={loop} dir={context.dir}>
      <Primitive
        role="tablist"
        aria-orientation={context.orientation}
        data-orientation={context.orientation}
        {...otherProps}
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

type TabsTabOwnProps = Polymorphic.Merge<
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
  const { value, disabled, ...tabProps } = props;
  const context = useTabsContext(TAB_NAME);
  const tabId = makeTabId(context.baseId, value);
  const tabPanelId = makeTabsPanelId(context.baseId, value);
  const isSelected = value === context.value;
  const rovingFocusProps = useRovingFocus({ disabled, active: isSelected });
  const handleTabChange = useCallbackRef(() => context.onValueChange(value));

  const handleKeyDown = composeEventHandlers(
    tabProps.onKeyDown,
    composeEventHandlers(rovingFocusProps.onKeyDown, (event) => {
      if (!disabled && (event.key === ' ' || event.key === 'Enter')) {
        handleTabChange();
      }
    })
  );

  const handleMouseDown = composeEventHandlers(
    tabProps.onMouseDown,
    composeEventHandlers(rovingFocusProps.onMouseDown, (event) => {
      // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
      // but not when the control key is pressed (avoiding MacOS right click)
      if (!disabled && event.button === 0 && event.ctrlKey === false) {
        handleTabChange();
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
        handleTabChange();
      }
    })
  );

  return (
    <Primitive
      role="tab"
      aria-selected={isSelected}
      aria-controls={tabPanelId}
      aria-disabled={disabled || undefined}
      data-state={isSelected ? 'active' : 'inactive'}
      data-disabled={disabled ? '' : undefined}
      data-orientation={context.orientation}
      id={tabId}
      {...tabProps}
      {...rovingFocusProps}
      ref={forwardedRef}
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

type TabsPanelPropsOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  { value: string }
>;
type TabsPanelPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  TabsPanelPropsOwnProps
>;

const TabsPanel = React.forwardRef((props, forwardedRef) => {
  const { value, ...tabPanelProps } = props;
  const context = useTabsContext(TAB_PANEL_NAME);
  const tabId = makeTabId(context.baseId, value);
  const tabPanelId = makeTabsPanelId(context.baseId, value);
  const isSelected = value === context.value;

  return (
    <Primitive
      data-state={isSelected ? 'active' : 'inactive'}
      data-orientation={context.orientation}
      role="tabpanel"
      aria-labelledby={tabId}
      hidden={!isSelected}
      id={tabPanelId}
      tabIndex={0}
      {...tabPanelProps}
      ref={forwardedRef}
    />
  );
}) as TabsPanelPrimitive;

TabsPanel.displayName = TAB_PANEL_NAME;

/* ---------------------------------------------------------------------------------------------- */

function makeTabId(baseId: string, value: string) {
  return `${baseId}-tab-${value}`;
}

function makeTabsPanelId(baseId: string, value: string) {
  return `${baseId}-panel-${value}`;
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
