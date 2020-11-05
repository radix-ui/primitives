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
  | { type: 'ANIMATE_OUT' }
  | { type: 'ANIMATE_END' };

type PresenceState = { value: 'in' | 'out' | 'animatingOut'; context: {} };

function usePresence(present: boolean) {
  const [node, setNode] = React.useState<HTMLElement>();
  const [styles, setStyles] = React.useState<CSSStyleDeclaration>();
  const prevPresentRef = React.useRef(present);
  const prevAnimatableValuesRef = React.useRef<string[]>([]);
  const machine = useStateMachine<{}, PresenceEvent, PresenceState>({
    id: 'presence',
    initial: present ? 'in' : 'out',
    states: {
      in: {
        on: { UNMOUNT: 'out', ANIMATE_OUT: 'animatingOut' },
      },
      animatingOut: {
        on: { ANIMATE_END: 'out' },
      },
      out: {
        on: { MOUNT: 'in' },
      },
    },
  });

  React.useEffect(() => {
    if (node) {
      const styles = getComputedStyle(node);
      prevAnimatableValuesRef.current = getAnimatableValues(styles);
      setStyles(styles);
    }
  }, [node]);

  React.useEffect(() => {
    const waitForPossibleStyleChange = waitForNextFrame(() => {
      const wasPresent = prevPresentRef.current;
      const prevValues = prevAnimatableValuesRef.current;
      const nextValues = getAnimatableValues(styles);
      // If the element is hidden, it will not trigger an animation/transition
      const hasHiddenStyle = styles?.display === 'none';
      const hasAnimationChanged = String(prevValues) !== String(nextValues);
      const isAnimating = !hasHiddenStyle && hasAnimationChanged;
      prevAnimatableValuesRef.current = nextValues;
      prevPresentRef.current = present;

      if (present) {
        machine.send('MOUNT');
      } else if (wasPresent && isAnimating) {
        machine.send('ANIMATE_OUT');
      } else {
        machine.send('UNMOUNT');
      }
    });
    return () => waitForPossibleStyleChange.cancel();
  }, [present, styles, machine]);

  React.useEffect(() => {
    if (node) {
      const handleEnd = () => machine.send('ANIMATE_END');
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
  }, [node, present, machine]);

  return {
    ref: setNode,
    isPresent: ['in', 'animatingOut'].includes(machine.state),
  };
}

function getAnimatableValues(styles?: CSSStyleDeclaration) {
  const animationValue = styles?.animationName || 'none';
  const transitionProperties = styles?.transitionProperty.split(/,\s?/) || [];
  const transitionValues = transitionProperties.map((prop) => styles?.[prop as any]);
  return [...transitionValues, animationValue].filter(Boolean) as string[];
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

  return {
    cancel: () => {
      cancelAnimationFrame(outerRaf);
      cancelAnimationFrame(innerRaf);
    },
  };
}

/* -----------------------------------------------------------------------------------------------*/

export { Presence };
export type { PresenceProps };
