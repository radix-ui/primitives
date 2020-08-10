// Currently a fork of @reach/machine
// This will be re-implemented when we have our own state machine API in @interop-ui/machine

import * as React from 'react';
import {
  assign,
  createMachine,
  EventObject as MachineEvent,
  interpret,
  InterpreterStatus,
  StateMachine,
  Typestate,
} from '@xstate/fsm';
import { DistributiveOmit, isString, isFunction, __DEV__ } from '@interop-ui/utils';
import { useConstant } from '@interop-ui/react-utils';

function getServiceState<
  ContextType extends object,
  EventType extends MachineEvent = MachineEvent,
  StateType extends Typestate<ContextType> = any
>(service: StateMachine.Service<ContextType, EventType, StateType>) {
  let currentValue: StateMachine.State<ContextType, EventType, StateType>;
  service
    .subscribe((state) => {
      currentValue = state;
    })
    .unsubscribe();
  return currentValue!;
}

/**
 * This `useMachine` works very similiarly to what you get from `@xstate/react` with some additions.
 *
 *  - A we pass `refs` into the options object to send all of our refs into our machine's contextual
 *    data object.
 *
 *  - We wrap the `send` function so that refs are updated included in all of our events so we can
 *    use their current value (generally DOM nodes) anywhere in our actions.
 *
 * @param stateMachine
 * @param options
 */
function useMachine<
  ContextType extends object,
  EventType extends MachineEventWithRefs = MachineEventWithRefs,
  StateType extends Typestate<ContextType> = any
>(
  stateMachineOrCreator:
    | StateMachine.Machine<ContextType, EventType, StateType>
    | (() => StateMachine.Machine<ContextType, EventType, StateType>),
  options?: {
    actions?: StateMachine.ActionMap<ContextType, EventType>;
    refs?: MachineToReactRefMap<EventType>;
    DEBUG?: boolean;
  }
) {
  let { refs, DEBUG = false, ...xstateOptions } = options || {};

  let service = useConstant(() => {
    let stateMachine = isFunction(stateMachineOrCreator)
      ? stateMachineOrCreator()
      : stateMachineOrCreator;
    return interpret(
      createMachine(
        stateMachine.config,
        xstateOptions ? xstateOptions : (stateMachine as any)._options
      )
    ).start();
  });
  let [state, setState] = React.useState(() => getServiceState(service));

  React.useEffect(() => {
    if (xstateOptions) {
      (service as any)._machine._options = xstateOptions;
    }
  });

  let lastEventType = React.useRef<EventType['type'] | null>(null);

  // Add refs to every event so we can use them to perform actions.
  let send = React.useCallback(
    (rawEvent: EventType['type'] | DistributiveOmit<EventType, 'refs'>) => {
      let event = isString(rawEvent) ? { type: rawEvent } : rawEvent;
      let refValues = unwrapRefs(refs);
      service.send({
        ...event,
        lastEventType: lastEventType.current,
        refs: refValues,
      } as EventType);
      lastEventType.current = event.type;

      if (__DEV__) {
        if (DEBUG) {
          console.group('Event Sent');
          console.log('Event:', event);
          console.groupEnd();
        }
      }
    },
    // We can disable the lint warning here. Refs will always be refs and should not trigger a
    // re-render. The state machine service persists for the life of the component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [DEBUG]
  );

  // Prevents state function references from causing rerenders
  let actionsRef = React.useRef(state.actions);
  let matchesRef = React.useRef(state.matches);
  React.useEffect(() => {
    actionsRef.current = state.actions;
    matchesRef.current = state.matches;
  });
  let memoizedState = React.useMemo<StateMachine.State<ContextType, EventType, StateType>>(
    () => ({
      changed: state.changed,
      context: state.context,
      value: state.value,
      matches: matchesRef.current,
      actions: actionsRef.current,
    }),
    [state.changed, state.context, state.value]
  );

  React.useEffect(() => {
    service.subscribe(setState);
    return () => {
      service.stop();
    };
  }, [service]);

  React.useEffect(() => {
    if (__DEV__) {
      if (DEBUG && memoizedState.changed) {
        console.group('State Updated');
        console.log('State:', memoizedState);
        console.groupEnd();
      }
    }
  }, [DEBUG, memoizedState]);

  return [memoizedState, send, service] as const;
}

/**
 * Converts an object with React refs into an object with the same keys and the current value of
 * those refs.
 *
 * @param refs
 */
function unwrapRefs<EventType extends MachineEventWithRefs = MachineEventWithRefs>(
  refs?: MachineToReactRefMap<EventType>
): EventType['refs'] {
  let _refs = refs || ({} as EventType['refs']);
  let entries = Object.keys(_refs).map((key) => [key, _refs[key]] as const);
  return entries.reduce<EventType['refs']>((value, [name, ref]) => {
    (value as any)[name] = ref.current;
    return value;
  }, {});
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Events use in our `useMachine` always have a refs object and will inherit
 * this interface.
 */
interface MachineEventWithRefs extends MachineEvent {
  refs: {
    [key: string]: any;
  };
  lastEventType?: MachineEventWithRefs['type'];
}

type MachineToReactRefMap<EventType extends MachineEventWithRefs> = {
  [K in keyof EventType['refs']]: React.RefObject<EventType['refs'][K]>;
};

type MachineState<
  ContextType extends object,
  EventType extends MachineEventWithRefs = MachineEventWithRefs,
  StateType extends Typestate<ContextType> = any
> = StateMachine.State<ContextType, EventType, StateType>;

type MachineSend<
  ContextType extends object,
  EventType extends MachineEventWithRefs = MachineEventWithRefs
> = StateMachine.Service<ContextType, DistributiveOmit<EventType, 'refs'>>['send'];

type MachineService<
  ContextType extends object,
  EventType extends MachineEventWithRefs = MachineEventWithRefs
> = StateMachine.Service<ContextType, EventType>;

export { useMachine, createMachine, assign, interpret, unwrapRefs };
export type {
  InterpreterStatus,
  MachineEvent,
  StateMachine,
  MachineService,
  MachineSend,
  MachineState,
  MachineToReactRefMap,
  MachineEventWithRefs,
};
