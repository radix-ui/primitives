import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContextScope } from '@radix-ui/react-context';
import { useId } from '@radix-ui/react-id';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { DismissableLayer, useDismissableLayerSurface } from '@radix-ui/react-dismissable-layer';
import {
  FocusScope,
  FocusScopeBranchProvider,
  useFocusScopeBranchRegistry,
} from '@radix-ui/react-focus-scope';
import { Portal as PortalPrimitive } from '@radix-ui/react-portal';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import { useFocusGuards } from '@radix-ui/react-focus-guards';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';
import { createSlot } from '@radix-ui/react-slot';

import type { Scope } from '@radix-ui/react-context';
import type { FocusScopeBranchRegistry } from '@radix-ui/react-focus-scope';
import { IS_DEVELOPMENT } from '@radix-ui/env-check/is-development';

/* -------------------------------------------------------------------------------------------------
 * Dialog
 * -----------------------------------------------------------------------------------------------*/

const DIALOG_NAME = 'Dialog';

type ScopedProps<P> = P & { __scopeDialog?: Scope | undefined };
const [createDialogContext, createDialogScope] = createContextScope(DIALOG_NAME);

interface DialogContextValue {
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<DialogContentElement | null>;
  contentId: string;
  setContentId: React.Dispatch<React.SetStateAction<string | undefined>>;
  titleId: string;
  titlePresent: boolean;
  descriptionPresent: boolean;
  setTitleCount: React.Dispatch<React.SetStateAction<number>>;
  setTitleId: React.Dispatch<React.SetStateAction<string | undefined>>;
  descriptionIds: Set<string>;
  setDescriptionIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpenToggle(): void;
  modal: boolean;
  // Nodes of nested, portalled layers (eg. a non-modal `Popover`) that should
  // be treated as part of this Dialog for focus trapping and scroll locking.
  // See https://github.com/radix-ui/primitives/issues/3423
  branchNodes: HTMLElement[];
  branchRegistry: FocusScopeBranchRegistry;
}

const [DialogProvider, useDialogContext] = createDialogContext<DialogContextValue>(DIALOG_NAME);

interface DialogProps {
  children?: React.ReactNode | undefined;
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: { bivarianceHack(open: boolean): void }['bivarianceHack'] | undefined;
  modal?: boolean | undefined;
}

