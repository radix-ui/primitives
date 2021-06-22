import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext } from '@radix-ui/react-context';
import { useId } from '@radix-ui/react-id';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { DismissableLayer } from '@radix-ui/react-dismissable-layer';
import { FocusScope } from '@radix-ui/react-focus-scope';
import { Portal } from '@radix-ui/react-portal';
import { Presence } from '@radix-ui/react-presence';
import { Primitive } from '@radix-ui/react-primitive';
import { Slot } from '@radix-ui/react-slot';
import { useFocusGuards } from '@radix-ui/react-focus-guards';
import { RemoveScroll } from 'react-remove-scroll';
import { hideOthers } from 'aria-hidden';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * Dialog
 * -----------------------------------------------------------------------------------------------*/

const DIALOG_NAME = 'Dialog';

type DialogContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>;
  contentId: string;
  descriptionId: string;
  titleId: string;
  open: boolean;
  onOpenChange(open: boolean): void;
};

const [DialogProvider, useDialogContext] = createContext<DialogContextValue>(DIALOG_NAME);

type DialogOwnProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
};

const Dialog: React.FC<DialogOwnProps> = (props) => {
  const { children, open: openProp, defaultOpen, onOpenChange } = props;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <DialogProvider
      triggerRef={triggerRef}
      contentId={useId()}
      descriptionId={useId()}
      titleId={useId()}
      open={open}
      onOpenChange={setOpen}
    >
      {children}
    </DialogProvider>
  );
};

Dialog.displayName = DIALOG_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'DialogTrigger';
const TRIGGER_DEFAULT_TAG = 'button';

type DialogTriggerOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type DialogTriggerPrimitive = Polymorphic.ForwardRefComponent<
  typeof TRIGGER_DEFAULT_TAG,
  DialogTriggerOwnProps
>;

const DialogTrigger = React.forwardRef((props, forwardedRef) => {
  const { as = TRIGGER_DEFAULT_TAG, ...triggerProps } = props;
  const context = useDialogContext(TRIGGER_NAME);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
  return (
    <Primitive
      type="button"
      aria-haspopup="dialog"
      aria-expanded={context.open}
      aria-controls={context.contentId}
      data-state={getState(context.open)}
      {...triggerProps}
      as={as}
      ref={composedTriggerRef}
      onClick={composeEventHandlers(props.onClick, () => context.onOpenChange(true))}
    />
  );
}) as DialogTriggerPrimitive;

DialogTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'DialogOverlay';

type DialogOverlayOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof DialogOverlayImpl>,
  {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
  }
>;

type DialogOverlayPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof DialogOverlayImpl>,
  DialogOverlayOwnProps
>;

const DialogOverlay = React.forwardRef((props, forwardedRef) => {
  const { forceMount, ...overlayProps } = props;
  const context = useDialogContext(OVERLAY_NAME);
  return (
    <Presence present={forceMount || context.open}>
      <DialogOverlayImpl data-state={getState(context.open)} {...overlayProps} ref={forwardedRef} />
    </Presence>
  );
}) as DialogOverlayPrimitive;

type DialogOverlayImplOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type DialogOverlayImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  DialogOverlayImplOwnProps
>;

const DialogOverlayImpl = React.forwardRef((props, forwardedRef) => {
  return (
    <Portal>
      <Primitive {...props} ref={forwardedRef} />
    </Portal>
  );
}) as DialogOverlayImplPrimitive;

DialogOverlay.displayName = OVERLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'DialogContent';

type DialogContentOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof DialogContentImpl>,
  {
    /**
     * Used to force mounting when more control is needed. Useful when
     * controlling animation with React animation libraries.
     */
    forceMount?: true;
  }
>;

type DialogContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof DialogContentImpl>,
  DialogContentOwnProps
>;

const DialogContent = React.forwardRef((props, forwardedRef) => {
  const { forceMount, ...contentProps } = props;
  const context = useDialogContext(CONTENT_NAME);
  return (
    <Presence present={forceMount || context.open}>
      <DialogContentImpl data-state={getState(context.open)} {...contentProps} ref={forwardedRef} />
    </Presence>
  );
}) as DialogContentPrimitive;

type FocusScopeOwnProps = Polymorphic.OwnProps<typeof FocusScope>;

