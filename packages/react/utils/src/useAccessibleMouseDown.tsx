import * as React from 'react';
import { composeEventHandlers } from './composeEventHandlers';

type UseAccessibleMouseDownOptions<T extends HTMLElement> = {
  /** Whether the target is currently disabled or not */
  isDisabled?: boolean;
  /** The original onMouseDown to compose */
  onMouseDown?: React.MouseEventHandler<T>;
  /** The original onKeyDown to compose */
  onKeyDown?: React.KeyboardEventHandler<T>;
};

/**
 * This hook can be used to create an accessible mouse down handler
 * which retains keyboard accessibility (that you normally get with click events).
 */
export function useAccessibleMouseDown<T extends HTMLElement>(
  handler: React.MouseEventHandler<T>,
  {
    isDisabled,
    onMouseDown: originalOnMouseDown,
    onKeyDown: originalOnKeyDown,
  }: UseAccessibleMouseDownOptions<T>
) {
  const handleMouseDown = React.useCallback(
    (event: React.MouseEvent<T>) => {
      if (isDisabled) {
        // prevent focus from happening
        event.preventDefault();
        return;
      }
      // only call handler if it's the left button (mousedown gets triggered by all mouse buttons)
      // but not when the control key is pressed (avoiding MacOS right click)
      if (event.button === 0 && event.ctrlKey === false) {
        handler(event);
      }
    },
    [handler, isDisabled]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<T>) => {
      if (isDisabled) return;
      if (event.key === ' ' || event.key === 'Enter') {
        // prevent active state to be stuck in case focus moves somewhere else before mouseUp
        event.preventDefault();
        handler((event as unknown) as React.MouseEvent<T>);
      }
    },
    [handler, isDisabled]
  );

  return {
    onMouseDown: composeEventHandlers(originalOnMouseDown, handleMouseDown),
    onKeyDown: composeEventHandlers(originalOnKeyDown, handleKeyDown),
  };
}
