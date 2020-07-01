import * as React from 'react';
import {
  RovingTabIndexProvider,
  useAccessibleMouseDown,
  useControlledState,
  useId,
  useRovingTabIndex,
} from '@interop-ui/react-hooks';
import {
  composeEventHandlers,
  cssReset,
  getFocusableResetStyles,
  useComposedRefs,
} from '@interop-ui/utils';

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
  let { style, ...otherProps } = props;

  return (
    <RovingTabIndexProvider orientation={orientation} shouldLoop={shouldLoop}>
      <div
        {...props}
        // accessibility
        role="tablist"
        aria-orientation={orientation}
        // other props
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
    style,
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

Tab.displayName = 'Tabs.Tab';

type TabPanelProps = React.ComponentPropsWithRef<'div'> & { id: string };

const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  props,
  forwardedRef
) {
  const { id, style, ...tabPanelProps } = props;
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
    style,
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
      <div
        {...tabsProps}
        ref={forwardedRef}
        id={tabsId}
        style={{
          ...cssReset('div'),
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'row' : 'column',
          ...style,
        }}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}) as ITabs;

Tabs.Panel = TabPanel;
Tabs.Tab = Tab;
Tabs.TabList = TabList;
Tabs.displayName = 'Tabs';

export { Tabs };
export type { TabsProps, TabListProps, TabProps, TabPanelProps };

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
