import * as React from 'react';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

let changeCount = 0;
let originalBodyPointerEvents: string;

function useBodyPointerEvents({ disabled }: { disabled: boolean }) {
  const isTouchOrPenPressRef = React.useRef(false);

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      isTouchOrPenPressRef.current = event.pointerType !== 'mouse';
    };
    const handlePointerUp = () => (isTouchOrPenPressRef.current = false);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isTouchOrPenPressRef]);

  useLayoutEffect(() => {
    if (disabled) {
      if (changeCount === 0) {
        originalBodyPointerEvents = document.body.style.pointerEvents;
      }

      function resetPointerEvents() {
        if (changeCount === 0) {
          document.body.style.pointerEvents = originalBodyPointerEvents;
        }
      }

      document.body.style.pointerEvents = 'none';
      changeCount++;

      return () => {
        changeCount--;
        if (isTouchOrPenPressRef.current) {
          /**
           * On touch devices, browsers implement a ~350ms delay between the time the user stops
           * touching the display and when the browser executes events. We need to ensure we
           * don't reactivate pointer-events within this timeframe otherwise the browser may
           * execute events that should have been prevented.
           *
           * We are aware that `touch-action: manipulation` shortens this delay for events,
           * but it isn't enough to cover all cases. When there is an input on screen:
           * - if a click event is bound to it, it will fire after a `pointerdown` which may
           * have re-enabled pointer-events (regardless of `touch-action: manipulation`).
           * - if clicking it causes the page to zoom, the events will wait for the zoom to
           * finish before executing on the input.
           * - if long pressesing it, the events will execute after the longpress delay.
           *
           * Instead, we force pointer-events to remain disabled until the `click` event has
           * executed when pressing on touch devices.
           */
          document.addEventListener('click', resetPointerEvents, { once: true });
        } else {
          resetPointerEvents();
        }
      };
    }
  }, [disabled]);
}

export { useBodyPointerEvents };
