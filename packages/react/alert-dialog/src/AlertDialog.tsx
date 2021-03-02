import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import {
  createContextObj,
  useComposedRefs,
  useDocumentRef,
  extendComponent,
} from '@radix-ui/react-utils';
import { Primitive } from '@radix-ui/react-primitive';
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@radix-ui/react-dialog';
import { useId } from '@radix-ui/react-id';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

/* -------------------------------------------------------------------------------------------------
 * AlertDialog
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'AlertDialog';

type AlertDialogContextValue = {
  descriptionId: string;
  titleId: string;
};

const [AlertDialogProvider, useAlertDialogContext] = createContextObj<AlertDialogContextValue>(
  ROOT_NAME
);

const AlertDialog: React.FC<React.ComponentProps<typeof Dialog>> = (props) => (
  <AlertDialogProvider descriptionId={useId()} titleId={useId()}>
    <Dialog {...props} />
  </AlertDialogProvider>
);

AlertDialog.displayName = ROOT_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogCancel
 * -----------------------------------------------------------------------------------------------*/

const CANCEL_NAME = 'AlertDialogCancel';

type AlertDialogCancelOwnProps = Polymorphic.OwnProps<typeof DialogClose>;
type AlertDialogCancelPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof DialogClose>,
  AlertDialogCancelOwnProps
>;

const AlertDialogCancel = React.forwardRef((props, forwardedRef) => {
  const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME);
  const ref = useComposedRefs(forwardedRef, cancelRef);
  return <DialogClose {...props} ref={ref} />;
}) as AlertDialogCancelPrimitive;

AlertDialogCancel.displayName = CANCEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'AlertDialogContent';

type AlertDialogContentContextValue = {
  cancelRef: React.MutableRefObject<React.ElementRef<typeof AlertDialogCancel> | null>;
  ownerDocumentRef: React.MutableRefObject<Document>;
};

const [
  AlertDialogContentProvider,
  useAlertDialogContentContext,
] = createContextObj<AlertDialogContentContextValue>(CONTENT_NAME);

type AlertDialogContentOwnProps = Omit<
  Polymorphic.OwnProps<typeof DialogContent>,
  'refToFocusOnOpen' | 'id'
>;

type AlertDialogContentPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof DialogContent>,
  AlertDialogContentOwnProps
>;

const AlertDialogContent = React.forwardRef((props, forwardedRef) => {
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
    ...dialogContentProps
  } = props;
  const { descriptionId, titleId } = useAlertDialogContext(CONTENT_NAME);
  const cancelRef = React.useRef<React.ElementRef<typeof AlertDialogCancel> | null>(null);
  const ownRef = React.useRef<React.ElementRef<typeof DialogContent> | null>(null);
  const ownerDocumentRef = useDocumentRef(ownRef);
  const ref = useComposedRefs(forwardedRef, ownRef);

  return (
    <AlertDialogContentProvider cancelRef={cancelRef} ownerDocumentRef={ownerDocumentRef}>
      {process.env.NODE_ENV === 'development' && <AccessibilityDevWarnings {...props} />}
      <DialogContent
        role="alertdialog"
        aria-describedby={ariaDescribedBy || descriptionId}
        // If `aria-label` is set, ensure `aria-labelledby` is undefined as to avoid confusion.
        // Otherwise fallback to an explicit `aria-labelledby` or the ID used in the
        // `AlertDialogTitle`
        aria-labelledby={ariaLabel ? undefined : ariaLabelledBy || titleId}
        aria-label={ariaLabel || undefined}
        {...dialogContentProps}
        ref={ref}
        onOpenAutoFocus={composeEventHandlers(dialogContentProps.onOpenAutoFocus, (event) => {
          event.preventDefault();
          cancelRef.current?.focus({ preventScroll: true });
        })}
      />
    </AlertDialogContentProvider>
  );
}) as AlertDialogContentPrimitive;

AlertDialogContent.displayName = CONTENT_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTitle
 * -----------------------------------------------------------------------------------------------*/

// Because `AlertDialog` depends more heavily on both a title and description for proper screen
// reader announcements, we provide explicit components for each to reduce the friction and make it
// simpler to get these right. These are optional if the consumer prefers to pass appropriate aria
// labelling props directly.

const TITLE_NAME = 'AlertDialogTitle';
const TITLE_DEFAULT_TAG = 'h2';

type AlertDialogTitleOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type AlertDialogTitlePrimitive = Polymorphic.ForwardRefComponent<
  typeof TITLE_DEFAULT_TAG,
  AlertDialogTitleOwnProps
>;

