import * as React from 'react';
import { createMachine, interpret } from '@xstate/fsm';
import type { StateMachine, EventObject, Typestate } from '@xstate/fsm';

export function useStateMachine<
  C extends object,
  E extends EventObject = EventObject,
  S extends Typestate<C> = { value: any; context: C }
>(fsmConfig: StateMachine.Config<C, E, S>) {
  const [machine] = React.useState(() => interpret(createMachine<C, E, S>(fsmConfig)));
  const [state, setState] = React.useState<S['value']>(fsmConfig.initial);
  const [context, setContext] = React.useState<C | undefined>(fsmConfig.context);

  React.useEffect(() => {
    const subscription = machine.subscribe((state) => {
      setState(state.value);
      setContext(state.context);
    });
    machine.start();
    return () => {
      subscription.unsubscribe();
      machine.stop();
    };
  }, [machine]);

  return React.useMemo(() => ({ state, context, send: machine.send }), [state, context, machine]);
}
