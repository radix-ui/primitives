const ASSIGN_ACTION_TYPE = 'machine.actions.assign' as const;

const isProduction = process.env.NODE_ENV === 'production';

type StateChart<State extends string, Event extends { type: string }, Context> = {
  initial: State;
  context: Context;
  states: {
    [stateValue in State]: {
      on?: {
        [eventType in Event['type']]?: Transition<State, Event, Context>;
      };
      entry?: Array<Action<Event, Context>>;
      exit?: Array<Action<Event, Context>>;
    };
  };
};

type Transition<State extends string, Event, Context> = {
  target: State;
  actions?: Array<Action<Event, Context>>;
};

type Action<Event, Context> = ActionFunction<Event, Context> | AssignAction<Event, Context>;

type ActionFunction<Event, Context> = (
  event: Event,
  context: Context,
  send: (event: Event) => void
) => void;

function createStateMachine<State extends string, Event extends { type: string }, Context>(
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

  const send = (event: Event) => {
    const stateDefinition = stateChart.states[CURRENT_STATE];
    const type: Event['type'] | undefined = event.type;
    const transition: Transition<State, Event, Context> | undefined = stateDefinition.on?.[type];

    if (transition === undefined) {
      if (warnOnUnknownTransitions) {
        console.warn(
          `From state: "${CURRENT_STATE}", event "${type}" has no transition to any state`
        );
      }
    } else {
      PREVIOUS_STATE = CURRENT_STATE;
      PREVIOUS_CONTEXT = { ...CURRENT_CONTEXT };
      const nextState = transition.target;
      const nextStateDefinition = stateChart.states[nextState];
      CURRENT_STATE = nextState;

      // execute actions
      const allActions = (stateDefinition.exit || []).concat(
        transition.actions || [],
        nextStateDefinition.entry || []
      );
      CURRENT_CONTEXT = executeActions(allActions, event, CURRENT_CONTEXT);

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

  function getContext() {
    return CURRENT_CONTEXT;
  }

  function executeActions(
    actions: Array<Action<Event, Context>>,
    event: Event,
    context: Context
  ): Context {
    let nextContext = context;
    actions?.forEach((action) => {
      if (typeof action === 'function') {
        action(event, nextContext, send);
      } else if (action.type === ASSIGN_ACTION_TYPE) {
        nextContext = action.assign(nextContext, event);
      }
    });
    return nextContext;
  }

  return { subscribe, send, getContext };
}

type AssignAction<Event, Context> = {
  type: typeof ASSIGN_ACTION_TYPE;
  assign(context: Context, event: Event): Context;
};

function assign<Event, Context>(
  assignFn: AssignAction<Event, Context>['assign']
): AssignAction<Event, Context> {
  return { type: ASSIGN_ACTION_TYPE, assign: assignFn };
}

export { createStateMachine, assign };
export type { StateChart };
