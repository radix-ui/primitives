import * as React from 'react';
import { css } from '../../../../stitches.config';
import * as Progress from '@radix-ui/react-progress';

export default {
  title: 'Components/Progress',
};

export const Styled = () => {
  const max = 150;
  const [value, percentage, setValue] = useProgressValueState(0, max);
  const toggleIndeterminate = useIndeterminateToggle(value, setValue);
  return (
    <div>
      <Progress.Root className={rootClass()} value={value} max={max}>
        <Progress.Indicator
          className={indicatorClass()}
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
    <Progress.Root className={rootClass()} value={0}>
      <Progress.Indicator className={chromaticIndicatorClass()}>/</Progress.Indicator>
    </Progress.Root>

    <h1>Loading (started)</h1>
    <Progress.Root className={rootClass()} value={30}>
      <Progress.Indicator className={chromaticIndicatorClass()}>/</Progress.Indicator>
    </Progress.Root>

    <h1>Indeterminate</h1>
    <Progress.Root className={rootClass()} value={null}>
      <Progress.Indicator className={chromaticIndicatorClass()}>/</Progress.Indicator>
    </Progress.Root>

    <h1>Complete</h1>
    <Progress.Root className={rootClass()} value={100}>
      <Progress.Indicator className={chromaticIndicatorClass()}>/</Progress.Indicator>
    </Progress.Root>

    <h1>State attributes</h1>
    <h2>Loading (started)</h2>
    <Progress.Root className={rootAttrClass()} value={30}>
      <Progress.Indicator className={indicatorAttrClass()}>/</Progress.Indicator>
    </Progress.Root>

    <h2>Indeterminate</h2>
    <Progress.Root className={rootAttrClass()} value={null}>
      <Progress.Indicator className={indicatorAttrClass()}>/</Progress.Indicator>
    </Progress.Root>

    <h2>Complete</h2>
    <Progress.Root className={rootAttrClass()} value={100}>
      <Progress.Indicator className={indicatorAttrClass()}>/</Progress.Indicator>
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

const rootClass = css({
  width: 400,
  height: 20,
  maxWidth: '100%',
  border: '5px solid $black',
  backgroundColor: '$gray200',
});

const indicatorClass = css({
  width: 0,
  height: '100%',
  backgroundColor: '$red',
  transition: 'background 150ms ease-out',
  '&[data-state="indeterminate"]': {
    backgroundColor: '$gray300',
  },
  '&[data-state="complete"]': {
    backgroundColor: '$green',
  },
});

const indicatorPseudos = css({
  '&::before': {
    content: 'attr(data-value)',
  },
  '&::after': {
    content: 'attr(data-max)',
  },
});

const chromaticIndicatorClass = css(indicatorClass, indicatorPseudos);

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '&[data-state="loading"]': { borderColor: 'red' },
  '&[data-state="indeterminate"]': { borderColor: 'purple' },
  '&[data-state="complete"]': { borderColor: 'green' },
};
const rootAttrClass = css(styles);
const indicatorAttrClass = css(indicatorPseudos, styles);

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