const Dialog: React.FC<DialogProps> = (props: ScopedProps<DialogProps>) => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true,
  } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<DialogContentElement>(null);
  const { nodes: branchNodes, registry: branchRegistry } = useFocusScopeBranchRegistry();
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DIALOG_NAME,
  });

  const defaultTitleId = useId();
  const defaultContentId = useId();
  const [titleId, setTitleId] = React.useState<string | undefined>(defaultTitleId);
  const [contentId, setContentId] = React.useState<string | undefined>(defaultContentId);
  const [descriptionIds, setDescriptionIds] = React.useState(() => new Set<string>());

  const [titleCount, setTitleCount] = React.useState(0);
  if (IS_DEVELOPMENT) {
    const hasMultipleTitles = titleCount > 1;
    // oxlint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (hasMultipleTitles) {
        console.warn(
          'Dialog has multiple titles. This is not supported and will lead to accessibility issues.',
        );
      }
    }, [hasMultipleTitles]);
  }

  return (
    <DialogProvider
      scope={__scopeDialog}
      triggerRef={triggerRef}
      contentRef={contentRef}
      contentId={contentId || defaultContentId}
      setContentId={setContentId}
      titleId={titleId || defaultTitleId}
      setTitleId={setTitleId}
      descriptionIds={descriptionIds}
      setDescriptionIds={setDescriptionIds}
      titlePresent={titleCount > 0}
      descriptionPresent={descriptionIds.size > 0}
      setTitleCount={setTitleCount}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
      modal={modal}
      branchNodes={branchNodes}
      branchRegistry={branchRegistry}
    >
      {children}
    </DialogProvider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * DialogTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'DialogTrigger';

type DialogTriggerElement = React.ComponentRef<typeof Primitive.button>;
type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;
interface DialogTriggerProps extends PrimitiveButtonProps {}

const DialogTrigger = /* @__PURE__ */ React.forwardRef<DialogTriggerElement, DialogTriggerProps>(
  function DialogTrigger(props: ScopedProps<DialogTriggerProps>, forwardedRef) {
    const { __scopeDialog, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    return (
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
  },
);

/* -------------------------------------------------------------------------------------------------
 * DialogPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'DialogPortal';

type PortalContextValue = { forceMount?: true | undefined };
const [PortalProvider, usePortalContext] = createDialogContext<PortalContextValue>(PORTAL_NAME, {
  forceMount: undefined,
});

type PortalProps = React.ComponentPropsWithoutRef<typeof PortalPrimitive>;
interface DialogPortalProps {
  children?: React.ReactNode | undefined;
  /**
   * Specify a container element to portal the content into.
   */
  container?: PortalProps['container'] | undefined;
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true | undefined;
}

const DialogPortal: React.FC<DialogPortalProps> = (props: ScopedProps<DialogPortalProps>) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME, __scopeDialog);
  return (
    <PortalProvider scope={__scopeDialog} forceMount={forceMount}>
      {React.Children.map(children, (child) => (
        <Presence present={forceMount || context.open}>
          <PortalPrimitive asChild container={container}>
            {child}
          </PortalPrimitive>
        </Presence>
      ))}
    </PortalProvider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'DialogOverlay';

type DialogOverlayElement = DialogOverlayImplElement;
interface DialogOverlayProps extends DialogOverlayImplProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true | undefined;
}

const DialogOverlay = /* @__PURE__ */ React.forwardRef<DialogOverlayElement, DialogOverlayProps>(
  function DialogOverlay(props: ScopedProps<DialogOverlayProps>, forwardedRef) {
    const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
    return context.modal ? (
      <Presence present={forceMount || context.open}>
        <DialogOverlayImpl {...overlayProps} ref={forwardedRef} />
      </Presence>
    ) : null;
  },
);

type DialogOverlayImplElement = React.ComponentRef<typeof Primitive.div>;
type PrimitiveDivProps = React.ComponentPropsWithoutRef<typeof Primitive.div>;
interface DialogOverlayImplProps extends PrimitiveDivProps {}

const Slot = createSlot('DialogOverlay.RemoveScroll');

const DialogOverlayImpl = /* @__PURE__ */ React.forwardRef<
  DialogOverlayImplElement,
  DialogOverlayImplProps
>(
  // blank line to reduce diff noise
  function DialogOverlayImpl(props: ScopedProps<DialogOverlayImplProps>, forwardedRef) {
    const { __scopeDialog, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog);

    // Register the overlay as a dismiss surface so a consumer calling
    // `stopPropagation` on it (eg. to avoid triggering parent handlers) does not
    // prevent the dialog from closing. See: https://github.com/radix-ui/primitives/issues/3346
    const registerDismissableSurface = useDismissableLayerSurface();
    const composedRefs = useComposedRefs(forwardedRef, registerDismissableSurface);

    return (
      // Make sure `Content` is scrollable even when it doesn't live inside
      // `RemoveScroll` (eg. when `Overlay` and `Content` are siblings). Nested
      // layers are registered as branches and added as shards so they remain
      // scrollable too. See https://github.com/radix-ui/primitives/issues/3423
      <RemoveScroll
        as={Slot}
        allowPinchZoom
        shards={React.useMemo(
          () => [context.contentRef, ...context.branchNodes.map((node) => ({ current: node }))],
          [context.contentRef, context.branchNodes],
        )}
      >
        <Primitive.div
          data-state={getState(context.open)}
          {...overlayProps}
          ref={composedRefs}
          // We re-enable pointer-events prevented by `Dialog.Content` to allow scrolling the overlay.
          style={{ pointerEvents: 'auto', ...overlayProps.style }}
        />
      </RemoveScroll>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DialogContent';

type DialogContentElement = DialogContentTypeElement;
interface DialogContentProps extends DialogContentTypeProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true | undefined;
}

const DialogContent = /* @__PURE__ */ React.forwardRef<DialogContentElement, DialogContentProps>(
  function DialogContent(props: ScopedProps<DialogContentProps>, forwardedRef) {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    return (
      <Presence present={forceMount || context.open}>
        {context.modal ? (
          <DialogContentModal {...contentProps} ref={forwardedRef} />
        ) : (
          <DialogContentNonModal {...contentProps} ref={forwardedRef} />
        )}
      </Presence>
    );
  },
);

/* -----------------------------------------------------------------------------------------------*/

type DialogContentTypeElement = DialogContentImplElement;
interface DialogContentTypeProps extends Omit<
  DialogContentImplProps,
  'trapFocus' | 'disableOutsidePointerEvents'
> {}

const DialogContentModal = /* @__PURE__ */ React.forwardRef<
  DialogContentTypeElement,
  DialogContentTypeProps
>(
  // blank line to reduce diff noise
  function DialogContentModal(props: ScopedProps<DialogContentTypeProps>, forwardedRef) {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);

    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    React.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);

    return (
      <DialogContentImpl
        {...props}
        ref={composedRefs}
        // we make sure focus isn't trapped once `DialogContent` has been closed
        // (closed !== unmounted when animating out)
        trapFocus={context.open}
        disableOutsidePointerEvents={context.open}
        onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
          event.preventDefault();
          context.triggerRef.current?.focus();
        })}
        onPointerDownOutside={composeEventHandlers(props.onPointerDownOutside, (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;

          // If the event is a right-click, we shouldn't close because
          // it is effectively as if we right-clicked the `Overlay`.
          if (isRightClick) event.preventDefault();
        })}
        // When focus is trapped, a `focusout` event may still happen.
        // We make sure we don't trigger our `onDismiss` in such case.
        onFocusOutside={composeEventHandlers(props.onFocusOutside, (event) =>
          event.preventDefault(),
        )}
      />
    );
  },
);

