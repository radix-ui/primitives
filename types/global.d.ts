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
  interface Window {
    RADIX_TOOLTIP_REST_THRESHOLD_DURATION?: number;
    RADIX_TOOLTIP_SKIP_REST_THRESHOLD_DURATION?: number;
  }
}
