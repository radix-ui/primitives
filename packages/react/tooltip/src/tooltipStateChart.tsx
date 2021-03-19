import { assign } from './createStateMachine';

import type { StateChart, Action } from './createStateMachine';

type TooltipState = 'closed' | 'opening' | 'open' | 'closing';

type TooltipEvent =
  | { type: 'OPEN'; id: string; delayDuration?: number }
  | { type: 'CLOSE'; id: string; skipDelayDuration: number }
  | { type: 'FOCUS'; id: string }
  | { type: 'DELAY_TIMER_END' }
  | { type: 'SKIP_DELAY_TIMER_END' };

type TooltipContext = { id: string | null; delayed: boolean };

type TooltipStateChart = StateChart<TooltipState, TooltipContext, TooltipEvent>;
type TooltipAction = Action<TooltipContext, TooltipEvent>;

// actions
let delayTimerId: number;
let skipDelayTimerId: number;

const startDelayTimer: TooltipAction = (context, event, send) => {
  const delayDuration: number | undefined = (event as any).delayDuration;
  const sendTimerEnd = () => send({ type: 'DELAY_TIMER_END' });
  if (delayDuration === undefined) {
    sendTimerEnd();
  } else {
    delayTimerId = window.setTimeout(sendTimerEnd, delayDuration);
  }
};

const cancelDelayTimer: TooltipAction = () => clearTimeout(delayTimerId);

const startSkipDelayTimer: TooltipAction = (context, event, send) => {
  const skipDelayDuration: number = (event as any).skipDelayDuration ?? 300;
  skipDelayTimerId = window.setTimeout(
    () => send({ type: 'SKIP_DELAY_TIMER_END' }),
    skipDelayDuration
  );
};

const cancelSkipDelayTimer: TooltipAction = () => clearTimeout(skipDelayTimerId);

const setId: TooltipAction = assign((context, event) => ({
  ...context,
  id: (event as any).id ?? context.id,
}));
const resetId: TooltipAction = assign((context) => ({ ...context, id: null }));
const setDelayed: TooltipAction = assign((context) => ({ ...context, delayed: true }));
const resetDelayed: TooltipAction = assign((context) => ({ ...context, delayed: false }));

const tooltipStateChart: TooltipStateChart = {
  initial: 'closed',
  context: { id: null, delayed: false },
  on: {
    FOCUS: { target: 'open' },
  },
  states: {
    closed: {
      entry: [resetId],
      on: {
        OPEN: { target: 'opening' },
      },
    },

    opening: {
      entry: [startDelayTimer, setId, setDelayed],
      exit: [cancelDelayTimer],
      on: {
        DELAY_TIMER_END: { target: 'open' },
        CLOSE: { target: 'closed' },
      },
    },

    open: {
      entry: [setId],
      exit: [resetDelayed],
      on: {
        OPEN: { target: 'open' },
        CLOSE: {
          target: 'closing',
          cond: (context, event) => context.id === (event as any).id,
        },
      },
    },

    closing: {
      entry: [startSkipDelayTimer],
      exit: [cancelSkipDelayTimer],
      on: {
        OPEN: { target: 'open' },
        SKIP_DELAY_TIMER_END: { target: 'closed' },
      },
    },
  },
};

export { tooltipStateChart };
