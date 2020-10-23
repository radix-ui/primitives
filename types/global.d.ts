import { INTERACT_OUTSIDE } from '../packages/react/dismissable-layer/src/DismissableLayer';
import type { InteractOutsideEvent } from '../packages/react/dismissable-layer/src/DismissableLayer';

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
