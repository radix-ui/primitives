import * as React from 'react';
import { useComposedRefs } from '@interop-ui/react-utils';
import { useStateMachine } from './useStateMachine';

type PresenceProps = { present: boolean };

const Presence: React.FC<PresenceProps> = (props) => {
  const { present, children } = props;
  const child = React.Children.only(children) as React.ReactElement;
  const presence = usePresence(present);
  const ref = useComposedRefs(presence.ref, (child as any).ref);
  return presence.isPresent ? React.cloneElement(child, { ref }) : null;
};

Presence.displayName = 'Presence';

/* -------------------------------------------------------------------------------------------------
 * usePresence
 * -----------------------------------------------------------------------------------------------*/
type PresenceEvent =
  | { type: 'MOUNT' }
  | { type: 'UNMOUNT' }
  | { type: 'MOTION_OUT' }
  | { type: 'MOTION_END' };

type PresenceState = { value: 'mounted' | 'unmounted' | 'unmountSuspended'; context: {} };

function usePresence(present: boolean) {
  const [node, setNode] = React.useState<HTMLElement>();
  const [styles, setStyles] = React.useState<CSSStyleDeclaration>();
  const prevPresentRef = React.useRef(present);
  const prevMotionValuesRef = React.useRef<string[]>([]);
  const { state, send } = useStateMachine<{}, PresenceEvent, PresenceState>({
    id: 'presence',
    initial: present ? 'mounted' : 'unmounted',
    states: {
      mounted: {
        on: { UNMOUNT: 'unmounted', MOTION_OUT: 'unmountSuspended' },
      },
      unmountSuspended: {
        on: { MOTION_END: 'unmounted' },
      },
      unmounted: {
        on: { MOUNT: 'mounted' },
      },
    },
  });

  React.useEffect(() => {
    if (node) {
      const styles = getComputedStyle(node);
      prevMotionValuesRef.current = getMotionValues(styles);
      setStyles(styles);
    }
  }, [node]);

  /**
   * We check for any changes to animation/transition properties to determine
   * whether an animation/transition has started when `present` has changed.
   *
   * We chose this approach (reading computed styles) over using `animationstart`
   * or `transitionstart` events because we would need to set a timer (`setTimeout`)
   * when `present` is `false`. These events would need to clear it to prevent unmount
   * which is at risk of breaking if consumers used things like `animation-delay`.
   */
  React.useEffect(() => {
    return waitForNextFrame(() => {
      const wasPresent = prevPresentRef.current;
      const prevMotionValues = prevMotionValuesRef.current;
      const currentMotionValues = getMotionValues(styles);
      const hasHiddenStyle = styles?.display === 'none';
      const hasMotionValuesChanged = String(prevMotionValues) !== String(currentMotionValues);
      // If the element is hidden, it will not trigger an animation/transition
      const isInMotion = !hasHiddenStyle && hasMotionValuesChanged;
      prevMotionValuesRef.current = currentMotionValues;
      prevPresentRef.current = present;

      if (present) {
        send('MOUNT');
      } else if (wasPresent && isInMotion) {
        send('MOTION_OUT');
      } else {
        send('UNMOUNT');
      }
    });
  }, [present, styles, send]);

  React.useEffect(() => {
    if (node) {
      const handleEnd = () => send('MOTION_END');
      node.addEventListener('animationcancel', handleEnd);
      node.addEventListener('transitioncancel', handleEnd);
      node.addEventListener('animationend', handleEnd);
      node.addEventListener('transitionend', handleEnd);

      return () => {
        node.removeEventListener('animationcancel', handleEnd);
        node.removeEventListener('transitioncancel', handleEnd);
        node.removeEventListener('animationend', handleEnd);
        node.removeEventListener('transitionend', handleEnd);
      };
    }
  }, [node, present, send]);

  return {
    ref: (node: HTMLElement) => setNode(node),
    isPresent: ['mounted', 'unmountSuspended'].includes(state),
  };
}

function getMotionValues(styles?: CSSStyleDeclaration) {
  const animationName = styles?.animationName || 'none';
  const transitionProperties = styles?.transitionProperty.split(/,\s?/) || [];
  const transitionValues = transitionProperties.map((prop) => styles?.[prop as any]);
  return [animationName, ...transitionValues].filter(Boolean) as string[];
}

function waitForNextFrame(cb = () => {}) {
  let innerRaf: number;
  /**
   * We call `requestAnimationFrame` twice because `requestAnimationFrame` fires *before* the
   * next frame and we need *next* frame. This is to ensure our live CSSStyleDeclaration
   * has updated before we compare values.
   */
  const outerRaf = requestAnimationFrame(() => {
    innerRaf = requestAnimationFrame(cb);
  });

  return () => {
    cancelAnimationFrame(outerRaf);
    cancelAnimationFrame(innerRaf);
  };
}

/* -----------------------------------------------------------------------------------------------*/

export { Presence };
export type { PresenceProps };
