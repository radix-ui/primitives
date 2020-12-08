// This code is a fork of `react-aria`'s `useHover` hook. The code in this file are based on code
// from both `react-aria` and `react-interactions`. Original licensing for each project can be found
// in the the root directories of each respective repository.
//
// @see https://github.com/adobe/react-spectrum/tree/452d1cb6a49f9f493757737edaf2b64014108de6/packages/%40react-aria
// @see https://github.com/facebook/react/tree/cc7c1aece46a6b69b41958d731e0fd27c94bfc6c/packages/react-interactions

import * as React from 'react';

export interface HoverEvent {
  /** The type of hover event being fired. */
  type: 'hoverstart' | 'hoverend';
  /** The pointer type that triggered the hover event. */
  pointerType: 'mouse' | 'pen';
  /** The target element of the hover event. */
  target: HTMLElement;
}

export interface HoverEvents {
  /** Handler that is called when a hover interaction starts. */
  onHoverStart?(e: HoverEvent): void;
  /** Handler that is called when a hover interaction ends. */
  onHoverEnd?(e: HoverEvent): void;
  /** Handler that is called when the hover state changes. */
  onHoverChange?(isHovering: boolean): void;
}

export interface HoverProps extends HoverEvents {
  /** Whether the hover events should be disabled. */
  isDisabled?: boolean;
}

interface HoverResult {
  /** Props to spread on the target element. */
  hoverProps: React.HTMLAttributes<HTMLElement>;
  isHovered: boolean;
}

// iOS fires onPointerEnter twice: once with pointerType="touch" and again with pointerType="mouse".
// We want to ignore these emulated events so they do not trigger hover behavior.
// See https://bugs.webkit.org/show_bug.cgi?id=214609.
let globalIgnoreEmulatedMouseEvents = false;
let hoverCount = 0;

function setGlobalIgnoreEmulatedMouseEvents() {
  globalIgnoreEmulatedMouseEvents = true;

  // Clear globalIgnoreEmulatedMouseEvents after a short timeout. iOS fires onPointerEnter with
  // pointerType="mouse" immediately after onPointerUp and before onFocus. On other devices that
  // don't have this quirk, we don't want to ignore a mouse hover sometime in the distant future
  // because a user previously touched the element.
  setTimeout(function clearGlobalIgnoreEmulatedMouseEvents() {
    globalIgnoreEmulatedMouseEvents = false;
  }, 50);
}

function handleGlobalPointerEvent(event: PointerEvent) {
  if (event.pointerType === 'touch') {
    setGlobalIgnoreEmulatedMouseEvents();
  }
}

function setupGlobalTouchEvents() {
  if (typeof document === 'undefined') {
    return;
  }

  document.addEventListener('pointerup', handleGlobalPointerEvent);

  hoverCount++;
  return function teardownGlobalTouchEvents() {
    hoverCount--;
    if (hoverCount > 0) {
      return;
    }
    document.removeEventListener('pointerup', handleGlobalPointerEvent);
  };
}

/**
 * Handles pointer hover interactions for an element. Normalizes behavior
 * across browsers and platforms, and ignores emulated mouse events on touch devices.
 */
export function useHover(props: HoverProps = {}): HoverResult {
  const { onHoverStart, onHoverChange, onHoverEnd, isDisabled } = props;

  const [isHovered, setHovered] = React.useState(false);
  const state = React.useRef({
    isHovered: false,
    ignoreEmulatedMouseEvents: false,
  }).current;

  React.useEffect(setupGlobalTouchEvents, []);

  const hoverProps = React.useMemo(
    function getHoverProps() {
      function triggerHoverStart(
        event: PointerEvent | React.PointerEvent | MouseEvent | React.MouseEvent,
        pointerType: 'mouse' | 'pen' | 'touch'
      ) {
        if (isDisabled || pointerType === 'touch' || state.isHovered) {
          return;
        }

        state.isHovered = true;
        const target = event.target as HTMLElement;

        if (onHoverStart) {
          onHoverStart({
            type: 'hoverstart',
            target,
            pointerType,
          });
        }

        if (onHoverChange) {
          onHoverChange(true);
        }

        setHovered(true);
      }

      function triggerHoverEnd(
        event: PointerEvent | React.PointerEvent | MouseEvent | React.MouseEvent,
        pointerType: 'mouse' | 'pen' | 'touch'
      ) {
        if (isDisabled || pointerType === 'touch' || !state.isHovered) {
          return;
        }

        state.isHovered = false;
        const target = event.target as HTMLElement;

        if (onHoverEnd) {
          onHoverEnd({
            type: 'hoverend',
            target,
            pointerType,
          });
        }

        if (onHoverChange) {
          onHoverChange(false);
        }

        setHovered(false);
      }

      const hoverProps: React.HTMLAttributes<HTMLElement> = {
        onPointerEnter(event: React.PointerEvent<HTMLElement>) {
          if (globalIgnoreEmulatedMouseEvents && event.pointerType === 'mouse') {
            return;
          }
          triggerHoverStart(event, event.pointerType);
        },
        onPointerLeave(event: React.PointerEvent<HTMLElement>) {
          triggerHoverEnd(event, event.pointerType);
        },
      };

      return hoverProps;
    },
    [isDisabled, state, onHoverStart, onHoverChange, onHoverEnd]
  );

  return {
    hoverProps,
    isHovered,
  };
}
