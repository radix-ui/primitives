import * as React from 'react';
import { useBodyPointerEvents } from '@radix-ui/react-use-body-pointer-events';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useEscapeKeydown } from '@radix-ui/react-use-escape-keydown';

// We need to compute the total count of layers AND a running count of all layers
// in order to find which layer is the deepest one.
// This is use to only dismiss the deepest layer when using the escape key
// because we bind the key listener to document so cannot take advantage of event.stopPropagation()
const [TotalLayerCountProvider, useTotalLayerCount] = createTotalLayerCount();
const [RunningLayerCountProvider, usePreviousRunningLayerCount] = createRunningLayerCount();

// We need to compute the total count of layers which set `disableOutsidePointerEvents` to `true` AND
// a running count of all the layers which set `disableOutsidePointerEvents` to `true` in order to determine
// which layers should be dismissed when interacting outside.
// (ie. all layers that do not have a child layer which sets `disableOutsidePointerEvents` to `true`)
const [
  TotalLayerCountWithDisabledOutsidePointerEventsProvider,
  useTotalLayerCountWithDisabledOutsidePointerEvents,
] = createTotalLayerCount('TotalLayerCountWithDisabledOutsidePointerEventsProvider');
const [
  RunningLayerCountWithDisabledOutsidePointerEventsProvider,
  usePreviousRunningLayerCountWithDisabledOutsidePointerEvents,
] = createRunningLayerCount('RunningLayerCountWithDisabledOutsidePointerEventsProvider');

/* -------------------------------------------------------------------------------------------------
 * DismissableLayer
 * -----------------------------------------------------------------------------------------------*/

type DismissableLayerProps = {
  children: (
    args: ReturnType<typeof usePointerDownOutside> &
      ReturnType<typeof useFocusOutside> & {
        style: React.CSSProperties;
      }
  ) => React.ReactElement;

  /**
   * When `true`, hover/focus/click interactions will be disabled on elements outside the `DismissableLayer`.
   * Users will need to click twice on outside elements to interact with them:
   * Once to close the `DismissableLayer`, and again to trigger the element.
   */
  disableOutsidePointerEvents?: boolean;

  /**
   * Event handler called when the escape key is down.
   * Can be prevented.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * Event handler called when the a pointer event happens outside of the `DismissableLayer`.
   * Can be prevented.
   */
  onPointerDownOutside?: (event: MouseEvent | TouchEvent) => void;

  /**
   * Event handler called when the focus moves outside of the `DismissableLayer`.
   * Can be prevented.
   */
  onFocusOutside?: (event: React.FocusEvent) => void;

  /**
   * Event handler called when an interaction happens outside the `DismissableLayer`.
   * Specifically, when a pointer event happens outside of the `DismissableLayer` or focus moves outside of it.
   * Can be prevented.
   */
  onInteractOutside?: (event: MouseEvent | TouchEvent | React.FocusEvent) => void;

  /** Callback called when the `DismissableLayer` should be dismissed */
  onDismiss?: () => void;
};

function DismissableLayer(props: DismissableLayerProps) {
  const runningLayerCount = usePreviousRunningLayerCount();
  const isRootLayer = runningLayerCount === 0;
  const layer = <DismissableLayerImpl {...props} />;

  // if it's the root layer, we wrap it with our necessary root providers
  // (effectively we wrap the whole tree of nested layers)
  return isRootLayer ? (
    <TotalLayerCountProvider>
      <TotalLayerCountWithDisabledOutsidePointerEventsProvider>
        {layer}
      </TotalLayerCountWithDisabledOutsidePointerEventsProvider>
    </TotalLayerCountProvider>
  ) : (
    layer
  );
}

