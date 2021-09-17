import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContext } from '@radix-ui/react-context';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Primitive } from '@radix-ui/react-primitive';
import { RovingFocusGroup, RovingFocusItem } from '@radix-ui/react-roving-focus';
import { useId } from '@radix-ui/react-id';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * Tabs
 * -----------------------------------------------------------------------------------------------*/

const TABS_NAME = 'Tabs';

type TabsContextValue = {
  baseId: string;
  value?: string;
  onValueChange: (value: string) => void;
  orientation?: TabsProps['orientation'];
  dir?: TabsProps['dir'];
  activationMode?: TabsProps['activationMode'];
};

const [TabsProvider, useTabsContext] = createContext<TabsContextValue>(TABS_NAME);

type TabsElement = React.ElementRef<typeof Primitive.div>;
type RovingFocusGroupProps = Radix.ComponentPropsWithoutRef<typeof RovingFocusGroup>;
type PrimitiveDivProps = Radix.ComponentPropsWithoutRef<typeof Primitive.div>;
interface TabsProps extends PrimitiveDivProps {
  /** The value for the selected tab, if controlled */
  value?: string;
  /** The value of the tab to select by default, if uncontrolled */
  defaultValue?: string;
  /** A function called when a new tab is selected */
  onValueChange?: (value: string) => void;
  /**
   * The orientation the tabs are layed out.
   * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
   * @defaultValue horizontal
   */
  orientation?: RovingFocusGroupProps['orientation'];
  /**
   * The direction of navigation between toolbar items.
   * @defaultValue ltr
   */
  dir?: RovingFocusGroupProps['dir'];
  /** Whether a tab is activated automatically or manually (default: automatic) */
  activationMode?: 'automatic' | 'manual';
}

const Tabs = React.forwardRef<TabsElement, TabsProps>((props, forwardedRef) => {
  const {
    value: valueProp,
    onValueChange,
    defaultValue,
    orientation = 'horizontal',
    dir = 'ltr',
    activationMode = 'automatic',
    ...tabsProps
  } = props;

  const [value, setValue] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
    defaultProp: defaultValue,
  });

  return (
    <TabsProvider
      baseId={useId()}
      value={value}
      onValueChange={setValue}
      orientation={orientation}
      dir={dir}
      activationMode={activationMode}
    >
      <Primitive.div data-orientation={orientation} {...tabsProps} ref={forwardedRef} />
    </TabsProvider>
  );
});

Tabs.displayName = TABS_NAME;

/* -------------------------------------------------------------------------------------------------
 * TabsList
 * -----------------------------------------------------------------------------------------------*/

const TAB_LIST_NAME = 'TabsList';

type TabsListElement = React.ElementRef<typeof Primitive.div>;
interface TabsListProps extends PrimitiveDivProps {
  loop?: RovingFocusGroupProps['loop'];
}

const TabsList = React.forwardRef<TabsListElement, TabsListProps>((props, forwardedRef) => {
  const { loop = true, ...listProps } = props;
  const context = useTabsContext(TAB_LIST_NAME);
  return (
    <RovingFocusGroup asChild orientation={context.orientation} dir={context.dir} loop={loop}>
      <Primitive.div role="tablist" dir={context.dir} {...listProps} ref={forwardedRef} />
    </RovingFocusGroup>
  );
});

TabsList.displayName = TAB_LIST_NAME;

/* -------------------------------------------------------------------------------------------------
 * TabsTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'TabsTrigger';

type TabsTriggerElement = React.ElementRef<typeof Primitive.div>;
interface TabsTriggerProps extends PrimitiveDivProps {
  value: string;
  disabled?: boolean;
}

const TabsTrigger = React.forwardRef<TabsTriggerElement, TabsTriggerProps>(
  (props, forwardedRef) => {
    const { value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const handleTabChange = useCallbackRef(() => context.onValueChange(value));
    return (
      <RovingFocusItem asChild focusable={!disabled} active={isSelected}>
        <Primitive.div
          role="tab"
          aria-selected={isSelected}
          aria-controls={contentId}
          aria-disabled={disabled || undefined}
          data-state={isSelected ? 'active' : 'inactive'}
          data-disabled={disabled ? '' : undefined}
          id={triggerId}
          {...triggerProps}
          ref={forwardedRef}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            if (!disabled && (event.key === ' ' || event.key === 'Enter')) {
              handleTabChange();
            }
          })}
          onMouseDown={composeEventHandlers(props.onMouseDown, (event) => {
            // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
            // but not when the control key is pressed (avoiding MacOS right click)
            if (!disabled && event.button === 0 && event.ctrlKey === false) {
              handleTabChange();
            }
          })}
          onFocus={composeEventHandlers(props.onFocus, () => {
            // handle "automatic" activation if necessary
            // ie. activate tab following focus
            const isAutomaticActivation = context.activationMode !== 'manual';
            if (!isSelected && !disabled && isAutomaticActivation) {
              handleTabChange();
            }
          })}
        />
      </RovingFocusItem>
    );
  }
);

TabsTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * TabsContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'TabsContent';

type TabsContentElement = React.ElementRef<typeof Primitive.div>;
interface TabsContentProps extends PrimitiveDivProps {
  value: string;
}

const TabsContent = React.forwardRef<TabsContentElement, TabsContentProps>(
  (props, forwardedRef) => {
    const { value, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return (
      <Primitive.div
        data-state={isSelected ? 'active' : 'inactive'}
        data-orientation={context.orientation}
        role="tabpanel"
        aria-labelledby={triggerId}
        hidden={!isSelected}
        id={contentId}
        tabIndex={0}
        {...contentProps}
        ref={forwardedRef}
      >
        {isSelected && children}
      </Primitive.div>
    );
  }
);

TabsContent.displayName = CONTENT_NAME;

/* ---------------------------------------------------------------------------------------------- */

function makeTriggerId(baseId: string, value: string) {
  return `${baseId}-trigger-${value}`;
}

function makeContentId(baseId: string, value: string) {
  return `${baseId}-content-${value}`;
}

const Root = Tabs;
const List = TabsList;
const Trigger = TabsTrigger;
const Content = TabsContent;

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  //
  Root,
  List,
  Trigger,
  Content,
};
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps };
