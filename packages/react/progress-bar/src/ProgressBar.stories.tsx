import * as React from 'react';
import { ProgressBar } from './ProgressBar';
import { styled } from '../../../../stitches.config';

export default {
  title: 'Components/ProgressBar',
};

export const Styled = () => {
  const max = 150;
  const [value, percentage, setValue] = useProgressValueState(0, max);
  const toggleIndeterminate = useIndeterminateToggle(value, setValue);
  return (
    <div>
      <ProgressBar as={StyledRoot} value={value} max={max}>
        <ProgressBar.Indicator
          as={StyledIndicator}
          style={{ width: percentage != null ? `${percentage}%` : undefined }}
        />
      </ProgressBar>
      <hr />
      <button onClick={toggleIndeterminate}>Toggle Indeterminate</button>
      <ProgressRange value={value} setValue={setValue} max={max} />
    </div>
  );
};

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

const StyledRoot = styled('div', {
  width: 400,
  height: 20,
  maxWidth: '100%',
  border: '5px solid $black',
  backgroundColor: '$gray200',
});

const StyledIndicator = styled('div', {
  width: '100%',
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
