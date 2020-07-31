import * as React from 'react';
import {
  Dialog,
  DialogRootProps,
  DialogOverlayProps,
  DialogInnerProps,
  DialogContentProps,
} from '@interop-ui/react-dialog';
import { cssReset, interopDataAttrObj, makeId } from '@interop-ui/utils';
import { createContext, forwardRef, useId, PrimitiveStyles } from '@interop-ui/react-utils';

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type AlertDialogContextValue = {
  descriptionId: string;
  titleId: string;
};
const [AlertDialogContext, useAlertDialogContext] = createContext<AlertDialogContextValue>(
  'AlertDialogContext',
  'AlertDialog.Root'
);

/* -------------------------------------------------------------------------------------------------
 * AlertDialogRoot
 * -----------------------------------------------------------------------------------------------*/

type AlertDialogRootProps = DialogRootProps & {
  /**
   * To prevent accidental destructive behavior if a user reacts too quickly to an alert prompt, an
   * alert dialog should focus on the least destructive action button when it opens. This is the
   * same as `refToFocusOnOpen` in `Dialog`, but it's explicitly named and required here.
   *
   * @see https://www.w3.org/TR/wai-aria-practices-1.2/examples/dialog-modal/alertdialog.html
   */
  leastDestructiveActionRef: React.RefObject<HTMLElement>;
  id?: string;
};

const AlertDialogRoot: React.FC<AlertDialogRootProps> = (props) => {
  let { children, leastDestructiveActionRef, id: idProp, ...dialogProps } = props;

  let generatedId = makeId('alert-dialog', useId());
  let alertDialogId = idProp || generatedId;
  let descriptionId = makeId('description', alertDialogId);
  let titleId = makeId('label', alertDialogId);

  return (
    <AlertDialogContext.Provider
      value={React.useMemo(() => {
        return {
          descriptionId,
          titleId,
        };
      }, [descriptionId, titleId])}
    >
      <Dialog.Root
        {...interopDataAttrObj('AlertDialogRoot')}
        {...dialogProps}
        refToFocusOnOpen={leastDestructiveActionRef}
      >
        {children}
      </Dialog.Root>
    </AlertDialogContext.Provider>
  );
};

AlertDialogRoot.displayName = 'AlertDialog.Root';

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
    let { as = OVERLAY_DEFAULT_TAG, ...overlayProps } = props;
    return (
      <Dialog.Overlay
        {...interopDataAttrObj('AlertDialogRoot')}
        as={as}
        ref={forwardedRef}
        {...overlayProps}
      />
    );
  }
);

AlertDialogOverlay.displayName = 'AlertDialog.Overlay';

/* -------------------------------------------------------------------------------------------------
 * AlertDialogInner
 * -----------------------------------------------------------------------------------------------*/

const INNER_DEFAULT_TAG = 'div';

type AlertDialogInnerDOMProps = React.ComponentPropsWithoutRef<typeof INNER_DEFAULT_TAG>;
type AlertDialogInnerOwnProps = {};
type AlertDialogInnerProps = DialogInnerProps & AlertDialogInnerDOMProps & AlertDialogInnerOwnProps;

const AlertDialogInner = forwardRef<typeof INNER_DEFAULT_TAG, AlertDialogInnerProps>(
  function AlertDialogInner(props, forwardedRef) {
    let { as = INNER_DEFAULT_TAG, ...innerProps } = props;
    return (
      <Dialog.Inner
        {...interopDataAttrObj('AlertDialogInner')}
        as={as}
        ref={forwardedRef}
        {...innerProps}
      />
    );
  }
);

AlertDialogInner.displayName = 'AlertDialog.Inner';

/* -------------------------------------------------------------------------------------------------
 * AlertDialogContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_DEFAULT_TAG = 'div';

type AlertDialogContentDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type AlertDialogContentOwnProps = {};
type AlertDialogContentProps = DialogContentProps &
  AlertDialogContentDOMProps &
  AlertDialogContentOwnProps;

const AlertDialogContent = forwardRef<typeof CONTENT_DEFAULT_TAG, AlertDialogContentProps>(
  function AlertDialogContent(props, forwardedRef) {
    let {
      as = CONTENT_DEFAULT_TAG,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...dialogContentProps
    } = props;
    let { descriptionId, titleId } = useAlertDialogContext('AlertDialogContent');
    React.useEffect(() => {
      if (__DEV__) {
        if (!ariaLabel && !(titleId && document.getElementById(titleId))) {
          console.warn(
            // TODO: Improve warning and add link to docs when available
            `You must label your AlertDialog.`
          );
        }
        if (!ariaDescribedBy && !(descriptionId && document.getElementById(descriptionId))) {
          console.warn(
            // TODO: Improve warning and add link to docs when available
            `You must use a description for your AlertDialog.`
          );
        }
      }
    }, [titleId, ariaLabel, ariaDescribedBy, descriptionId]);
    return (
      <Dialog.Content
        {...interopDataAttrObj('AlertDialogContent')}
        as={as}
        ref={forwardedRef}
        role="alertdialog"
        aria-describedby={ariaDescribedBy || descriptionId}
        aria-labelledby={ariaLabel ? undefined : titleId}
        aria-label={ariaLabel || undefined}
        {...dialogContentProps}
      />
    );
  }
);

AlertDialogContent.displayName = 'AlertDialog.Content';

/* -------------------------------------------------------------------------------------------------
 * AlertDialogTitle
 * -----------------------------------------------------------------------------------------------*/

