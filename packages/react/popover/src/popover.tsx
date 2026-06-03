import * as React from 'react';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { useFocusGuards } from '@radix-ui/react-focus-guards';
import {
  FocusScope,
  FocusScopeBranchProvider,
  useFocusScopeBranch,
  useFocusScopeBranchRegistry,
} from '@radix-ui/react-focus-scope';
import type { FocusScopeBranchRegistry } from '@radix-ui/react-focus-scope';
import { useId } from '@radix-ui/react-id';
import * as PopperPrimitive from '@radix-ui/react-popper';
import { createPopperScope } from '@radix-ui/react-popper';
import { Portal as PortalPrimitive } from '@radix-ui/react-portal';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import { createSlot } from '@radix-ui/react-slot';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { hideOthers } from 'aria-hidden';
import { RemoveScroll } from 'react-remove-scroll';

import type { Scope } from '@radix-ui/react-context';

/* -------------------------------------------------------------------------------------------------
 * Popover
 * -----------------------------------------------------------------------------------------------*/

const POPOVER_NAME = 'Popover';

type ScopedProps<P> = P & { __scopePopover?: Scope };
const [createPopoverContext, createPopoverScope] = createContextScope(POPOVER_NAME, [
  createPopperScope,
]);
const usePopperScope = createPopperScope();

interface PopoverContextValue {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentId: string;
  titleId: string;
  descriptionId: string;
  titlePresent: boolean;
  descriptionPresent: boolean;
  setTitleCount: React.Dispatch<React.SetStateAction<number>>;
  setDescriptionCount: React.Dispatch<React.SetStateAction<number>>;
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpenToggle(): void;
  hasCustomAnchor: boolean;
  onCustomAnchorAdd(): void;
  onCustomAnchorRemove(): void;
  modal: boolean;
}

const [PopoverProvider, usePopoverContext] =
  createPopoverContext<PopoverContextValue>(POPOVER_NAME);

interface PopoverProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

const Popover: React.FC<PopoverProps> = (props: ScopedProps<PopoverProps>) => {
  const {
    __scopePopover,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = false,
  } = props;
  const popperScope = usePopperScope(__scopePopover);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false);
  const [titleCount, setTitleCount] = React.useState(0);
  const [descriptionCount, setDescriptionCount] = React.useState(0);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: POPOVER_NAME,
  });

  return (
    <PopperPrimitive.Root {...popperScope}>
      <PopoverProvider
        scope={__scopePopover}
        contentId={useId()}
        titleId={useId()}
        descriptionId={useId()}
        titlePresent={titleCount > 0}
        descriptionPresent={descriptionCount > 0}
        setTitleCount={setTitleCount}
        setDescriptionCount={setDescriptionCount}
        triggerRef={triggerRef}
        open={open}
        onOpenChange={setOpen}
        onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
        hasCustomAnchor={hasCustomAnchor}
        onCustomAnchorAdd={React.useCallback(() => setHasCustomAnchor(true), [])}
        onCustomAnchorRemove={React.useCallback(() => setHasCustomAnchor(false), [])}
        modal={modal}
      >
        {children}
      </PopoverProvider>
    </PopperPrimitive.Root>
  );
};

/* -------------------------------------------------------------------------------------------------
 * PopoverAnchor
 * -----------------------------------------------------------------------------------------------*/

const ANCHOR_NAME = 'PopoverAnchor';

type PopoverAnchorElement = React.ComponentRef<typeof PopperPrimitive.Anchor>;
type PopperAnchorProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Anchor>;
interface PopoverAnchorProps extends PopperAnchorProps {}

