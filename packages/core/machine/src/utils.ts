import { isFunction, isString } from '@interop-ui/utils';
import {
  ActionObject,
  ActionFunction,
  EventObject,
  ExtendedState,
  StateObject,
  InitEvent,
  TimerEvent,
} from './types';
import { TIMER_START_ACTION, TIMER_CLEAR_ACTION } from './constants';

export function createMatcher(value: string) {
  return (stateValue: any) => value === stateValue;
}

export function createUnchangedState<
  State extends StateObject<Context>,
  Event extends EventObject,
  Context extends object = {}
>(value: State['value'], context: Context): ExtendedState<State, Event, Context> {
  return {
    value,
    context,
    actions: [],
    changed: false,
    matches: createMatcher(value),
  };
}

export function executeStateActions<
  Context extends object,
  Event extends EventObject = any,
  State extends StateObject<Context> = any
>(state: ExtendedState<State, Event, Context>, event: Event | InitEvent | TimerEvent) {
  let startTimeouts: { delay: number; target: State['value'] }[] = [];
  let clearTimeouts: { id: number }[] = [];
  for (let { exec, type: actionType } of state.actions) {
    if (actionType === TIMER_START_ACTION) {
      exec && startTimeouts.push(exec(state.context, event));
    } else if (actionType === TIMER_CLEAR_ACTION) {
      exec && clearTimeouts.push(exec(state.context, event));
    } else {
      exec && exec(state.context, event);
    }
  }
  return [startTimeouts, clearTimeouts] as const;
}

export function toActionObject<Event extends EventObject, Context extends object>(
  action: string | ActionFunction<Event, Context> | ActionObject<Event, Context>
): ActionObject<Event, Context> {
  return isString(action)
    ? { type: action }
    : isFunction(action)
    ? { type: action.name, exec: action }
    : action;
}

export function toEventObject<Event extends EventObject>(event: Event['type'] | Event): Event {
  return (isString(event) ? { type: event } : event) as Event;
}
