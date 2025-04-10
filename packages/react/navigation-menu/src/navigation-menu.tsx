import * as React from 'react';
import ReactDOM from 'react-dom';
import { createContextScope } from '@radix-ui/react-context';
import { composeEventHandlers } from '@radix-ui/primitive';
import { Primitive, dispatchDiscreteCustomEvent } from '@radix-ui/react-primitive';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { composeRefs, useComposedRefs } from '@radix-ui/react-compose-refs';
import { useDirection } from '@radix-ui/react-direction';
import { Presence } from '@radix-ui/react-presence';
import { useId } from '@radix-ui/react-id';
import { createCollection } from '@radix-ui/react-collection';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { usePrevious } from '@radix-ui/react-use-previous';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';

import type { Scope } from '@radix-ui/react-context';

type Orientation = 'vertical' | 'horizontal';
type Direction = 'ltr' | 'rtl';

/* -------------------------------------------------------------------------------------------------
 * NavigationMenu
 * -----------------------------------------------------------------------------------------------*/

const NAVIGATION_MENU_NAME = 'NavigationMenu';

const [Collection, useCollection, createCollectionScope] = createCollection<
  NavigationMenuTriggerElement,
  { value: string }
>(NAVIGATION_MENU_NAME);

const [FocusGroupCollection, useFocusGroupCollection, createFocusGroupCollectionScope] =
  createCollection<FocusGroupItemElement, {}>(NAVIGATION_MENU_NAME);

type ScopedProps<P> = P & { __scopeNavigationMenu?: Scope };
const [createNavigationMenuContext, createNavigationMenuScope] = createContextScope(
  NAVIGATION_MENU_NAME,
  [createCollectionScope, createFocusGroupCollectionScope]
);

type ContentData = {
  ref?: React.Ref<ViewportContentMounterElement>;
} & ViewportContentMounterProps;

type NavigationMenuContextValue = {
  isRootMenu: boolean;
  value: string;
  previousValue: string;
  baseId: string;
  dir: Direction;
  orientation: Orientation;
  rootNavigationMenu: NavigationMenuElement | null;
  indicatorTrack: HTMLDivElement | null;
  onIndicatorTrackChange(indicatorTrack: HTMLDivElement | null): void;
  viewport: NavigationMenuViewportElement | null;
  onViewportChange(viewport: NavigationMenuViewportElement | null): void;
  onViewportContentChange(contentValue: string, contentData: ContentData): void;
  onViewportContentRemove(contentValue: string): void;
  onTriggerEnter(itemValue: string): void;
  onTriggerLeave(): void;
  onContentEnter(): void;
  onContentLeave(): void;
  onItemSelect(itemValue: string): void;
  onItemDismiss(): void;
};

const [NavigationMenuProviderImpl, useNavigationMenuContext] =
  createNavigationMenuContext<NavigationMenuContextValue>(NAVIGATION_MENU_NAME);

const [ViewportContentProvider, useViewportContentContext] = createNavigationMenuContext<{
  items: Map<string, ContentData>;
}>(NAVIGATION_MENU_NAME);

type NavigationMenuElement = React.ElementRef<typeof Primitive.nav>;
type PrimitiveNavProps = React.ComponentPropsWithoutRef<typeof Primitive.nav>;
interface NavigationMenuProps
  extends Omit<NavigationMenuProviderProps, keyof NavigationMenuProviderPrivateProps>,
    PrimitiveNavProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  dir?: Direction;
  orientation?: Orientation;
  /**
   * The duration from when the pointer enters the trigger until the tooltip gets opened.
   * @defaultValue 200
   */
  delayDuration?: number;
  /**
   * How much time a user has to enter another trigger without incurring a delay again.
   * @defaultValue 300
   */
  skipDelayDuration?: number;
}

const NavigationMenu = React.forwardRef<NavigationMenuElement, NavigationMenuProps>(
  (props: ScopedProps<NavigationMenuProps>, forwardedRef) => {
    const {
      __scopeNavigationMenu,
      value: valueProp,
      onValueChange,
      defaultValue,
      delayDuration = 200,
      skipDelayDuration = 300,
      orientation = 'horizontal',
      dir,
      ...NavigationMenuProps
    } = props;
    const [navigationMenu, setNavigationMenu] = React.useState<NavigationMenuElement | null>(null);
    const composedRef = useComposedRefs(forwardedRef, (node) => setNavigationMenu(node));
    const direction = useDirection(dir);
    const openTimerRef = React.useRef(0);
    const closeTimerRef = React.useRef(0);
    const skipDelayTimerRef = React.useRef(0);
    const [isOpenDelayed, setIsOpenDelayed] = React.useState(true);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: (value) => {
        const isOpen = value !== '';
        const hasSkipDelayDuration = skipDelayDuration > 0;

        if (isOpen) {
          window.clearTimeout(skipDelayTimerRef.current);
          if (hasSkipDelayDuration) setIsOpenDelayed(false);
        } else {
          window.clearTimeout(skipDelayTimerRef.current);
          skipDelayTimerRef.current = window.setTimeout(
            () => setIsOpenDelayed(true),
            skipDelayDuration
          );
        }

        onValueChange?.(value);
      },
      defaultProp: defaultValue ?? '',
      caller: NAVIGATION_MENU_NAME,
    });

    const startCloseTimer = React.useCallback(() => {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = window.setTimeout(() => setValue(''), 150);
    }, [setValue]);

    const handleOpen = React.useCallback(
      (itemValue: string) => {
        window.clearTimeout(closeTimerRef.current);
        setValue(itemValue);
      },
      [setValue]
    );

    const handleDelayedOpen = React.useCallback(
      (itemValue: string) => {
        const isOpenItem = value === itemValue;
        if (isOpenItem) {
          // If the item is already open (e.g. we're transitioning from the content to the trigger)
          // then we want to clear the close timer immediately.
          window.clearTimeout(closeTimerRef.current);
        } else {
          openTimerRef.current = window.setTimeout(() => {
            window.clearTimeout(closeTimerRef.current);
            setValue(itemValue);
          }, delayDuration);
        }
      },
      [value, setValue, delayDuration]
    );

    React.useEffect(() => {
      return () => {
        window.clearTimeout(openTimerRef.current);
        window.clearTimeout(closeTimerRef.current);
        window.clearTimeout(skipDelayTimerRef.current);
      };
    }, []);

    return (
      <NavigationMenuProvider
        scope={__scopeNavigationMenu}
        isRootMenu={true}
        value={value}
        dir={direction}
        orientation={orientation}
        rootNavigationMenu={navigationMenu}
        onTriggerEnter={(itemValue) => {
          window.clearTimeout(openTimerRef.current);
          if (isOpenDelayed) handleDelayedOpen(itemValue);
          else handleOpen(itemValue);
        }}
        onTriggerLeave={() => {
          window.clearTimeout(openTimerRef.current);
          startCloseTimer();
        }}
        onContentEnter={() => window.clearTimeout(closeTimerRef.current)}
        onContentLeave={startCloseTimer}
        onItemSelect={(itemValue) => {
          setValue((prevValue) => (prevValue === itemValue ? '' : itemValue));
        }}
        onItemDismiss={() => setValue('')}
      >
        <Primitive.nav
          aria-label="Main"
          data-orientation={orientation}
          dir={direction}
          {...NavigationMenuProps}
          ref={composedRef}
        />
      </NavigationMenuProvider>
    );
  }
);

