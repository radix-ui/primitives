import * as React from 'react';
import {
  Dialog,
  DialogCloseProps,
  DialogContentProps,
  DialogOverlayProps,
  DialogProps,
  DialogTriggerProps,
  styles as dialogStyles,
} from '@interop-ui/react-dialog';
import { cssReset, makeId, warning } from '@interop-ui/utils';
import {
  createContext,
  createStyleObj,
  forwardRef,
  useComposedRefs,
  useId,
} from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

const ROOT_NAME = 'AlertDialog';

type AlertDialogContextValue = {
  descriptionId: string;
  titleId: string;
};

type AlertDialogContentContextValue = {
  leastDestructiveActionRef: React.MutableRefObject<HTMLElement | null | undefined>;
};

const [AlertDialogContext, useAlertDialogContext] = createContext<AlertDialogContextValue>(
  'AlertDialogContext',
  ROOT_NAME
);

const [AlertDialogContentContext, useAlertDialogContentContext] = createContext<
  AlertDialogContentContextValue
>('AlertDialogContext', ROOT_NAME);

/* -------------------------------------------------------------------------------------------------
 * AlertDialogRoot
 * -----------------------------------------------------------------------------------------------*/

type AlertDialogProps = DialogProps;

const AlertDialog: React.FC<AlertDialogProps> = (props) => {
  const { children, id: idProp, ...dialogProps } = props;
  const generatedId = makeId('alert-dialog', useId());
  const alertDialogId = idProp || generatedId;
  const descriptionId = makeId('description', alertDialogId);
  const titleId = makeId('label', alertDialogId);

  return (
    <AlertDialogContext.Provider
      value={React.useMemo(() => {
        return {
          descriptionId,
          titleId,
        };
      }, [descriptionId, titleId])}
    >
      <Dialog {...dialogProps}>{children}</Dialog>
    </AlertDialogContext.Provider>
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

AlertDialogTrigger.displayName = TRIGGER_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogOverlay
 * -----------------------------------------------------------------------------------------------*/

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

AlertDialogOverlay.displayName = 'AlertDialog.Overlay';

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
    const { leastDestructiveActionRef } = useAlertDialogContentContext(CANCEL_NAME);
    const ref = useComposedRefs(forwardedRef, leastDestructiveActionRef as any);
    return <Dialog.Close {...interopDataAttrObj('cancel')} as={as} ref={ref} {...cancelProps} />;
  }
);

AlertDialogCancel.displayName = CANCEL_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogConfirm
 * -----------------------------------------------------------------------------------------------*/

const CONFIRM_NAME = 'AlertDialog.Confirm';
const CONFIRM_DEFAULT_TAG = 'button';

type AlertDialogConfirmDOMProps = React.ComponentPropsWithoutRef<typeof CONFIRM_DEFAULT_TAG>;
type AlertDialogConfirmOwnProps = {};
type AlertDialogConfirmProps = DialogCloseProps &
  AlertDialogConfirmOwnProps &
  AlertDialogConfirmDOMProps;

const AlertDialogConfirm = forwardRef<typeof CONFIRM_DEFAULT_TAG, AlertDialogCancelProps>(
  function AlertDialogConfirm(props, forwardedRef) {
    const { as = CONFIRM_DEFAULT_TAG, ...confirmProps } = props;
    return (
      <Dialog.Close
        {...interopDataAttrObj('confirm')}
        as={as}
        ref={forwardedRef}
        {...confirmProps}
      />
    );
  }
);

AlertDialogConfirm.displayName = CONFIRM_NAME;

