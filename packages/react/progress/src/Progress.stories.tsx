import * as React from 'react';
import { Progress, styles } from './Progress';
import { createStyled } from '@stitches/react';

export default { title: 'Progress' };

const { styled } = createStyled({
  tokens: {
    colors: {
      $white: '#fff',
      $gray100: '#ccc',
      $gray300: '#aaa',
      $black: '#111',
      $red: 'crimson',
      $green: 'green',
    },
  },
});

export const Basic = () => {
  const [value, percentage, setValue] = useProgressValueState(0);
  const toggleIndeterminate = useIndeterminateToggle(value, setValue);
  return (
    <div>
      <Progress style={styles.root} value={value}>
        <Progress.Indicator
          style={{ ...styles.indicator, width: percentage ?? `${percentage}%` }}
        />
      </Progress>
      <hr />
      <button onClick={toggleIndeterminate}>Toggle Indeterminate</button>
      <ProgressRange value={value} setValue={setValue} />
    </div>
  );
};

export const StitchesStyle = () => {
  const max = 150;
  const [value, percentage, setValue] = useProgressValueState(0, max);
  const toggleIndeterminate = useIndeterminateToggle(value, setValue);
  return (
    <div>
      <Progress as={Root} value={value} max={max}>
        <Progress.Indicator
          as={Indicator}
          style={{ width: percentage != null ? `${percentage}%` : undefined }}
        />
      </Progress>
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

/* -------------------------------------------------------------------------------------------------
 * Reset components
 * -----------------------------------------------------------------------------------------------*/

const HEIGHT = 20;
const WIDTH = 400;
const BORDER = 5;

const Root = styled('div', {
  ...(styles.root as any),
  height: `${HEIGHT}px`,
  width: `${WIDTH}px`,
  maxWidth: '100%',
  border: `${BORDER}px solid $black`,
  backgroundColor: '$gray100',
});

const Indicator = styled('div', {
  ...(styles.indicator as any),
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