NavigationMenu.displayName = NAVIGATION_MENU_NAME;

/* -------------------------------------------------------------------------------------------------
 * NavigationMenuSub
 * -----------------------------------------------------------------------------------------------*/

const SUB_NAME = 'NavigationMenuSub';

type NavigationMenuSubElement = React.ElementRef<typeof Primitive.div>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface NavigationMenuSubProps
  extends Omit<NavigationMenuProviderProps, keyof NavigationMenuProviderPrivateProps>,
    PrimitiveDivProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: Orientation;
}

const NavigationMenuSub = React.forwardRef<NavigationMenuSubElement, NavigationMenuSubProps>(
  (props: ScopedProps<NavigationMenuSubProps>, forwardedRef) => {
    const {
      __scopeNavigationMenu,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = 'horizontal',
      ...subProps
    } = props;
    const context = useNavigationMenuContext(SUB_NAME, __scopeNavigationMenu);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? '',
      caller: SUB_NAME,
    });

    return (
      <NavigationMenuProvider
        scope={__scopeNavigationMenu}
        isRootMenu={false}
        value={value}
        dir={context.dir}
        orientation={orientation}
        rootNavigationMenu={context.rootNavigationMenu}
        onTriggerEnter={(itemValue) => setValue(itemValue)}
        onItemSelect={(itemValue) => setValue(itemValue)}
        onItemDismiss={() => setValue('')}
      >
        <Primitive.div data-orientation={orientation} {...subProps} ref={forwardedRef} />
      </NavigationMenuProvider>
    );
  }
);

NavigationMenuSub.displayName = SUB_NAME;

/* -----------------------------------------------------------------------------------------------*/

interface NavigationMenuProviderPrivateProps {
  isRootMenu: boolean;
  scope: Scope;
  children: React.ReactNode;
  orientation: Orientation;
  dir: Direction;
  rootNavigationMenu: NavigationMenuElement | null;
  value: string;
  onTriggerEnter(itemValue: string): void;
  onTriggerLeave?(): void;
  onContentEnter?(): void;
  onContentLeave?(): void;
  onItemSelect(itemValue: string): void;
  onItemDismiss(): void;
}

interface NavigationMenuProviderProps extends NavigationMenuProviderPrivateProps {}

const NavigationMenuProvider: React.FC<NavigationMenuProviderProps> = (
  props: ScopedProps<NavigationMenuProviderProps>
) => {
  const {
    scope,
    isRootMenu,
    rootNavigationMenu,
    dir,
    orientation,
    children,
    value,
    onItemSelect,
    onItemDismiss,
    onTriggerEnter,
    onTriggerLeave,
    onContentEnter,
    onContentLeave,
  } = props;
  const [viewport, setViewport] = React.useState<NavigationMenuViewportElement | null>(null);
  const [viewportContent, setViewportContent] = React.useState<Map<string, ContentData>>(new Map());
  const [indicatorTrack, setIndicatorTrack] = React.useState<HTMLDivElement | null>(null);

  return (
    <NavigationMenuProviderImpl
      scope={scope}
      isRootMenu={isRootMenu}
      rootNavigationMenu={rootNavigationMenu}
      value={value}
      previousValue={usePrevious(value)}
      baseId={useId()}
      dir={dir}
      orientation={orientation}
      viewport={viewport}
      onViewportChange={setViewport}
      indicatorTrack={indicatorTrack}
      onIndicatorTrackChange={setIndicatorTrack}
      onTriggerEnter={useCallbackRef(onTriggerEnter)}
      onTriggerLeave={useCallbackRef(onTriggerLeave)}
      onContentEnter={useCallbackRef(onContentEnter)}
      onContentLeave={useCallbackRef(onContentLeave)}
      onItemSelect={useCallbackRef(onItemSelect)}
      onItemDismiss={useCallbackRef(onItemDismiss)}
      onViewportContentChange={React.useCallback((contentValue, contentData) => {
        setViewportContent((prevContent) => {
          prevContent.set(contentValue, contentData);
          return new Map(prevContent);
        });
      }, [])}
      onViewportContentRemove={React.useCallback((contentValue) => {
        setViewportContent((prevContent) => {
          if (!prevContent.has(contentValue)) return prevContent;
          prevContent.delete(contentValue);
          return new Map(prevContent);
        });
      }, [])}
    >
      <Collection.Provider scope={scope}>
        <ViewportContentProvider scope={scope} items={viewportContent}>
          {children}
        </ViewportContentProvider>
      </Collection.Provider>
    </NavigationMenuProviderImpl>
  );
};

