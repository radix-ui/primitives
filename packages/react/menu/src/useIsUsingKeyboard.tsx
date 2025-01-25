import * as React from 'react';

let isUsingKeyboard = false;
let isUsingKeyboardSubscriberCount = 0;

function handleKeydown() {
  isUsingKeyboard = true;
}

function handlePointer() {
  isUsingKeyboard = false;
}

function getIsUsingKeyboard() {
  return isUsingKeyboard;
}

function subscribeShared() {
  if (isUsingKeyboardSubscriberCount++ === 0) {
    // Capture phase ensures we set the boolean before any side effects execute
    // in response to the key or pointer event as they might depend on this value.
    document.addEventListener('keydown', handleKeydown, { capture: true });
    document.addEventListener('pointerdown', handlePointer, { capture: true });
    document.addEventListener('pointermove', handlePointer, { capture: true });
  }
}

function unsubscribeShared() {
  if (--isUsingKeyboardSubscriberCount === 0) {
    document.removeEventListener('keydown', handleKeydown, { capture: true });
    document.removeEventListener('pointerdown', handlePointer, { capture: true });
    document.removeEventListener('pointermove', handlePointer, { capture: true });
  }
}

/**
 * Starts tracking whether the user is using a keyboard or a mouse.
 * This implementation keeps track of how many subscribers it has and makes sure
 * only one set of listeners is attached to the document to improve performance and
 * prevent memory leaks.
 */
export function useIsUsingKeyboard() {
  React.useEffect(() => {
    subscribeShared();
    return unsubscribeShared;
  }, []);

  return getIsUsingKeyboard;
}
