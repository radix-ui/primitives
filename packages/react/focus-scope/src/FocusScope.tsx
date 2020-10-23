import * as React from 'react';
import { createFocusScope, AUTOFOCUS_ON_CREATE, AUTOFOCUS_ON_DESTROY } from './createFocusScope';
import { useDebugContext } from '@interop-ui/react-debug-context';
import { useCallbackRef } from '@interop-ui/react-utils';

type FocusScopeProps = {
  children: (args: { ref: React.RefObject<any> }) => React.ReactElement;

  /**
   * Whether focus should be trapped within the FocusScope
   * (default: false)
   */
  trapped?: boolean;

  /**
   * Event handler called when auto-focusing on mount.
   * Can be prevented.
   */
  onMountAutoFocus?: (event: Event) => void;

  /**
   * Event handler called when auto-focusing on unmount.
   * Can be prevented.
   */
  onUnmountAutoFocus?: (event: Event) => void;
};

function FocusScope(props: FocusScopeProps) {
  const debugContext = useDebugContext();
  const containerRef = React.useRef<HTMLElement>(null);
  if (debugContext.disableLock) {
    return props.children({ ref: containerRef });
  }
  return <FocusScopeImpl containerRef={containerRef} {...props} />;
}

function FocusScopeImpl(props: FocusScopeProps & { containerRef: React.RefObject<HTMLElement> }) {
  const { children, trapped = false, containerRef } = props;
  const focusScopeRef = React.useRef<ReturnType<typeof createFocusScope>>();
  const onMountAutoFocus = useCallbackRef(props.onMountAutoFocus);
  const onUnmountAutoFocus = useCallbackRef(props.onUnmountAutoFocus);

  // Create the focus scope on mount and destroy it on unmount
  React.useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener(AUTOFOCUS_ON_CREATE, onMountAutoFocus);
      container.addEventListener(AUTOFOCUS_ON_DESTROY, onUnmountAutoFocus);
      focusScopeRef.current = createFocusScope(container);

      return () => {
        container.removeEventListener(AUTOFOCUS_ON_CREATE, onMountAutoFocus);
        // We hit a react bug (fixed in v17) with focusing in unmount.
        // We need to delay the focus a little to get around it for now.
        // See: https://github.com/facebook/react/issues/17894
        setTimeout(() => {
          focusScopeRef.current?.destroy();
          // this needs to come after calling `destroy()` to make sure we can catch the event on time.
          container.removeEventListener(AUTOFOCUS_ON_DESTROY, onUnmountAutoFocus);
        }, 0);
      };
    }
  }, [containerRef, onMountAutoFocus, onUnmountAutoFocus]);

  // Sync `trapped` prop imperatively rather than passing as an argument to
  // `createFocusScope()` so that we do not risk executing side-effects run
  // on create and destroy (focus side-effects) if it ever changes live.
  React.useEffect(() => {
    if (trapped) {
      focusScopeRef.current?.trap();
      return () => focusScopeRef.current?.untrap();
    }
  }, [trapped]);

  return children({ ref: containerRef });
}

export { FocusScope };
export type { FocusScopeProps };