/* -------------------------------------------------------------------------------------------------
 * NavigationMenuList
 * -----------------------------------------------------------------------------------------------*/

const LIST_NAME = 'NavigationMenuList';

type NavigationMenuListElement = React.ElementRef<typeof Primitive.ul>;
type PrimitiveUnorderedListProps = React.ComponentPropsWithoutRef<typeof Primitive.ul>;
interface NavigationMenuListProps extends PrimitiveUnorderedListProps {}

const NavigationMenuList = React.forwardRef<NavigationMenuListElement, NavigationMenuListProps>(
  (props: ScopedProps<NavigationMenuListProps>, forwardedRef) => {
    const { __scopeNavigationMenu, ...listProps } = props;
    const context = useNavigationMenuContext(LIST_NAME, __scopeNavigationMenu);

    const list = (
      <Primitive.ul data-orientation={context.orientation} {...listProps} ref={forwardedRef} />
    );

    return (
      <Primitive.div style={{ position: 'relative' }} ref={context.onIndicatorTrackChange}>
        <Collection.Slot scope={__scopeNavigationMenu}>
          {context.isRootMenu ? <FocusGroup asChild>{list}</FocusGroup> : list}
        </Collection.Slot>
      </Primitive.div>
    );
  }
);

NavigationMenuList.displayName = LIST_NAME;

/* -------------------------------------------------------------------------------------------------
 * NavigationMenuItem
 * -----------------------------------------------------------------------------------------------*/

const ITEM_NAME = 'NavigationMenuItem';

type FocusProxyElement = React.ElementRef<typeof VisuallyHiddenPrimitive.Root>;

type NavigationMenuItemContextValue = {
  value: string;
  triggerRef: React.RefObject<NavigationMenuTriggerElement | null>;
  contentRef: React.RefObject<NavigationMenuContentElement | null>;
  focusProxyRef: React.RefObject<FocusProxyElement | null>;
  wasEscapeCloseRef: React.MutableRefObject<boolean>;
  onEntryKeyDown(): void;
  onFocusProxyEnter(side: 'start' | 'end'): void;
  onRootContentClose(): void;
  onContentFocusOutside(): void;
};

const [NavigationMenuItemContextProvider, useNavigationMenuItemContext] =
  createNavigationMenuContext<NavigationMenuItemContextValue>(ITEM_NAME);

type NavigationMenuItemElement = React.ElementRef<typeof Primitive.li>;
type PrimitiveListItemProps = React.ComponentPropsWithoutRef<typeof Primitive.li>;
interface NavigationMenuItemProps extends PrimitiveListItemProps {
  value?: string;
}

const NavigationMenuItem = React.forwardRef<NavigationMenuItemElement, NavigationMenuItemProps>(
  (props: ScopedProps<NavigationMenuItemProps>, forwardedRef) => {
    const { __scopeNavigationMenu, value: valueProp, ...itemProps } = props;
    const autoValue = useId();
    // We need to provide an initial deterministic value as `useId` will return
    // empty string on the first render and we don't want to match our internal "closed" value.
    const value = valueProp || autoValue || 'LEGACY_REACT_AUTO_VALUE';
    const contentRef = React.useRef<NavigationMenuContentElement>(null);
    const triggerRef = React.useRef<NavigationMenuTriggerElement>(null);
    const focusProxyRef = React.useRef<FocusProxyElement>(null);
    const restoreContentTabOrderRef = React.useRef(() => {});
    const wasEscapeCloseRef = React.useRef(false);

    const handleContentEntry = React.useCallback((side = 'start') => {
      if (contentRef.current) {
        restoreContentTabOrderRef.current();
        const candidates = getTabbableCandidates(contentRef.current);
        if (candidates.length) focusFirst(side === 'start' ? candidates : candidates.reverse());
      }
    }, []);

    const handleContentExit = React.useCallback(() => {
      if (contentRef.current) {
        const candidates = getTabbableCandidates(contentRef.current);
        if (candidates.length) restoreContentTabOrderRef.current = removeFromTabOrder(candidates);
      }
    }, []);

    return (
      <NavigationMenuItemContextProvider
        scope={__scopeNavigationMenu}
        value={value}
        triggerRef={triggerRef}
        contentRef={contentRef}
        focusProxyRef={focusProxyRef}
        wasEscapeCloseRef={wasEscapeCloseRef}
        onEntryKeyDown={handleContentEntry}
        onFocusProxyEnter={handleContentEntry}
        onRootContentClose={handleContentExit}
        onContentFocusOutside={handleContentExit}
      >
        <Primitive.li {...itemProps} ref={forwardedRef} />
      </NavigationMenuItemContextProvider>
    );
  }
);

NavigationMenuItem.displayName = ITEM_NAME;

