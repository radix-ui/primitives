import { INTERACT_OUTSIDE } from '../packages/react/lock-modular-temp/src/DismissableLayer';
import type { InteractOutsideEvent } from '../packages/react/lock-modular-temp/src/DismissableLayer';

export {};

type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};

declare global {
  interface HTMLElementEventMap {
    [INTERACT_OUTSIDE]: InteractOutsideEvent;
  }
}
