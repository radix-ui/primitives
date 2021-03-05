import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

let changeCount = 0;
let originalBodyPointerEvents: string;

function useBodyPointerEvents({ disabled }: { disabled: boolean }) {
  useLayoutEffect(() => {
    if (disabled) {
      if (changeCount === 0) {
        originalBodyPointerEvents = document.body.style.pointerEvents;
      }
      document.body.style.pointerEvents = 'none';
      changeCount++;

      return () => {
        changeCount--;
        if (changeCount === 0) {
          document.body.style.pointerEvents = originalBodyPointerEvents;
        }
      };
    }
  }, [disabled]);
}

export { useBodyPointerEvents };
