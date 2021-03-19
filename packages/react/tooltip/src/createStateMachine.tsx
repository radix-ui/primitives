const ASSIGN_ACTION_TYPE = 'machine.actions.assign' as const;

const isProduction = process.env.NODE_ENV === 'production';

type StateChart<State extends string, Context, Event extends { type: string }> = {
  initial: State;
  context: Context;
  on?: {
    [eventType in Event['type']]?: Transition<State, Context, Event>;
  };
  states: {
    [stateValue in State]: {
      on?: {
        [eventType in Event['type']]?: Transition<State, Context, Event>;
      };
      entry?: Array<Action<Context, Event>>;
      exit?: Array<Action<Context, Event>>;
    };
  };
};

type Transition<State extends string, Context, Event> = {
  target?: State;
  actions?: Array<Action<Context, Event>>;
  cond?: (context: Context, Event: Event) => boolean;
};

type Action<Context, Event> = ActionFunction<Context, Event> | AssignAction<Context, Event>;

type ActionFunction<Context, Event> = (
  context: Context,
  event: Event,
  send: (event: Event) => void
) => void;

function createStateMachine<State extends string, Context, Event extends { type: string }>(
  stateChart: StateChart<State, Context, Event>,
  { debug = false, warnOnUnknownTransitions = !isProduction } = {}
) {
  let currentState = stateChart.initial;
  let currentContext = stateChart.context;

  type CallbackFn = (args: { state: State; context: Context }) => void;
  const subscriptions: Array<CallbackFn> = [];

  function subscribe(callback: CallbackFn) {
    subscriptions.push(callback);
    return () => {
      subscriptions.splice(subscriptions.indexOf(callback), 1);
    };
  }

  function notify() {
    subscriptions.forEach((callback) => callback({ state: currentState, context: currentContext }));
  }

  const send = (event: Event) => {
    const stateDefinition = stateChart.states[currentState];
    const type: Event['type'] | undefined = event.type;
    const topLevelTransition: Transition<State, Context, Event> | undefined = stateChart.on?.[type];
    const stateTransition: Transition<State, Context, Event> | undefined =
      stateDefinition.on?.[type];
    const transition = topLevelTransition ?? stateTransition;

    if (transition === undefined) {
      if (warnOnUnknownTransitions) {
        console.warn(
          `From state: "${currentState}", event "${type}" has no transition to any state`
        );
      }
    } else {
      const { target: nextState, actions = [], cond = () => true } = transition;
      const nextStateDefinition = nextState ? stateChart.states[nextState] : {};

      if (cond(currentContext, event)) {
        // execute actions
        const allActions = (stateDefinition.exit || []).concat(
          actions,
          nextStateDefinition.entry || []
        );
        currentContext = executeActions(allActions, event, currentContext);

        if (nextState) {
          currentState = nextState;

          if (debug) {
            console.group('event:', event);
            console.log('state:', currentState);
            console.log('context:', currentContext);
            console.groupEnd();
          }

          notify();
        }
      }
    }
  };

  function getContext() {
    return currentContext;
  }

  function executeActions(
    actions: Array<Action<Context, Event>>,
    event: Event,
    context: Context
  ): Context {
    let nextContext = context;
    actions?.forEach((action) => {
      if (typeof action === 'function') {
        action(nextContext, event, send);
      } else if (action.type === ASSIGN_ACTION_TYPE) {
        nextContext = action.assign(nextContext, event);
      }
    });
    return nextContext;
  }

  return { subscribe, send, getContext };
}

type AssignAction<Context, Event> = {
  type: typeof ASSIGN_ACTION_TYPE;
  assign(context: Context, event: Event): Context;
};

function assign<Context, Event>(
  assignFn: AssignAction<Context, Event>['assign']
): AssignAction<Context, Event> {
  return { type: ASSIGN_ACTION_TYPE, assign: assignFn };
}

export { createStateMachine, assign };
export type { StateChart, Action };
