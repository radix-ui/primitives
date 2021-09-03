import * as React from 'react';
import { createContext } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { composeEventHandlers } from '@radix-ui/primitive';
import { extendPrimitive } from '@radix-ui/react-primitive';
import { Slottable } from '@radix-ui/react-slot';

import type * as Radix from '@radix-ui/react-primitive';

/* -------------------------------------------------------------------------------------------------
 * AlertDialog
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'AlertDialog';

type DialogProps = Radix.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;
interface AlertDialogProps extends Omit<DialogProps, 'modal'> {}

const AlertDialog: React.FC<AlertDialogProps> = (props) => (
  <DialogPrimitive.Root {...props} modal={true} />
);

AlertDialog.displayName = ROOT_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'AlertDialogContent';

type AlertDialogContentContextValue = {
  cancelRef: React.MutableRefObject<AlertDialogCancelElement | null>;
};

const [AlertDialogContentProvider, useAlertDialogContentContext] =
  createContext<AlertDialogContentContextValue>(CONTENT_NAME);

type AlertDialogContentElement = React.ElementRef<typeof DialogPrimitive.Content>;
type DialogContentProps = Radix.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>;
interface AlertDialogContentProps extends Omit<DialogContentProps, 'onPointerDownOutside'> {}

const AlertDialogContent = React.forwardRef<AlertDialogContentElement, AlertDialogContentProps>(
  (props, forwardedRef) => {
    const { children, ...contentProps } = props;
    const contentRef = React.useRef<AlertDialogContentElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    const cancelRef = React.useRef<AlertDialogCancelElement | null>(null);

    return (
      <DialogPrimitive.LabelWarningProvider
        value={React.useMemo(
          () => ({ contentName: CONTENT_NAME, titleName: TITLE_NAME, docsSlug: 'alert-dialog' }),
          []
        )}
      >
        <AlertDialogContentProvider cancelRef={cancelRef}>
          <DialogPrimitive.Content
            role="alertdialog"
            {...contentProps}
            ref={composedRefs}
            onOpenAutoFocus={composeEventHandlers(contentProps.onOpenAutoFocus, (event) => {
              event.preventDefault();
              cancelRef.current?.focus({ preventScroll: true });
            })}
            onPointerDownOutside={(event) => event.preventDefault()}
          >
            {/**
             * We have to use `Slottable` here as we cannot wrap the `AlertDialogContentProvider`
             * around everything, otherwise the `DescriptionWarning` would be rendered straight away.
             * This is because we want the accessibility checks to run only once the content is actually
             * open and that behaviour is already encapsulated in `DialogContent`.
             */}
            <Slottable>{children}</Slottable>
            {process.env.NODE_ENV === 'development' && (
              <DescriptionWarning contentRef={contentRef} />
            )}
          </DialogPrimitive.Content>
        </AlertDialogContentProvider>
      </DialogPrimitive.LabelWarningProvider>
    );
  }
);

AlertDialogContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogCancel
 * -----------------------------------------------------------------------------------------------*/

const CANCEL_NAME = 'AlertDialogCancel';

type AlertDialogCancelElement = React.ElementRef<typeof DialogPrimitive.Close>;
type DialogCloseProps = Radix.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;
interface AlertDialogCancelProps extends DialogCloseProps {}

const AlertDialogCancel = React.forwardRef<AlertDialogCancelElement, AlertDialogCancelProps>(
  (props, forwardedRef) => {
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME);
    const ref = useComposedRefs(forwardedRef, cancelRef);
    return <DialogPrimitive.Close {...props} ref={ref} />;
  }
);

AlertDialogCancel.displayName = CANCEL_NAME;

/* ---------------------------------------------------------------------------------------------- */
type DialogTriggerProps = Radix.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;
interface AlertDialogTriggerProps extends DialogTriggerProps {}
const AlertDialogTrigger = extendPrimitive(DialogPrimitive.Trigger, {
  displayName: 'AlertDialogTrigger',
});

type DialogOverlayProps = Radix.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>;
interface AlertDialogOverlayProps extends DialogOverlayProps {}
const AlertDialogOverlay = extendPrimitive(DialogPrimitive.Overlay, {
  displayName: 'AlertDialogOverlay',
});

interface AlertDialogActionProps extends DialogCloseProps {}
const AlertDialogAction = extendPrimitive(DialogPrimitive.Close, {
  displayName: 'AlertDialogAction',
});

const TITLE_NAME = 'AlertDialogTitle';
type DialogTitleProps = Radix.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;
interface AlertDialogTitleProps extends DialogTitleProps {}
const AlertDialogTitle = extendPrimitive(DialogPrimitive.Title, {
  displayName: TITLE_NAME,
});

const DESCRIPTION_NAME = 'AlertDialogDescription';
type DialogDescriptionProps = Radix.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>;
interface AlertDialogDescriptionProps extends DialogDescriptionProps {}
const AlertDialogDescription = extendPrimitive(DialogPrimitive.Description, {
  displayName: DESCRIPTION_NAME,
});

/* ---------------------------------------------------------------------------------------------- */

type DescriptionWarningProps = {
  contentRef: React.RefObject<AlertDialogContentElement>;
};

const DescriptionWarning: React.FC<DescriptionWarningProps> = ({ contentRef }) => {
  const MESSAGE = `\`${CONTENT_NAME}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${CONTENT_NAME}\` by passing a \`${DESCRIPTION_NAME}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${CONTENT_NAME}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;

  React.useEffect(() => {
    const hasDescription = document.getElementById(
      contentRef.current?.getAttribute('aria-describedby')!
    );
    if (!hasDescription) console.warn(MESSAGE);
  }, [MESSAGE, contentRef]);

  return null;
};

const Root = AlertDialog;
const Trigger = AlertDialogTrigger;
const Overlay = AlertDialogOverlay;
const Content = AlertDialogContent;
const Action = AlertDialogAction;
const Cancel = AlertDialogCancel;
const Title = AlertDialogTitle;
const Description = AlertDialogDescription;

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogDescription,
  //
  Root,
  Trigger,
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
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
};
