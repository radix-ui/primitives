import * as React from 'react';
import { useCallbackRef } from '@radix-ui/react-use-callback-ref';

function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}:
  | {
      defaultProp: never;
      prop: T;
      onChange: React.Dispatch<React.SetStateAction<T>>;
    }
  | {
      defaultProp: T;
      prop: never;
      onChange: React.Dispatch<React.SetStateAction<T>>;
    }) {
  const [uncontrolledProp, setUncontrolledProp] = useUncontrolledState({
    defaultProp,
    onChange,
  });
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;
  const handleChange = useCallbackRef(onChange);

  const setValue = useCallback<React.Dispatch<React.SetStateAction<T>>>(
    nextValue => {
      if (isControlled) {
        const value =
          nextValue instanceof Function ? nextValue(prop) : nextValue;
        if (value !== prop) handleChange(value);
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, handleChange]
  );

  return [value, setValue] as const;
}

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: {
  defaultProp: T;
  onChange: React.Dispatch<React.SetStateAction<T>>;
}) {
  const uncontrolledState = useState(defaultProp);
  const [value] = uncontrolledState;
  const prevValueRef = useRef(value);
  const handleChange = useCallbackRef(onChange);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef, handleChange]);

  return uncontrolledState;
}

export { useControllableState };
