import * as React from 'react';
import { useCallbackRef } from './useCallbackRef';

type UseControlledStateParams<T> = {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange?: (state: T) => void;
};

type SetStateFn<T> = (prevState?: T) => T;

export function useControlledState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: UseControlledStateParams<T>) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({ defaultProp, onChange });
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;

  const setValue: React.Dispatch<React.SetStateAction<T | undefined>> = (nextValue) => {
    if (isControlled) {
      const setter = nextValue as SetStateFn<T>;
      const value = typeof nextValue === 'function' ? setter(prop) : nextValue;
      if (value !== prop) onChange(value as T);
    } else {
      setUncontrolledProp(nextValue);
    }
  };

  return [value, setValue] as const;
}

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: Omit<UseControlledStateParams<T>, 'prop'>) {
  const uncontrolledState = React.useState<T | undefined>(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = React.useRef(value);
  const handleChange = useCallbackRef(onChange);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef, handleChange]);

  return uncontrolledState;
}
