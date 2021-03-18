import { assign } from './createStateMachine';

import type { StateChart } from './createStateMachine';

// How long the mouse needs to stop moving for the tooltip to open
const REST_THRESHOLD_DURATION = 300;

// How much time does the user has to move from one tooltip to another without incurring the rest wait
const SKIP_REST_THRESHOLD_DURATION = 300;

type TooltipState =
  // tooltip is closed
  | 'closed'

  // still closed
  // we are waiting for the mouse to stop moving (REST_THRESHOLD_DURATION)
  | 'waitingForRest'

  // tooltip is open
  | 'open'

  // tooltip is closed
  // we are checking if the mouse enters another tooltip trigger (SKIP_REST_THRESHOLD_DURATION)
  | 'checkingIfShouldSkipRestThreshold'

  // tooltip has been dismissed via click or keyboard action (escape, space, enter)
  | 'dismissed';

type TooltipEvent =
  | { type: 'MOUSE_ENTER'; id: string }
  | { type: 'MOUSE_MOVE'; id: string }
  | { type: 'MOUSE_LEAVE'; id: string }
  | { type: 'REST_TIMER_ELAPSE'; id: string }
  | { type: 'SKIP_REST_TIMER_ELAPSE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'BLUR'; id: string }
  | { type: 'ACTIVATE'; id: string }
  | { type: 'TRIGGER_MOVE'; id: string }
  | { type: 'UNMOUNT'; id: string };

type TooltipContext = { id: string | null };

type TooltipStateChart = StateChart<TooltipState, TooltipEvent, TooltipContext>;

// The rest timer is used to check for the user "resting" a certain
// period of time over the trigger, before deciding to open the tooltip.
let restTimerId: number;

// The skip rest timer is used to check if the user enters another tooltip trigger
// in a certain period of time, in which case, we would skip the rest timer and open
// the tooltip instantly.
let skipRestTimerId: number;

const assignId = assign((context: TooltipContext, event: TooltipEvent) => ({
  ...context,
  id: event.id,
}));

const tooltipStateChart: TooltipStateChart = {
  initial: 'closed',
  context: { id: null },
  states: {
    closed: {
      on: {
        MOUSE_ENTER: { target: 'waitingForRest', actions: [assignId] },
        FOCUS: { target: 'open', actions: [assignId] },
      },
    },
    waitingForRest: {
      entry: [
        (event, context, send) => {
          restTimerId = window.setTimeout(
            () => send({ type: 'REST_TIMER_ELAPSE', id: event.id }),
            REST_THRESHOLD_DURATION
          );
        },
      ],
      exit: [
        (event, context) => {
          clearTimeout(restTimerId);
        },
      ],
      on: {
        REST_TIMER_ELAPSE: { target: 'open', actions: [assignId] },
        MOUSE_MOVE: { target: 'waitingForRest', actions: [assignId] },
        MOUSE_LEAVE: { target: 'closed', actions: [assignId] },
        ACTIVATE: { target: 'dismissed', actions: [assignId] },
        UNMOUNT: { target: 'closed', actions: [assignId] },
      },
    },
    open: {
      on: {
        MOUSE_LEAVE: { target: 'checkingIfShouldSkipRestThreshold', actions: [assignId] },
        MOUSE_ENTER: { target: 'open', actions: [assignId] },
        MOUSE_MOVE: { target: 'open', actions: [assignId] },
        ACTIVATE: { target: 'dismissed', actions: [assignId] },
        BLUR: { target: 'closed', actions: [assignId] },
        TRIGGER_MOVE: { target: 'closed', actions: [assignId] },
        UNMOUNT: { target: 'closed', actions: [assignId] },
      },
    },
    checkingIfShouldSkipRestThreshold: {
      entry: [
        (event, context, send) => {
          skipRestTimerId = window.setTimeout(
            () => send({ type: 'SKIP_REST_TIMER_ELAPSE', id: event.id }),
            SKIP_REST_THRESHOLD_DURATION
          );
        },
      ],
      exit: [
        (event, context) => {
          clearTimeout(skipRestTimerId);
        },
      ],
      on: {
        SKIP_REST_TIMER_ELAPSE: { target: 'closed', actions: [assignId] },
        MOUSE_ENTER: { target: 'open', actions: [assignId] },
        FOCUS: { target: 'open', actions: [assignId] },
        ACTIVATE: { target: 'dismissed', actions: [assignId] },
        UNMOUNT: { target: 'closed', actions: [assignId] },
      },
    },
    dismissed: {
      on: {
        MOUSE_LEAVE: { target: 'closed', actions: [assignId] },
        BLUR: { target: 'closed', actions: [assignId] },
        UNMOUNT: { target: 'closed', actions: [assignId] },
      },
    },
  },
};

export { tooltipStateChart };
