import * as React from 'react';
import { createContext, useCallbackRef, useLayoutEffect } from '@interop-ui/react-utils';

const increment = (n: number) => n + 1;
const decrement = (n: number) => n - 1;

/* -------------------------------------------------------------------------------------------------
 * LayersProvider (root of all layers)
 * -----------------------------------------------------------------------------------------------*/
type LayerConfig = { disableOutsidePointerEvents: boolean };
type LayersContextValue = {
  addLayer: (layer: LayerConfig) => void;
  removeLayer: (layer: LayerConfig) => void;
  numLayers: number;
  numLayersDisablingOutsidePointerEvents: number;
};
const [LayersContext, useLayers] = createContext<LayersContextValue>(
  'LayersContext',
  'LayersProvider'
);

const LayersProvider: React.FC = ({ children }) => {
  const [numLayers, setNumLayers] = React.useState(0);
  const [
    numLayersDisablingOutsidePointerEvents,
    setNumLayersWithDisabledOutsidePointerEvents,
  ] = React.useState(0);

  // disable pointer-events on `document.body` when at least one layer is disabling outside pointer events
  useLayoutEffect(() => {
    if (numLayersDisablingOutsidePointerEvents > 0) {
      const originalBodyPointerEvents = document.body.style.pointerEvents;
      document.body.style.pointerEvents = 'none';
      return () => {
        document.body.style.pointerEvents = originalBodyPointerEvents;
      };
    }
  }, [numLayersDisablingOutsidePointerEvents]);

  return (
    <LayersContext.Provider
      value={React.useMemo(
        () => ({
          numLayers,
          numLayersDisablingOutsidePointerEvents,
          addLayer: (layer) => {
            setNumLayers(increment);
            if (layer.disableOutsidePointerEvents) {
              setNumLayersWithDisabledOutsidePointerEvents(increment);
            }
          },
          removeLayer: (layer) => {
            setNumLayers(decrement);
            if (layer.disableOutsidePointerEvents) {
              setNumLayersWithDisabledOutsidePointerEvents(decrement);
            }
          },
        }),
        [numLayers, numLayersDisablingOutsidePointerEvents]
      )}
    >
      {children}
    </LayersContext.Provider>
  );
};

/* -------------------------------------------------------------------------------------------------
 * DismissableLayer
 * -----------------------------------------------------------------------------------------------*/

// This context will help with capturing informating about nested layers
type ParentLayer = {
  numParentLayers: number;
  numLayersDisablingOutsidePointerEventsAtLayer: number;
};
const ParentLayerContext = React.createContext<ParentLayer | undefined>(undefined);
ParentLayerContext.displayName = 'ParentLayerContext';
const useParentLayer = () => React.useContext(ParentLayerContext);

// This context will help with letting `FocusScope` know about how a layer was dismissed
type DismissalInfo = {
  disableOutsidePointerEvents: boolean;
  dismissMethod?: 'escape' | 'interactOutsideClick' | 'interactOutsideBlur';
};
const DismissalInfoContext = React.createContext<DismissalInfo | undefined>(undefined);
DismissalInfoContext.displayName = 'DismissalInfoContext';
const useDismissalInfo = () => React.useContext(DismissalInfoContext);

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
  onEscapeKeyDown?: React.KeyboardEventHandler;

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
  const parentLayer = useParentLayer();
  const isRootLayer = parentLayer === undefined;
  const layer = <DismissableLayerImpl {...props} />;

  // if it's the root layer, we wrap it (and effectively the whole tree of nested layers)
  // with our layers provider.
  return isRootLayer ? <LayersProvider>{layer}</LayersProvider> : layer;
}

