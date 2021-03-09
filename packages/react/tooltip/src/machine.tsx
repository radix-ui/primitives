/* -------------------------------------------------------------------------------------------------
 * Core state machine implementation
 * -----------------------------------------------------------------------------------------------*/

const isProduction = process.env.NODE_ENV === 'production';

type StateChart<State extends string, Event extends string, Context> = {
  initial: State;
  context: Context;
  states: Record<State, StateDefinition<State, Event, Context>>;
};

type StateDefinition<State, Event extends string, Context> = {
  onEnterState?: (transitionFn: TransitionFn<Event, Context>, context: Context) => void;
  onLeaveState?: (transitionFn: TransitionFn<Event, Context>, context: Context) => void;
  on?: { [index in Event]?: State };
};

type TransitionFn<Event, Context> = (event: Event, context?: Context) => void;

function createStateMachine<State extends string, Event extends string, Context>(
  stateChart: StateChart<State, Event, Context>,
  { debug = false, warnOnUnknownTransitions = !isProduction } = {}
) {
  let PREVIOUS_STATE: State | undefined;
  let CURRENT_STATE = stateChart.initial;
  let PREVIOUS_CONTEXT: Context | undefined;
  let CURRENT_CONTEXT = stateChart.context;

  type CallbackFn = (args: { state: State; previousState?: State; context: Context }) => void;
  const subscriptions: Array<CallbackFn> = [];

  function subscribe(callback: CallbackFn) {
    subscriptions.push(callback);
    return () => {
      subscriptions.splice(subscriptions.indexOf(callback), 1);
    };
  }

  function notify() {
    subscriptions.forEach((callback) =>
      callback({
        state: CURRENT_STATE,
        previousState: PREVIOUS_STATE,
        context: CURRENT_CONTEXT,
      })
    );
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
      PREVIOUS_STATE = CURRENT_STATE;
      PREVIOUS_CONTEXT = CURRENT_CONTEXT;

      if (stateDefinition.onLeaveState) {
        stateDefinition.onLeaveState(transition, CURRENT_CONTEXT);
      }

      const nextStateDefinition = stateChart.states[nextState];

      CURRENT_STATE = nextState;

      if (context !== undefined) {
        CURRENT_CONTEXT = context;
      }

      if (nextStateDefinition.onEnterState) {
        nextStateDefinition.onEnterState(transition, CURRENT_CONTEXT);
      }

      if (debug) {
        console.log({
          previousState: PREVIOUS_STATE,
          previousContext: PREVIOUS_CONTEXT,
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

type TooltipState =
  // tooltip is closed
  | 'CLOSED'

  // still closed
  // we are waiting for the mouse to stop moving (rest duration)
  | 'WAITING_FOR_REST'

  // tooltip is open
  | 'OPEN'

  // tooltip is closed
  // we are checking if the mouse enters another tooltip trigger (bypass rest duration)
  | 'CHECKING_IF_SHOULD_BYPASS_REST'

  // tooltip has been dismissed via click or keyboard action (escape, space, enter)
  | 'DISMISSED';

type TooltipEvent =
  | 'mouseEntered'
  | 'mouseMoved'
  | 'mouseLeft'
  | 'restTimerElapsed'
  | 'bypassRestTimerElapsed'
  | 'focused'
  | 'blurred'
  | 'activated'
  | 'triggerMoved'
  | 'unmounted';

type TooltipContext = {
  id: string | null;
  restDuration?: number;
  bypassRestDuration?: number;
};

type TooltipStateChart = StateChart<TooltipState, TooltipEvent, TooltipContext>;
type TooltipTransitionFn = TransitionFn<TooltipEvent, TooltipContext>;

const stateChart: TooltipStateChart = {
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
        mouseLeft: 'CHECKING_IF_SHOULD_BYPASS_REST',
        mouseEntered: 'OPEN',
        mouseMoved: 'OPEN',
        activated: 'DISMISSED',
        blurred: 'CLOSED',
        triggerMoved: 'CLOSED',
        unmounted: 'CLOSED',
      },
    },
    CHECKING_IF_SHOULD_BYPASS_REST: {
      onEnterState: startBypassRestTimer,
      onLeaveState: clearBypassRestTimer,
      on: {
        bypassRestTimerElapsed: 'CLOSED',
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
// period of time over the trigger, before deciding to open the tooltip.
let restTimerId: number;

function startRestTimer(transition: TooltipTransitionFn, context: TooltipContext) {
  const duration = context.restDuration ?? 300;
  clearTimeout(restTimerId);
  restTimerId = window.setTimeout(() => transition('restTimerElapsed'), duration);
}

function clearRestTimer() {
  clearTimeout(restTimerId);
}

// The bypass rest timer is used to check if the user enters another tooltip trigger
// in a certain period of time, in which case, we would bypass the rest timer and open
// the tooltip instantly.
let bypassRestTimerId: number;

function startBypassRestTimer(transition: TooltipTransitionFn, context: TooltipContext) {
  const duration = context.bypassRestDuration ?? 300;
  clearTimeout(bypassRestTimerId);
  bypassRestTimerId = window.setTimeout(() => transition('bypassRestTimerElapsed'), duration);
}

function clearBypassRestTimer() {
  clearTimeout(bypassRestTimerId);
}

export { stateChart, createStateMachine };
export type { StateChart, TransitionFn };