const TITLE_DEFAULT_TAG = 'h2';

type AlertDialogTitleDOMProps = React.ComponentPropsWithoutRef<typeof TITLE_DEFAULT_TAG>;
type AlertDialogTitleOwnProps = {};
type AlertDialogTitleProps = AlertDialogTitleDOMProps & AlertDialogTitleOwnProps;

const AlertDialogTitle = forwardRef<typeof TITLE_DEFAULT_TAG, AlertDialogTitleProps>(
  function AlertDialogTitle(props, forwardedRef) {
    let { as: Comp = TITLE_DEFAULT_TAG, ...titleProps } = props;
    let { titleId } = useAlertDialogContext('AlertDialogTitle');
    return (
      <Comp
        {...interopDataAttrObj('AlertDialogTitle')}
        ref={forwardedRef}
        id={titleId}
        {...titleProps}
      />
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
      {...interopDataAttrObj('AlertDialogDescription')}
      ref={forwardedRef}
      id={descriptionId}
      {...descriptionProps}
    />
  );
});

AlertDialogDescription.displayName = 'AlertDialog.Description';

/* -------------------------------------------------------------------------------------------------
 * Composed AlertDialog
 * -----------------------------------------------------------------------------------------------*/

type AlertDialogDOMProps = React.ComponentPropsWithoutRef<typeof CONTENT_DEFAULT_TAG>;
type AlertDialogOwnProps = AlertDialogRootProps;
type AlertDialogProps = AlertDialogDOMProps & AlertDialogOwnProps;

const AlertDialog = forwardRef<
  typeof CONTENT_DEFAULT_TAG,
  AlertDialogProps,
  AlertDialogStaticProps
>(function AlertDialog(props, forwardedRef) {
  let {
    isOpen,
    onClose,
    leastDestructiveActionRef,
    refToFocusOnClose,
    shouldCloseOnEscape,
    shouldCloseOnOutsideClick,
    children,
    ...contentProps
  } = props;
  return (
    <AlertDialogRoot
      isOpen={isOpen}
      leastDestructiveActionRef={leastDestructiveActionRef}
      onClose={onClose}
      refToFocusOnClose={refToFocusOnClose}
      shouldCloseOnEscape={shouldCloseOnEscape}
      shouldCloseOnOutsideClick={shouldCloseOnOutsideClick}
    >
      <AlertDialogOverlay>
        <AlertDialogInner>
          <AlertDialogContent ref={forwardedRef} {...contentProps}>
            {children}
          </AlertDialogContent>
        </AlertDialogInner>
      </AlertDialogOverlay>
    </AlertDialogRoot>
  );
});

/* ---------------------------------------------------------------------------------------------- */

AlertDialog.displayName = 'AlertDialog';
AlertDialog.Root = AlertDialogRoot;
AlertDialog.Overlay = AlertDialogOverlay;
AlertDialog.Inner = AlertDialogInner;
AlertDialog.Content = AlertDialogContent;

interface AlertDialogStaticProps {
  Root: typeof AlertDialogRoot;
  Overlay: typeof AlertDialogOverlay;
  Inner: typeof AlertDialogInner;
  Content: typeof AlertDialogContent;
  Title: typeof AlertDialogTitle;
  Description: typeof AlertDialogDescription;
}

const useHasAlertDialogContext = () => {
  try {
    let ctx = useAlertDialogContext('useHasAlertDialogContext');
    return !!ctx;
  } catch (err) {}
  return false;
};

const styles: PrimitiveStyles = {
  root: null,
  overlay: {
    ...cssReset(OVERLAY_DEFAULT_TAG),
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  inner: {
    ...cssReset(INNER_DEFAULT_TAG),
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    pointerEvents: 'none',
  },
  content: {
    ...cssReset(CONTENT_DEFAULT_TAG),
    pointerEvents: 'auto',
  },
  title: {
    ...cssReset(TITLE_DEFAULT_TAG),
  },
  description: {
    ...cssReset(DESCRIPTION_DEFAULT_TAG),
  },
};

export { AlertDialog, styles, useHasAlertDialogContext };
export type {
  AlertDialogProps,
  AlertDialogRootProps,
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogInnerProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
};