/* -------------------------------------------------------------------------------------------------
 * NavigationMenuTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'NavigationMenuTrigger';

type NavigationMenuTriggerElement = React.ElementRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface NavigationMenuTriggerProps extends PrimitiveButtonProps {}

const NavigationMenuTrigger = React.forwardRef<
  NavigationMenuTriggerElement,
  NavigationMenuTriggerProps
>((props: ScopedProps<NavigationMenuTriggerProps>, forwardedRef) => {
  const { __scopeNavigationMenu, disabled, ...triggerProps } = props;
  const context = useNavigationMenuContext(TRIGGER_NAME, props.__scopeNavigationMenu);
  const itemContext = useNavigationMenuItemContext(TRIGGER_NAME, props.__scopeNavigationMenu);
  const ref = React.useRef<NavigationMenuTriggerElement>(null);
  const composedRefs = useComposedRefs(ref, itemContext.triggerRef, forwardedRef);
  const triggerId = makeTriggerId(context.baseId, itemContext.value);
  const contentId = makeContentId(context.baseId, itemContext.value);
  const hasPointerMoveOpenedRef = React.useRef(false);
  const wasClickCloseRef = React.useRef(false);
  const open = itemContext.value === context.value;

  return (
    <>
      <Collection.ItemSlot scope={__scopeNavigationMenu} value={itemContext.value}>
        <FocusGroupItem asChild>
          <Primitive.button
            id={triggerId}
            disabled={disabled}
            data-disabled={disabled ? '' : undefined}
            data-state={getOpenState(open)}
            aria-expanded={open}
            aria-controls={contentId}
            {...triggerProps}
            ref={composedRefs}
            onPointerEnter={composeEventHandlers(props.onPointerEnter, () => {
              wasClickCloseRef.current = false;
              itemContext.wasEscapeCloseRef.current = false;
            })}
            onPointerMove={composeEventHandlers(
              props.onPointerMove,
              whenMouse(() => {
                if (
                  disabled ||
                  wasClickCloseRef.current ||
                  itemContext.wasEscapeCloseRef.current ||
                  hasPointerMoveOpenedRef.current
                )
                  return;
                context.onTriggerEnter(itemContext.value);
                hasPointerMoveOpenedRef.current = true;
              })
            )}
            onPointerLeave={composeEventHandlers(
              props.onPointerLeave,
              whenMouse(() => {
                if (disabled) return;
                context.onTriggerLeave();
                hasPointerMoveOpenedRef.current = false;
              })
            )}
            onClick={composeEventHandlers(props.onClick, () => {
              context.onItemSelect(itemContext.value);
              wasClickCloseRef.current = open;
            })}
            onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
              const verticalEntryKey = context.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
              const entryKey = { horizontal: 'ArrowDown', vertical: verticalEntryKey }[
                context.orientation
              ];
              if (open && event.key === entryKey) {
                itemContext.onEntryKeyDown();
                // Prevent FocusGroupItem from handling the event
                event.preventDefault();
              }
            })}
          />
        </FocusGroupItem>
      </Collection.ItemSlot>

      {/* Proxy tab order between trigger and content */}
      {open && (
        <>
          <VisuallyHiddenPrimitive.Root
            aria-hidden
            tabIndex={0}
            ref={itemContext.focusProxyRef}
            onFocus={(event) => {
              const content = itemContext.contentRef.current;
              const prevFocusedElement = event.relatedTarget as HTMLElement | null;
              const wasTriggerFocused = prevFocusedElement === ref.current;
              const wasFocusFromContent = content?.contains(prevFocusedElement);

              if (wasTriggerFocused || !wasFocusFromContent) {
                itemContext.onFocusProxyEnter(wasTriggerFocused ? 'start' : 'end');
              }
            }}
          />

          {/* Restructure a11y tree to make content accessible to screen reader when using the viewport */}
          {context.viewport && <span aria-owns={contentId} />}
        </>
      )}
    </>
  );
});

NavigationMenuTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * NavigationMenuLink
 * -----------------------------------------------------------------------------------------------*/

const LINK_NAME = 'NavigationMenuLink';
const LINK_SELECT = 'navigationMenu.linkSelect';

type NavigationMenuLinkElement = React.ElementRef<typeof Primitive.a>;
type PrimitiveLinkProps = React.ComponentPropsWithoutRef<typeof Primitive.a>;
interface NavigationMenuLinkProps extends Omit<PrimitiveLinkProps, 'onSelect'> {
  active?: boolean;
  onSelect?: (event: Event) => void;
}

const NavigationMenuLink = React.forwardRef<NavigationMenuLinkElement, NavigationMenuLinkProps>(
  (props: ScopedProps<NavigationMenuLinkProps>, forwardedRef) => {
    const { __scopeNavigationMenu, active, onSelect, ...linkProps } = props;

    return (
      <FocusGroupItem asChild>
        <Primitive.a
          data-active={active ? '' : undefined}
          aria-current={active ? 'page' : undefined}
          {...linkProps}
          ref={forwardedRef}
          onClick={composeEventHandlers(
            props.onClick,
            (event) => {
              const target = event.target as HTMLElement;
              const linkSelectEvent = new CustomEvent(LINK_SELECT, {
                bubbles: true,
                cancelable: true,
              });
              target.addEventListener(LINK_SELECT, (event) => onSelect?.(event), { once: true });
              dispatchDiscreteCustomEvent(target, linkSelectEvent);

              if (!linkSelectEvent.defaultPrevented && !event.metaKey) {
                const rootContentDismissEvent = new CustomEvent(ROOT_CONTENT_DISMISS, {
                  bubbles: true,
                  cancelable: true,
                });
                dispatchDiscreteCustomEvent(target, rootContentDismissEvent);
              }
            },
            { checkForDefaultPrevented: false }
          )}
        />
      </FocusGroupItem>
    );
  }
);

NavigationMenuLink.displayName = LINK_NAME;

/* -------------------------------------------------------------------------------------------------
 * NavigationMenuIndicator
 * -----------------------------------------------------------------------------------------------*/

const INDICATOR_NAME = 'NavigationMenuIndicator';

type NavigationMenuIndicatorElement = NavigationMenuIndicatorImplElement;
interface NavigationMenuIndicatorProps extends NavigationMenuIndicatorImplProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const NavigationMenuIndicator = React.forwardRef<
  NavigationMenuIndicatorElement,
  NavigationMenuIndicatorProps
