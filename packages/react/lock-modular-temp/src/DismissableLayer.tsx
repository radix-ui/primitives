import * as React from 'react';
import { composeEventHandlers, useCallbackRef } from '@interop-ui/react-utils';

const INTERACT_OUTSIDE_EVENT_TYPE = 'dismissablelayer.interactoutside';
type InteractOutsideEvent = CustomEvent<{ target: EventTarget | null; nativeEvent: Event }>;

/* -------------------------------------------------------------------------------------------------
 * Root level context
 * -----------------------------------------------------------------------------------------------*/

type DismissableLayerContextValue = {
  setPreventDismissOnEscape: (can: boolean) => void;
  setPreventDismissOnInteractOutside: (prevent: boolean) => void;
};
const DismissableLayerContext = React.createContext<DismissableLayerContextValue | undefined>(
  undefined
);
DismissableLayerContext.displayName = 'DismissableLayerContext';

/* -------------------------------------------------------------------------------------------------
 * DismissableLayer
 * -----------------------------------------------------------------------------------------------*/

type DismissableLayerProps = {
  children: (
    args: {
      ref: React.RefObject<any>;
    } & ReturnType<typeof useDisableOutsidePointerEvents> &
      ReturnType<typeof useInteractOutside>
  ) => React.ReactElement;

  /**
   * When `true`, hover/focus/click interactions will be disabled on elements outside
   * the `DismissableLayer`. Users will need to click twice on outside elements to interact
   * with them – once to close the `DismissableLayer`, and again to trigger the element.
   */
  disableOutsidePointerEvents?: boolean;

  /** Handler called when the escape key is down */
  onEscapeKeyDown?: React.KeyboardEventHandler;

  /**
   * Handler called when an interaction happened outside the `DismissableLayer`.
   * Specifically, when focus leaves the `DismissableLayer` or a pointer event happens outside it.
   */
  onInteractOutside?: (event: InteractOutsideEvent) => void;

  /** Handler called when the `DismissableLayer` should be dismissed */
  onDismiss?: () => void;
};

function DismissableLayer(props: DismissableLayerProps) {
  const {
    children,
    disableOutsidePointerEvents = false,
    onEscapeKeyDown,
    onInteractOutside,
    onDismiss,
  } = props;
  const nodeRef = React.useRef<HTMLElement>(null);

  // Disable outside pointer events
  const disableOutsidePointerEventProps = useDisableOutsidePointerEvents({
    active: disableOutsidePointerEvents,
  });

  // Dismiss on escape (one layer at the time)
  const setPreventDismissOnEscape = useEscapableLayer({ onEscapeKeyDown, onDismiss });

  // Dismiss on outside interaction (one layer at a time — depends on `disableOutsidePointerEvents`)
  const {
    props: interactOutsideProps,
    setPreventDismissOnInteractOutside,
  } = useInteractOutsideLayer({
    nodeRef,
    disableOutsidePointerEvents,
    onInteractOutside,
    onDismiss,
  });

  const layer = React.useMemo(
    () => ({
      setPreventDismissOnEscape,
      setPreventDismissOnInteractOutside,
    }),
    [setPreventDismissOnEscape, setPreventDismissOnInteractOutside]
  );

  return (
    <DismissableLayerContext.Provider value={layer}>
      <FocusEdgeGuard />
      {children({
        ref: nodeRef,
        style: disableOutsidePointerEventProps.style,
        ...interactOutsideProps,
        onMouseDownCapture: composeEventHandlers(
          disableOutsidePointerEventProps.onMouseDownCapture,
          interactOutsideProps.onMouseDownCapture
        ),
        onTouchStartCapture: composeEventHandlers(
          disableOutsidePointerEventProps.onTouchStartCapture,
          interactOutsideProps.onTouchStartCapture
        ),
      })}
      <FocusEdgeGuard />
    </DismissableLayerContext.Provider>
  );
}

/**
 * This component exists to ensure we can catch events
 * even when the dismissable layer is at the edge of the DOM.
 */
function FocusEdgeGuard() {
  return (
    <span
      data-dismissable-layer-focus-edge-guard
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      style={{ position: 'fixed', opacity: 0, pointerEvents: 'none' }}
    />
  );
}

/* -------------------------------------------------------------------------------------------------
 * Hooks
 * -----------------------------------------------------------------------------------------------*/

/**
 * Disables pointer events outside a given node.
 * Returns props to pass to the given node.
 */
function useDisableOutsidePointerEvents({ active = false }) {
  // disable pointer events on body
  React.useEffect(() => {
    if (active) {
      const originalBodyPointerEvents = document.body.style.pointerEvents;
      document.body.style.pointerEvents = 'none';
      return () => {
        document.body.style.pointerEvents = originalBodyPointerEvents;
      };
    }
  }, [active]);

  const pointerDownOutsideProps = usePointerDownOutside((event) => {
    if (active) {
      // NOTE: We do this to prevent focus event from happening
      event.preventDefault();
    }
  });

  // ensures events don't go through `DismissableLayer`s
  // because we have disabled `pointerEvents` on the body.
  return {
    ...pointerDownOutsideProps,
    style: { pointerEvents: 'auto' } as React.CSSProperties,
  };
}

/**
 * Sets up dismissing when pressing escape, whilst ensuring only one layer is dismissed at one time.
 * Returns functions to enable/disable dismissing on escape.
 */
