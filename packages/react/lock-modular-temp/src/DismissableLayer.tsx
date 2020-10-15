import * as React from 'react';
import { createContext, useCallbackRef, useLayoutEffect } from '@interop-ui/react-utils';
import { useDebugContext } from '@interop-ui/react-debug-context';

const increment = (n: number) => n + 1;
const decrement = (n: number) => n - 1;

/* -------------------------------------------------------------------------------------------------
 * LayerTreeProvider (root of all layers)
 * -----------------------------------------------------------------------------------------------*/

// This context will help with capturing information about the whole tree of layers
type LayerTreeContextValue = {
  totalLayerCount: number;
  totalLayerCountWithDisabledOutsidePointerEvents: number;
  isBodyPointerEventsDisabled: boolean;
  addLayer: (layer: LayerConfig) => void;
  removeLayer: (layer: LayerConfig) => void;
};
const [LayerTreeContext, useLayerTreeContext] = createContext<LayerTreeContextValue>(
  'LayerTreeContext',
  'LayerTreeProvider'
);

const LayerTreeProvider: React.FC = ({ children }) => {
  const [totalLayerCount, setTotalLayerCount] = React.useState(0);
  const [
    totalLayerCountWithDisabledOutsidePointerEvents,
    setTotalLayerCountWithDisabledOutsidePointerEvents,
  ] = React.useState(0);

  const isBodyPointerEventsDisabled = totalLayerCountWithDisabledOutsidePointerEvents > 0;

  // disable pointer-events on `document.body` when at least one layer is disabling outside pointer events
  useLayoutEffect(() => {
    if (isBodyPointerEventsDisabled) {
      const originalBodyPointerEvents = document.body.style.pointerEvents;
      document.body.style.pointerEvents = 'none';
      return () => {
        document.body.style.pointerEvents = originalBodyPointerEvents;
      };
    }
  }, [isBodyPointerEventsDisabled]);

  return (
    <LayerTreeContext.Provider
      value={React.useMemo(
        () => ({
          totalLayerCount,
          totalLayerCountWithDisabledOutsidePointerEvents,
          isBodyPointerEventsDisabled,
          addLayer: (layer) => {
            setTotalLayerCount(increment);
            if (layer.disableOutsidePointerEvents) {
              setTotalLayerCountWithDisabledOutsidePointerEvents(increment);
            }
          },
          removeLayer: (layer) => {
            setTotalLayerCount(decrement);
            if (layer.disableOutsidePointerEvents) {
              setTotalLayerCountWithDisabledOutsidePointerEvents(decrement);
            }
          },
        }),
        [
          totalLayerCount,
          totalLayerCountWithDisabledOutsidePointerEvents,
          isBodyPointerEventsDisabled,
        ]
      )}
    >
      {children}
    </LayerTreeContext.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * DismissableLayer
 * -----------------------------------------------------------------------------------------------*/

// This context will help with capturing information about nested layers
// passing them recursively down the tree.
type ParentLayerContextValue = {
  runningLayerCount: number;
  runningLayerCountWithDisabledOutsidePointerEvents: number;
};
const ParentLayerContext = React.createContext<ParentLayerContextValue | undefined>(undefined);
ParentLayerContext.displayName = 'ParentLayerContext';
const useParentLayerContext = () => React.useContext(ParentLayerContext);

type DismissableLayerProps = {
  children: (
    args: ReturnType<typeof useInteractOutside> & {
      ref: React.RefObject<any>;
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
   * Event handler called when an interaction happened outside the `DismissableLayer`.
   * Specifically, when focus leaves the `DismissableLayer` or a pointer event happens outside it.
   * Can be prevented.
   */
  onInteractOutside?: (event: InteractOutsideEvent) => void;

  /** Callback called when the `DismissableLayer` should be dismissed */
  onDismiss?: () => void;
};

function DismissableLayer(props: DismissableLayerProps) {
  const debugContext = useDebugContext();
  const nodeRef = React.useRef<HTMLElement>(null);
  if (debugContext.disableLock) {
    return props.children({
      ref: nodeRef,
      style: {},
      onBlurCapture: () => {},
      onFocusCapture: () => {},
      onMouseDownCapture: () => {},
      onTouchStartCapture: () => {},
    });
  }
  return <DismissableLayerImpl1 nodeRef={nodeRef} {...props} />;
}

function DismissableLayerImpl1(
  props: DismissableLayerProps & { nodeRef: React.RefObject<HTMLElement> }
) {
  const parentLayerContext = useParentLayerContext();
  const isRootLayer = parentLayerContext === undefined;

  // if it's the root layer, we wrap it with our `LayerTreeProvider`
  // (effectively we wrap the whole tree of nested layers)
  const RootLayerWrapper = isRootLayer ? LayerTreeProvider : React.Fragment;

  return (
    <RootLayerWrapper>
      <DismissableLayerImpl2 {...props} />
    </RootLayerWrapper>
  );
}

type LayerConfig = { disableOutsidePointerEvents: boolean };

function DismissableLayerImpl2(props: React.ComponentProps<typeof DismissableLayerImpl1>) {
  const {
    nodeRef,
    children,
    disableOutsidePointerEvents = false,
    onEscapeKeyDown,
    onInteractOutside,
    onDismiss,
  } = props;

  const layer: LayerConfig = React.useMemo(() => ({ disableOutsidePointerEvents }), [
    disableOutsidePointerEvents,
  ]);

  const layersContext = useLayerTreeContext('DismissableLayer');
  const parentLayerContext = useParentLayerContext();

  // We compute a running count of all layers so we can compare it with
  // the total count of layers in order to find which layer is the deepest one.
  // This is use to only dismiss the deepest layer when using the escape key.
  const runningLayerCount = !parentLayerContext ? 1 : parentLayerContext.runningLayerCount + 1;
  const isDeepestLayer = runningLayerCount === layersContext.totalLayerCount;

  // We compute a running count of all the layers which set `disableOutsidePointerEvents` to `true`
  // so we can compare it with the total count of layers which set `disableOutsidePointerEvents` to `true`.
  // This is used to determine which layers should be dismissed when interacting outside.
  // (ie. all layers that do not have a child layer which sets `disableOutsidePointerEvents` to `true`)
  //
  // prettier-ignore
  const runningLayerCountWithDisabledOutsidePointerEvents =
    getRunningLayerCountWithDisabledOutsidePointerEvents(layer, parentLayerContext);
  const containsChildLayerWithDisabledOutsidePointerEvents =
    runningLayerCountWithDisabledOutsidePointerEvents <
    layersContext.totalLayerCountWithDisabledOutsidePointerEvents;

  // Layer registration
  useLayoutEffect(() => {
    layersContext.addLayer(layer);
    return () => layersContext.removeLayer(layer);
  }, [layersContext, layer]);

  // Dismiss on escape
  useEscapeKeydown((event) => {
    // only dismiss if it's the deepest layer
    if (isDeepestLayer) {
      onEscapeKeyDown?.(event);
      if (!event.defaultPrevented) {
        onDismiss?.();
      }
    }
  });

  // Dismiss on outside interaction
  const interactOutside = useInteractOutside(nodeRef, (event) => {
    // only dismiss if there's no deeper layer which disabled pointer events outside itself
    if (!containsChildLayerWithDisabledOutsidePointerEvents) {
      onInteractOutside?.(event);
      if (!event.defaultPrevented) {
        onDismiss?.();
      }
    }
  });

  // Because we MAY have set `pointerEvents: 'none'` on `document.body`, we MAY need
  // to set `pointerEvents: 'auto'` on some layers. This depends on which layers set
  // `disableOutsidePointerEvents` to `true`.
  //
  // NOTE: it's important we set it on ALL layers that need it as we cannot simply
  // set it on the deepest layer which sets `disableOutsidePointerEvents` to `true` and rely
  // on inheritence. This is because layers may be rendered in different portals where
  // inheritece wouldn't apply, so we need to set it explicity on its children too.
  const shouldReEnablePointerEvents =
    layersContext.isBodyPointerEventsDisabled &&
    !containsChildLayerWithDisabledOutsidePointerEvents;

  return (
    <ParentLayerContext.Provider
      value={React.useMemo(
        () => ({
          runningLayerCount,
          runningLayerCountWithDisabledOutsidePointerEvents,
        }),
        [runningLayerCount, runningLayerCountWithDisabledOutsidePointerEvents]
      )}
    >
      {children({
        ref: nodeRef,
        style: shouldReEnablePointerEvents ? { pointerEvents: 'auto' } : {},
        ...interactOutside,
      })}
    </ParentLayerContext.Provider>
  );
}

function getRunningLayerCountWithDisabledOutsidePointerEvents(
  currentLayer: LayerConfig,
  parentLayer?: ParentLayerContextValue
) {
  return (
    (parentLayer?.runningLayerCountWithDisabledOutsidePointerEvents ?? 0) +
    (currentLayer.disableOutsidePointerEvents ? 1 : 0)
  );
}

/* -------------------------------------------------------------------------------------------------
 * Utility hooks
 * -----------------------------------------------------------------------------------------------*/

/**
 * Listens for when the escape key is down
 */
function useEscapeKeydown(onEscapeKeyDownProp?: (event: KeyboardEvent) => void) {
  const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeKeyDown(event);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscapeKeyDown]);
}

const INTERACT_OUTSIDE = 'dismissableLayer.interactOutside';
type InteractOutsideEvent = CustomEvent<{
  relatedTarget: EventTarget | null;
  originalEvent: Event;
}>;

/**
 * Sets up dissmissing when interacting outside a given node.
 * Returns props to pass to the given node.
 */
function useInteractOutside(
  nodeRef: React.RefObject<HTMLElement>,
  onInteractOutsideProp?: (event: InteractOutsideEvent) => void
) {
  const onInteractOutside = useCallbackRef(onInteractOutsideProp);

  const dispatchCustomEvent = (originalEvent: Event, relatedTarget: EventTarget | null) => {
    const interactOutsideEvent: InteractOutsideEvent = new CustomEvent(INTERACT_OUTSIDE, {
      bubbles: false,
      cancelable: true,
      detail: { relatedTarget, originalEvent },
    });
    nodeRef.current?.dispatchEvent(interactOutsideEvent);

    if (interactOutsideEvent.defaultPrevented) {
      originalEvent.preventDefault();
    }
  };

  // listen for custom event dispatched
  React.useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      node.addEventListener(INTERACT_OUTSIDE, onInteractOutside);
      return () => node.removeEventListener(INTERACT_OUTSIDE, onInteractOutside);
    }
  }, [onInteractOutside, nodeRef]);

  return {
    ...usePointerDownOutside((event) => dispatchCustomEvent(event, event.target)),
    ...useFocusLeave((event) => dispatchCustomEvent(event.nativeEvent, event.relatedTarget)),
  };
}

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
  onOutsidePointerDownProp?: (event: MouseEvent | TouchEvent) => void
) {
  const onOutsidePointerDown = useCallbackRef(onOutsidePointerDownProp);
  const isEventInside = React.useRef(false);

  React.useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!isEventInside.current) {
        onOutsidePointerDown(event);
      }
      isEventInside.current = false;
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [onOutsidePointerDown]);

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
 * Listens for when focus leaves a react subtree.
 * Returns props to pass to the root (node) of the subtree we want to check.
 */
function useFocusLeave(onFocusLeave?: (event: React.FocusEvent) => void) {
  const timerRef = React.useRef<number>(0);

  return {
    onBlurCapture: (event: React.FocusEvent) => {
      event.persist();
      timerRef.current = window.setTimeout(() => {
        onFocusLeave?.(event);
      }, 0);
    },
    onFocusCapture: () => {
      window.clearTimeout(timerRef.current);
    },
  };
}

export { DismissableLayer, INTERACT_OUTSIDE };
export type { DismissableLayerProps, InteractOutsideEvent };
