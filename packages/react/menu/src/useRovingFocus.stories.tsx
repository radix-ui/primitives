import * as React from 'react';
import { RovingFocusGroup, useRovingFocus } from './useRovingFocus';

import type { RovingFocusGroupProps } from './useRovingFocus';

export default { title: 'Hooks/useRovingFocus' };

export const Basic = () => (
  <>
    <h1>no orientation (both) + no looping</h1>
    <ButtonGroup defaultValue="two">
      <Button value="one">One</Button>
      <Button value="two">Two</Button>
      <Button disabled value="three">
        Three
      </Button>
      <Button value="four">Four</Button>
    </ButtonGroup>

    <h1>no orientation (both) + looping</h1>
    <ButtonGroup loop>
      <Button value="one">One</Button>
      <Button value="two">Two</Button>
      <Button disabled value="three">
        Three
      </Button>
      <Button value="four">Four</Button>
    </ButtonGroup>

    <h1>horizontal orientation + no looping</h1>
    <ButtonGroup orientation="horizontal">
      <Button value="one">One</Button>
      <Button value="two">Two</Button>
      <Button disabled value="three">
        Three
      </Button>
      <Button value="four">Four</Button>
    </ButtonGroup>

    <h1>horizontal orientation + looping</h1>
    <ButtonGroup orientation="horizontal" loop>
      <Button value="one">One</Button>
      <Button value="two">Two</Button>
      <Button disabled value="three">
        Three
      </Button>
      <Button value="four">Four</Button>
    </ButtonGroup>

    <h1>vertical orientation + no looping</h1>
    <ButtonGroup orientation="vertical">
      <Button value="one">One</Button>
      <Button value="two">Two</Button>
      <Button disabled value="three">
        Three
      </Button>
      <Button value="four">Four</Button>
    </ButtonGroup>

    <h1>vertical orientation + looping</h1>
    <ButtonGroup orientation="vertical" loop>
      <Button value="one">One</Button>
      <Button value="two">Two</Button>
      <Button disabled value="three">
        Three
      </Button>
      <Button value="four">Four</Button>
    </ButtonGroup>
  </>
);

export const Nested = () => (
  <ButtonGroup orientation="vertical" loop>
    <Button value="1">1</Button>

    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Button value="2" style={{ marginBottom: 10 }}>
        2
      </Button>

      <ButtonGroup orientation="horizontal" loop>
        <Button value="2.1">2.1</Button>
        <Button value="2.2">2.2</Button>
        <Button disabled value="2.3">
          2.3
        </Button>
        <Button value="2.4">2.4</Button>
      </ButtonGroup>
    </div>

    <Button value="3" disabled>
      3
    </Button>
    <Button value="4">4</Button>
  </ButtonGroup>
);

const ButtonGroupContext = React.createContext<{
  value?: string;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
}>({} as any);

type ButtonGroupProps = Omit<React.ComponentPropsWithRef<'div'>, 'defaultValue'> &
  RovingFocusGroupProps & { defaultValue?: string };

const ButtonGroup = ({ orientation, loop, defaultValue, ...props }: ButtonGroupProps) => {
  const [value, setValue] = React.useState(defaultValue);
  return (
    <ButtonGroupContext.Provider value={{ value, setValue }}>
      <RovingFocusGroup orientation={orientation} loop={loop}>
        <div
          {...props}
          style={{
            ...props.style,
            display: 'inline-flex',
            flexDirection: orientation === 'vertical' ? 'column' : 'row',
            gap: 10,
          }}
        />
      </RovingFocusGroup>
    </ButtonGroupContext.Provider>
  );
};

type ButtonProps = Omit<React.ComponentPropsWithRef<'button'>, 'value'> & { value?: string };

const Button = ({ disabled, tabIndex, value, ...props }: ButtonProps) => {
  const { value: contextValue, setValue } = React.useContext(ButtonGroupContext);
  const isSelected = contextValue !== undefined && value !== undefined && contextValue === value;
  const rovingFocusProps = useRovingFocus({ disabled, isDefaultTabStop: isSelected });

  return (
    <button
      disabled={disabled}
      style={{
        border: '1px solid #ccc',
        padding: '5px 10px',
        borderRadius: 5,
        ...(isSelected
          ? {
              borderColor: 'black',
              backgroundColor: 'black',
              color: 'white',
            }
          : {}),
      }}
      onClick={() => setValue(value)}
      onFocus={(event) => {
        if (contextValue !== undefined) {
          event.target.click();
        }
      }}
      {...rovingFocusProps}
    />
  );
};
