import * as React from 'react';
import { createContext } from '@radix-ui/react-context';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { composeEventHandlers } from '@radix-ui/primitive';
import { extendPrimitive } from '@radix-ui/react-primitive';
import { Slottable } from '@radix-ui/react-slot';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * AlertDialog
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'AlertDialog';

type AlertDialogProps = Omit<React.ComponentProps<typeof DialogPrimitive.Root>, 'modal'>;

const AlertDialog: React.FC<AlertDialogProps> = (props) => (
  <DialogPrimitive.Root {...props} modal={true} />
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

type AlertDialogContentProps = Omit<
  Polymorphic.OwnProps<typeof DialogPrimitive.Content>,
  'onPointerDownOutside'
>;

type AlertDialogContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof DialogPrimitive.Content>,
  AlertDialogContentProps
>;

const AlertDialogContent = React.forwardRef((props, forwardedRef) => {
  const { children, ...contentProps } = props;
  const contentRef = React.useRef<React.ElementRef<typeof AlertDialogContent>>(null);
  const composedRefs = useComposedRefs(forwardedRef, contentRef);
  const cancelRef = React.useRef<React.ElementRef<typeof AlertDialogCancel> | null>(null);

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
          {process.env.NODE_ENV === 'development' && <DescriptionWarning contentRef={contentRef} />}
        </DialogPrimitive.Content>
      </AlertDialogContentProvider>
    </DialogPrimitive.LabelWarningProvider>
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

type DescriptionWarningProps = {
  contentRef: React.RefObject<React.ElementRef<typeof AlertDialogContent>>;
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
export type { AlertDialogContentPrimitive, AlertDialogCancelPrimitive };