/* -----------------------------------------------------------------------------------------------*/

const DialogContentNonModal = /* @__PURE__ */ React.forwardRef<
  DialogContentTypeElement,
  DialogContentTypeProps
>(
  // blank line to reduce diff noise
  function DialogContentNonModal(props: ScopedProps<DialogContentTypeProps>, forwardedRef) {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const hasInteractedOutsideRef = React.useRef(false);
    const hasPointerDownOutsideRef = React.useRef(false);

    return (
      <DialogContentImpl
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

type DialogContentImplElement = React.ComponentRef<typeof DismissableLayer>;
type DismissableLayerProps = React.ComponentPropsWithoutRef<typeof DismissableLayer>;
type FocusScopeProps = React.ComponentPropsWithoutRef<typeof FocusScope>;
interface DialogContentImplProps extends Omit<DismissableLayerProps, 'onDismiss'> {
  /**
   * When `true`, focus cannot escape the `Content` via keyboard,
   * pointer, or a programmatic focus.
   * @defaultValue false
   */
  trapFocus?: FocusScopeProps['trapped'] | undefined;

  /**
   * Event handler called when auto-focusing on open.
   * Can be prevented.
   */
  onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus'] | undefined;

  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'] | undefined;
}

const DialogContentImpl = /* @__PURE__ */ React.forwardRef<
  DialogContentImplElement,
  DialogContentImplProps
>(
  // blank line to reduce diff noise
  function DialogContentImpl(props: ScopedProps<DialogContentImplProps>, forwardedRef) {
    const {
      __scopeDialog,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      'aria-describedby': ariaDescribedby,
      children,
      id: idProp,
      ...contentProps
    } = props;
    const context = useDialogContext(CONTENT_NAME, __scopeDialog);

    // Make sure the whole tree has focus guards as our `Dialog` will be
    // the last element in the DOM (because of the `Portal`)
    useFocusGuards();

    const { setContentId } = context;
    useLayoutEffect(() => {
      setContentId(toValidId(idProp) || undefined);
      return () => setContentId(undefined);
    }, [idProp, setContentId]);

    return (
      <FocusScopeBranchProvider registry={context.branchRegistry}>
        <FocusScope
          asChild
          loop
          trapped={trapFocus}
          branches={context.branchNodes}
          onMountAutoFocus={onOpenAutoFocus}
          onUnmountAutoFocus={onCloseAutoFocus}
        >
          <DismissableLayer
            role="dialog"
            id={context.contentId}
            aria-labelledby={context.titlePresent ? context.titleId : undefined}
            aria-describedby={
              context.descriptionPresent
                ? concatAriaDescribedby(ariaDescribedby, ...context.descriptionIds)
                : ariaDescribedby
            }
            data-state={getState(context.open)}
            {...contentProps}
            ref={forwardedRef}
            deferPointerDownOutside
            onDismiss={() => context.onOpenChange(false)}
          >
            {children}
          </DismissableLayer>
        </FocusScope>
      </FocusScopeBranchProvider>
    );
  },
);

/* -------------------------------------------------------------------------------------------------
 * DialogTitle
 * -----------------------------------------------------------------------------------------------*/

type DialogTitleElement = React.ComponentRef<typeof Primitive.h2>;
type PrimitiveHeading2Props = React.ComponentPropsWithoutRef<typeof Primitive.h2>;
interface DialogTitleProps extends PrimitiveHeading2Props {}

const DialogTitle = /* @__PURE__ */ React.forwardRef<DialogTitleElement, DialogTitleProps>(
  function DialogTitle(props: ScopedProps<DialogTitleProps>, forwardedRef) {
    const { __scopeDialog, id: idProp, ...titleProps } = props;
    const context = useDialogContext('DialogTitle', __scopeDialog);
    const { setTitleCount, setTitleId } = context;
    useLayoutEffect(() => {
      setTitleCount((count) => count + 1);
      return () => setTitleCount((count) => count - 1);
    }, [setTitleCount]);
    useLayoutEffect(() => {
      setTitleId(toValidId(idProp) || undefined);
      return () => setTitleId(undefined);
    }, [idProp, setTitleId]);
    return <Primitive.h2 id={context.titleId} {...titleProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * DialogDescription
 * -----------------------------------------------------------------------------------------------*/

type DialogDescriptionElement = React.ComponentRef<typeof Primitive.p>;
type PrimitiveParagraphProps = React.ComponentPropsWithoutRef<typeof Primitive.p>;
interface DialogDescriptionProps extends PrimitiveParagraphProps {}

const DialogDescription = /* @__PURE__ */ React.forwardRef<
  DialogDescriptionElement,
  DialogDescriptionProps
>(
  // blank line to reduce diff noise
  function DialogDescription(props: ScopedProps<DialogDescriptionProps>, forwardedRef) {
    const { __scopeDialog, id: idProp, ...descriptionProps } = props;
    const context = useDialogContext('DialogDescription', __scopeDialog);
    const { setDescriptionIds } = context;

    const generatedId = useId();
    const id = toValidId(idProp) || generatedId;

    useLayoutEffect(() => {
      setDescriptionIds((descriptionIds) => {
        if (descriptionIds.has(id)) {
          return descriptionIds;
        }

        const newDescriptionIds = new Set(descriptionIds);
        newDescriptionIds.add(id);
        return newDescriptionIds;
      });
      return () => {
        setDescriptionIds((descriptionIds) => {
          const newDescriptionIds = new Set(descriptionIds);
          newDescriptionIds.delete(id);
          return newDescriptionIds.size === descriptionIds.size
            ? descriptionIds
            : newDescriptionIds;
        });
      };
    }, [setDescriptionIds, id]);

    return <Primitive.p id={id} {...descriptionProps} ref={forwardedRef} />;
  },
);

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'DialogClose';

type DialogCloseElement = React.ComponentRef<typeof Primitive.button>;
interface DialogCloseProps extends PrimitiveButtonProps {}

const DialogClose = /* @__PURE__ */ React.forwardRef<DialogCloseElement, DialogCloseProps>(
  function DialogClose(props: ScopedProps<DialogCloseProps>, forwardedRef) {
    const { __scopeDialog, ...closeProps } = props;
    const context = useDialogContext(CLOSE_NAME, __scopeDialog);
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

/** @deprecated Noop component to avoid breaking changes. */
export const WarningProvider: React.FC<
  ScopedProps<{
    children?: React.ReactNode | undefined;
    contentName: string;
    titleName: string;
    docsSlug: 'dialog';
  }>
> = (props) => {
  return props.children;
};

/* -----------------------------------------------------------------------------------------------*/

// TODO: Move to primitive once that package exposed individual sub-modules
function concatAriaDescribedby(...values: (string | null | undefined)[]): string | undefined {
  const ids = new Set<string>();
  for (const value of values) {
    if (typeof value !== 'string') {
      continue;
    }
    for (const id of value.trim().split(/\s+/)) {
      if (id) {
        ids.add(id);
      }
    }
  }

  return ids.size > 0 ? Array.from(ids).join(' ') : undefined;
}

function getState(open: boolean) {
  return open ? 'open' : 'closed';
}

function toValidId(value: number | string | undefined) {
  // We type id's internally as strings, but in some version of React's types a
  // number can be passed without type errors.
  if (typeof value === 'number') {
    return String(value);
  }
  return value;
}

export {
  createDialogScope,
  //
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  //
  Dialog as Root,
  DialogTrigger as Trigger,
  DialogPortal as Portal,
  DialogOverlay as Overlay,
  DialogContent as Content,
  DialogTitle as Title,
  DialogDescription as Description,
  DialogClose as Close,
};
export type {
  DialogProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
};