const AlertDialogTitle = React.forwardRef((props, forwardedRef) => {
  const { as = TITLE_DEFAULT_TAG, ...titleProps } = props;
  const { titleId } = useAlertDialogContext(TITLE_NAME);
  return <Primitive id={titleId} {...titleProps} as={as} ref={forwardedRef} />;
}) as AlertDialogTitlePrimitive;

AlertDialogTitle.displayName = TITLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DESCRIPTION_NAME = 'AlertDialogDescription';
const DESCRIPTION_DEFAULT_TAG = 'p';

type AlertDialogDescriptionOwnProps = Polymorphic.OwnProps<typeof Primitive>;
type AlertDialogDescriptionPrimitive = Polymorphic.ForwardRefComponent<
  typeof DESCRIPTION_DEFAULT_TAG,
  AlertDialogDescriptionOwnProps
>;

const AlertDialogDescription = React.forwardRef((props, forwardedRef) => {
  const { as = DESCRIPTION_DEFAULT_TAG, ...descriptionProps } = props;
  const { descriptionId } = useAlertDialogContext(DESCRIPTION_NAME);
  return <Primitive id={descriptionId} {...descriptionProps} as={as} ref={forwardedRef} />;
}) as AlertDialogDescriptionPrimitive;

AlertDialogDescription.displayName = DESCRIPTION_NAME;

/* ---------------------------------------------------------------------------------------------- */

const AlertDialogTrigger = extendComponent(DialogTrigger, 'AlertDialogTrigger');
const AlertDialogOverlay = extendComponent(DialogOverlay, 'AlertDialogOverlay');
const AlertDialogAction = extendComponent(DialogClose, 'AlertDialogAction');

/* ---------------------------------------------------------------------------------------------- */

// TODO: Add link to docs when available
const LABEL_WARNING = `${CONTENT_NAME} requires a label for the component to be accessible for screen reader users.

You can label the ${CONTENT_NAME} by passing a ${TITLE_NAME} component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a title by assigning it an \`id\` and passing the same value to the \`aria-labelledby\` prop in ${CONTENT_NAME}. If the label is confusing or duplicative for sighted users, you can also pass a label directly by using the \`aria-label\` prop.

For more information, see https://LINK-TO-DOCS.com`;

const DESC_WARNING = `${CONTENT_NAME} requires a description for the component to be accessible for screen reader users.

You can add a description to the ${CONTENT_NAME} by passing a ${DESCRIPTION_NAME} component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in ${CONTENT_NAME}. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://LINK-TO-DOCS.com`;

// We need some effects to fire when DialogContent is mounted that will give us some useful dev
// warnings. DialogContent returns `null` when the Dialog is closed, meaning that if we put these
// effects up in AlertDialog.Content these effects only fire on its initial mount, NOT when the
// underlying DialogContent mounts. We stick this inner component inside DialogContent to make
// sure the effects fire as expected. This component is only useful in a dev environment, so we
// won't bother rendering it in production.
const AccessibilityDevWarnings: React.FC<React.ComponentProps<typeof AlertDialogContent>> = (
  props
) => {
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
  } = props;
  const { ownerDocumentRef } = useAlertDialogContentContext(CANCEL_NAME);
  const context = useAlertDialogContext('AlertDialogContent');

  React.useEffect(() => {
    const ownerDocument = ownerDocumentRef.current;
    const hasLabel = Boolean(
      ariaLabel ||
        (ariaLabelledBy && ownerDocument.getElementById(ariaLabelledBy)) ||
        (context.titleId && ownerDocument.getElementById(context.titleId))
    );
    if (!hasLabel) {
      console.warn(LABEL_WARNING);
    }

    const hasDescription = Boolean(
      (ariaDescribedBy && ownerDocument.getElementById(ariaDescribedBy)) ||
        (context.descriptionId && ownerDocument.getElementById(context.descriptionId))
    );
    if (!hasDescription) {
      console.warn(DESC_WARNING);
    }
  }, [
    context.titleId,
    ariaLabel,
    ariaDescribedBy,
    context.descriptionId,
    ariaLabelledBy,
    ownerDocumentRef,
  ]);

  return null;
};

const Root = AlertDialog;
const Title = AlertDialogTitle;
const Cancel = AlertDialogCancel;
const Action = AlertDialogAction;
const Content = AlertDialogContent;
const Description = AlertDialogDescription;
const Overlay = AlertDialogOverlay;
const Trigger = AlertDialogTrigger;

export {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogTrigger,
  //
  Root,
  Title,
  Cancel,
  Action,
  Content,
  Description,
  Overlay,
  Trigger,
};
