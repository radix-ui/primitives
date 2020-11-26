import * as React from 'react';
import { useCallbackRef } from './useCallbackRef';

type UseControlledStateOptions<T> = {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange?: (state: T) => void;
};

function useControlledState<T>(options: UseControlledStateOptions<T>) {
  const { prop, defaultProp, onChange } = options;
  const [internalState, setInternalState] = React.useState(defaultProp);
  const isControlled = prop !== undefined;
  const handleChange = useCallbackRef(onChange);

  type SetState = React.Dispatch<React.SetStateAction<T | undefined>>;

  const stateWhenControlled = prop;
  const setStateWhenControlled: SetState = React.useCallback(
    (setStateAction) => {
      const prevState = stateWhenControlled;
      const nextState = resolveSetStateAction(setStateAction, prevState);
      if (nextState !== prevState) handleChange?.(nextState as T);
    },
    [handleChange, stateWhenControlled]
  );

  const stateWhenUncontrolled = internalState;
  const setStateWhenUncontrolled: SetState = React.useCallback(
    (setStateAction) => {
      setInternalState((prevState) => {
        const nextState = resolveSetStateAction(setStateAction, prevState);
        if (nextState !== prevState) handleChange?.(nextState as T);
        return nextState;
      });
    },
    [handleChange]
  );

  if (isControlled) {
    return [stateWhenControlled, setStateWhenControlled] as const;
  } else {
    return [stateWhenUncontrolled, setStateWhenUncontrolled] as const;
  }
}

type SetStateFn<T> = (prevState?: T) => T;

function resolveSetStateAction<S>(action: React.SetStateAction<S>, prevState: S) {
  const setter = action as SetStateFn<S>;
  return typeof action === 'function' ? setter(prevState) : action;
}

export { useControlledState };