function DismissableLayerImpl(props: React.ComponentProps<typeof DismissableLayer>) {
  const {
    children,
    disableOutsidePointerEvents = false,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    onDismiss,
  } = props;

  const totalLayerCount = useTotalLayerCount();
  const prevRunningLayerCount = usePreviousRunningLayerCount();
  const runningLayerCount = prevRunningLayerCount + 1;
  const isDeepestLayer = runningLayerCount === totalLayerCount;

  const totalLayerCountWithDisabledOutsidePointerEvents = useTotalLayerCountWithDisabledOutsidePointerEvents(
    disableOutsidePointerEvents
  );
  const prevRunningLayerCountWithDisabledOutsidePointerEvents = usePreviousRunningLayerCountWithDisabledOutsidePointerEvents();
  const runningLayerCountWithDisabledOutsidePointerEvents =
    prevRunningLayerCountWithDisabledOutsidePointerEvents + (disableOutsidePointerEvents ? 1 : 0);
  const containsChildLayerWithDisabledOutsidePointerEvents =
    runningLayerCountWithDisabledOutsidePointerEvents <
    totalLayerCountWithDisabledOutsidePointerEvents;

  // Disable pointer-events on `document.body` when at least one layer is disabling outside pointer events
  useBodyPointerEvents({ disabled: disableOutsidePointerEvents });

  // Dismiss on escape
  useEscapeKeydown((event) => {
    // Only dismiss if it's the deepest layer. his is effectively mimicking
    // event.stopPropagation from the layer with disabled outside pointer events.
    if (isDeepestLayer) {
      onEscapeKeyDown?.(event);
      if (!event.defaultPrevented) {
        onDismiss?.();
      }
    }
  });

  // Dismiss on pointer down outside
  const pointerDownOutside = usePointerDownOutside((event) => {
    // Only dismiss if there's no deeper layer which disabled pointer events outside itself
    if (!containsChildLayerWithDisabledOutsidePointerEvents) {
      onPointerDownOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) {
        onDismiss?.();
      }
    }
  });

  // Dismiss on focus outside
  const focusOutside = useFocusOutside((event) => {
    onFocusOutside?.(event);
    onInteractOutside?.(event);
    if (!event.defaultPrevented) {
      onDismiss?.();
    }
  });

  // If we have disabled pointer events on body, we need to reset `pointerEvents: 'auto'`
  // on some layers. This depends on which layers set `disableOutsidePointerEvents` to `true`.
  //
  // NOTE: it's important we set it on ALL layers that need it as we cannot simply
  // set it on the deepest layer which sets `disableOutsidePointerEvents` to `true` and rely
  // on inheritence. This is because layers may be rendered in different portals where
  // inheritence wouldn't apply, so we need to set it explicity on its children too.
  const isBodyPointerEventsDisabled = totalLayerCountWithDisabledOutsidePointerEvents > 0;
  const shouldReEnablePointerEvents =
    isBodyPointerEventsDisabled && !containsChildLayerWithDisabledOutsidePointerEvents;

  return (
    <RunningLayerCountProvider runningCount={runningLayerCount}>
      <RunningLayerCountWithDisabledOutsidePointerEventsProvider
        runningCount={runningLayerCountWithDisabledOutsidePointerEvents}
      >
        {children({
          style: shouldReEnablePointerEvents ? { pointerEvents: 'auto' } : {},
          ...pointerDownOutside,
          ...focusOutside,
        })}
      </RunningLayerCountWithDisabledOutsidePointerEventsProvider>
    </RunningLayerCountProvider>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Utility hooks
 * -----------------------------------------------------------------------------------------------*/

/**
 * Sets up mousedown/touchstart listeners which listens for pointer down events outside a react subtree.
 *
 * We use `mousedown` rather than click` for 2 reasons:
 * - to mimic layer dismissing behaviour present in OS which usually happens on mousedown
 * - to enable to us call `event.preventDefault()` and prevent focus from happening.
 *
 * Returns props to pass to the node we want to check for outside events.
 */
function usePointerDownOutside(
  onPointerDownOutsideProp?: (event: MouseEvent | TouchEvent) => void
) {
  const onPointerDownOutside = useCallbackRef(onPointerDownOutsideProp);
  const isEventInside = React.useRef(false);

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!isEventInside.current) {
        onPointerDownOutside(event);
      }
      isEventInside.current = false;
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [onPointerDownOutside]);

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
 * Listens for when focus moves outside a react subtree.
 * Returns props to pass to the root (node) of the subtree we want to check.
 */
function useFocusOutside(onFocusOutside?: (event: React.FocusEvent) => void) {
  const timerRef = React.useRef<number>(0);

  return {
    onBlurCapture: (event: React.FocusEvent) => {
      event.persist();
      timerRef.current = window.setTimeout(() => {
        onFocusOutside?.(event);
      }, 0);
    },
    onFocusCapture: () => {
      window.clearTimeout(timerRef.current);
    },
  };
}

/* -------------------------------------------------------------------------------------------------
 * Layer counting utilities
 * -----------------------------------------------------------------------------------------------*/

function createTotalLayerCount(displayName?: string) {
  const TotalLayerCountContext = React.createContext<{
    total: number;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
  }>({ total: 0, setTotal: () => {} });

  const TotalLayerCountProvider: React.FC = ({ children }) => {
    const [total, setTotal] = React.useState(0);
    const context = React.useMemo(() => ({ total, setTotal }), [total, setTotal]);
    return (
      <TotalLayerCountContext.Provider value={context}>{children}</TotalLayerCountContext.Provider>
    );
  };
  if (displayName) {
    TotalLayerCountProvider.displayName = displayName;
  }

  function useTotalLayerCount(counted = true) {
    const { total, setTotal } = React.useContext(TotalLayerCountContext);

    React.useLayoutEffect(() => {
      if (counted) {
        setTotal((n) => n + 1);
        return () => setTotal((n) => n - 1);
      }
    }, [counted, setTotal]);

    return total;
  }

  return [TotalLayerCountProvider, useTotalLayerCount] as const;
}

function createRunningLayerCount(displayName?: string) {
  const RunningLayerCountContext = React.createContext(0);

  const RunningLayerCountProvider: React.FC<{ runningCount: number }> = (props) => {
    const { children, runningCount } = props;
    return (
      <RunningLayerCountContext.Provider value={runningCount}>
        {children}
      </RunningLayerCountContext.Provider>
    );
  };
  if (displayName) {
    RunningLayerCountProvider.displayName = displayName;
  }

  function usePreviousRunningLayerCount() {
    return React.useContext(RunningLayerCountContext) || 0;
  }

  return [RunningLayerCountProvider, usePreviousRunningLayerCount] as const;
}

const Root = DismissableLayer;

export {
  DismissableLayer,
  //
  Root,
};