function DismissableLayerImpl(props: DismissableLayerProps) {
  const {
    children,
    disableOutsidePointerEvents = false,
    onEscapeKeyDown,
    onInteractOutside,
    onDismiss,
  } = props;
  const [dismissMethod, setDismissMethod] = React.useState<DismissalInfo['dismissMethod']>();
  const nodeRef = React.useRef<HTMLElement>(null);
  const layer: LayerConfig = React.useMemo(() => ({ disableOutsidePointerEvents }), [
    disableOutsidePointerEvents,
  ]);

  const layers = useLayers('DismissableLayer');
  const parentLayer = useParentLayer();
  const numParentLayers = getNumParentLayers(parentLayer);
  const numLayersDisablingOutsidePointerEventsAtLayer = getNumLayersDisablingOutsidePointerEventsAtLayer(
    layer,
    parentLayer
  );

  // Layer registration
  useLayoutEffect(() => {
    layers.addLayer(layer);
    return () => layers.removeLayer(layer);
  }, [layers, layer]);

  // Dismiss on escape (one layer at the time)
  const isDeepestLayer = numParentLayers === layers.numLayers - 1;
  useEscapeKeydown((event) => {
    if (isDeepestLayer) {
      onEscapeKeyDown?.(event);
      if (!event.defaultPrevented) {
        setDismissMethod('escape');
        onDismiss?.();
      }
    }
  });

  // Dismiss on outside interaction (one layer at a time — depends on `disableOutsidePointerEvents`)
  const isDeepestLayerDisablingOutsidePointerEventsOrDeeper =
    numLayersDisablingOutsidePointerEventsAtLayer === layers.numLayersDisablingOutsidePointerEvents;
  const canDismissOnInteractOutside = isDeepestLayerDisablingOutsidePointerEventsOrDeeper;
  const interactOutside = useInteractOutside(nodeRef, (event) => {
    if (canDismissOnInteractOutside) {
      onInteractOutside?.(event);
      if (!event.defaultPrevented) {
        setDismissMethod(
          event.detail.originalEvent.type === 'blur'
            ? 'interactOutsideBlur'
            : 'interactOutsideClick'
        );
        onDismiss?.();
      }
    }
  });

  // Because we MAY have set `pointerEvents: 'none'` on `document.body`
  // we MAY need to set `pointerEvents: 'auto'` on some layers.
  // This depends on which layers set `disableOutsidePointerEvents` to `true`.
  const shouldReEnablePointerEvents =
    // no need to anything here, because pointer events wouldn't have been disabled on `document.body`
    layers.numLayersDisablingOutsidePointerEvents > 0 &&
    // need to re-enable from the deepest layer that disables outside pointer events
    isDeepestLayerDisablingOutsidePointerEventsOrDeeper;

  return (
    <ParentLayerContext.Provider
      value={React.useMemo(
        () => ({
          numParentLayers,
          numLayersDisablingOutsidePointerEventsAtLayer,
          dismissMethod,
        }),
        [numParentLayers, numLayersDisablingOutsidePointerEventsAtLayer, dismissMethod]
      )}
    >
      <DismissalInfoContext.Provider
        value={React.useMemo(() => ({ disableOutsidePointerEvents, dismissMethod }), [
          disableOutsidePointerEvents,
          dismissMethod,
        ])}
      >
        {children({
          ref: nodeRef,
          style: shouldReEnablePointerEvents ? { pointerEvents: 'auto' } : {},
          ...interactOutside,
        })}
      </DismissalInfoContext.Provider>
    </ParentLayerContext.Provider>
  );
}

function getNumParentLayers(parentLayer?: ParentLayer) {
  if (!parentLayer) return 0;
  return parentLayer.numParentLayers + 1;
}

function getNumLayersDisablingOutsidePointerEventsAtLayer(
  layer: LayerConfig,
  parentLayer?: ParentLayer
) {
  return (
    (parentLayer?.numLayersDisablingOutsidePointerEventsAtLayer ?? 0) +
    (layer.disableOutsidePointerEvents ? 1 : 0)
  );
}

/* -------------------------------------------------------------------------------------------------
 * Utility hooks
 * -----------------------------------------------------------------------------------------------*/

/**
 * Listens for when the escape key is down
 */
function useEscapeKeydown(onEscapeKeyDown?: (event: React.KeyboardEvent) => void) {
  const handleEscapeKeyDown = useCallbackRef(onEscapeKeyDown);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleEscapeKeyDown(event);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleEscapeKeyDown]);
}

const INTERACT_OUTSIDE_EVENT_TYPE = 'dismissablelayer.interactoutside';
type InteractOutsideEvent = CustomEvent<{ target: EventTarget | null; originalEvent: Event }>;

/**
 * Sets up dissmissing when interacting outside a given node.
 * Returns props to pass to the given node.
 */
function useInteractOutside(
  nodeRef: React.RefObject<HTMLElement>,
  onInteractOutside?: (event: InteractOutsideEvent) => void
) {
  const handleInteractOutside = useCallbackRef(onInteractOutside);

  const dispatchCustomEvent = (originalEvent: Event, target: EventTarget | null) => {
    const interactOutsideEvent: InteractOutsideEvent = new CustomEvent(
      INTERACT_OUTSIDE_EVENT_TYPE,
      { bubbles: false, cancelable: true, detail: { target, originalEvent } }
    );
    nodeRef.current?.dispatchEvent(interactOutsideEvent);

    if (interactOutsideEvent.defaultPrevented) {
      originalEvent.preventDefault();
    }
  };

  // listen for custom event dispatched
  React.useEffect(() => {
    const node = nodeRef.current;
    if (node) {
      node.addEventListener(INTERACT_OUTSIDE_EVENT_TYPE, handleInteractOutside);
      return () => node.removeEventListener(INTERACT_OUTSIDE_EVENT_TYPE, handleInteractOutside);
    }
  }, [handleInteractOutside, nodeRef]);

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

export { DismissableLayer, useDismissalInfo };
export type { DismissableLayerProps };
