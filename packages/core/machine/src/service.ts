export {};
// import { StateMachine } from './state-machine';
// import { EventObject, ExtendedState, StateObject, StateListener, InterpreterStatus } from './types';
// import { executeStateActions, toEventObject, createMatcher } from './utils';
// import { INIT_EVENT } from './constants';

// export class Service<
//   State extends StateObject<Context>,
//   Event extends EventObject,
//   Context extends object
// > {
//   readonly machine: StateMachine<State, Event, Context>;
//   private _status: InterpreterStatus;
//   private _state: ExtendedState<State, Event, Context>;
//   private listeners: Set<StateListener<ExtendedState<State, Event, Context>>>;

//   public get state() {
//     return this._state;
//   }

//   public get status() {
//     return this._status;
//   }

//   constructor(machine: StateMachine<State, Event, Context>) {
//     let state = machine.initialState;
//     this.machine = machine;
//     this._state = state;
//     this._status = InterpreterStatus.NotStarted;
//     this.listeners = new Set<StateListener<ExtendedState<State, Event, Context>>>();
//   }

//   public readonly send = (event: Event | Event['type']): void => {
//     let { _status: status } = this;
//     if (status !== InterpreterStatus.Running) {
//       return;
//     }
//     this._state = this.machine.transition(this._state, event);
//     executeStateActions(this._state, toEventObject(event));
//     this.listeners.forEach((listener) => listener(this._state));
//   };

//   public readonly subscribe = (listener: StateListener<ExtendedState<State, Event, Context>>) => {
//     this.listeners.add(listener);
//     listener(this._state);

//     return {
//       unsubscribe: () => {
//         this.listeners.delete(listener);
//       },
//     };
//   };

//   public readonly start = (
//     initialState?: State['value'] | { context: Context; value: State['value'] }
//   ) => {
//     if (initialState) {
//       const resolved =
//         typeof initialState === 'object'
//           ? initialState
//           : { context: this.machine.context!, value: initialState };
//       this._state = {
//         value: resolved.value,
//         actions: [],
//         context: resolved.context,
//         matches: createMatcher(resolved.value),
//       };

//       if (__DEV__) {
//         if (!(this._state.value in this.machine.chart)) {
//           throw new Error(
//             `Cannot start service in state '${
//               this._state.value
//             }'. The state is not found on machine${this.machine.id ? ` '${this.machine.id}'` : ''}.`
//           );
//         }
//       }
//     }
//     this._status = InterpreterStatus.Running;
//     executeStateActions(this._state, INIT_EVENT);
//     return this;
//   };

//   public readonly stop = () => {
//     this._status = InterpreterStatus.Stopped;
//     this.listeners.clear();
//     return this;
//   };
// }
