import * as React from 'react';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';

/**
 * Listens for when the escape key is down
 *
 * @deprecated Passing `ownerDocument` directly is deprecated and will be
 * removed in the next major version. Pass a function that returns the owner
 * document instead to prevent hydration and SSR errors.
 */
export function useEscapeKeydown(
  onEscapeKeyDownProp: ((event: KeyboardEvent) => void) | undefined,
  ownerDocument?: Document
): void;

/**
 * Listens for when the escape key is down
 */
export function useEscapeKeydown(
  onEscapeKeyDownProp: ((event: KeyboardEvent) => void) | undefined,
  getOwnerDocument: () => Document
): void;

export function useEscapeKeydown(
  onEscapeKeyDownProp: ((event: KeyboardEvent) => void) | undefined,
  getOwnerDocument?: Document | (() => Document)
) {
  const onEscapeKeyDown = useCallbackRef(onEscapeKeyDownProp);
  React.useEffect(() => {
    const ownerDocument =
      typeof getOwnerDocument === 'function'
        ? getOwnerDocument()
        : // eslint-disable-next-line no-restricted-globals
          (getOwnerDocument ?? globalThis.document);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeKeyDown(event);
      }
    };
    ownerDocument.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      ownerDocument.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [onEscapeKeyDown, getOwnerDocument]);
}