const PopoverAnchor = /* @__PURE__ */ React.forwardRef<PopoverAnchorElement, PopoverAnchorProps>(
  function PopoverAnchor(props: ScopedProps<PopoverAnchorProps>, forwardedRef) {
    const { __scopePopover, ...anchorProps } = props;
    const context = usePopoverContext(ANCHOR_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);
    const { onCustomAnchorAdd, onCustomAnchorRemove } = context;

    React.useEffect(() => {
      onCustomAnchorAdd();
      return () => onCustomAnchorRemove();
    }, [onCustomAnchorAdd, onCustomAnchorRemove]);

    return <PopperPrimitive.Anchor {...popperScope} {...anchorProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * PopoverTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'PopoverTrigger';

type PopoverTriggerElement = React.ComponentRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface PopoverTriggerProps extends PrimitiveButtonProps {}

const PopoverTrigger = /* @__PURE__ */ React.forwardRef<PopoverTriggerElement, PopoverTriggerProps>(
  function PopoverTrigger(props: ScopedProps<PopoverTriggerProps>, forwardedRef) {
    const { __scopePopover, ...triggerProps } = props;
    const context = usePopoverContext(TRIGGER_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

    const trigger = (
      <Primitive.button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.open ? context.contentId : undefined}
        data-state={getState(context.open)}
        {...triggerProps}
        ref={composedTriggerRef}
        onClick={composeEventHandlers(props.onClick, context.onOpenToggle)}
      />
    );

    return context.hasCustomAnchor ? (
      trigger
    ) : (
      <PopperPrimitive.Anchor asChild {...popperScope}>
        {trigger}
      </PopperPrimitive.Anchor>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * PopoverPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'PopoverPortal';

type PortalContextValue = { forceMount?: true };
const [PortalProvider, usePortalContext] = createPopoverContext<PortalContextValue>(PORTAL_NAME, {
  forceMount: undefined,
});

type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>;
interface PopoverPortalProps {
  children?: React.ReactNode;
  /**
   * Specify a container element to portal the content into.
   */
  container?: PortalProps['container'];
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const PopoverPortal: React.FC<PopoverPortalProps> = (props: ScopedProps<PopoverPortalProps>) => {
  const { __scopePopover, forceMount, children, container } = props;
  const context = usePopoverContext(PORTAL_NAME, __scopePopover);
  return (
    <PortalProvider scope={__scopePopover} forceMount={forceMount}>
      <Presence present={forceMount || context.open}>
        <PortalPrimitive asChild container={container}>
          {children}
        </PortalPrimitive>
      </Presence>
    </PortalProvider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'PopoverContent';

interface PopoverContentProps extends PopoverContentTypeProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const PopoverContent = /* @__PURE__ */ React.forwardRef<
  PopoverContentTypeElement,
  PopoverContentProps
>(
  // blank line to reduce diff noise
  function PopoverContent(props: ScopedProps<PopoverContentProps>, forwardedRef) {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopePopover);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
    return (
      <Presence present={forceMount || context.open}>
        {context.modal ? (
          <PopoverContentModal {...contentProps} ref={forwardedRef} />
        ) : (
          <PopoverContentNonModal {...contentProps} ref={forwardedRef} />
        )}
      </Presence>
    );
  },
);

/* -----------------------------------------------------------------------------------------------*/

const Slot = createSlot('PopoverContent.RemoveScroll');

type PopoverContentTypeElement = PopoverContentImplElement;
interface PopoverContentTypeProps extends Omit<
  PopoverContentImplProps,
  'trapFocus' | 'disableOutsidePointerEvents' | 'branchRegistry' | 'branchNodes'
> {}

const PopoverContentModal = /* @__PURE__ */ React.forwardRef<
  PopoverContentTypeElement,
  PopoverContentTypeProps
>(
  // blank line to reduce diff noise
  function PopoverContentModal(props: ScopedProps<PopoverContentTypeProps>, forwardedRef) {
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const isRightClickOutsideRef = React.useRef(false);

    // Allows nested portalled layers to register themselves as branches of this
    // modal `Popover` so focus isn't reclaimed and scroll isn't locked for
    // them. See: https://github.com/radix-ui/primitives/issues/3423
    const { nodes: branchNodes, registry: branchRegistry } = useFocusScopeBranchRegistry();

    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    React.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);

    return (
      <RemoveScroll
        as={Slot}
        allowPinchZoom
        shards={[contentRef, ...branchNodes.map((node) => ({ current: node }))]}
      >
        <PopoverContentImpl
          {...props}
          ref={composedRefs}
          branchNodes={branchNodes}
          branchRegistry={branchRegistry}
          // we make sure we're not trapping once it's been closed
          // (closed !== unmounted when animating out)
          trapFocus={context.open}
          disableOutsidePointerEvents
          onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
            event.preventDefault();
            if (!isRightClickOutsideRef.current) context.triggerRef.current?.focus();
          })}
          onPointerDownOutside={composeEventHandlers(
            props.onPointerDownOutside,
            (event) => {
              const originalEvent = event.detail.originalEvent;
              const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
              const isRightClick = originalEvent.button === 2 || ctrlLeftClick;

              isRightClickOutsideRef.current = isRightClick;
            },
            { checkForDefaultPrevented: false },
          )}
          // When focus is trapped, a `focusout` event may still happen.
          // We make sure we don't trigger our `onDismiss` in such case.
          onFocusOutside={composeEventHandlers(
            props.onFocusOutside,
            (event) => event.preventDefault(),
            { checkForDefaultPrevented: false },
          )}
        />
      </RemoveScroll>
    );
  },
);

const PopoverContentNonModal = /* @__PURE__ */ React.forwardRef<
  PopoverContentTypeElement,
  PopoverContentTypeProps
>(
  // blank line to reduce diff noise
  function PopoverContentNonModal(props: ScopedProps<PopoverContentTypeProps>, forwardedRef) {
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover);
    const hasInteractedOutsideRef = React.useRef(false);
    const hasPointerDownOutsideRef = React.useRef(false);

    return (
      <PopoverContentImpl
        {...props}
        ref={forwardedRef}
        trapFocus={false}
        disableOutsidePointerEvents={false}
        onCloseAutoFocus={(event) => {
          props.onCloseAutoFocus?.(event);

          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
            // Always prevent auto focus because we either focus manually or want user agent focus
            event.preventDefault();
          }

          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        }}
        onInteractOutside={(event) => {
          props.onInteractOutside?.(event);

          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === 'pointerdown') {
              hasPointerDownOutsideRef.current = true;
            }
          }

          // Prevent dismissing when clicking the trigger.
          // As the trigger is already setup to close, without doing so would
          // cause it to close and immediately open.
          const target = event.target as HTMLElement;
          const targetIsTrigger = context.triggerRef.current?.contains(target);
          if (targetIsTrigger) event.preventDefault();

          // On Safari if the trigger is inside a container with tabIndex={0}, when clicked
          // we will get the pointer down outside event on the trigger, but then a subsequent
          // focus outside event on the container, we ignore any focus outside event when we've
          // already had a pointer down outside event.
          if (event.detail.originalEvent.type === 'focusin' && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }}
      />
    );
  },
);

/* -----------------------------------------------------------------------------------------------*/

type PopoverContentImplElement = React.ComponentRef<typeof PopperPrimitive.Content>;
type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>;
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>;
type PopperContentProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Content>;
interface PopoverContentImplProps
  extends Omit<PopperContentProps, 'onPlaced'>, Omit<DismissableLayerProps, 'onDismiss'> {
  /**
   * Whether focus should be trapped within the `Popover`
   * (default: false)
   */
  trapFocus?: FocusScopeProps['trapped'];

  /**
   * Event handler called when auto-focusing on open.
   * Can be prevented.
   */
  onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'];

  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'];

  /**
   * Branch nodes registered by nested, portalled layers. Passed to the trapped
   * `FocusScope` so focus isn't reclaimed from them. Only provided by the modal
   * variant.
   * @internal
   */
  branchNodes?: HTMLElement[];

  /**
   * Registry that nested, portalled layers use to register themselves as branches of this modal
   * `Popover`. Only provided by the modal variant.
   * @internal
   */
  branchRegistry?: FocusScopeBranchRegistry;
}

const PopoverContentImpl = /* @__PURE__ */ React.forwardRef<
  PopoverContentImplElement,
  PopoverContentImplProps
>(
  // blank line to reduce diff noise
  function PopoverContentImpl(props: ScopedProps<PopoverContentImplProps>, forwardedRef) {
    const {
      __scopePopover,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      'aria-describedby': ariaDescribedby,
      branchNodes,
      branchRegistry,
      children,
      ...contentProps
    } = props;
    const context = usePopoverContext(CONTENT_NAME, __scopePopover);
    const popperScope = usePopperScope(__scopePopover);

    // When this `Popover` is nested inside a modal layer (eg. a `Dialog`) but
    // portalled outside of it, register its content with the ancestor layer so
    // focus isn't reclaimed and scroll isn't locked for it. No-ops when there
    // is no ancestor layer. See:
    // https://github.com/radix-ui/primitives/issues/3423
    const [contentNode, setContentNode] = React.useState<PopoverContentImplElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, setContentNode);
    useFocusScopeBranch(contentNode);

    // Make sure the whole tree has focus guards as our `Popover` may be
    // the last element in the DOM (because of the `Portal`)
    useFocusGuards();

    return (
      <FocusScope
        asChild
        loop
        trapped={trapFocus}
        branches={branchNodes}
        onMountAutoFocus={onOpenAutoFocus}
        onUnmountAutoFocus={onCloseAutoFocus}
      >
        <DismissableLayer
          asChild
          disableOutsidePointerEvents={disableOutsidePointerEvents}
          onInteractOutside={onInteractOutside}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={onPointerDownOutside}
          onFocusOutside={onFocusOutside}
          onDismiss={() => context.onOpenChange(false)}
          deferPointerDownOutside
        >
          <PopperPrimitive.Content
            data-state={getState(context.open)}
            role="dialog"
            id={context.contentId}
            aria-labelledby={context.titlePresent ? context.titleId : undefined}
            aria-describedby={
              context.descriptionPresent
                ? concatAriaDescribedby(ariaDescribedby, context.descriptionId)
                : ariaDescribedby
            }
            {...popperScope}
            {...contentProps}
            ref={composedRefs}
            style={{
              ...contentProps.style,
              // re-namespace exposed content custom properties
              ...{
                '--radix-popover-content-transform-origin': 'var(--radix-popper-transform-origin)',
                '--radix-popover-content-available-width': 'var(--radix-popper-available-width)',
                '--radix-popover-content-available-height': 'var(--radix-popper-available-height)',
                '--radix-popover-trigger-width': 'var(--radix-popper-anchor-width)',
                '--radix-popover-trigger-height': 'var(--radix-popper-anchor-height)',
              },
            }}
          >
            {branchRegistry ? (
              <FocusScopeBranchProvider value={branchRegistry}>{children}</FocusScopeBranchProvider>
            ) : (
              children
            )}
          </PopperPrimitive.Content>
        </DismissableLayer>
      </FocusScope>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * PopoverTitle
 * -----------------------------------------------------------------------------------------------*/

type PopoverTitleElement = React.ComponentRef<typeof Primitive.h2>;
type PrimitiveHeading2Props = React.ComponentPropsWithoutRef<typeof Primitive.h2>;
interface PopoverTitleProps extends PrimitiveHeading2Props {}

const PopoverTitle = /* @__PURE__ */ React.forwardRef<PopoverTitleElement, PopoverTitleProps>(
  function PopoverTitle(props: ScopedProps<PopoverTitleProps>, forwardedRef) {
    const { __scopePopover, ...titleProps } = props;
    const context = usePopoverContext('PopoverTitle', __scopePopover);
    const { setTitleCount } = context;
    useLayoutEffect(() => {
      setTitleCount((count) => count + 1);
      return () => setTitleCount((count) => count - 1);
    }, [setTitleCount]);

    return <Primitive.h2 id={context.titleId} {...titleProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * PopoverDescription
 * -----------------------------------------------------------------------------------------------*/

type PopoverDescriptionElement = React.ComponentRef<typeof Primitive.p>;
type PrimitiveParagraphProps = React.ComponentPropsWithoutRef<typeof Primitive.p>;
interface PopoverDescriptionProps extends PrimitiveParagraphProps {}

const PopoverDescription = /* @__PURE__ */ React.forwardRef<
  PopoverDescriptionElement,
  PopoverDescriptionProps
>(function PopoverDescription(props: ScopedProps<PopoverDescriptionProps>, forwardedRef) {
  const { __scopePopover, ...descriptionProps } = props;
  const context = usePopoverContext('PopoverDescription', __scopePopover);
  const { setDescriptionCount } = context;
  useLayoutEffect(() => {
    setDescriptionCount((count) => count + 1);
    return () => setDescriptionCount((count) => count - 1);
  }, [setDescriptionCount]);

  return <Primitive.p id={context.descriptionId} {...descriptionProps} ref={forwardedRef} />;
});

/* -------------------------------------------------------------------------------------------------
 * PopoverClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'PopoverClose';

type PopoverCloseElement = React.ComponentRef<typeof Primitive.button>;
interface PopoverCloseProps extends PrimitiveButtonProps {}

const PopoverClose = /* @__PURE__ */ React.forwardRef<PopoverCloseElement, PopoverCloseProps>(
  function PopoverClose(props: ScopedProps<PopoverCloseProps>, forwardedRef) {
    const { __scopePopover, ...closeProps } = props;
    const context = usePopoverContext(CLOSE_NAME, __scopePopover);
    return (
      <Primitive.button
        type="button"
        {...closeProps}
        ref={forwardedRef}
        onClick={composeEventHandlers(props.onClick, () => context.onOpenChange(false))}
      />
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * PopoverArrow
 * -----------------------------------------------------------------------------------------------*/

type PopoverArrowElement = React.ComponentRef<typeof PopperPrimitive.Arrow>;
type PopperArrowProps = React.ComponentPropsWithoutRef<typeof PopperPrimitive.Arrow>;
interface PopoverArrowProps extends PopperArrowProps {}

const PopoverArrow = /* @__PURE__ */ React.forwardRef<PopoverArrowElement, PopoverArrowProps>(
  function PopoverArrow(props: ScopedProps<PopoverArrowProps>, forwardedRef) {
    const { __scopePopover, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopePopover);
    return <PopperPrimitive.Arrow {...popperScope} {...arrowProps} ref={forwardedRef} />;
  },
);

/* -----------------------------------------------------------------------------------------------*/

function getState(open: boolean) {
  return open ? 'open' : 'closed';
}

// TODO: Move to primitive once that package exposed individual sub-modules
function concatAriaDescribedby(...values: unknown[]): string | undefined {
  const ids = new Set<string>();
  for (const value of values) {
    if (typeof value !== 'string') continue;
    for (const id of String(value).trim().split(/\s+/)) {
      if (id) ids.add(id);
    }
  }

  return ids.size > 0 ? Array.from(ids).join(' ') : undefined;
}

export {
  createPopoverScope,
  //
  Popover,
  PopoverAnchor,
  PopoverTrigger,
  PopoverPortal,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
  PopoverArrow,
  //
  Popover as Root,
  PopoverAnchor as Anchor,
  PopoverTrigger as Trigger,
  PopoverPortal as Portal,
  PopoverContent as Content,
  PopoverTitle as Title,
  PopoverDescription as Description,
  PopoverClose as Close,
  PopoverArrow as Arrow,
};
export type {
  PopoverProps,
  PopoverAnchorProps,
  PopoverTriggerProps,
  PopoverPortalProps,
  PopoverContentProps,
  PopoverTitleProps,
  PopoverDescriptionProps,
  PopoverCloseProps,
  PopoverArrowProps,
};
