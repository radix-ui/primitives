import * as React from 'react';

type UseControlledStateParams<T> = {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange?: (state: T) => void;

  /**
   * Extra override if checking `prop !== undefined` is not enough
   * for example a Select accepts an `undefined` value
   */
  unstable__isControlled?: boolean;
};

type SetStateFn<T> = (prevState?: T) => T;

export function useControlledState<T>({
  prop,
  defaultProp,
  onChange = () => {},
  unstable__isControlled,
}: UseControlledStateParams<T>) {
  const [_state, _setState] = React.useState(defaultProp);
  const isControlled =
    unstable__isControlled !== undefined ? unstable__isControlled : prop !== undefined;
  const state = isControlled ? prop : _state;

  const isInitiallyControlledRef = React.useRef(isControlled);
  const initialValueRef = React.useRef(state);

  const persistentValueRef = React.useRef(state);
  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    persistentValueRef.current = state;
    onChangeRef.current = onChange;
  });

  const setState = React.useCallback(function setState(nextState?: T | SetStateFn<T>) {
    const change = (prevState?: T) => {
      const update = getNextState(prevState, nextState);
      onChangeRef.current(update!);
      return update;
    };

    if (isInitiallyControlledRef.current) {
      change(persistentValueRef.current);
    } else {
      _setState(change);
    }
  }, []);

  const resetState = React.useCallback(
    function resetState() {
      setState(initialValueRef.current);
    },
    [setState]
  );

  return [state, setState, resetState] as const;
}

function getNextState<T>(prevState?: T, state?: T | SetStateFn<T>) {
  let nextState;

  if (typeof state === 'function') {
    const setter = state as SetStateFn<T>;
    nextState = setter(prevState);
  } else {
    nextState = state;
  }

  return nextState;
}
