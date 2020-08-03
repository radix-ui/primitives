export default {};
// import type {
//   EventObject,
//   Assigner,
//   PropertyAssigner,
//   AssignActionObject,
//   StateObject,
//   StateChart,
//   Action,
// } from './types';
// import {
//   ASSIGN_ACTION,
//   TIMER_START_EVENT_TYPE,
//   TIMER_CLEAR_EVENT_TYPE,
//   TIMER_START_ACTION,
// } from './constants';
// import { isString, SingleOrArray, toArray } from '@interop-ui/utils';
// import { StateMachine } from './state-machine';
// import { Service } from './service';
// import { ExtendedState } from './types';

// export function after<Event extends EventObject, Context extends object>(
//   delay: number,
//   nextState: any
// ): any {
//   let target = isString(nextState) ? nextState : nextState.target;
//   let actions = [getStartTimer(target, delay), ...toArray(nextState.actions)];
//   return {
//     [TIMER_START_EVENT_TYPE]: {
//       actions,
//       cond: nextState.cond || undefined,
//     },
//     [TIMER_CLEAR_EVENT_TYPE]: {
//       actions: [],
//     },
//   };
// }

// export function getStartTimer<
//   State extends StateObject<Context>,
//   Event extends EventObject,
//   Context extends object
// >(target: State['value'], delay: number): Action<Event, Context> {
//   return {
//     type: TIMER_START_ACTION,
//     exec(ctx, evt) {
//       return { delay, target };
//     },
//   };
// }

// export function assign<Event extends EventObject, Context extends object>(
//   assignment: Assigner<Event, Context> | PropertyAssigner<Event, Context>
// ): AssignActionObject<Event, Context> {
//   return {
//     type: ASSIGN_ACTION,
//     assignment,
//   };
// }

// export function createMachine<
//   State extends StateObject<Context>,
//   Event extends EventObject,
//   Context extends object & { _id?: string } = {}
// >(
//   initial: State['value'],
//   stateChart: StateChart<State, Event, Context>,
//   contextAndId: Context = {} as Context
// ): StateMachine<State, Event, Context> {
//   let { _id = 'interop-machine', ...rest } = contextAndId;
//   let context = rest as Context;
//   return new StateMachine(_id, initial, stateChart, context);
// }

// export function interpret<
//   State extends StateObject<Context>,
//   Event extends EventObject = EventObject,
//   Context extends object = {}
// >(machine: StateMachine<State, Event, Context>) {
//   return new Service(machine);
// }

// export type { EventObject, StateObject, StateChart, ExtendedState };
// export { StateMachine, Service };