>((props: ScopedProps<NavigationMenuIndicatorProps>, forwardedRef) => {
  const { forceMount, ...indicatorProps } = props;
  const context = useNavigationMenuContext(INDICATOR_NAME, props.__scopeNavigationMenu);
  const isVisible = Boolean(context.value);

  return context.indicatorTrack
    ? ReactDOM.createPortal(
        <Presence present={forceMount || isVisible}>
          <NavigationMenuIndicatorImpl {...indicatorProps} ref={forwardedRef} />
        </Presence>,
        context.indicatorTrack
      )
    : null;
});

NavigationMenuIndicator.displayName = INDICATOR_NAME;

type NavigationMenuIndicatorImplElement = React.ElementRef<typeof Primitive.div>;
interface NavigationMenuIndicatorImplProps extends PrimitiveDivProps {}

const NavigationMenuIndicatorImpl = React.forwardRef<
  NavigationMenuIndicatorImplElement,
  NavigationMenuIndicatorImplProps
>((props: ScopedProps<NavigationMenuIndicatorImplProps>, forwardedRef) => {
  const { __scopeNavigationMenu, ...indicatorProps } = props;
  const context = useNavigationMenuContext(INDICATOR_NAME, __scopeNavigationMenu);
  const getItems = useCollection(__scopeNavigationMenu);
  const [activeTrigger, setActiveTrigger] = React.useState<NavigationMenuTriggerElement | null>(
    null
  );
  const [position, setPosition] = React.useState<{ size: number; offset: number } | null>(null);
  const isHorizontal = context.orientation === 'horizontal';
  const isVisible = Boolean(context.value);

  React.useEffect(() => {
    const items = getItems();
    const triggerNode = items.find((item) => item.value === context.value)?.ref.current;
    if (triggerNode) setActiveTrigger(triggerNode);
  }, [getItems, context.value]);

  /**
   * Update position when the indicator or parent track size changes
   */
  const handlePositionChange = () => {
    if (activeTrigger) {
      setPosition({
        size: isHorizontal ? activeTrigger.offsetWidth : activeTrigger.offsetHeight,
        offset: isHorizontal ? activeTrigger.offsetLeft : activeTrigger.offsetTop,
      });
    }
  };
  useResizeObserver(activeTrigger, handlePositionChange);
  useResizeObserver(context.indicatorTrack, handlePositionChange);

  // We need to wait for the indicator position to be available before rendering to
  // snap immediately into position rather than transitioning from initial
  return position ? (
    <Primitive.div
      aria-hidden
      data-state={isVisible ? 'visible' : 'hidden'}
      data-orientation={context.orientation}
      {...indicatorProps}
      ref={forwardedRef}
      style={{
        position: 'absolute',
        ...(isHorizontal
          ? {
              left: 0,
              width: position.size + 'px',
              transform: `translateX(${position.offset}px)`,
            }
          : {
              top: 0,
              height: position.size + 'px',
              transform: `translateY(${position.offset}px)`,
            }),
        ...indicatorProps.style,
      }}
    />
  ) : null;
});

/* -------------------------------------------------------------------------------------------------
 * NavigationMenuContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'NavigationMenuContent';

type NavigationMenuContentElement = NavigationMenuContentImplElement;
interface NavigationMenuContentProps
  extends Omit<NavigationMenuContentImplProps, keyof NavigationMenuContentImplPrivateProps> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const NavigationMenuContent = React.forwardRef<
  NavigationMenuContentElement,
  NavigationMenuContentProps
>((props: ScopedProps<NavigationMenuContentProps>, forwardedRef) => {
  const { forceMount, ...contentProps } = props;
  const context = useNavigationMenuContext(CONTENT_NAME, props.__scopeNavigationMenu);
  const itemContext = useNavigationMenuItemContext(CONTENT_NAME, props.__scopeNavigationMenu);
  const composedRefs = useComposedRefs(itemContext.contentRef, forwardedRef);
  const open = itemContext.value === context.value;

  const commonProps = {
    value: itemContext.value,
    triggerRef: itemContext.triggerRef,
    focusProxyRef: itemContext.focusProxyRef,
    wasEscapeCloseRef: itemContext.wasEscapeCloseRef,
    onContentFocusOutside: itemContext.onContentFocusOutside,
    onRootContentClose: itemContext.onRootContentClose,
    ...contentProps,
  };

  return !context.viewport ? (
    <Presence present={forceMount || open}>
      <NavigationMenuContentImpl
        data-state={getOpenState(open)}
        {...commonProps}
        ref={composedRefs}
        onPointerEnter={composeEventHandlers(props.onPointerEnter, context.onContentEnter)}
        onPointerLeave={composeEventHandlers(
          props.onPointerLeave,
          whenMouse(context.onContentLeave)
        )}
        style={{
          // Prevent interaction when animating out
          pointerEvents: !open && context.isRootMenu ? 'none' : undefined,
          ...commonProps.style,
        }}
      />
    </Presence>
  ) : (
    <ViewportContentMounter forceMount={forceMount} {...commonProps} ref={composedRefs} />
  );
});

NavigationMenuContent.displayName = CONTENT_NAME;

/* -----------------------------------------------------------------------------------------------*/

type ViewportContentMounterElement = NavigationMenuContentImplElement;
interface ViewportContentMounterProps extends NavigationMenuContentImplProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const ViewportContentMounter = React.forwardRef<
  ViewportContentMounterElement,
  ViewportContentMounterProps
