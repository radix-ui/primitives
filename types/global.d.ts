import { POINTER_DOWN_OUTSIDE } from '../packages/react/dismissable-layer/src';
import type { PointerDownOutsideEvent } from '../packages/react/dismissable-layer/src';

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
    [POINTER_DOWN_OUTSIDE]: PointerDownOutsideEvent;
  }
}
