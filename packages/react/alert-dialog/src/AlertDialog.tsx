import * as React from 'react';
import { createContext } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { composeEventHandlers } from '@radix-ui/primitive';
import { extendPrimitive } from '@radix-ui/react-primitive';
import * as DialogPrimitive from '@radix-ui/react-dialog';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * AlertDialog
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'AlertDialog';

const AlertDialog: React.FC<React.ComponentProps<typeof DialogPrimitive.Root>> = (props) => (
  <DialogPrimitive.Root {...props} />
);

AlertDialog.displayName = ROOT_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'AlertDialogContent';

type AlertDialogContentContextValue = {
  cancelRef: React.MutableRefObject<React.ElementRef<typeof AlertDialogCancel> | null>;
};

const [
  AlertDialogContentProvider,
  useAlertDialogContentContext,
] = createContext<AlertDialogContentContextValue>(CONTENT_NAME);

type AlertDialogContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof DialogPrimitive.Content>,
  Polymorphic.OwnProps<typeof DialogPrimitive.Content>
>;

const AlertDialogContent = React.forwardRef((props, forwardedRef) => {
  const cancelRef = React.useRef<React.ElementRef<typeof AlertDialogCancel> | null>(null);

  return (
    <DialogPrimitive.AccessibilityDevWarningsContext.Provider
      value={React.useMemo(
        () => ({
          descriptionRequired: true,
          partNames: { content: CONTENT_NAME, title: TITLE_NAME, description: DESCRIPTION_NAME },
          docsUrl: 'https://radix-ui.com/primitives/docs/components/alert-dialog',
        }),
        []
      )}
    >
      <AlertDialogContentProvider cancelRef={cancelRef}>
        <DialogPrimitive.Content
          role="alertdialog"
          {...props}
          ref={forwardedRef}
          onOpenAutoFocus={composeEventHandlers(props.onOpenAutoFocus, (event) => {
            event.preventDefault();
            cancelRef.current?.focus({ preventScroll: true });
          })}
        />
      </AlertDialogContentProvider>
    </DialogPrimitive.AccessibilityDevWarningsContext.Provider>
  );
}) as AlertDialogContentPrimitive;

AlertDialogContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogCancel
 * -----------------------------------------------------------------------------------------------*/

const CANCEL_NAME = 'AlertDialogCancel';

type AlertDialogCancelOwnProps = Polymorphic.OwnProps<typeof DialogPrimitive.Close>;
type AlertDialogCancelPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof DialogPrimitive.Close>,
  AlertDialogCancelOwnProps
>;

const AlertDialogCancel = React.forwardRef((props, forwardedRef) => {
  const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME);
  const ref = useComposedRefs(forwardedRef, cancelRef);
  return <DialogPrimitive.Close {...props} ref={ref} />;
}) as AlertDialogCancelPrimitive;

AlertDialogCancel.displayName = CANCEL_NAME;

/* ---------------------------------------------------------------------------------------------- */

const AlertDialogTrigger = extendPrimitive(DialogPrimitive.Trigger, {
  displayName: 'AlertDialogTrigger',
});
const AlertDialogOverlay = extendPrimitive(DialogPrimitive.Overlay, {
  displayName: 'AlertDialogOverlay',
});
const AlertDialogAction = extendPrimitive(DialogPrimitive.Close, {
  displayName: 'AlertDialogAction',
});
const TITLE_NAME = 'AlertDialogTitle';
const AlertDialogTitle = extendPrimitive(DialogPrimitive.Title, {
  displayName: TITLE_NAME,
});
const DESCRIPTION_NAME = 'AlertDialogDescription';
const AlertDialogDescription = extendPrimitive(DialogPrimitive.Description, {
  displayName: DESCRIPTION_NAME,
});

/* ---------------------------------------------------------------------------------------------- */

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
export type { AlertDialogContentPrimitive, AlertDialogCancelPrimitive };
