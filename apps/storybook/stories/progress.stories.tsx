import * as React from 'react';
import { Progress } from 'radix-ui';
import styles from './progress.stories.module.css';

export default {
  title: 'Components/Progress',
};

export const Styled = () => {
  const max = 150;
  const [value, percentage, setValue] = useProgressValueState(0, max);
  const toggleIndeterminate = useIndeterminateToggle(value, setValue);
  return (
    <div>
      <Progress.Root className={styles.root} value={value} max={max}>
        <Progress.Indicator
          className={styles.indicator}
          style={{ width: percentage != null ? `${percentage}%` : undefined }}
        />
      </Progress.Root>
      <hr />
      <button onClick={toggleIndeterminate}>Toggle Indeterminate</button>
      <ProgressRange value={value} setValue={setValue} max={max} />
    </div>
  );
};

export const Chromatic = () => (
  <>
    <h1>Loading (not started)</h1>
    <Progress.Root className={styles.root} value={0}>
      <Progress.Indicator className={styles.chromaticIndicator}>/</Progress.Indicator>
    </Progress.Root>

    <h1>Loading (started)</h1>
    <Progress.Root className={styles.root} value={30}>
      <Progress.Indicator className={styles.chromaticIndicator}>/</Progress.Indicator>
    </Progress.Root>

    <h1>Indeterminate</h1>
    <Progress.Root className={styles.root}>
      <Progress.Indicator className={styles.chromaticIndicator}>/</Progress.Indicator>
    </Progress.Root>

    <h1>Complete</h1>
    <Progress.Root className={styles.root} value={100}>
      <Progress.Indicator className={styles.chromaticIndicator}>/</Progress.Indicator>
    </Progress.Root>

    <h1>State attributes</h1>
    <h2>Loading (started)</h2>
    <Progress.Root className={styles.rootAttr} value={30}>
      <Progress.Indicator className={styles.indicatorAttr}>/</Progress.Indicator>
    </Progress.Root>

    <h2>Indeterminate</h2>
    <Progress.Root className={styles.rootAttr}>
      <Progress.Indicator className={styles.indicatorAttr}>/</Progress.Indicator>
    </Progress.Root>

    <h2>Complete</h2>
    <Progress.Root className={styles.rootAttr} value={100}>
      <Progress.Indicator className={styles.indicatorAttr}>/</Progress.Indicator>
    </Progress.Root>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

function ProgressRange({ value, setValue, max = 100 }: any) {
  const previousValueRef = usePreviousValueRef(value);
  return (
    <input
      type="range"
      disabled={value == null}
      value={value == null ? previousValueRef.current : value}
      max={max}
      min={0}
      onChange={(e) => {
        const val = Number(e.target.value);
        if (!isNaN(val)) {
          setValue(val);
        }
      }}
    />
  );
}

type ProgressValue = number | null;
function useProgressValueState(initialState: ProgressValue | (() => ProgressValue), max = 100) {
  const [value, setValue] = React.useState<number | null>(initialState);
  const precentage = value != null ? Math.round((value / max) * 100) : null;
  return [value, precentage, setValue] as const;
}

function useIndeterminateToggle(
  value: ProgressValue,
  setValue: React.Dispatch<React.SetStateAction<ProgressValue>>
) {
  const previousValueRef = usePreviousValueRef(value);
  const toggleIndeterminate = React.useCallback(
    function setIndeterminate() {
      setValue((val) => {
        if (val == null) {
          return previousValueRef.current;
        }
        return null;
      });
    },
    [previousValueRef, setValue]
  );
  return toggleIndeterminate;
}

function usePreviousValueRef(value: ProgressValue) {
  const previousValueRef = React.useRef<number>(value || 0);
  React.useEffect(() => {
    if (value != null) {
      previousValueRef.current = value;
    }
  });
  return previousValueRef;
}
