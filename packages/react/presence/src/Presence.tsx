import * as React from 'react';
import { useComposedRefs } from '@radix-ui/react-utils';
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
        on: { MOUNT: 'mounted', ANIMATION_END: 'unmounted', TRANSITION_END: 'unmounted' },
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
    /**
     * We wait till after next frame so we can verify if an animation/transition is occurring.
     * Both mount and unmount events are triggered after the next frame so that the two
     * events happen at the same time. This is to avoid flickering on screen when elements
     * are mounting at the same time as elements that are unmounting.
     */
    return waitForAfterNextFrame(() => {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);
      prevAnimationNameRef.current = currentAnimationName;

      if (present) {
        send('MOUNT');
      } else if (styles?.display === 'none') {
        // If the element is hidden, animations won't run so we unmount instantly
        send('UNMOUNT');
      } else {
        /**
         * When `present` changes to `false`, we check changes to animation-name to
         * determine whether an animation has started. We chose this approach (reading
         * computed styles) because there is no `animationrun` event and `animationstart`
         * fires after `animation-delay` has expired which would be too late.
         */
        const wasPresent = prevPresentRef.current;
        const isAnimating = prevAnimationName !== currentAnimationName;

        if (wasPresent && isAnimating) {
          send('ANIMATION_OUT');
        } else {
          send('UNMOUNT');
        }
      }

      prevPresentRef.current = present;
    });
  }, [present, styles, send]);

  React.useEffect(() => {
    if (node) {
      /**
       * Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
       * event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
       * make sure we only trigger ANIMATION_END for the currently active animation.
       */
      const handleAnimationEnd = (event: AnimationEvent) => {
        const currentAnimationName = getAnimationName(styles);
        const isCurrentAnimation = event.animationName === currentAnimationName;
        if (event.target === node && isCurrentAnimation) send('ANIMATION_END');
      };
      const handleTransitionRun = (event: TransitionEvent) => {
        if (!present && event.target === node) send('TRANSITION_OUT');
      };
      const handleTransitionEnd = (event: TransitionEvent) => {
        if (event.target === node) send('TRANSITION_END');
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
  }, [node, present, styles, send]);

  return {
    ref: (node: HTMLElement) => setNode(node),
    isPresent: ['mounted', 'unmountSuspended'].includes(state),
  };
}

/* -----------------------------------------------------------------------------------------------*/

function getAnimationName(styles?: CSSStyleDeclaration) {
  return styles?.animationName || 'none';
}

function waitForAfterNextFrame(cb = () => {}) {
  let nextFrameRaf: number;
  let afterNextFrameRaf: number;
  /**
   * Three `requestAnimationFrame` calls are needed because `requestAnimationFrame`
   * fires *before* the next frame and we need after the *next* frame. This is to ensure
   * transitions have updated and `transitionrun` has fired.
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

export { Presence };
export type { PresenceProps };
