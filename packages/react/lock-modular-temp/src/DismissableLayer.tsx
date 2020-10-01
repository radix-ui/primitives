import * as React from 'react';
import { arrayRemove, isFunction } from '@interop-ui/utils';

let layerStack: Array<React.RefObject<HTMLElement>> = [];

type DismissableLayerProps = {
  children: (args: {
    ref: React.RefObject<any>;
    styles: ReturnType<typeof usePreventOutsidePointerEvents>;
  }) => React.ReactElement;

  /** Whether pressing the escape key should dismiss */
  dismissOnEscape?: boolean;

  /** Whether clicking outside the `DismissableLayer` should dismiss */
  dismissOnOutsideClick?: boolean | ((event: MouseEvent | TouchEvent) => boolean);

  /** Whether blurring outside the `DismissableLayer` should dismiss */
  dismissOnOutsideBlur?: boolean;

  /** A function called when the `DismissableLayer` is dismissed */
  onDismiss?: () => void;

  /** Whether pointer events happening outside the `DismissableLayer` should be prevented */
  preventOutsideClick?: boolean;
};

function DismissableLayer(props: DismissableLayerProps) {
  const {
    children,
    dismissOnEscape = false,
    dismissOnOutsideClick = false,
    dismissOnOutsideBlur = false,
    preventOutsideClick = false,
    onDismiss,
  } = props;
  const containerRef = React.useRef<HTMLElement>(null);

  const dismissTopMostLayer = React.useCallback(() => {
    const isTopMostLayer = layerStack[layerStack.length - 1] === containerRef;
    if (isTopMostLayer) {
      onDismiss?.();
    }
  }, [onDismiss]);

  // Maintain stack of open `DismissableLayer`
  React.useEffect(() => {
    layerStack = [...layerStack, containerRef];
    return () => {
      layerStack = arrayRemove(layerStack, containerRef);
    };
  }, []);

  // Dismiss on escape
  React.useEffect(() => {
    if (dismissOnEscape) {
      return onEscapeKeydown(dismissTopMostLayer);
    }
  }, [dismissTopMostLayer, dismissOnEscape]);

  // Dismiss on outside click
  React.useEffect(() => {
    const container = containerRef.current;
    if (container && dismissOnOutsideClick) {
      return onOutsidePointerDown(container, (event) => {
        const shouldDismiss = isFunction(dismissOnOutsideClick)
          ? dismissOnOutsideClick(event)
          : dismissOnOutsideClick;

        if (shouldDismiss) {
          if (preventOutsideClick) {
            // NOTE: As outside clicks are prevented, make sure nothing gains focus
            event.preventDefault();
          }
          dismissTopMostLayer();
        } else {
          // NOTE: As we shouldn't dismiss, make sure nothing gains focus
          event.preventDefault();
        }
      });
    }
  }, [dismissTopMostLayer, dismissOnOutsideClick, preventOutsideClick]);

  // Dismiss on outside blur
  React.useEffect(() => {
    const container = containerRef.current;
    if (container && dismissOnOutsideBlur) {
      return onOutsideBlur(container, () => dismissTopMostLayer());
    }
  }, [dismissTopMostLayer, dismissOnOutsideBlur]);

  // Prevent outside click
  const styles = usePreventOutsidePointerEvents({
    containerRef,
    active: preventOutsideClick,
  });

  return children({ ref: containerRef, styles });
}

/**
 * Encapsulates behaviour and styles to prevent outside pointer events.
 */
function usePreventOutsidePointerEvents(options: {
  containerRef: React.RefObject<HTMLElement>;
  active: boolean;
}): React.CSSProperties {
  const { containerRef, active } = options;
  React.useEffect(() => {
    const container = containerRef.current;
    if (container && active) {
      const originalBodyPointerEvents = document.body.style.pointerEvents;
      document.body.style.pointerEvents = 'none';

      const stopOutsidePointerDownListener = onOutsidePointerDown(container, (event) => {
        // NOTE: We do this to prevent focus event from happening
        event.preventDefault();
      });

      return () => {
        document.body.style.pointerEvents = originalBodyPointerEvents;
        stopOutsidePointerDownListener();
      };
    }
  }, [containerRef, active]);

  return active ? { pointerEvents: 'auto' } : {};
}

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/

function isTargetOutsideElement(target: EventTarget | null, element: HTMLElement) {
  return !element.contains(target as Node);
}

function isEventOutsideElement(event: Event, element: HTMLElement) {
  return !element.contains(event.target as Node);
}

/**
 * Sets up a keydown listener which listens for the escape key.
 * Return a function to remove the listener.
 */
function onEscapeKeydown(callback: (event: KeyboardEvent) => void) {
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      callback(event);
    }
  }

  document.addEventListener('keydown', handleKeydown, { capture: true });

  return () => document.removeEventListener('keydown', handleKeydown, { capture: true });
}

/**
 * Sets up mousedown/touchstart listeners which listens for pointer down events outside the given container.
 * Return a function to remove the listeners.
 */
function onOutsidePointerDown(
  container: HTMLElement,
  callback: (event: MouseEvent | TouchEvent) => void
) {
  function handlePointerDown(event: MouseEvent | TouchEvent) {
    if (isEventOutsideElement(event, container)) {
      callback(event);
    }
  }

  document.addEventListener('mousedown', handlePointerDown, { capture: true });
  document.addEventListener('touchstart', handlePointerDown, { capture: true });

  return () => {
    document.removeEventListener('mousedown', handlePointerDown, { capture: true });
    document.removeEventListener('touchstart', handlePointerDown, { capture: true });
  };
}

function onOutsideBlur(container: HTMLElement, callback: (event: FocusEvent) => void) {
  function handleBlur(event: FocusEvent) {
    const relatedTarget = event.relatedTarget as Element | null;
    if (relatedTarget && isTargetOutsideElement(relatedTarget, container!)) {
      callback(event);
    }
  }

  document.addEventListener('blur', handleBlur, { capture: true });

  return () => document.removeEventListener('blur', handleBlur, { capture: true });
}

export { DismissableLayer };
export type { DismissableLayerProps };
