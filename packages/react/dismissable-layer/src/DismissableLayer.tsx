import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import { Primitive } from '@radix-ui/react-primitive';
import { useBodyPointerEvents } from '@radix-ui/react-use-body-pointer-events';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';
import { useEscapeKeydown } from '@radix-ui/react-use-escape-keydown';

import type * as Polymorphic from '@radix-ui/react-polymorphic';

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

const DISMISSABLE_LAYER_NAME = 'DismissableLayer';

type DismissableLayerPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof DismissableLayerImpl>,
  Polymorphic.OwnProps<typeof DismissableLayerImpl>
>;

const DismissableLayer = React.forwardRef((props, forwardedRef) => {
  const runningLayerCount = usePreviousRunningLayerCount();
  const isRootLayer = runningLayerCount === 0;
  const layer = <DismissableLayerImpl {...props} ref={forwardedRef} />;

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
}) as DismissableLayerPrimitive;

DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;

type DismissableLayerImplOwnProps = Polymorphic.Merge<
  Polymorphic.OwnProps<typeof Primitive>,
  {
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
    onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;

    /**
     * Event handler called when the focus moves outside of the `DismissableLayer`.
     * Can be prevented.
     */
    onFocusOutside?: (event: FocusOutsideEvent) => void;

    /**
     * Event handler called when an interaction happens outside the `DismissableLayer`.
     * Specifically, when a pointer event happens outside of the `DismissableLayer` or focus moves outside of it.
     * Can be prevented.
     */
    onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void;

    /** Callback called when the `DismissableLayer` should be dismissed */
    onDismiss?: () => void;
  }
>;

type DismissableLayerImplPrimitive = Polymorphic.ForwardRefComponent<
  Polymorphic.IntrinsicElement<typeof Primitive>,
  DismissableLayerImplOwnProps
>;

const DismissableLayerImpl = React.forwardRef((props, forwardedRef) => {
  const {
    disableOutsidePointerEvents = false,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    onDismiss,
    ...layerProps
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
  const { onPointerDownCapture: handlePointerDownCapture } = usePointerDownOutside((event) => {
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
  const { onBlurCapture: handleBlurCapture, onFocusCapture: handleFocusCapture } = useFocusOutside(
    (event) => {
      onFocusOutside?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) {
        onDismiss?.();
      }
    }
  );

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
        <Primitive
          {...layerProps}
          ref={forwardedRef}
          style={{
            pointerEvents: shouldReEnablePointerEvents ? 'auto' : undefined,
            ...layerProps.style,
          }}
          onPointerDownCapture={composeEventHandlers(
            props.onPointerDownCapture,
            handlePointerDownCapture
          )}
          onBlurCapture={composeEventHandlers(props.onBlurCapture, handleBlurCapture)}
          onFocusCapture={composeEventHandlers(props.onFocusCapture, handleFocusCapture)}
        />
      </RunningLayerCountWithDisabledOutsidePointerEventsProvider>
    </RunningLayerCountProvider>
  );
}) as DismissableLayerImplPrimitive;

/* -------------------------------------------------------------------------------------------------
 * Utility hooks
 * -----------------------------------------------------------------------------------------------*/

const POINTER_DOWN_OUTSIDE = 'dismissableLayer.pointerDownOutside';
const FOCUS_OUTSIDE = 'dismissableLayer.focusOutside';
type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>;
type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>;

/**
 * Sets up `pointerdown` listener which listens for events outside a react subtree.
 *
 * We use `pointerdown` rather than `pointerup` to mimic layer dismissing behaviour
 * present in OS which usually happens on `pointerdown`.
 *
 * Returns props to pass to the node we want to check for outside events.
 */

function usePointerDownOutside(onPointerDownOutside?: (event: PointerDownOutsideEvent) => void) {
  const handlePointerDownOutside = useCallbackRef(onPointerDownOutside) as EventListener;
  const isPointerInsideReactTreeRef = React.useRef(false);

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target && !isPointerInsideReactTreeRef.current) {
        const pointerDownOutsideEvent: PointerDownOutsideEvent = new CustomEvent(
          POINTER_DOWN_OUTSIDE,
          { bubbles: false, cancelable: true, detail: { originalEvent: event } }
        );
        target.addEventListener(POINTER_DOWN_OUTSIDE, handlePointerDownOutside, { once: true });
        target.dispatchEvent(pointerDownOutsideEvent);
      }
      isPointerInsideReactTreeRef.current = false;
    };
    /**
     * if this hook executes in a component that mounts via a `pointerdown` event, the event
     * would bubble up to the document and trigger a `pointerDownOutside` event. We avoid
     * this by delaying the event listener registration on the document.
     * This is not React specific, but rather how the DOM works, ie:
     * ```
     * button.addEventListener('pointerdown', () => {
     *   console.log('I will log');
     *   document.addEventListener('pointerdown', () => {
     *     console.log('I will also log');
     *   })
     * });
     */
    const timerId = window.setTimeout(() => {
      document.addEventListener('pointerdown', handlePointerDown);
    }, 0);
    return () => {
      window.clearTimeout(timerId);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [handlePointerDownOutside]);

  return {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => (isPointerInsideReactTreeRef.current = true),
  };
}

/**
 * Listens for when focus happens outside a react subtree.
 * Returns props to pass to the root (node) of the subtree we want to check.
 */

function useFocusOutside(onFocusOutside?: (event: FocusOutsideEvent) => void) {
  const handleFocusOutside = useCallbackRef(onFocusOutside) as EventListener;
  const isFocusInsideReactTreeRef = React.useRef(false);

  React.useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target;
      if (target && !isFocusInsideReactTreeRef.current) {
        const focusOutsideEvent: FocusOutsideEvent = new CustomEvent(FOCUS_OUTSIDE, {
          bubbles: false,
          cancelable: true,
          detail: { originalEvent: event },
        });
        target.addEventListener(FOCUS_OUTSIDE, handleFocusOutside, { once: true });
        target.dispatchEvent(focusOutsideEvent);
      }
    };
    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, [handleFocusOutside]);

  return {
    onFocusCapture: () => (isFocusInsideReactTreeRef.current = true),
    onBlurCapture: () => (isFocusInsideReactTreeRef.current = false),
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
