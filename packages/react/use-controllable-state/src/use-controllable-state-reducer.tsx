import * as React from 'react';
import { useLayoutEffect } from '@radix-ui/react-use-layout-effect';

// Prevent bundlers from trying to optimize the import
const useInsertionEffect: typeof useLayoutEffect =
  (React as any)[' useInsertionEffect '.trim().toString()] || useLayoutEffect;

type ChangeHandler<T> = (state: T) => void;

interface UseControllableStateParams<K, T> {
  key: K;
  prop: T | undefined;
  defaultProp: T;
  onChange: ChangeHandler<T> | undefined;
  caller: string;
}

interface AnyAction {
  type: string;
}

const SYNC_ACTION = Symbol('RADIX:CONTROLLED_UPDATE');

export function useControllableStateReducer<
  S extends { [key: string]: any },
  K extends keyof S,
  A extends AnyAction,
>(
  reducer: (prevState: S, action: A) => S,
  userArgs: UseControllableStateParams<K, S[K]>,
  initialState: Omit<S, K>
): [S, React.Dispatch<A>];

export function useControllableStateReducer<
  S extends { [key: string]: any },
  K extends keyof S,
  A extends AnyAction,
>(
  reducer: (prevState: S, action: A) => S,
  userArgs: UseControllableStateParams<K, S[K]>,
  initialState: Omit<S, K>
): [S, React.Dispatch<A>];

export function useControllableStateReducer<
  S extends { [key: string]: any },
  K extends keyof S,
  I,
  A extends AnyAction,
>(
  reducer: (prevState: S, action: A) => S,
  userArgs: UseControllableStateParams<K, S[K]>,
  initialArg: I,
  init: (i: I & { [key in K]: S[K] }) => Omit<S, K>
): [S, React.Dispatch<A>];

export function useControllableStateReducer<
  S extends { [key: string]: any },
  K extends keyof S,
  A extends AnyAction,
>(
  reducer: (prevState: S, action: A) => S,
  userArgs: UseControllableStateParams<K, S[K]>,
  initialArg: any,
  init?: (i: any) => Omit<S, K>
): [S, React.Dispatch<A>] {
  const { key, prop, defaultProp, onChange, caller } = userArgs;
  const isControlled = prop !== undefined;

  // OK to disable conditionally calling hooks here because they will always run
  // consistently in the same environment. Bundlers should be able to remove the
  // code block entirely in production.
  /* eslint-disable react-hooks/rules-of-hooks */
  if (process.env.NODE_ENV !== 'production') {
    const isControlledRef = React.useRef(prop !== undefined);
    React.useEffect(() => {
      const wasControlled = isControlledRef.current;
      if (wasControlled !== isControlled) {
        const from = wasControlled ? 'controlled' : 'uncontrolled';
        const to = isControlled ? 'controlled' : 'uncontrolled';
        console.warn(
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
        );
      }
      isControlledRef.current = isControlled;
    }, [isControlled, caller]);
  }

  /* eslint-enable react-hooks/rules-of-hooks */

  const [internalState, dispatch] = React.useReducer<S, [action: A]>(
    (state: S, action: A): S => {
      switch (action.type) {
        // @ts-expect-error
        case SYNC_ACTION: {
          if (!isControlled) {
            return state;
          }

          const nextValue = (action as any).payload;
          const value = isFunction(nextValue) ? nextValue(prop) : nextValue;
          if (value !== prop) {
            onChangeRef.current?.(value);
          }
          return { ...state, [action.type]: value };
        }
        default:
          return reducer(state, action);
      }
    },
    //
    { ...initialArg, [key]: defaultProp },
    // @ts-expect-error
    init
  );

  const uncontrolledProp = internalState[key];
  const prevValueRef = React.useRef(uncontrolledProp);
  const onChangeRef = React.useRef(onChange);
  useInsertionEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  React.useEffect(() => {
    if (prevValueRef.current !== uncontrolledProp) {
      onChangeRef.current?.(uncontrolledProp);
      prevValueRef.current = uncontrolledProp;
    }
  }, [uncontrolledProp, prevValueRef]);

  const state = React.useMemo(() => {
    const isControlled = prop !== undefined;
    if (isControlled) {
      return {
        ...internalState,
        [key]: prop,
      };
    }

    return internalState;
  }, [internalState, prop, key]);

  return [state, dispatch] as any;
}

function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
}