>((props: ScopedProps<ViewportContentMounterProps>, forwardedRef) => {
  const context = useNavigationMenuContext(CONTENT_NAME, props.__scopeNavigationMenu);
  const { onViewportContentChange, onViewportContentRemove } = context;

  useLayoutEffect(() => {
    onViewportContentChange(props.value, {
      ref: forwardedRef,
      ...props,
    });
  }, [props, forwardedRef, onViewportContentChange]);

  useLayoutEffect(() => {
    return () => onViewportContentRemove(props.value);
  }, [props.value, onViewportContentRemove]);

  // Content is proxied into the viewport
  return null;
});

/* -----------------------------------------------------------------------------------------------*/

const ROOT_CONTENT_DISMISS = 'navigationMenu.rootContentDismiss';

type MotionAttribute = 'to-start' | 'to-end' | 'from-start' | 'from-end';
type NavigationMenuContentImplElement = React.ElementRef<typeof DismissableLayer>;
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>;

interface NavigationMenuContentImplPrivateProps {
  value: string;
  triggerRef: React.RefObject<NavigationMenuTriggerElement | null>;
  focusProxyRef: React.RefObject<FocusProxyElement | null>;
  wasEscapeCloseRef: React.MutableRefObject<boolean>;
  onContentFocusOutside(): void;
  onRootContentClose(): void;
}
interface NavigationMenuContentImplProps
  extends Omit<DismissableLayerProps, 'onDismiss' | 'disableOutsidePointerEvents'>,
    NavigationMenuContentImplPrivateProps {}

const NavigationMenuContentImpl = React.forwardRef<
  NavigationMenuContentImplElement,
  NavigationMenuContentImplProps
>((props: ScopedProps<NavigationMenuContentImplProps>, forwardedRef) => {
  const {
    __scopeNavigationMenu,
    value,
    triggerRef,
    focusProxyRef,
    wasEscapeCloseRef,
    onRootContentClose,
    onContentFocusOutside,
    ...contentProps
  } = props;
  const context = useNavigationMenuContext(CONTENT_NAME, __scopeNavigationMenu);
  const ref = React.useRef<NavigationMenuContentImplElement>(null);
  const composedRefs = useComposedRefs(ref, forwardedRef);
  const triggerId = makeTriggerId(context.baseId, value);
  const contentId = makeContentId(context.baseId, value);
  const getItems = useCollection(__scopeNavigationMenu);
  const prevMotionAttributeRef = React.useRef<MotionAttribute | null>(null);

  const { onItemDismiss } = context;

  React.useEffect(() => {
    const content = ref.current;

    // Bubble dismiss to the root content node and focus its trigger
    if (context.isRootMenu && content) {
      const handleClose = () => {
        onItemDismiss();
        onRootContentClose();
        if (content.contains(document.activeElement)) triggerRef.current?.focus();
      };
      content.addEventListener(ROOT_CONTENT_DISMISS, handleClose);
      return () => content.removeEventListener(ROOT_CONTENT_DISMISS, handleClose);
    }
  }, [context.isRootMenu, props.value, triggerRef, onItemDismiss, onRootContentClose]);

  const motionAttribute = React.useMemo(() => {
    const items = getItems();
    const values = items.map((item) => item.value);
    if (context.dir === 'rtl') values.reverse();
    const index = values.indexOf(context.value);
    const prevIndex = values.indexOf(context.previousValue);
    const isSelected = value === context.value;
    const wasSelected = prevIndex === values.indexOf(value);

    // We only want to update selected and the last selected content
    // this avoids animations being interrupted outside of that range
    if (!isSelected && !wasSelected) return prevMotionAttributeRef.current;

    const attribute = (() => {
      // Don't provide a direction on the initial open
      if (index !== prevIndex) {
        // If we're moving to this item from another
        if (isSelected && prevIndex !== -1) return index > prevIndex ? 'from-end' : 'from-start';
        // If we're leaving this item for another
        if (wasSelected && index !== -1) return index > prevIndex ? 'to-start' : 'to-end';
      }
      // Otherwise we're entering from closed or leaving the list
      // entirely and should not animate in any direction
      return null;
    })();

    prevMotionAttributeRef.current = attribute;
    return attribute;
  }, [context.previousValue, context.value, context.dir, getItems, value]);

  return (
    <FocusGroup asChild>
      <DismissableLayer
        id={contentId}
        aria-labelledby={triggerId}
        data-motion={motionAttribute}
        data-orientation={context.orientation}
        {...contentProps}
        ref={composedRefs}
        disableOutsidePointerEvents={false}
        onDismiss={() => {
          const rootContentDismissEvent = new Event(ROOT_CONTENT_DISMISS, {
            bubbles: true,
            cancelable: true,
          });
          ref.current?.dispatchEvent(rootContentDismissEvent);
        }}
        onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) => {
          onContentFocusOutside();
          const target = event.target as HTMLElement;
          // Only dismiss content when focus moves outside of the menu
          if (context.rootNavigationMenu?.contains(target)) event.preventDefault();
        })}
        onPointerDownOutside={composeEventHandlers(props.onPointerDownOutside, (event) => {
          const target = event.target as HTMLElement;
          const isTrigger = getItems().some((item) => item.ref.current?.contains(target));
          const isRootViewport = context.isRootMenu && context.viewport?.contains(target);
          if (isTrigger || isRootViewport || !context.isRootMenu) event.preventDefault();
        })}
        onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
          const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;
          const isTabKey = event.key === 'Tab' && !isMetaKey;
          if (isTabKey) {
            const candidates = getTabbableCandidates(event.currentTarget);
            const focusedElement = document.activeElement;
            const index = candidates.findIndex((candidate) => candidate === focusedElement);
            const isMovingBackwards = event.shiftKey;
            const nextCandidates = isMovingBackwards
              ? candidates.slice(0, index).reverse()
              : candidates.slice(index + 1, candidates.length);

            if (focusFirst(nextCandidates)) {
              // prevent browser tab keydown because we've handled focus
              event.preventDefault();
            } else {
              // If we can't focus that means we're at the edges
              // so focus the proxy and let browser handle
              // tab/shift+tab keypress on the proxy instead
              focusProxyRef.current?.focus();
            }
          }
        })}
        onEscapeKeyDown={composeEventHandlers(props.onEscapeKeyDown, (_event) => {
          // prevent the dropdown from reopening
          // after the escape key has been pressed
          wasEscapeCloseRef.current = true;
        })}
      />
    </FocusGroup>
  );
});

