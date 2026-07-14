import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { createContextScope } from '@radix-ui/react-context';
import { createRovingFocusGroupScope } from '@radix-ui/react-roving-focus';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import * as RovingFocusGroup from '@radix-ui/react-roving-focus';
import { useDirection } from '@radix-ui/react-direction';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useId } from '@radix-ui/react-id';

import type { Scope } from '@radix-ui/react-context';

/* -------------------------------------------------------------------------------------------------
 * Tabs
 * -----------------------------------------------------------------------------------------------*/

const TABS_NAME = 'Tabs';

type ScopedProps<P> = P & { __scopeTabs?: Scope };
const [createTabsContext, createTabsScope] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope,
]);
const useRovingFocusGroupScope = createRovingFocusGroupScope();

type TabsContextValue = {
  baseId: string;
  value: string;
  onValueChange: (value: string) => void;
  orientation?: TabsProps['orientation'];
  dir?: TabsProps['dir'];
  activationMode?: TabsProps['activationMode'];
};

const [TabsProvider, useTabsContext] = createTabsContext<TabsContextValue>(TABS_NAME);

type TabsElement = React.ComponentRef<typeof Primitive.div>;
type RovingFocusGroupProps = React.ComponentPropsWithoutRef<typeof RovingFocusGroup.Root>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
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
   */
  dir?: RovingFocusGroupProps['dir'];
  /**
   * Whether a tab is activated automatically or manually.
   * @defaultValue automatic
   * */
  activationMode?: 'automatic' | 'manual';
}

const Tabs = /* @__PURE__ */ React.forwardRef<TabsElement, TabsProps>(
  // blank line to reduce diff noise
  function Tabs(props: ScopedProps<TabsProps>, forwardedRef) {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = 'horizontal',
      dir,
      activationMode = 'automatic',
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? '',
      caller: TABS_NAME,
    });

    return (
      <TabsProvider
        scope={__scopeTabs}
        baseId={useId()}
        value={value}
        onValueChange={setValue}
        orientation={orientation}
        dir={direction}
        activationMode={activationMode}
      >
        <Primitive.div
          dir={direction}
          data-orientation={orientation}
          {...tabsProps}
          ref={forwardedRef}
        />
      </TabsProvider>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * TabsList
 * -----------------------------------------------------------------------------------------------*/

const TAB_LIST_NAME = 'TabsList';

type TabsListElement = React.ComponentRef<typeof Primitive.div>;
interface TabsListProps extends PrimitiveDivProps {
  loop?: RovingFocusGroupProps['loop'];
}

const TabsList = /* @__PURE__ */ React.forwardRef<TabsListElement, TabsListProps>(
  // blank line to reduce diff noise
  function TabsList(props: ScopedProps<TabsListProps>, forwardedRef) {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return (
      <RovingFocusGroup.Root
        asChild
        {...rovingFocusGroupScope}
        orientation={context.orientation}
        dir={context.dir}
        loop={loop}
      >
        <Primitive.div
          role="tablist"
          aria-orientation={context.orientation}
          {...listProps}
          ref={forwardedRef}
        />
      </RovingFocusGroup.Root>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * TabsTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'TabsTrigger';

type TabsTriggerElement = React.ComponentRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface TabsTriggerProps extends PrimitiveButtonProps {
  value: string;
}

const TabsTrigger = /* @__PURE__ */ React.forwardRef<TabsTriggerElement, TabsTriggerProps>(
  function TabsTrigger(props: ScopedProps<TabsTriggerProps>, forwardedRef) {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return (
      <RovingFocusGroup.Item
        asChild
        {...rovingFocusGroupScope}
        focusable={!disabled}
        active={isSelected}
      >
        <Primitive.button
          type="button"
          role="tab"
          aria-selected={isSelected}
          aria-controls={contentId}
          data-state={isSelected ? 'active' : 'inactive'}
          data-disabled={disabled ? '' : undefined}
          disabled={disabled}
          id={triggerId}
          {...triggerProps}
          ref={forwardedRef}
          onMouseDown={composeEventHandlers(props.onMouseDown, (event) => {
            // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
            // but not when the control key is pressed (avoiding MacOS right click)
            if (!disabled && event.button === 0 && event.ctrlKey === false) {
              context.onValueChange(value);
            } else {
              // prevent focus to avoid accidental activation
              event.preventDefault();
            }
          })}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            // Only react to keys originating from the trigger itself. Focusable
            // descendants (eg. content portaled out of the trigger's DOM
            // subtree) bubble their key events here through React's event
            // system.
            // See: https://github.com/radix-ui/primitives/issues/3232
            if (disabled || event.target !== event.currentTarget) {
              return;
            }

            if ([' ', 'Enter'].includes(event.key)) {
              context.onValueChange(value);
            }
          })}
          onFocus={composeEventHandlers(props.onFocus, () => {
            // handle "automatic" activation if necessary
            // ie. activate tab following focus
            const isAutomaticActivation = context.activationMode !== 'manual';
            if (!isSelected && !disabled && isAutomaticActivation) {
              context.onValueChange(value);
            }
          })}
        />
      </RovingFocusGroup.Item>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * TabsContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'TabsContent';

type TabsContentElement = React.ComponentRef<typeof Primitive.div>;
interface TabsContentProps extends PrimitiveDivProps {
  value: string;

  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const TabsContent = /* @__PURE__ */ React.forwardRef<TabsContentElement, TabsContentProps>(
  function TabsContent(props: ScopedProps<TabsContentProps>, forwardedRef) {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = React.useRef(isSelected);

    React.useEffect(() => {
      const rAF = requestAnimationFrame(() => (isMountAnimationPreventedRef.current = false));
      return () => cancelAnimationFrame(rAF);
    }, []);

    return (
      <Presence present={forceMount || isSelected}>
        {({ present }) => (
          <Primitive.div
            data-state={isSelected ? 'active' : 'inactive'}
            data-orientation={context.orientation}
            role="tabpanel"
            aria-labelledby={triggerId}
            hidden={!present}
            id={contentId}
            tabIndex={0}
            {...contentProps}
            ref={forwardedRef}
            style={{
              ...props.style,
              animationDuration: isMountAnimationPreventedRef.current ? '0s' : undefined,
            }}
          >
            {present && children}
          </Primitive.div>
        )}
      </Presence>
    );
  },
);

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
  createTabsScope,
  //
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
