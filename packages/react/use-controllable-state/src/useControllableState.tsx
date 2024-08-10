import * as React from 'react';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';

type UseControllableStateParams<T> = {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange?: (state: T) => void;
};

type SetStateFn<T> = (prevState?: T) => T;

function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: UseControllableStateParams<T>) {
  const [uncontrolledProp, setUncontrolledProp] = React.useState<T | undefined>(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;
  const handleChange = useCallbackRef(onChange);

  const setValue: React.Dispatch<React.SetStateAction<T | undefined>> = React.useCallback(
    (next) => {
      const setter = next as SetStateFn<T>;
      const nextValue = typeof next === 'function' ? setter(value) : next;

      if (value === nextValue) return;

      if (!isControlled) setUncontrolledProp(nextValue);

      handleChange(nextValue as T);
    },
    [isControlled, value, setUncontrolledProp, handleChange]
  );

  return [value, setValue] as const;
}

export { useControllableState };
