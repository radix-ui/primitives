import * as React from 'react';
import { useRovingFocus, useRovingFocusItem } from './useRovingFocus';

export default { title: 'Hooks/useRovingFocus' };

export const Basic = () => (
  <>
    <h1>no orientation (both) + no looping</h1>
    <ButtonGroup defaultValue="two">
      <Button tabIndex={0} value="one">
        One
      </Button>
      <Button value="two">Two</Button>
      <Button disabled value="three">
        Three
      </Button>
      <Button value="four">Four</Button>
    </ButtonGroup>

    <h1>no orientation (both) + looping</h1>
    <ButtonGroup loop>
      <Button tabIndex={0} value="one">
        One
      </Button>
      <Button value="two">Two</Button>
      <Button disabled value="three">
        Three
      </Button>
      <Button value="four">Four</Button>
    </ButtonGroup>

    <h1>horizontal orientation + no looping</h1>
    <ButtonGroup orientation="horizontal">
      <Button tabIndex={0} value="one">
        One
      </Button>
      <Button value="two">Two</Button>
      <Button disabled value="three">
        Three
      </Button>
      <Button value="four">Four</Button>
    </ButtonGroup>

    <h1>horizontal orientation + looping</h1>
    <ButtonGroup orientation="horizontal" loop>
      <Button tabIndex={0} value="one">
        One
      </Button>
      <Button value="two">Two</Button>
      <Button disabled value="three">
        Three
      </Button>
      <Button value="four">Four</Button>
    </ButtonGroup>

    <h1>vertical orientation + no looping</h1>
    <ButtonGroup orientation="vertical">
      <Button tabIndex={0} value="one">
        One
      </Button>
      <Button value="two">Two</Button>
      <Button disabled value="three">
        Three
      </Button>
      <Button value="four">Four</Button>
    </ButtonGroup>

    <h1>vertical orientation + looping</h1>
    <ButtonGroup orientation="vertical" loop>
      <Button tabIndex={0} value="one">
        One
      </Button>
      <Button value="two">Two</Button>
      <Button disabled value="three">
        Three
      </Button>
      <Button value="four">Four</Button>
    </ButtonGroup>
  </>
);

const ButtonGroupContext = React.createContext<{
  value?: string;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
}>({} as any);

type ButtonGroupProps = Omit<React.ComponentPropsWithRef<'div'>, 'defaultValue'> &
  Parameters<typeof useRovingFocus>[0] & { defaultValue?: string };

const ButtonGroup = ({ orientation, loop, defaultValue, ...props }: ButtonGroupProps) => {
  const [value, setValue] = React.useState(defaultValue);
  const rovingFocusProps = useRovingFocus({
    orientation,
    loop,
    makeFirstItemTabbable: value === undefined,
  });

  return (
    <ButtonGroupContext.Provider value={{ value, setValue }}>
      <div
        {...props}
        style={{
          ...props.style,
          display: 'inline-flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          gap: 10,
        }}
        onFocus={(event) => {
          if (value !== undefined) {
            event.target.click();
          }
        }}
        {...rovingFocusProps}
      />
    </ButtonGroupContext.Provider>
  );
};

type ButtonProps = Omit<React.ComponentPropsWithRef<'button'>, 'value'> & { value?: string };

const Button = ({ disabled, tabIndex, value, ...props }: ButtonProps) => {
  const { value: contextValue, setValue } = React.useContext(ButtonGroupContext);
  const isSelected = contextValue !== undefined && value !== undefined && contextValue === value;
  const rovingFocusItemProps = useRovingFocusItem({ disabled, initiallyTabbable: isSelected });
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
      {...props}
      {...rovingFocusItemProps}
    />
  );
};