type DialogContentImplOwnProps = Polymorphic.Merge<
  Omit<
    Polymorphic.OwnProps<typeof DismissableLayer>,
    'disableOutsidePointerEvents' | 'onFocusOutside' | 'onInteractOutside' | 'onDismiss'
  >,
  {
    /**
     * Event handler called when auto-focusing on open.
     * Can be prevented.
     */
    onOpenAutoFocus?: FocusScopeOwnProps['onMountAutoFocus'];

    /**
     * Event handler called when auto-focusing on close.
     * Can be prevented.
     */
    onCloseAutoFocus?: FocusScopeOwnProps['onUnmountAutoFocus'];
  }
>;

type DialogContentImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof DismissableLayer>,
  DialogContentImplOwnProps
>;

const DialogContentImpl = React.forwardRef((props, forwardedRef) => {
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    onOpenAutoFocus,
    onCloseAutoFocus,
    onEscapeKeyDown,
    onPointerDownOutside,
    ...contentProps
  } = props;
  const context = useDialogContext(CONTENT_NAME);

  const contentRef = React.useRef<HTMLDivElement>(null);
  const composedRefs = useComposedRefs(forwardedRef, contentRef);

  // Make sure the whole tree has focus guards as our `Dialog` will be
  // the last element in the DOM (beacuse of the `Portal`)
  useFocusGuards();

  // Hide everything from ARIA except the content
  React.useEffect(() => {
    const content = contentRef.current;
    if (content) return hideOthers(content);
  }, []);

  return (
    <>
      <Portal>
        <RemoveScroll>
          <FocusScope
            as={Slot}
            // we make sure we're not trapping once it's been closed
            // (closed !== unmounted when animating out)
            trapped={context.open}
            onMountAutoFocus={onOpenAutoFocus}
            onUnmountAutoFocus={onCloseAutoFocus}
          >
            <DismissableLayer
              role="dialog"
              id={context.contentId}
              aria-modal
              aria-describedby={ariaDescribedBy || context.descriptionId}
              // If `aria-label` is set, ensure `aria-labelledby` is undefined as to avoid confusion.
              // Otherwise fallback to an explicit `aria-labelledby` or the ID used in the
              // `DialogTitle`
              aria-labelledby={ariaLabel ? undefined : ariaLabelledBy || context.titleId}
              aria-label={ariaLabel || undefined}
              {...contentProps}
              ref={composedRefs}
              disableOutsidePointerEvents
              onEscapeKeyDown={onEscapeKeyDown}
              onPointerDownOutside={composeEventHandlers(onPointerDownOutside, (event) => {
                const originalEvent = event.detail.originalEvent as MouseEvent;
                const isRightClick =
                  originalEvent.button === 2 ||
                  (originalEvent.button === 0 && originalEvent.ctrlKey === true);

                // If the event is a right-click, we shouldn't close because
                // it is effectively as if we right-clicked the `Overlay`.
                if (isRightClick) event.preventDefault();
              })}
              // When focus is trapped, a focusout event may still happen.
              // We make sure we don't trigger our `onDismiss` in such case.
              onFocusOutside={(event) => event.preventDefault()}
              onDismiss={() => context.onOpenChange(false)}
            />
          </FocusScope>
        </RemoveScroll>
      </Portal>
      {process.env.NODE_ENV === 'development' && (
        <AccessibilityDevWarnings
          ariaLabel={ariaLabel}
          ariaLabelledBy={ariaLabelledBy}
          ariaDescribedBy={ariaDescribedBy}
        />
      )}
    </>
  );
}) as DialogContentImplPrimitive;

DialogContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogTitle
 * -----------------------------------------------------------------------------------------------*/

const TITLE_NAME = 'DialogTitle';
const TITLE_DEFAULT_TAG = 'h2';

type DialogTitleOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type DialogTitlePrimitive = Polymorphic.ForwardRefComponent<
  typeof TITLE_DEFAULT_TAG,
  DialogTitleOwnProps
>;

const DialogTitle = React.forwardRef((props, forwardedRef) => {
  const { as = TITLE_DEFAULT_TAG, ...titleProps } = props;
  const context = useDialogContext(TITLE_NAME);
  return <Primitive id={context.titleId} {...titleProps} as={as} ref={forwardedRef} />;
}) as DialogTitlePrimitive;

DialogTitle.displayName = TITLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DESCRIPTION_NAME = 'DialogDescription';
const DESCRIPTION_DEFAULT_TAG = 'p';

type DialogDescriptionOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type DialogDescriptionPrimitive = Polymorphic.ForwardRefComponent<
  typeof DESCRIPTION_DEFAULT_TAG,
  DialogDescriptionOwnProps
>;

const DialogDescription = React.forwardRef((props, forwardedRef) => {
  const { as = DESCRIPTION_DEFAULT_TAG, ...descriptionProps } = props;
  const context = useDialogContext(DESCRIPTION_NAME);
  return <Primitive id={context.descriptionId} {...descriptionProps} as={as} ref={forwardedRef} />;
}) as DialogDescriptionPrimitive;

DialogDescription.displayName = DESCRIPTION_NAME;

/* -------------------------------------------------------------------------------------------------
 * DialogClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'DialogClose';
const CLOSE_DEFAULT_TAG = 'button';

type DialogCloseOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type DialogClosePrimitive = Polymorphic.ForwardRefComponent<
  typeof CLOSE_DEFAULT_TAG,
  DialogCloseOwnProps
>;

const DialogClose = React.forwardRef((props, forwardedRef) => {
  const { as = CLOSE_DEFAULT_TAG, ...closeProps } = props;
  const context = useDialogContext(CLOSE_NAME);
  return (
    <Primitive
      type="button"
      {...closeProps}
      as={as}
      ref={forwardedRef}
      onClick={composeEventHandlers(props.onClick, () => context.onOpenChange(false))}
    />
  );
}) as DialogClosePrimitive;

DialogClose.displayName = CLOSE_NAME;

/* -----------------------------------------------------------------------------------------------*/

function getState(open: boolean) {
  return open ? 'open' : 'closed';
}

const AccessibilityDevWarningsContext = React.createContext({
  descriptionRequired: false,
  partNames: { content: CONTENT_NAME, title: TITLE_NAME, description: DESCRIPTION_NAME },
  docsUrl: 'https://radix-ui.com/primitives/docs/components/dialog',
});

const AccessibilityDevWarnings: React.FC<{
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}> = (props) => {
  const { ariaLabel, ariaLabelledBy, ariaDescribedBy } = props;
  const context = useDialogContext('AccessibilityDevWarnings');
  const devWarningsContext = React.useContext(AccessibilityDevWarningsContext);
  const { partNames } = devWarningsContext;

  const LABEL_WARNING = `\`${partNames.content}\` requires a label for the component to be accessible for screen reader users.

You can label the \`${partNames.content}\` by passing a \`${partNames.title}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a title by assigning it an \`id\` and passing the same value to the \`aria-labelledby\` prop in \`${partNames.content}\`. If the label is confusing or duplicative for sighted users, you can also pass a label directly by using the \`aria-label\` prop.

For more information, see ${devWarningsContext.docsUrl}`;

  const DESCRIPTION_WARNING = `\`${partNames.content}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${partNames.content}\` by passing a \`${partNames.description}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${partNames.content}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see ${devWarningsContext.docsUrl}`;

  React.useEffect(() => {
    const hasLabel = Boolean(
      ariaLabel ||
        (ariaLabelledBy && document.getElementById(ariaLabelledBy)) ||
        (context.titleId && document.getElementById(context.titleId))
    );
    if (!hasLabel) {
      console.warn(LABEL_WARNING);
    }

    const hasDescription = Boolean(
      (ariaDescribedBy && document.getElementById(ariaDescribedBy)) ||
        (context.descriptionId && document.getElementById(context.descriptionId))
    );
    if (devWarningsContext.descriptionRequired && !hasDescription) {
      console.warn(DESCRIPTION_WARNING);
    }
  }, [
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    devWarningsContext.descriptionRequired,
    context.titleId,
    context.descriptionId,
    LABEL_WARNING,
    DESCRIPTION_WARNING,
  ]);

  return null;
};

const Root = Dialog;
const Trigger = DialogTrigger;
const Overlay = DialogOverlay;
const Content = DialogContent;
const Title = DialogTitle;
const Description = DialogDescription;
const Close = DialogClose;

export {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  //
  Root,
  Trigger,
  Overlay,
  Content,
  Title,
  Description,
  Close,
  //
  AccessibilityDevWarningsContext,
};
export type {
  DialogTriggerPrimitive,
  DialogOverlayPrimitive,
  DialogContentPrimitive,
  DialogTitlePrimitive,
  DialogDescriptionPrimitive,
  DialogClosePrimitive,
};
