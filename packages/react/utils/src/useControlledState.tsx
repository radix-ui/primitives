import * as React from 'react';
import { useCallbackRef } from './useCallbackRef';

type UseControlledStateParams<T> = {
  prop?: T | undefined;
  defaultProp?: T | undefined;
  onChange?: (state: T) => void;
};

export function useControlledState<T>({
  prop,
  defaultProp,
  onChange = () => {},
}: UseControlledStateParams<T>) {
  // If `defaultProp` is undefined (so not uncontrolled),
  // `value` will fallback to `prop` every render (controlled)
  const [value = prop, setValue] = React.useState(defaultProp);
  const prevValueRef = React.useRef(value);
  const handleChange = useCallbackRef(onChange);

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value as T);
      prevValueRef.current = value;
    }
  }, [value, handleChange]);

  return [value, setValue] as [T | undefined, React.Dispatch<React.SetStateAction<T>>];
}
