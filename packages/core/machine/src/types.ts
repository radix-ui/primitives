import { SingleOrArray } from '@interop-ui/utils';

export enum InterpreterStatus {
  NotStarted = 0,
  Running = 1,
  Stopped = 2,
}

export interface EventObject {
  type: string;
}

export type TimerStartEventType = 'interop.start-timer';
export type TimerClearEventType = 'interop.clear-timer';
export type InitEvent = { type: 'interop.init' };
export type TimerEvent =
  | { type: TimerStartEventType; delay: number }
  | { type: TimerClearEventType; id: number };

export type Action<Event extends EventObject, Context extends object> =
  | string
  | AssignActionObject<Event, Context>
  | ActionObject<Event, Context>
  | ActionFunction<Event, Context>;

export type ActionMap<Event extends EventObject, Context extends object> = Record<
  string,
  Exclude<Action<Event, Context>, string>
>;

export interface ActionObject<Event extends EventObject, Context extends object> {
  type: string;
  exec?: ActionFunction<Event, Context>;
  [key: string]: any;
}

export type ActionFunction<Event extends EventObject, Context extends object> = (
  context: Context,
  event: Event | InitEvent | TimerEvent
) => any;

export type AssignAction = 'interop.assign';

export interface AssignActionObject<Event extends EventObject, Context extends object>
  extends ActionObject<Event, Context> {
  type: AssignAction;
  assignment: Assigner<Event, Context> | PropertyAssigner<Event, Context>;
}

export type Transition<
  State extends StateObject<Context>,
  Event extends EventObject,
  Context extends object
> =
  | string
  | {
      target?: State['value'];
      actions?: SingleOrArray<Action<Event, Context>>;
      cond?: (context: Context, event: Event) => boolean;
    };

export interface ExtendedState<
  State extends StateObject<Context>,
  Event extends EventObject,
  Context extends object
> {
  value: State['value'];
  context: Context;
  actions: ActionObject<Event, Context>[];
  changed?: boolean | undefined;
  matches: <TSV extends State['value']>(
    value: TSV
  ) => this is State extends { value: TSV } ? State : never;
}

// export interface StateChart<
//   State extends StateObject<Context>,
//   Event extends EventObject,
//   Context extends object = {}
// > {
//   id?: string;
//   initial: State['value'];
//   context?: Context;
//   states: {
//     [key in State['value']]: {
//       on?: {
//         [K in Event['type']]?: SingleOrArray<
//           Transition<Event extends { type: K } ? Event : never, Context>
//         >;
//       };
//       exit?: SingleOrArray<Action<Event, Context>>;
//       entry?: SingleOrArray<Action<Event, Context>>;
//     };
//   };
// }

export type StateChart<
  State extends StateObject<Context>,
  Event extends EventObject,
  Context extends object
> = {
  [key in State['value']]: {
    on?: {
      [K in Event['type']]?: SingleOrArray<Transition<State, Event, Context>>;
    };
    exit?: SingleOrArray<Action<Event, Context>>;
    entry?: SingleOrArray<Action<Event, Context>>;
  } & {
    [K in Event['type']]?: SingleOrArray<Transition<State, Event, Context>>;
  };
};

export type StateListener<T extends ExtendedState<any, any, any>> = (state: T) => void;

export type Assigner<Event extends EventObject, Context extends object> = (
  context: Context,
  event: Event
) => Partial<Context>;

export type PropertyAssigner<Event extends EventObject, Context extends object> = {
  [K in keyof Context]?: ((context: Context, event: Event) => Context[K]) | Context[K];
};

export interface StateObject<Context extends object> {
  value: string;
  context: Context;
}