/* -------------------------------------------------------------------------------------------------
 * NavigationMenuViewport
 * -----------------------------------------------------------------------------------------------*/

const VIEWPORT_NAME = 'NavigationMenuViewport';

type NavigationMenuViewportElement = NavigationMenuViewportImplElement;
interface NavigationMenuViewportProps
  extends Omit<NavigationMenuViewportImplProps, 'activeContentValue'> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const NavigationMenuViewport = React.forwardRef<
  NavigationMenuViewportElement,
  NavigationMenuViewportProps
>((props: ScopedProps<NavigationMenuViewportProps>, forwardedRef) => {
  const { forceMount, ...viewportProps } = props;
  const context = useNavigationMenuContext(VIEWPORT_NAME, props.__scopeNavigationMenu);
  const open = Boolean(context.value);

  return (
    <Presence present={forceMount || open}>
      <NavigationMenuViewportImpl {...viewportProps} ref={forwardedRef} />
    </Presence>
  );
});

NavigationMenuViewport.displayName = VIEWPORT_NAME;

/* -----------------------------------------------------------------------------------------------*/

type NavigationMenuViewportImplElement = React.ElementRef<typeof Primitive.div>;
interface NavigationMenuViewportImplProps extends PrimitiveDivProps {}

const NavigationMenuViewportImpl = React.forwardRef<
  NavigationMenuViewportImplElement,
  NavigationMenuViewportImplProps
>((props: ScopedProps<NavigationMenuViewportImplProps>, forwardedRef) => {
  const { __scopeNavigationMenu, children, ...viewportImplProps } = props;
  const context = useNavigationMenuContext(VIEWPORT_NAME, __scopeNavigationMenu);
  const composedRefs = useComposedRefs(forwardedRef, context.onViewportChange);
  const viewportContentContext = useViewportContentContext(
    CONTENT_NAME,
    props.__scopeNavigationMenu
  );
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);
  const [content, setContent] = React.useState<NavigationMenuContentElement | null>(null);
  const viewportWidth = size ? size?.width + 'px' : undefined;
  const viewportHeight = size ? size?.height + 'px' : undefined;
  const open = Boolean(context.value);
  // We persist the last active content value as the viewport may be animating out
  // and we want the content to remain mounted for the lifecycle of the viewport.
  const activeContentValue = open ? context.value : context.previousValue;

  /**
   * Update viewport size to match the active content node.
   * We prefer offset dimensions over `getBoundingClientRect` as the latter respects CSS transform.
   * For example, if content animates in from `scale(0.5)` the dimensions would be anything
   * from `0.5` to `1` of the intended size.
   */
  const handleSizeChange = () => {
    if (content) setSize({ width: content.offsetWidth, height: content.offsetHeight });
  };
  useResizeObserver(content, handleSizeChange);

  return (
    <Primitive.div
      data-state={getOpenState(open)}
      data-orientation={context.orientation}
      {...viewportImplProps}
      ref={composedRefs}
      style={{
        // Prevent interaction when animating out
        pointerEvents: !open && context.isRootMenu ? 'none' : undefined,
        ['--radix-navigation-menu-viewport-width' as any]: viewportWidth,
        ['--radix-navigation-menu-viewport-height' as any]: viewportHeight,
        ...viewportImplProps.style,
      }}
      onPointerEnter={composeEventHandlers(props.onPointerEnter, context.onContentEnter)}
      onPointerLeave={composeEventHandlers(props.onPointerLeave, whenMouse(context.onContentLeave))}
    >
      {Array.from(viewportContentContext.items).map(([value, { ref, forceMount, ...props }]) => {
        const isActive = activeContentValue === value;
        return (
          <Presence key={value} present={forceMount || isActive}>
            <NavigationMenuContentImpl
              {...props}
              ref={composeRefs(ref, (node) => {
                // We only want to update the stored node when another is available
                // as we need to smoothly transition between them.
                if (isActive && node) setContent(node);
              })}
            />
          </Presence>
        );
      })}
    </Primitive.div>
  );
});

/* -----------------------------------------------------------------------------------------------*/

const FOCUS_GROUP_NAME = 'FocusGroup';

type FocusGroupElement = React.ElementRef<typeof Primitive.div>;
interface FocusGroupProps extends PrimitiveDivProps {}

const FocusGroup = React.forwardRef<FocusGroupElement, FocusGroupProps>(
  (props: ScopedProps<FocusGroupProps>, forwardedRef) => {
    const { __scopeNavigationMenu, ...groupProps } = props;
    const context = useNavigationMenuContext(FOCUS_GROUP_NAME, __scopeNavigationMenu);

    return (
      <FocusGroupCollection.Provider scope={__scopeNavigationMenu}>
        <FocusGroupCollection.Slot scope={__scopeNavigationMenu}>
          <Primitive.div dir={context.dir} {...groupProps} ref={forwardedRef} />
        </FocusGroupCollection.Slot>
      </FocusGroupCollection.Provider>
    );
  }
);

/* -----------------------------------------------------------------------------------------------*/

const ARROW_KEYS = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
const FOCUS_GROUP_ITEM_NAME = 'FocusGroupItem';

