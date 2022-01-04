import * as React from 'react';

function usePrevious<T>(value: T) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = React.useRef({ value, previous: value });

  // We compare values before making an update to ensure that
  // a change has been made. This ensures the previous value is
  // persisted correctly between renders.
  return React.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}

export { usePrevious };