function useEscapableLayer(options: {
  onEscapeKeyDown?: React.KeyboardEventHandler;
  onDismiss?: () => void;
}) {
  const { onEscapeKeyDown, onDismiss } = options;
  const [preventDismiss, setPreventDismiss] = React.useState(false);
  const parentLayer = React.useContext(DismissableLayerContext);

  const handleEscapeKeyDown = useCallbackRef(onEscapeKeyDown);
  const handleDismiss = useCallbackRef(onDismiss);

  // if a layer has a parent layer, prevent the parent layer from dismissing on escape
  // effectively only dismissing one layer at a time
  React.useEffect(() => {
    if (parentLayer) {
      parentLayer.setPreventDismissOnEscape(true);
      return () => parentLayer.setPreventDismissOnEscape(false);
    }
  }, [parentLayer]);

  // add keydown event
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !preventDismiss) {
        handleEscapeKeyDown?.(event);
        if (!event.defaultPrevented) {
          handleDismiss?.();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [preventDismiss, handleDismiss, handleEscapeKeyDown]);

  return setPreventDismiss;
}

function useInteractOutsideLayer(options: {
  nodeRef: React.RefObject<HTMLElement>;
  disableOutsidePointerEvents?: boolean;
  onInteractOutside?: (event: InteractOutsideEvent) => void;
  onDismiss?: () => void;
}) {
  const { nodeRef, disableOutsidePointerEvents, onInteractOutside, onDismiss } = options;
  const [preventDismiss, setPreventDismissOnInteractOutside] = React.useState(false);
  const parentLayer = React.useContext(DismissableLayerContext);

  // if a layer is disabling outside pointer events
  // prevent all its parents from dismissing on outside interaction
  React.useEffect(() => {
    const preventParentDismiss = preventDismiss || disableOutsidePointerEvents;
    if (parentLayer && preventParentDismiss) {
      parentLayer.setPreventDismissOnInteractOutside(true);
      return () => parentLayer.setPreventDismissOnInteractOutside(false);
    }
  }, [preventDismiss, disableOutsidePointerEvents, parentLayer]);

  const interactOutsideProps = useInteractOutside(nodeRef, (event) => {
    if (!preventDismiss) {
      onInteractOutside?.(event);
      if (!event.defaultPrevented) {
        onDismiss?.();
      }
    }
  });

  return { props: interactOutsideProps, setPreventDismissOnInteractOutside };
}

/**
 * Sets up dissmissing when interacting outside a given node.
 * Returns props to pass to the given node.
 */
function useInteractOutside(
  nodeRef: React.RefObject<HTMLElement>,
  onInteractOutside?: (event: InteractOutsideEvent) => void
) {
  const handleInteractOutside = useCallbackRef(onInteractOutside);

  const dispatchInteractOutsideCustomEvent = useCallbackRef(
    (nativeEvent: Event, target: EventTarget | null) => {
      const options = { bubbles: false, cancelable: true, detail: { target, nativeEvent } };
      const interactOutsideEvent: InteractOutsideEvent = new CustomEvent(
        INTERACT_OUTSIDE_EVENT_TYPE,
        options
      );

      nodeRef.current?.dispatchEvent(interactOutsideEvent);

      if (interactOutsideEvent.defaultPrevented) {
        nativeEvent.preventDefault();
      }
    }
  );

  // listen for custom even dispatched
  React.useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      node.addEventListener(INTERACT_OUTSIDE_EVENT_TYPE, handleInteractOutside);
      return () => node.removeEventListener(INTERACT_OUTSIDE_EVENT_TYPE, handleInteractOutside);
    }
  }, [handleInteractOutside, nodeRef]);

  const pointerDownOutsideProps = usePointerDownOutside((event) => {
    dispatchInteractOutsideCustomEvent(event, event.target);
  });

  const focusLeave = useFocusLeave((event) => {
    dispatchInteractOutsideCustomEvent(event, event.target);
  });

  return {
    ...pointerDownOutsideProps,
    ...focusLeave,
  };
}

/**
 * Sets up mousedown/touchstart listeners which listens for pointer down events outside a node.
 * Also respects the react tree rather than just the DOM tree.
 *
 * We use `mousedown` rather than click` for 2 reasons:
 * - to mimic layer dismissing behaviour present in OS which usually happens on mousedown
 * - to enable to us call `event.preventDefault()` and prevent focus from happening.
 *
 * Returns props to pass to the node we want to check for outside events.
 */
function usePointerDownOutside(onOutsidePointerDown?: (event: MouseEvent | TouchEvent) => void) {
  const handleOutsidePointerDown = useCallbackRef(onOutsidePointerDown);
  const isEventInside = React.useRef(false);

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!isEventInside.current) {
        handleOutsidePointerDown(event);
      }
      isEventInside.current = false;
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [handleOutsidePointerDown]);

  const markEventAsInside = () => {
    isEventInside.current = true;
  };

  return {
    // ensures we check React component tree (not just DOM tree)
    onMouseDownCapture: markEventAsInside as React.MouseEventHandler,
    onTouchStartCapture: markEventAsInside as React.TouchEventHandler,
  };
}

/**
 * Listens for when focus leaves a given node.
 * Also respects the react tree rather than just the DOM tree.
 *
 * Returns props to pass to the node we want to check.
 */
function useFocusLeave(onFocusLeave?: (event: React.FocusEvent) => void) {
  const timerRef = React.useRef<number>(0);
  return {
    onBlurCapture: (event: React.FocusEvent) => {
      event.persist();
      timerRef.current = window.setTimeout(() => {
        if (event.relatedTarget !== null) {
          onFocusLeave?.(event);
        }
      }, 0);
    },
    onFocusCapture: () => {
      window.clearTimeout(timerRef.current);
    },
  };
}

export { DismissableLayer };
export type { DismissableLayerProps };
