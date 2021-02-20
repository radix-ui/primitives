import * as React from 'react';

type Machine = { [k: string]: { [k: string]: string } };
type MachineState<T> = keyof T;
type MachineEvent<T> = keyof UnionToIntersection<T[keyof T]>;

// 🤯 https://fettblog.eu/typescript-union-to-intersection/
type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any
  ? R
  : never;

export function useStateMachine<M extends Machine>(initialState: MachineState<M>, machine: M) {
  return React.useReducer((state: MachineState<M>, event: MachineEvent<M>): MachineState<M> => {
    const nextState = (machine[state] as any)[event];
    return nextState ?? state;
  }, initialState);
}
