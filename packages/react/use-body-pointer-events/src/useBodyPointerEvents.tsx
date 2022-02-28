import * as React from 'react';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

let changeCount = 0;
let originalBodyPointerEvents: string;

function useBodyPointerEvents({ disabled }: { disabled: boolean }) {
  const isTouchOrPenPressedRef = React.useRef(false);

  useLayoutEffect(() => {
    if (disabled) {
      if (changeCount === 0) {
        originalBodyPointerEvents = document.body.style.pointerEvents;
      }

      function resetPointerEvents() {
        changeCount--;
        if (changeCount === 0) {
          document.body.style.pointerEvents = originalBodyPointerEvents;
        }
      }

      document.body.style.pointerEvents = 'none';
      changeCount++;

      function handlePointerUp(event: PointerEvent) {
        isTouchOrPenPressedRef.current = event.pointerType !== 'mouse';
      }

      document.addEventListener('pointerup', handlePointerUp);

      return () => {
        if (isTouchOrPenPressedRef.current) {
          /**
           * We force pointer-events to remain disabled until `click` fires on touch devices
           * because browsers implement a ~350ms delay between the time the user stops
           * touching the display and when the browser executes events. We need to ensure we
           * don't reactivate pointer-events within this timeframe otherwise the browser may
           * execute events that should have been prevented.
           *
           * We are aware that `touch-action: manipulation` shortens this delay for events,
           * but it isn't enough to cover all cases.
           *
           * When there is an input on screen:
           * - if a click event is bound to it, it will fire after a `pointerdown` which may
           * have re-enabled pointer-events (regardless of `touch-action: manipulation`).
           * - if clicking it causes the page to zoom, the events will wait for the zoom to
           * finish before executing on the input.
           * - if long pressing it, the events will execute after the longpress delay.
           */
          document.addEventListener('click', resetPointerEvents, { once: true });
        } else {
          resetPointerEvents();
        }

        document.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [disabled]);
}

export { useBodyPointerEvents };