/* -------------------------------------------------------------------------------------------------
 * AlertDialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_DEFAULT_TAG = 'div';

type AlertDialogContentDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type AlertDialogContentOwnProps = {
  /**
   * To prevent accidental destructive behavior if a user reacts too quickly to an alert prompt, an
   * alert dialog should focus on the least destructive action button when it opens. This is the
   * same as `refToFocusOnOpen` in `Dialog`, but it's explicitly named here to clarify that
   * distinction. This can be passed when not using `AlertDialog.Cancel`.
   *
   * @see https://www.w3.org/TR/wai-aria-practices-1.2/examples/dialog-modal/alertdialog.html
   */
  leastDestructiveActionRef?: React.RefObject<HTMLElement | null | undefined>;
};
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
      leastDestructiveActionRef: leastDestructiveActionRefProp,
      ...dialogContentProps
    } = props;
    const { descriptionId, titleId } = useAlertDialogContext('AlertDialogContent');
    const cancelRef = React.useRef<HTMLElementTagNameMap[typeof CANCEL_DEFAULT_TAG] | null>(null);
    const leastDestructiveActionRef = leastDestructiveActionRefProp || cancelRef;

    if (process.env.NODE_ENV === 'development') {
      // Hook is called conditionally but safely, as it's consistent in a given environment
      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useEffect(() => {
        const hasLabel = Boolean(
          ariaLabel ||
            (ariaLabelledBy && document.getElementById(ariaLabelledBy)) ||
            (titleId && document.getElementById(titleId))
        );
        const hasDescription = Boolean(
          (ariaDescribedBy && document.getElementById(ariaDescribedBy)) ||
            (descriptionId && document.getElementById(descriptionId))
        );

        // TODO: Improve warnings and add link to docs when available
        warning(hasLabel, `You must label your AlertDialog.`);
        warning(hasDescription, `You must use a description for your AlertDialog.`);
      }, [titleId, ariaLabel, ariaDescribedBy, descriptionId, ariaLabelledBy]);
    }

    return (
      <AlertDialogContentContext.Provider
        value={React.useMemo(() => {
          return {
            leastDestructiveActionRef,
          };
        }, [leastDestructiveActionRef])}
      >
        <Dialog.Content
          {...interopDataAttrObj('content')}
          as={as}
          ref={forwardedRef}
          role="alertdialog"
          aria-describedby={ariaDescribedBy || descriptionId}
          // If `aria-label` is set, ensure `aria-labelledby` is undefined as to avoid confusion.
          // Otherwise fallback to an explicit `aria-labelledby` or the ID used in the
          // `AlertDialogTitle`
          aria-labelledby={ariaLabel ? undefined : ariaLabelledBy || titleId}
          aria-label={ariaLabel || undefined}
          {...dialogContentProps}
          refToFocusOnOpen={leastDestructiveActionRef}
        />
      </AlertDialogContentContext.Provider>
    );
  }
);

AlertDialogContent.displayName = 'AlertDialog.Content';

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTitle
 * -----------------------------------------------------------------------------------------------*/

// Because `AlertDialog` depends more heavily on both a title and description for proper screen
// reader announcements, we provide explicit components for each to reduce the friction and make it
// simpler to get these right. These are optional if the consumer prefers to pass appropriate aria
// labelling props directly.

const TITLE_DEFAULT_TAG = 'h2';

type AlertDialogTitleDOMProps = React.ComponentPropsWithoutRef<typeof TITLE_DEFAULT_TAG>;
type AlertDialogTitleOwnProps = {};
type AlertDialogTitleProps = AlertDialogTitleDOMProps & AlertDialogTitleOwnProps;

const AlertDialogTitle = forwardRef<typeof TITLE_DEFAULT_TAG, AlertDialogTitleProps>(
  function AlertDialogTitle(props, forwardedRef) {
    let { as: Comp = TITLE_DEFAULT_TAG, ...titleProps } = props;
    let { titleId } = useAlertDialogContext('AlertDialogTitle');
    return (
      <Comp {...interopDataAttrObj('title')} ref={forwardedRef} id={titleId} {...titleProps} />
    );
  }
);

AlertDialogTitle.displayName = 'AlertDialog.Title';

/* -------------------------------------------------------------------------------------------------
 * AlertDialogDescription
 * -----------------------------------------------------------------------------------------------*/

const DESCRIPTION_DEFAULT_TAG = 'div';

type AlertDialogDescriptionDOMProps = React.ComponentPropsWithoutRef<
  typeof DESCRIPTION_DEFAULT_TAG
>;
type AlertDialogDescriptionOwnProps = {};
type AlertDialogDescriptionProps = AlertDialogDescriptionDOMProps & AlertDialogDescriptionOwnProps;

const AlertDialogDescription = forwardRef<
  typeof DESCRIPTION_DEFAULT_TAG,
  AlertDialogDescriptionProps
>(function AlertDialogDescription(props, forwardedRef) {
  let { as: Comp = DESCRIPTION_DEFAULT_TAG, ...descriptionProps } = props;
  let { descriptionId } = useAlertDialogContext('AlertDialogDescription');
  return (
    <Comp
      {...interopDataAttrObj('description')}
      ref={forwardedRef}
      id={descriptionId}
      {...descriptionProps}
    />
  );
});

AlertDialogDescription.displayName = 'AlertDialog.Description';

/* ---------------------------------------------------------------------------------------------- */

const _AlertDialog = Object.assign(AlertDialog, {
  Overlay: AlertDialogOverlay,
  Trigger: AlertDialogTrigger,
  Content: AlertDialogContent,
  Cancel: AlertDialogCancel,
  Confirm: AlertDialogConfirm,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
});

_AlertDialog.displayName = 'AlertDialog';

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
  confirm: {
    ...cssReset(CONFIRM_DEFAULT_TAG),
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

export { _AlertDialog as AlertDialog, styles };
export type {
  AlertDialogProps,
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogCancelProps,
  AlertDialogConfirmProps,
  AlertDialogTriggerProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
};
