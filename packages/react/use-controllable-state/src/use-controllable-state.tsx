import { useEffectEvent } from '@radix-ui/react-use-effect-event';
import * as React from 'react';

type ChangeHandler<T> = (state: T) => void;
type SetStateFn<T> = React.Dispatch<React.SetStateAction<T>>;

interface UseControllableStateParams<T> {
  prop?: T | undefined;
  defaultProp: T;
  onChange?: ChangeHandler<T>;
  caller?: string;
}

export function useControllableState<T>({
  prop,
  defaultProp,
  onChange = () => {},
  caller,
}: UseControllableStateParams<T>): [T, SetStateFn<T>] {
  const [uncontrolledProp, setUncontrolledProp, stableOnChange] = useUncontrolledState({
    defaultProp,
    onChange,
  });
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledProp;

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
          `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
        );
      }
      isControlledRef.current = isControlled;
    }, [isControlled, caller]);
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  const setValue = React.useCallback<SetStateFn<T>>(
    (nextValue) => {
      if (isControlled) {
        const value = isFunction(nextValue) ? nextValue(prop) : nextValue;
        if (value !== prop) {
          stableOnChange(value);
        }
      } else {
        setUncontrolledProp(nextValue);
      }
    },
    [isControlled, prop, setUncontrolledProp, stableOnChange],
  );

  return [value, setValue];
}

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: Omit<UseControllableStateParams<T>, 'prop'>): [
  Value: T,
  setValue: React.Dispatch<React.SetStateAction<T>>,
  OnChange: ChangeHandler<T>,
] {
  const [value, setValue] = React.useState(defaultProp);
  const prevValueRef = React.useRef(value);

  const stableOnChange = useEffectEvent(onChange ?? (() => {}));

  React.useEffect(() => {
    if (prevValueRef.current !== value) {
      stableOnChange(value);
      prevValueRef.current = value;
    }
  }, [value, prevValueRef, stableOnChange]);

  return [value, setValue, stableOnChange];
}

function isFunction(value: unknown): value is (...args: any[]) => any {
  return typeof value === 'function';
}
