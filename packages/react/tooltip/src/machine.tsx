/* -------------------------------------------------------------------------------------------------
 * Core state machine implementation
 * TODO: Consider adopting a state machine lib or reimplementing for broader usage
 * -----------------------------------------------------------------------------------------------*/

const isProduction = process.env.NODE_ENV === 'production';

export type StateChart<State extends string, Event extends string, Context> = {
  initial: State;
  context: Context;
  states: Record<State, StateDefinition<State, Event, Context>>;
};

type StateDefinition<State, Event extends string, Context> = {
  onEnterState?: (transitionFn: TransitionFn<Event, Context>) => void;
  onLeaveState?: (transitionFn: TransitionFn<Event, Context>) => void;
  on?: { [index in Event]?: State };
};

export type TransitionFn<Event, Context> = (event: Event, context?: Context) => void;

export function createStateMachine<State extends string, Event extends string, Context>(
  stateChart: StateChart<State, Event, Context>,
  { debug = false, warnOnUnknownTransitions = !isProduction } = {}
) {
  let CURRENT_STATE = stateChart.initial;
  let CURRENT_CONTEXT = stateChart.context;

  type CallbackFn = (state: State, context: Context) => void;
  const subscriptions: Array<CallbackFn> = [];

  function subscribe(callback: CallbackFn) {
    subscriptions.push(callback);
    return () => {
      subscriptions.splice(subscriptions.indexOf(callback), 1);
    };
  }

  function notify() {
    subscriptions.forEach((callback) => callback(CURRENT_STATE, CURRENT_CONTEXT));
  }

  const transition: TransitionFn<Event, Context> = (event, context) => {
    const stateDefinition = stateChart.states[CURRENT_STATE];

    // we cast to `State | undefined` because otherwise the type of `nextState`
    // would be `{ [index in Event]?: State | undefined; }[Event] | undefined`
    // and would cause issue later when trying to grab `nextStateDefinition`
    // as it would conflict with the type of `StateChart.states` which is
    // `Record<State, StateDefinition<State, Event>>`
    const nextState: State | undefined = stateDefinition.on && stateDefinition.on[event];

    if (nextState === undefined) {
      if (warnOnUnknownTransitions) {
        console.warn(`From state: "${CURRENT_STATE}", event "${event}" does not lead to any state`);
      }
    } else {
      const previousState = CURRENT_STATE;
      const previousContext = CURRENT_CONTEXT;

      if (stateDefinition.onLeaveState) {
        stateDefinition.onLeaveState(transition);
      }

      const nextStateDefinition = stateChart.states[nextState];

      if (nextStateDefinition.onEnterState) {
        nextStateDefinition.onEnterState(transition);
      }

      CURRENT_STATE = nextState;

      if (context !== undefined) {
        CURRENT_CONTEXT = context;
      }

      if (debug) {
        console.log({
          previousState,
          previousContext,
          event,
          state: CURRENT_STATE,
          context: CURRENT_CONTEXT,
        });
      }

      notify();
    }
  };

  function getState() {
    return CURRENT_STATE;
  }

  function getContext() {
    return CURRENT_CONTEXT;
  }

  return {
    subscribe,
    transition,
    getState,
    getContext,
  };
}

/* -------------------------------------------------------------------------------------------------
 * Core state machine implementation
 * TODO: Consider adopting a state machine lib or reimplementing for broader usage
 * -----------------------------------------------------------------------------------------------*/

// How long the mouse needs to stop moving for the tooltip to open
const REST_THRESHOLD_DURATION = 300;

// How much time does the user has to move from one tooltip to another without incurring the rest wait
const SKIP_REST_THRESHOLD_DURATION = 300;

type TooltipState =
  // tooltip is closed
  | 'CLOSED'

  // still closed
  // we are waiting for the mouse to stop moving (REST_THRESHOLD_DURATION)
  | 'WAITING_FOR_REST'

  // tooltip is open
  | 'OPEN'

  // tooltip is closed
  // we are checking if the mouse enters another tooltip target (SKIP_REST_THRESHOLD_DURATION)
  | 'CHECKING_IF_SHOULD_SKIP_REST_THRESHOLD'

  // tooltip has been dismissed via click or keyboard action (escape, space, enter)
  | 'DISMISSED';

type TooltipEvent =
  | 'mouseEntered'
  | 'mouseMoved'
  | 'mouseLeft'
  | 'restTimerElapsed'
  | 'skipRestTimerElapsed'
  | 'focused'
  | 'blurred'
  | 'activated'
  | 'targetMoved'
  | 'unmounted';

type TooltipContext = { id: string | null };

type TooltipStateChart = StateChart<TooltipState, TooltipEvent, TooltipContext>;
type TooltipTransitionFn = TransitionFn<TooltipEvent, TooltipContext>;

export const stateChart: TooltipStateChart = {
  initial: 'CLOSED',
  context: { id: null },
  states: {
    CLOSED: {
      on: {
        mouseEntered: 'WAITING_FOR_REST',
        focused: 'OPEN',
      },
    },
    WAITING_FOR_REST: {
      onEnterState: startRestTimer,
      onLeaveState: clearRestTimer,
      on: {
        restTimerElapsed: 'OPEN',
        mouseMoved: 'WAITING_FOR_REST',
        mouseLeft: 'CLOSED',
        activated: 'DISMISSED',
        unmounted: 'CLOSED',
      },
    },
    OPEN: {
      on: {
        mouseLeft: 'CHECKING_IF_SHOULD_SKIP_REST_THRESHOLD',
        mouseEntered: 'OPEN',
        mouseMoved: 'OPEN',
        activated: 'DISMISSED',
        blurred: 'CLOSED',
        targetMoved: 'CLOSED',
        unmounted: 'CLOSED',
      },
    },
    CHECKING_IF_SHOULD_SKIP_REST_THRESHOLD: {
      onEnterState: startSkipRestTimer,
      onLeaveState: clearSkipRestTimer,
      on: {
        skipRestTimerElapsed: 'CLOSED',
        mouseEntered: 'OPEN',
        focused: 'OPEN',
        activated: 'DISMISSED',
        unmounted: 'CLOSED',
      },
    },
    DISMISSED: {
      on: {
        mouseLeft: 'CLOSED',
        blurred: 'CLOSED',
        unmounted: 'CLOSED',
      },
    },
  },
};

// The rest timer is used to check for the user "resting" a certain
// period of time over the target, before deciding to open the tooltip.
let restTimerId: number;

function startRestTimer(transition: TooltipTransitionFn) {
  clearTimeout(restTimerId);
  restTimerId = window.setTimeout(() => transition('restTimerElapsed'), REST_THRESHOLD_DURATION);
}

function clearRestTimer() {
  clearTimeout(restTimerId);
}

// The skip rest timer is used to check if the user enters another tooltip target
// in a certain period of time, in which case, we would skip the rest timer and open
// the tooltip instantly.
let skipRestTimerId: number;

function startSkipRestTimer(transition: TooltipTransitionFn) {
  clearTimeout(skipRestTimerId);
  skipRestTimerId = window.setTimeout(
    () => transition('skipRestTimerElapsed'),
    SKIP_REST_THRESHOLD_DURATION
  );
}

function clearSkipRestTimer() {
  clearTimeout(skipRestTimerId);
}
