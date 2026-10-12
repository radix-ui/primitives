import * as React from 'react';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';

/**
 * Listens for when the escape key is down
 *
 * @deprecated Attach listeners directly via useEffect for more granular control
 * over how callbacks are stabilized, when to detach listeners, etc.
 */
function useEscapeKeydown(
  onEscapeKeyDownProp?: (event: KeyboardEvent) => void,
  ownerDocument: Document = globalThis?.document,
) {
  const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // An Escape during an IME composition belongs to the input method (see DismissableLayer).
      if (event.key === 'Escape' && !event.isComposing && event.keyCode !== 229) {
        onEscapeKeyDown(event);
      }
    };
    ownerDocument.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => ownerDocument.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [onEscapeKeyDown, ownerDocument]);
}

export { useEscapeKeydown };
