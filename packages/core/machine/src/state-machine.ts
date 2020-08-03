export default {};
// import { toArray, isUndefined, isString, isFunction } from '@interop-ui/utils';
// import {
//   ActionObject,
//   EventObject,
//   ExtendedState,
//   StateChart,
//   StateObject,
//   TimerEvent,
// } from './types';
// import { toEventObject, createMatcher, toActionObject, createUnchangedState } from './utils';
// import { ASSIGN_ACTION, TIMER_START_EVENT_TYPE } from './constants';

// export class StateMachine<
//   State extends StateObject<Context>,
//   Event extends EventObject,
//   Context extends object
// > {
//   readonly chart: StateChart<State, Event, Context>;
//   readonly context: Context;
//   readonly initialState: ExtendedState<State, Event, Context>;
//   readonly id: string;

//   constructor(
//     id: string,
//     initial: State['value'],
//     stateChart: StateChart<State, Event, Context>,
//     context: Context
//   ) {
//     this.initialState = {
//       value: initial,
//       actions: toArray(stateChart[initial].entry).map((action) => toActionObject(action)),
//       context,
//       matches: createMatcher(initial),
//     };

//     // let newChart: StateChart<State, Event | TimerEvent, Context> = {} as any;
//     // for (let s of Object.keys(stateChart)) {

//     //   let state = s as State['value'];
//     //   if (stateChart[state].on) {
//     //     newChart[state].on[TIMER_START_EVENT_TYPE] = { type: '' }
//     //   }
//     //   newChart[state] =
//     // }

//     this.chart = stateChart;
//     this.context = context;
//     this.id = id;
//   }

//   public readonly transition = (
//     state: State['value'] | ExtendedState<State, Event, Context>,
//     event: Event['type'] | Event
//   ): ExtendedState<State, Event, Context> => {
//     let { id, chart, context: currentContext } = this;
//     let { value, context } = isString(state) ? { value: state, context: currentContext } : state;
//     let eventObject = toEventObject(event);
//     let stateConfig = chart[value];

//     if (__DEV__) {
//       if (!stateConfig) {
//         throw new Error(`State '${value}' not found on machine${id ? ` '${id}'` : ''}.`);
//       }
//     }

//     if (stateConfig.on) {
//       let transitions = toArray(stateConfig.on[eventObject.type as Event['type']]);

//       for (let transition of transitions) {
//         if (isUndefined(transition)) {
//           return createUnchangedState(value, context);
//         }

//         const { target = value, actions = [], cond = () => true } = isString(transition)
//           ? { target: transition }
//           : transition;

//         let nextContext = context;

//         if (cond(context, eventObject)) {
//           let nextStateConfig = chart[target];
//           let assigned = false;

//           let allActions: ActionObject<Event, Context>[] = [];

//           // TODO: Rewrite to avoid nested loops if possible
//           for (let possibleAction of ([] as any[]).concat(
//             stateConfig.exit,
//             actions,
//             nextStateConfig.entry
//           )) {
//             if (!possibleAction) continue;

//             let action = toActionObject(possibleAction);

//             if (action.type === ASSIGN_ACTION) {
//               assigned = true;
//               let tmpContext = { ...(nextContext || {}) };

//               if (isFunction(action.assignment)) {
//                 tmpContext = action.assignment(nextContext, eventObject, this);
//               } else {
//                 // Yet another nested loop, though this one may not be avoidable
//                 for (let key of Object.keys(action.assignment)) {
//                   tmpContext[key as keyof Context] = isFunction(action.assignment[key])
//                     ? action.assignment[key](tmpContext, eventObject, this)
//                     : action.assignment[key];
//                 }
//               }

//               nextContext = tmpContext;
//             } else {
//               allActions.push(action);
//             }
//           }

//           return {
//             value: target,
//             context: nextContext,
//             actions: allActions,
//             changed: target !== value || allActions.length > 0 || assigned,
//             matches: createMatcher(target),
//           };
//         }
//       }
//     }

//     // No transitions match
//     return createUnchangedState(value, context);
//   };
// }
