import * as React from 'react';
import { useComposedRefs } from '@interop-ui/react-utils';
import { useStateMachine } from './useStateMachine';

type PresenceProps = {
  present: boolean;
  children: React.ReactElement | ((props: { present: boolean }) => React.ReactElement);
};

const Presence: React.FC<PresenceProps> = (props) => {
  const { present, children } = props;
  const presence = usePresence(present);

  const child = (typeof children === 'function'
    ? children({ present: presence.isPresent })
    : React.Children.only(children)) as React.ReactElement;

  const ref = useComposedRefs(presence.ref, (child as any).ref);
  const forceMount = typeof children === 'function';
  return forceMount || presence.isPresent ? React.cloneElement(child, { ref }) : null;
};

Presence.displayName = 'Presence';

/* -------------------------------------------------------------------------------------------------
 * usePresence
 * -----------------------------------------------------------------------------------------------*/
type PresenceEvent =
  | { type: 'MOUNT' }
  | { type: 'UNMOUNT' }
  | { type: 'ANIMATION_OUT' }
  | { type: 'TRANSITION_OUT' }
  | { type: 'ANIMATION_END' }
  | { type: 'TRANSITION_END' };

type PresenceState = { value: 'mounted' | 'unmounted' | 'unmountSuspended'; context: {} };

function usePresence(present: boolean) {
  const [node, setNode] = React.useState<HTMLElement>();
  const [styles, setStyles] = React.useState<CSSStyleDeclaration>();
  const prevPresentRef = React.useRef(present);
  const prevAnimationNameRef = React.useRef<string>();
  const { state, send } = useStateMachine<{}, PresenceEvent, PresenceState>({
    id: 'presence',
    initial: present ? 'mounted' : 'unmounted',
    states: {
      mounted: {
        on: {
          UNMOUNT: 'unmounted',
          ANIMATION_OUT: 'unmountSuspended',
          TRANSITION_OUT: 'unmountSuspended',
        },
      },
      unmountSuspended: {
        on: { ANIMATION_END: 'unmounted', TRANSITION_END: 'unmounted' },
      },
      unmounted: {
        on: { MOUNT: 'mounted' },
      },
    },
  });

  React.useEffect(() => {
    if (node) {
      const styles = getComputedStyle(node);
      prevAnimationNameRef.current = getAnimationName(styles);
      setStyles(styles);
    }
  }, [node]);

  React.useEffect(() => {
    return waitForAfterNextFrame(() => {
      /**
       * When `present` changes, we check changes to animation-name to determine
       * whether an animation has started. We chose this approach (reading computed
       * styles) over using `animationstart` event because we would need to delay
       * unmount with a `setTimeout` that `animationstart` would clear. That approach
       * becomes problematic if consumers use `animation-delay`.
       */
      const wasPresent = prevPresentRef.current;
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);
      const isAnimating = String(prevAnimationName) !== String(currentAnimationName);
      prevAnimationNameRef.current = currentAnimationName;
      prevPresentRef.current = present;

      if (present) {
        send('MOUNT');
      } else if (wasPresent && isAnimating) {
        // If the element is hidden, it will not run the animation
        send(styles?.display === 'none' ? 'UNMOUNT' : 'ANIMATION_OUT');
      } else {
        send('UNMOUNT');
      }
    });
  }, [present, styles, send]);

  React.useEffect(() => {
    if (node) {
      const handleTransitionRun = (event: TransitionEvent) => {
        const wasPresent = prevPresentRef.current;
        const isTransitionOut = !present && wasPresent;
        if (event.target === node && isTransitionOut) {
          send('TRANSITION_OUT');
        }
      };
      const handleTransitionEnd = (event: TransitionEvent) => {
        if (event.target === node) send('TRANSITION_END');
      };
      const handleAnimationEnd = (event: AnimationEvent) => {
        if (event.target === node) send('ANIMATION_END');
      };

      node.addEventListener('animationcancel', handleAnimationEnd);
      node.addEventListener('animationend', handleAnimationEnd);
      node.addEventListener('transitionrun', handleTransitionRun);
      node.addEventListener('transitioncancel', handleTransitionEnd);
      node.addEventListener('transitionend', handleTransitionEnd);

      return () => {
        node.removeEventListener('animationcancel', handleAnimationEnd);
        node.removeEventListener('animationend', handleAnimationEnd);
        node.removeEventListener('transitionrun', handleTransitionRun);
        node.removeEventListener('transitioncancel', handleTransitionEnd);
        node.removeEventListener('transitionend', handleTransitionEnd);
      };
    }
  }, [node, present, send]);

  return {
    ref: (node: HTMLElement) => setNode(node),
    isPresent: ['mounted', 'unmountSuspended'].includes(state),
  };
}

function getAnimationName(styles?: CSSStyleDeclaration) {
  return styles?.animationName || 'none';
}

function waitForAfterNextFrame(cb = () => {}) {
  let nextFrameRaf: number;
  let afterNextFrameRaf: number;
  /**
   * This first two `requestAnimationFrame` calls are needed because `requestAnimationFrame`
   * fires *before* the next frame and we need *next* frame. This is to ensure our live
   * CSSStyleDeclaration has updated before we compare values for animation. The third
   * `requestAnimationFrame` is to ensure the callback fires after the `transitionrun` event.
   */
  const beforeNextFrameRaf = requestAnimationFrame(() => {
    nextFrameRaf = requestAnimationFrame(() => {
      afterNextFrameRaf = requestAnimationFrame(cb);
    });
  });

  return () => {
    cancelAnimationFrame(beforeNextFrameRaf);
    cancelAnimationFrame(nextFrameRaf);
    cancelAnimationFrame(afterNextFrameRaf);
  };
}

/* -----------------------------------------------------------------------------------------------*/

export { Presence };
export type { PresenceProps };
