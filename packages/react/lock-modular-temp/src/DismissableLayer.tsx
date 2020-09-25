import * as React from 'react';
import * as ReactIs from 'react-is';
import { useComposedRefs } from '@interop-ui/react-utils';
import { arrayRemove, isFunction } from '@interop-ui/utils';

let layerStack: Array<React.RefObject<HTMLElement>> = [];

type DismissableLayerProps = {
  children: React.ReactElement;

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

const DismissableLayer = React.forwardRef<HTMLElement, DismissableLayerProps>(
  (props, forwardedRef) => {
    const {
      children,
      dismissOnEscape = false,
      dismissOnOutsideClick = false,
      dismissOnOutsideBlur = false,
      preventOutsideClick = false,
      onDismiss,
    } = props;
    const child = React.Children.only(children);
    if (ReactIs.isFragment(child)) {
      throw new Error(
        'DismissableLayer needs to have a single valid React child that renders a DOM element.'
      );
    }
    const containerRef = React.useRef<HTMLElement>(null);
    const ref = useComposedRefs((child as any).ref, forwardedRef, containerRef);

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

          // Prevent focus
          event.preventDefault();

          if (shouldDismiss) {
            dismissTopMostLayer();
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
    React.useEffect(() => {
      const container = containerRef.current;
      if (container && preventOutsideClick) {
        return preventOutsidePointerEvents(container);
      }
    }, [preventOutsideClick]);

    return React.cloneElement(child, { ref });
  }
);

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

/**
 * Prevents outside pointer events.
 * Returns a function to stop preventing.
 */
function preventOutsidePointerEvents(container: HTMLElement) {
  const originalBodyPointerEvents = document.body.style.pointerEvents;
  const originalContainerPointerEvents = container.style.pointerEvents;

  document.body.style.pointerEvents = 'none';
  container.style.pointerEvents = 'auto';

  const stopOutsidePointerDownListener = onOutsidePointerDown(container, (event) => {
    // NOTE: We do this to prevent focus event from happening on focusable elements
    event.preventDefault();
  });

  return () => {
    document.body.style.pointerEvents = originalBodyPointerEvents;
    container.style.pointerEvents = originalContainerPointerEvents;
    stopOutsidePointerDownListener();
  };
}

export { DismissableLayer };
export type { DismissableLayerProps };
