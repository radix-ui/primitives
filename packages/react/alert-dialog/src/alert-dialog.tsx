import * as React from 'react';
import { createContextScope } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { createDialogScope } from '@radix-ui/react-dialog';
import { composeEventHandlers } from '@radix-ui/primitive';

import type { Scope } from '@radix-ui/react-context';

/* -------------------------------------------------------------------------------------------------
 * AlertDialog
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'AlertDialog';

type ScopedProps<P> = P & { __scopeAlertDialog?: Scope };
const [createAlertDialogContext, createAlertDialogScope] = createContextScope(ROOT_NAME, [
  createDialogScope,
]);
const useDialogScope = createDialogScope();

type DialogProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;
interface AlertDialogProps extends Omit<DialogProps, 'modal'> {}

const AlertDialog: React.FC<AlertDialogProps> = (props: ScopedProps<AlertDialogProps>) => {
  const { __scopeAlertDialog, ...alertDialogProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return <DialogPrimitive.Root {...dialogScope} {...alertDialogProps} modal={true} />;
};

AlertDialog.displayName = ROOT_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTrigger
 * -----------------------------------------------------------------------------------------------*/
const TRIGGER_NAME = 'AlertDialogTrigger';

type AlertDialogTriggerElement = React.ComponentRef<typeof DialogPrimitive.Trigger>;
type DialogTriggerProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;
interface AlertDialogTriggerProps extends DialogTriggerProps {}

const AlertDialogTrigger = React.forwardRef<AlertDialogTriggerElement, AlertDialogTriggerProps>(
  (props: ScopedProps<AlertDialogTriggerProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...triggerProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return <DialogPrimitive.Trigger {...dialogScope} {...triggerProps} ref={forwardedRef} />;
  },
);

AlertDialogTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogPortal
 * -----------------------------------------------------------------------------------------------*/

const PORTAL_NAME = 'AlertDialogPortal';

type DialogPortalProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>;
interface AlertDialogPortalProps extends DialogPortalProps {}

const AlertDialogPortal: React.FC<AlertDialogPortalProps> = (
  props: ScopedProps<AlertDialogPortalProps>,
) => {
  const { __scopeAlertDialog, ...portalProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return <DialogPrimitive.Portal {...dialogScope} {...portalProps} />;
};

AlertDialogPortal.displayName = PORTAL_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'AlertDialogOverlay';

type AlertDialogOverlayElement = React.ComponentRef<typeof DialogPrimitive.Overlay>;
type DialogOverlayProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;
interface AlertDialogOverlayProps extends DialogOverlayProps {}

const AlertDialogOverlay = React.forwardRef<AlertDialogOverlayElement, AlertDialogOverlayProps>(
  (props: ScopedProps<AlertDialogOverlayProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...overlayProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return <DialogPrimitive.Overlay {...dialogScope} {...overlayProps} ref={forwardedRef} />;
  },
);

AlertDialogOverlay.displayName = OVERLAY_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'AlertDialogContent';

type AlertDialogContentContextValue = {
  cancelRef: React.MutableRefObject<AlertDialogCancelElement | null>;
};

const [AlertDialogContentProvider, useAlertDialogContentContext] =
  createAlertDialogContext<AlertDialogContentContextValue>(CONTENT_NAME);

type AlertDialogContentElement = React.ComponentRef<typeof DialogPrimitive.Content>;
type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>;
interface AlertDialogContentProps extends Omit<
  DialogContentProps,
  'onPointerDownOutside' | 'onInteractOutside'
> {}

const AlertDialogContent = React.forwardRef<AlertDialogContentElement, AlertDialogContentProps>(
  (props: ScopedProps<AlertDialogContentProps>, forwardedRef) => {
    const { __scopeAlertDialog, children, ...contentProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const contentRef = React.useRef<AlertDialogContentElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = React.useRef<AlertDialogCancelElement | null>(null);

    return (
      <AlertDialogContentProvider scope={__scopeAlertDialog} cancelRef={cancelRef}>
        <DialogPrimitive.Content
          role="alertdialog"
          {...dialogScope}
          {...contentProps}
          ref={composedRefs}
          onOpenAutoFocus={composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
            event.preventDefault();
            cancelRef.current?.focus({ preventScroll: true });
          })}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          {children}
        </DialogPrimitive.Content>
      </AlertDialogContentProvider>
    );
  },
);

AlertDialogContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTitle
 * -----------------------------------------------------------------------------------------------*/

const TITLE_NAME = 'AlertDialogTitle';

type AlertDialogTitleElement = React.ComponentRef<typeof DialogPrimitive.Title>;
type DialogTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;
interface AlertDialogTitleProps extends DialogTitleProps {}

const AlertDialogTitle = React.forwardRef<AlertDialogTitleElement, AlertDialogTitleProps>(
  (props: ScopedProps<AlertDialogTitleProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...titleProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return <DialogPrimitive.Title {...dialogScope} {...titleProps} ref={forwardedRef} />;
  },
);

AlertDialogTitle.displayName = TITLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DESCRIPTION_NAME = 'AlertDialogDescription';

type AlertDialogDescriptionElement = React.ComponentRef<typeof DialogPrimitive.Description>;
type DialogDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;
interface AlertDialogDescriptionProps extends DialogDescriptionProps {}

const AlertDialogDescription = React.forwardRef<
  AlertDialogDescriptionElement,
  AlertDialogDescriptionProps
>((props: ScopedProps<AlertDialogDescriptionProps>, forwardedRef) => {
  const { __scopeAlertDialog, ...descriptionProps } = props;
  const dialogScope = useDialogScope(__scopeAlertDialog);
  return <DialogPrimitive.Description {...dialogScope} {...descriptionProps} ref={forwardedRef} />;
});

AlertDialogDescription.displayName = DESCRIPTION_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogAction
 * -----------------------------------------------------------------------------------------------*/

const ACTION_NAME = 'AlertDialogAction';

type AlertDialogActionElement = React.ComponentRef<typeof DialogPrimitive.Close>;
type DialogCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;
interface AlertDialogActionProps extends DialogCloseProps {}

const AlertDialogAction = React.forwardRef<AlertDialogActionElement, AlertDialogActionProps>(
  (props: ScopedProps<AlertDialogActionProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...actionProps } = props;
    const dialogScope = useDialogScope(__scopeAlertDialog);
    return <DialogPrimitive.Close {...dialogScope} {...actionProps} ref={forwardedRef} />;
  },
);

AlertDialogAction.displayName = ACTION_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogCancel
 * -----------------------------------------------------------------------------------------------*/

const CANCEL_NAME = 'AlertDialogCancel';

type AlertDialogCancelElement = React.ComponentRef<typeof DialogPrimitive.Close>;
interface AlertDialogCancelProps extends DialogCloseProps {}

const AlertDialogCancel = React.forwardRef<AlertDialogCancelElement, AlertDialogCancelProps>(
  (props: ScopedProps<AlertDialogCancelProps>, forwardedRef) => {
    const { __scopeAlertDialog, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME, __scopeAlertDialog);
    const dialogScope = useDialogScope(__scopeAlertDialog);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return <DialogPrimitive.Close {...dialogScope} {...cancelProps} ref={ref} />;
  },
);

AlertDialogCancel.displayName = CANCEL_NAME;

/* ---------------------------------------------------------------------------------------------- */

const Root = AlertDialog;
const Trigger = AlertDialogTrigger;
const Portal = AlertDialogPortal;
const Overlay = AlertDialogOverlay;
const Content = AlertDialogContent;
const Action = AlertDialogAction;
const Cancel = AlertDialogCancel;
const Title = AlertDialogTitle;
const Description = AlertDialogDescription;

export {
  createAlertDialogScope,
  //
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
  //
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Action,
  Cancel,
  Title,
  Description,
};
export type {
  AlertDialogProps,
  AlertDialogTriggerProps,
  AlertDialogPortalProps,
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
};
