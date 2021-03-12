import { assign } from './createStateMachine';

import type { StateChart, Action } from './createStateMachine';

type TooltipState = 'closed' | 'open';
type TooltipEvent =
  | { type: 'MOUSE_ENTER'; id: string; delayDuration: number }
  | { type: 'MOUSE_LEAVE'; id: string; skipDelayDuration: number }
  | { type: 'DELAY_TIMER_ELAPSE'; id: string }
  | { type: 'DELAY_TIMER_SKIP'; id: string }
  | { type: 'SKIP_DELAY_TIMER_ELAPSE'; id: string }
  | { type: 'FOCUS'; id: string }
  | { type: 'BLUR'; id: string }
  | { type: 'ACTIVATE'; id: string }
  | { type: 'DISMISS'; id: string }
  | { type: 'TRIGGER_MOVE'; id: string }
  | { type: 'UNMOUNT'; id: string };
type TooltipContext = { id: string | null; shouldSkipDelay: boolean };
type TooltipStateChart = StateChart<TooltipState, TooltipEvent, TooltipContext>;
type TooltipAction = Action<TooltipEvent, TooltipContext>;

// context assignment actions
const setId: TooltipAction = assign((context, event) => ({ ...context, id: event.id }));
const setShouldSkipDelay = (shouldSkipDelay: boolean): TooltipAction => {
  return assign((context) => ({ ...context, shouldSkipDelay }));
};

let delayTimerId: number;
let skipDelayTimerId: number;

// other actions
const startDelayTimer: TooltipAction = (event, context, send) => {
  if (context.shouldSkipDelay) {
    send({ type: 'DELAY_TIMER_SKIP', id: event.id });
  } else {
    delayTimerId = window.setTimeout(
      () => send({ type: 'DELAY_TIMER_ELAPSE', id: event.id }),
      // @ts-ignore
      event.delayDuration
    );
  }
};
const cancelDelayTimer: TooltipAction = () => clearTimeout(delayTimerId);
const startSkipDelayTimer: TooltipAction = (event, context, send) => {
  skipDelayTimerId = window.setTimeout(
    () => send({ type: 'SKIP_DELAY_TIMER_ELAPSE', id: event.id }),
    // @ts-ignore
    event.skipDelayDuration
  );
};
const cancelSkipDelayTimer: TooltipAction = () => clearTimeout(skipDelayTimerId);

const tooltipStateChart: TooltipStateChart = {
  initial: 'closed',
  context: { id: null, shouldSkipDelay: false },
  states: {
    closed: {
      exit: [cancelDelayTimer],
      on: {
        MOUSE_ENTER: { actions: [setId, startDelayTimer] },
        FOCUS: { target: 'open', actions: [setId, setShouldSkipDelay(true)] },
        DELAY_TIMER_ELAPSE: { target: 'open', actions: [setId] },
        DELAY_TIMER_SKIP: { target: 'open', actions: [setId] },
        SKIP_DELAY_TIMER_ELAPSE: { actions: [setId, setShouldSkipDelay(false)] },
        MOUSE_LEAVE: { actions: [setId, cancelDelayTimer] },
      },
    },
    open: {
      entry: [cancelSkipDelayTimer],
      on: {
        MOUSE_ENTER: { target: 'open', actions: [setId] },
        FOCUS: { target: 'open', actions: [setId, setShouldSkipDelay(true)] },
        MOUSE_LEAVE: {
          target: 'closed',
          actions: [setId, setShouldSkipDelay(true), startSkipDelayTimer],
        },
        ACTIVATE: { target: 'closed', actions: [setId] },
        DISMISS: { target: 'closed', actions: [setId] },
        BLUR: { target: 'closed', actions: [setId, setShouldSkipDelay(false)] },
        TRIGGER_MOVE: { target: 'closed', actions: [setId] },
        UNMOUNT: { target: 'closed', actions: [setId] },
      },
    },
  },
};

export { tooltipStateChart };
