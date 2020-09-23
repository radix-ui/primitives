/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import { Dialog, styles as dialogStyles } from '@interop-ui/react-dialog';
import { cssReset, makeId, warning } from '@interop-ui/utils';
import {
  createContext,
  createStyleObj,
  forwardRef,
  useComposedRefs,
  useId,
  useDocumentRef,
} from '@interop-ui/react-utils';
import type {
  DialogCloseProps,
  DialogContentProps,
  DialogOverlayProps,
  DialogProps,
  DialogTriggerProps,
} from '@interop-ui/react-dialog';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'AlertDialog';

type AlertDialogContextValue = {
  descriptionId: string;
  titleId: string;
};

type AlertDialogContentContextValue = {
  cancelRef: React.MutableRefObject<HTMLElement | null>;
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

interface AlertDialogStaticProps {
  Trigger: typeof AlertDialogTrigger;
  Overlay: typeof AlertDialogOverlay;
  Content: typeof AlertDialogContent;
  Cancel: typeof AlertDialogCancel;
  Action: typeof AlertDialogAction;
  Title: typeof AlertDialogTitle;
  Description: typeof AlertDialogDescription;
}

type AlertDialogProps = DialogProps;

const AlertDialog: React.FC<AlertDialogProps> & AlertDialogStaticProps = function AlertDialog(
  props
) {
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

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'AlertDialog.Trigger';
const TRIGGER_DEFAULT_TAG = 'button';

type AlertDialogTriggerDOMProps = React.ComponentPropsWithoutRef<typeof TRIGGER_DEFAULT_TAG>;
type AlertDialogTriggerOwnProps = {};
type AlertDialogTriggerProps = DialogTriggerProps &
  AlertDialogTriggerDOMProps &
  AlertDialogTriggerOwnProps;

const AlertDialogTrigger = forwardRef<typeof TRIGGER_DEFAULT_TAG, AlertDialogTriggerProps>(
  function AlertDialogTrigger(props, forwardedRef) {
    const { as = TRIGGER_DEFAULT_TAG, ...triggerProps } = props;
    return (
      <Dialog.Trigger
        {...interopDataAttrObj('trigger')}
        as={as}
        ref={forwardedRef}
        {...triggerProps}
      />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * AlertDialogOverlay
 * -----------------------------------------------------------------------------------------------*/

const OVERLAY_NAME = 'AlertDialog.Overlay';
const OVERLAY_DEFAULT_TAG = 'div';

type AlertDialogOverlayDOMProps = React.ComponentPropsWithoutRef<typeof OVERLAY_DEFAULT_TAG>;
type AlertDialogOverlayOwnProps = {};
type AlertDialogOverlayProps = DialogOverlayProps &
  AlertDialogOverlayDOMProps &
  AlertDialogOverlayOwnProps;

const AlertDialogOverlay = forwardRef<typeof OVERLAY_DEFAULT_TAG, AlertDialogOverlayProps>(
  function AlertDialogOverlay(props, forwardedRef) {
    const { as = OVERLAY_DEFAULT_TAG, ...overlayProps } = props;
    return (
      <Dialog.Overlay
        {...interopDataAttrObj('overlay')}
        as={as}
        ref={forwardedRef}
        {...overlayProps}
      />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * AlertDialogCancel
 * -----------------------------------------------------------------------------------------------*/

const CANCEL_NAME = 'AlertDialog.Cancel';
const CANCEL_DEFAULT_TAG = 'button';

type AlertDialogCancelDOMProps = React.ComponentPropsWithoutRef<typeof CANCEL_DEFAULT_TAG>;
type AlertDialogCancelOwnProps = {};
type AlertDialogCancelProps = DialogCloseProps &
  AlertDialogCancelOwnProps &
  AlertDialogCancelDOMProps;

const AlertDialogCancel = forwardRef<typeof CANCEL_DEFAULT_TAG, AlertDialogCancelProps>(
  function AlertDialogCancel(props, forwardedRef) {
    const { as = CANCEL_DEFAULT_TAG, ...cancelProps } = props;
    const { cancelRef } = useAlertDialogContentContext(CANCEL_NAME);
    const ref = useComposedRefs(forwardedRef, cancelRef as any);
    return <Dialog.Close {...interopDataAttrObj('cancel')} as={as} ref={ref} {...cancelProps} />;
  }
);

/* -------------------------------------------------------------------------------------------------
 * AlertDialogAction
 * -----------------------------------------------------------------------------------------------*/

const ACTION_NAME = 'AlertDialog.Action';
const ACTION_DEFAULT_TAG = 'button';

type AlertDialogActionDOMProps = React.ComponentPropsWithoutRef<typeof ACTION_DEFAULT_TAG>;
type AlertDialogActionOwnProps = {};
type AlertDialogActionProps = DialogCloseProps &
  AlertDialogActionOwnProps &
  AlertDialogActionDOMProps;

const AlertDialogAction = forwardRef<typeof ACTION_DEFAULT_TAG, AlertDialogCancelProps>(
  function AlertDialogAction(props, forwardedRef) {
    const { as = ACTION_DEFAULT_TAG, ...actionProps } = props;
    return (
      <Dialog.Close {...interopDataAttrObj('action')} as={as} ref={forwardedRef} {...actionProps} />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * AlertDialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'AlertDialog.Content';
const CONTENT_DEFAULT_TAG = 'div';

type AlertDialogContentDOMProps = Omit<
  React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>,
  'id'
>;
type AlertDialogContentOwnProps = {};
type AlertDialogContentProps = Omit<DialogContentProps, 'refToFocusOnOpen'> &
  AlertDialogContentDOMProps &
  AlertDialogContentOwnProps;

const AlertDialogContent = forwardRef<typeof CONTENT_DEFAULT_TAG, AlertDialogContentProps>(
  function AlertDialogContent(props, forwardedRef) {
    const {
      as = CONTENT_DEFAULT_TAG,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      children,
      ...dialogContentProps
    } = props;
    const { descriptionId, titleId } = useAlertDialogContext('AlertDialogContent');
    const cancelRef = React.useRef<HTMLElementTagNameMap[typeof CANCEL_DEFAULT_TAG] | null>(null);
    const ownRef = React.useRef<HTMLElementTagNameMap[typeof CONTENT_DEFAULT_TAG] | null>(null);
    const ownerDocumentRef = useDocumentRef(ownRef);
    const ref = useComposedRefs(forwardedRef, ownRef);

    return (
      <Dialog.Content
        {...interopDataAttrObj('content')}
        as={as}
        ref={ref}
        role="alertdialog"
        aria-describedby={ariaDescribedBy || descriptionId}
        // If `aria-label` is set, ensure `aria-labelledby` is undefined as to avoid confusion.
        // Otherwise fallback to an explicit `aria-labelledby` or the ID used in the
        // `AlertDialogTitle`
        aria-labelledby={ariaLabel ? undefined : ariaLabelledBy || titleId}
        aria-label={ariaLabel || undefined}
        {...dialogContentProps}
        refToFocusOnOpen={cancelRef}
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
      </Dialog.Content>
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTitle
 * -----------------------------------------------------------------------------------------------*/

// Because `AlertDialog` depends more heavily on both a title and description for proper screen
// reader announcements, we provide explicit components for each to reduce the friction and make it
// simpler to get these right. These are optional if the consumer prefers to pass appropriate aria
// labelling props directly.

const TITLE_NAME = 'AlertDialog.Title';
const TITLE_DEFAULT_TAG = 'h2';

type AlertDialogTitleDOMProps = React.ComponentPropsWithoutRef<typeof TITLE_DEFAULT_TAG>;
type AlertDialogTitleOwnProps = {};
type AlertDialogTitleProps = AlertDialogTitleDOMProps & AlertDialogTitleOwnProps;

const AlertDialogTitle = forwardRef<typeof TITLE_DEFAULT_TAG, AlertDialogTitleProps>(
  function AlertDialogTitle(props, forwardedRef) {
    const { as: Comp = TITLE_DEFAULT_TAG, ...titleProps } = props;
    const { titleId } = useAlertDialogContext('AlertDialogTitle');
    return (
      <Comp {...interopDataAttrObj('title')} ref={forwardedRef} id={titleId} {...titleProps} />
    );
  }
);

/* -------------------------------------------------------------------------------------------------
 * AlertDialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DESCRIPTION_NAME = 'AlertDialog.Description';
const DESCRIPTION_DEFAULT_TAG = 'p';

type AlertDialogDescriptionDOMProps = React.ComponentPropsWithoutRef<
  typeof DESCRIPTION_DEFAULT_TAG
>;
type AlertDialogDescriptionOwnProps = {};
type AlertDialogDescriptionProps = AlertDialogDescriptionDOMProps & AlertDialogDescriptionOwnProps;

const AlertDialogDescription = forwardRef<
  typeof DESCRIPTION_DEFAULT_TAG,
  AlertDialogDescriptionProps
>(function AlertDialogDescription(props, forwardedRef) {
  const { as: Comp = DESCRIPTION_DEFAULT_TAG, ...descriptionProps } = props;
  const { descriptionId } = useAlertDialogContext('AlertDialogDescription');
  return (
    <Comp
      {...interopDataAttrObj('description')}
      ref={forwardedRef}
      id={descriptionId}
      {...descriptionProps}
    />
  );
});

/* ---------------------------------------------------------------------------------------------- */

AlertDialog.Cancel = AlertDialogCancel;
AlertDialog.Action = AlertDialogAction;
AlertDialog.Content = AlertDialogContent;
AlertDialog.Description = AlertDialogDescription;
AlertDialog.Overlay = AlertDialogOverlay;
AlertDialog.Title = AlertDialogTitle;
AlertDialog.Trigger = AlertDialogTrigger;

AlertDialog.Title.displayName = TITLE_NAME;
AlertDialog.Cancel.displayName = CANCEL_NAME;
AlertDialog.Action.displayName = ACTION_NAME;
AlertDialog.Content.displayName = CONTENT_NAME;
AlertDialog.Description.displayName = DESCRIPTION_NAME;
AlertDialog.Overlay.displayName = OVERLAY_NAME;
AlertDialog.Trigger.displayName = TRIGGER_NAME;
AlertDialog.displayName = ROOT_NAME;

const [styles, interopDataAttrObj] = createStyleObj(ROOT_NAME, {
  root: dialogStyles.root,
  overlay: {
    ...cssReset(OVERLAY_DEFAULT_TAG),
    ...dialogStyles.overlay,
  },
  trigger: {
    ...cssReset(TRIGGER_DEFAULT_TAG),
    ...dialogStyles.trigger,
  },
  cancel: {
    ...cssReset(CANCEL_DEFAULT_TAG),
    ...dialogStyles.close,
  },
  action: {
    ...cssReset(ACTION_DEFAULT_TAG),
    ...dialogStyles.close,
  },
  content: {
    ...cssReset(CONTENT_DEFAULT_TAG),
    ...dialogStyles.content,
  },
  title: {
    ...cssReset(TITLE_DEFAULT_TAG),
  },
  description: {
    ...cssReset(DESCRIPTION_DEFAULT_TAG),
  },
});

export { AlertDialog, styles };
export type {
  AlertDialogProps,
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogCancelProps,
  AlertDialogActionProps,
  AlertDialogTriggerProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
};

// TODO: Add link to docs when available
const LABEL_WARNING = `${CONTENT_NAME} requires a label for the component to be accessible for screen reader users.

You can label the ${CONTENT_NAME} by passing a ${TITLE_NAME} component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a title by assigning it an \`id\` and passing the same value to the \`aria-labelledby\` prop in ${CONTENT_NAME}. If the label is confusing or duplicative for sighted users, you can also pass a label directly by using the \`aria-label\` prop.

For more information, see https://LINK-TO-DOCS.com`;

const DESC_WARNING = `${CONTENT_NAME} requires a description for the component to be accessible for screen reader users.

You can add a description to the ${CONTENT_NAME} by passing a ${DESCRIPTION_NAME} component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in ${CONTENT_NAME}. If the description is confusing or duplicative for sighted users, you can use the \`interop-ui/react-visually-hidden\` component as a wrapper around your description component.

For more information, see https://LINK-TO-DOCS.com`;

// We need some effects to fire when Dialog.Content is mounted that will give us some useful dev
// warnings. Dialog.Content returns `null` when the Dialog is closed, meaning that if we put these
// effects up in AlertDialog.Content these effects only fire on its initial mount, NOT when the
// underlying Dialog.Content mounts. We stick this inner component inside Dialog.Content to make
// sure the effects fire as expected. This component is only useful in a dev environment, so we
// won't bother rendering it in production.
const AccessibilityDevWarnings: React.FC<AlertDialogContentProps> = function AccessibilityDevWarnings(
  props
) {
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-describedby': ariaDescribedBy,
  } = props;
  const { ownerDocumentRef } = useAlertDialogContentContext(CANCEL_NAME);
  const { descriptionId, titleId } = useAlertDialogContext('AlertDialogContent');
  React.useEffect(() => {
    const ownerDocument = ownerDocumentRef.current;

    // We need to query the DOM to make sure our labeling elements exist. Rendering of inner
    // elements seems to be delayed by something somewhere, so this timeout is only meant to deal
    // with that. Ideally we could revisit this and solve the race condition, but this is just for
    // dev warnings so this is fine. In the event that consumers need to query the inner DOM nodes
    // here they will run into these same challenges.
    const timeout = window.setTimeout(() => {
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
    }, 0);

    return function () {
      window.clearTimeout(timeout);
    };
  }, [titleId, ariaLabel, ariaDescribedBy, descriptionId, ariaLabelledBy, ownerDocumentRef]);

  return null;
};