type FocusGroupItemElement = React.ElementRef<typeof Primitive.button>;
interface FocusGroupItemProps extends PrimitiveButtonProps {}

const FocusGroupItem = React.forwardRef<FocusGroupItemElement, FocusGroupItemProps>(
  (props: ScopedProps<FocusGroupItemProps>, forwardedRef) => {
    const { __scopeNavigationMenu, ...groupProps } = props;
    const getItems = useFocusGroupCollection(__scopeNavigationMenu);
    const context = useNavigationMenuContext(FOCUS_GROUP_ITEM_NAME, __scopeNavigationMenu);

    return (
      <FocusGroupCollection.ItemSlot scope={__scopeNavigationMenu}>
        <Primitive.button
          {...groupProps}
          ref={forwardedRef}
          onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
            const isFocusNavigationKey = ['Home', 'End', ...ARROW_KEYS].includes(event.key);
            if (isFocusNavigationKey) {
              let candidateNodes = getItems().map((item) => item.ref.current!);
              const prevItemKey = context.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
              const prevKeys = [prevItemKey, 'ArrowUp', 'End'];
              if (prevKeys.includes(event.key)) candidateNodes.reverse();
              if (ARROW_KEYS.includes(event.key)) {
                const currentIndex = candidateNodes.indexOf(event.currentTarget);
                candidateNodes = candidateNodes.slice(currentIndex + 1);
              }
              /**
               * Imperative focus during keydown is risky so we prevent React's batching updates
               * to avoid potential bugs. See: https://github.com/facebook/react/issues/20332
               */
              setTimeout(() => focusFirst(candidateNodes));

              // Prevent page scroll while navigating
              event.preventDefault();
            }
          })}
        />
      </FocusGroupCollection.ItemSlot>
    );
  }
);

/**
 * Returns a list of potential tabbable candidates.
 *
 * NOTE: This is only a close approximation. For example it doesn't take into account cases like when
 * elements are not visible. This cannot be worked out easily by just reading a property, but rather
 * necessitate runtime knowledge (computed styles, etc). We deal with these cases separately.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 * Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
 */
function getTabbableCandidates(container: HTMLElement) {
  const nodes: HTMLElement[] = [];
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: any) => {
      const isHiddenInput = node.tagName === 'INPUT' && node.type === 'hidden';
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
      // `.tabIndex` is not the same as the `tabindex` attribute. It works on the
      // runtime's understanding of tabbability, so this automatically accounts
      // for any kind of element that could be tabbed to.
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    },
  });
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement);
  // we do not take into account the order of nodes with positive `tabIndex` as it
  // hinders accessibility to have tab order different from visual order.
  return nodes;
}

function focusFirst(candidates: HTMLElement[]) {
  const previouslyFocusedElement = document.activeElement;
  return candidates.some((candidate) => {
    // if focus is already where we want to go, we don't want to keep going through the candidates
    if (candidate === previouslyFocusedElement) return true;
    candidate.focus();
    return document.activeElement !== previouslyFocusedElement;
  });
}

function removeFromTabOrder(candidates: HTMLElement[]) {
  candidates.forEach((candidate) => {
    candidate.dataset.tabindex = candidate.getAttribute('tabindex') || '';
    candidate.setAttribute('tabindex', '-1');
  });
  return () => {
    candidates.forEach((candidate) => {
      const prevTabIndex = candidate.dataset.tabindex as string;
      candidate.setAttribute('tabindex', prevTabIndex);
    });
  };
}

function useResizeObserver(element: HTMLElement | null, onResize: () => void) {
  const handleResize = useCallbackRef(onResize);
  useLayoutEffect(() => {
    let rAF = 0;
    if (element) {
      /**
       * Resize Observer will throw an often benign error that says `ResizeObserver loop
       * completed with undelivered notifications`. This means that ResizeObserver was not
       * able to deliver all observations within a single animation frame, so we use
       * `requestAnimationFrame` to ensure we don't deliver unnecessary observations.
       * Further reading: https://github.com/WICG/resize-observer/issues/38
       */
      const resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(rAF);
        rAF = window.requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(element);
      return () => {
        window.cancelAnimationFrame(rAF);
        resizeObserver.unobserve(element);
      };
    }
  }, [element, handleResize]);
}

function getOpenState(open: boolean) {
  return open ? 'open' : 'closed';
}

function makeTriggerId(baseId: string, value: string) {
  return `${baseId}-trigger-${value}`;
}

function makeContentId(baseId: string, value: string) {
  return `${baseId}-content-${value}`;
}

function whenMouse<E>(handler: React.PointerEventHandler<E>): React.PointerEventHandler<E> {
  return (event) => (event.pointerType === 'mouse' ? handler(event) : undefined);
}

/* -----------------------------------------------------------------------------------------------*/

const Root = NavigationMenu;
const Sub = NavigationMenuSub;
const List = NavigationMenuList;
const Item = NavigationMenuItem;
const Trigger = NavigationMenuTrigger;
const Link = NavigationMenuLink;
const Indicator = NavigationMenuIndicator;
const Content = NavigationMenuContent;
const Viewport = NavigationMenuViewport;

export {
  createNavigationMenuScope,
  //
  NavigationMenu,
  NavigationMenuSub,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuContent,
  NavigationMenuViewport,
  //
  Root,
  Sub,
  List,
  Item,
  Trigger,
  Link,
  Indicator,
  Content,
  Viewport,
};
export type {
  NavigationMenuProps,
  NavigationMenuSubProps,
  NavigationMenuListProps,
  NavigationMenuItemProps,
  NavigationMenuTriggerProps,
  NavigationMenuLinkProps,
  NavigationMenuIndicatorProps,
  NavigationMenuContentProps,
  NavigationMenuViewportProps,
};
