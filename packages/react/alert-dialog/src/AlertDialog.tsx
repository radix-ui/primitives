import * as React from 'react';
import { getPartDataAttrObj, makeId, warning } from '@radix-ui/utils';
import {
  createContext,
  useComposedRefs,
  useId,
  useDocumentRef,
  composeEventHandlers,
  extendComponent,
} from '@radix-ui/react-utils';
import { forwardRefWithAs } from '@radix-ui/react-polymorphic';
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@radix-ui/react-dialog';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'AlertDialog';

type AlertDialogContextValue = {
  descriptionId: string;
  titleId: string;
};

type AlertDialogContentContextValue = {
  cancelRef: React.MutableRefObject<React.ElementRef<typeof AlertDialogCancel> | null>;
  ownerDocumentRef: React.MutableRefObject<Document>;
};

const [AlertDialogContext, useAlertDialogContext] = createContext<AlertDialogContextValue>(
  'AlertDialogContext',
  ROOT_NAME
);

const [AlertDialogContentContext, useAlertDialogContentContext] = createContext<
  AlertDialogContentContextValue
>('AlertDialogContext', ROOT_NAME);

/* -------------------------------------------------------------------------------------------------
 * AlertDialog
 * -----------------------------------------------------------------------------------------------*/

const AlertDialog: React.FC<React.ComponentProps<typeof Dialog>> = (props) => {
  const { children, id: idProp, ...dialogProps } = props;
  const generatedId = makeId('alert-dialog', useId());
  const alertDialogId = idProp || generatedId;
  const descriptionId = makeId(alertDialogId, 'description');
  const titleId = makeId(alertDialogId, 'title');

  return (
    <Dialog {...dialogProps}>
      <AlertDialogContext.Provider
        value={React.useMemo(() => ({ descriptionId, titleId }), [descriptionId, titleId])}
      >
        {children}
      </AlertDialogContext.Provider>
    </Dialog>
  );
};

AlertDialog.displayName = ROOT_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogCancel
 * -----------------------------------------------------------------------------------------------*/

const CANCEL_NAME = 'AlertDialogCancel';

const AlertDialogCancel = forwardRefWithAs<typeof DialogClose>((props, forwardedRef) => {
  const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME);
  const ref = useComposedRefs(forwardedRef, cancelRef);
  return <DialogClose {...getPartDataAttrObj(CANCEL_NAME)} ref={ref} {...props} />;
});

AlertDialogCancel.displayName = CANCEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'AlertDialogContent';

type AlertDialogContentOwnProps = {
  refToFocusOnOpen: never;
  id: never;
};

const AlertDialogContent = forwardRefWithAs<typeof DialogContent, AlertDialogContentOwnProps>(
  (props, forwardedRef) => {
    const {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      children,
      ...dialogContentProps
    } = props;
    const { descriptionId, titleId } = useAlertDialogContext(CONTENT_NAME);
    const cancelRef = React.useRef<React.ElementRef<typeof AlertDialogCancel> | null>(null);
    const ownRef = React.useRef<React.ElementRef<typeof DialogContent> | null>(null);
    const ownerDocumentRef = useDocumentRef(ownRef);
    const ref = useComposedRefs(forwardedRef, ownRef);

    return (
      <DialogContent
        {...getPartDataAttrObj(CONTENT_NAME)}
        ref={ref}
        role="alertdialog"
        aria-describedby={ariaDescribedBy || descriptionId}
        // If `aria-label` is set, ensure `aria-labelledby` is undefined as to avoid confusion.
        // Otherwise fallback to an explicit `aria-labelledby` or the ID used in the
        // `AlertDialogTitle`
        aria-labelledby={ariaLabel ? undefined : ariaLabelledBy || titleId}
        aria-label={ariaLabel || undefined}
        {...dialogContentProps}
        onOpenAutoFocus={composeEventHandlers(dialogContentProps.onOpenAutoFocus, (event) => {
          event.preventDefault();
          cancelRef.current?.focus({ preventScroll: true });
        })}
      >
        <AlertDialogContentContext.Provider
          value={React.useMemo(() => {
            return {
              cancelRef,
              ownerDocumentRef,
            };
          }, [cancelRef, ownerDocumentRef])}
        >
          {process.env.NODE_ENV === 'development' && <AccessibilityDevWarnings {...props} />}
          {children}
        </AlertDialogContentContext.Provider>
      </DialogContent>
    );
  }
);

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

const AlertDialogTitle = forwardRefWithAs<typeof TITLE_DEFAULT_TAG>((props, forwardedRef) => {
  const { as: Comp = TITLE_DEFAULT_TAG, ...titleProps } = props;
  const { titleId } = useAlertDialogContext(TITLE_NAME);
  return (
    <Comp {...getPartDataAttrObj(TITLE_NAME)} ref={forwardedRef} id={titleId} {...titleProps} />
  );
});

AlertDialogTitle.displayName = TITLE_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DESCRIPTION_NAME = 'AlertDialogDescription';
const DESCRIPTION_DEFAULT_TAG = 'p';

const AlertDialogDescription = forwardRefWithAs<typeof DESCRIPTION_DEFAULT_TAG>(
  (props, forwardedRef) => {
    const { as: Comp = DESCRIPTION_DEFAULT_TAG, ...descriptionProps } = props;
    const { descriptionId } = useAlertDialogContext(DESCRIPTION_NAME);
    return (
      <Comp
        {...getPartDataAttrObj(DESCRIPTION_NAME)}
        ref={forwardedRef}
        id={descriptionId}
        {...descriptionProps}
      />
    );
  }
);

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
  const { descriptionId, titleId } = useAlertDialogContext('AlertDialogContent');
  React.useEffect(() => {
    const ownerDocument = ownerDocumentRef.current;
    const hasLabel = Boolean(
      ariaLabel ||
        (ariaLabelledBy && ownerDocument.getElementById(ariaLabelledBy)) ||
        (titleId && ownerDocument.getElementById(titleId))
    );
    const hasDescription = Boolean(
      (ariaDescribedBy && ownerDocument.getElementById(ariaDescribedBy)) ||
        (descriptionId && ownerDocument.getElementById(descriptionId))
    );
    warning(hasLabel, LABEL_WARNING);
    warning(hasDescription, DESC_WARNING);
  }, [titleId, ariaLabel, ariaDescribedBy, descriptionId, ariaLabelledBy, ownerDocumentRef]);

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
