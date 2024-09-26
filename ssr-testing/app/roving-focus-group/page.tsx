'use client';
import * as React from 'react';
import { composeEventHandlers } from '@radix-ui/primitive';
import * as RovingFocusGroup from '@radix-ui/react-roving-focus';

type RovingFocusGroupProps = React.ComponentProps<typeof RovingFocusGroup.Root>;

export default function Page() {
  const [dir, setDir] = React.useState<RovingFocusGroupProps['dir']>('ltr');

  return (
    <>
      <h1>Basic</h1>
      <div dir={dir}>
        <h2>
          Direction: {dir}{' '}
          <button type="button" onClick={() => setDir((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'))}>
            Toggle to {dir === 'ltr' ? 'rtl' : 'ltr'}
          </button>
        </h2>

        <h3>no orientation (both) + no looping</h3>
        <ButtonGroup dir={dir} defaultValue="two">
          <Button value="one">One</Button>
          <Button value="two">Two</Button>
          <Button disabled value="three">
            Three
          </Button>
          <Button value="four">Four</Button>
        </ButtonGroup>

        <h3>no orientation (both) + looping</h3>
        <ButtonGroup dir={dir} loop>
          <Button value="one">One</Button>
          <Button value="two">Two</Button>
          <Button disabled value="three">
            Three
          </Button>
          <Button value="four">Four</Button>
        </ButtonGroup>

        <h3>horizontal orientation + no looping</h3>
        <ButtonGroup orientation="horizontal" dir={dir}>
          <Button value="one">One</Button>
          <Button value="two">Two</Button>
          <Button disabled value="three">
            Three
          </Button>
          <Button value="four">Four</Button>
        </ButtonGroup>

        <h3>horizontal orientation + looping</h3>
        <ButtonGroup orientation="horizontal" dir={dir} loop>
          <Button value="one">One</Button>
          <Button value="two">Two</Button>
          <Button disabled value="three">
            Three
          </Button>
          <Button value="four">Four</Button>
        </ButtonGroup>

        <h3>vertical orientation + no looping</h3>
        <ButtonGroup orientation="vertical" dir={dir}>
          <Button value="one">One</Button>
          <Button value="two">Two</Button>
          <Button disabled value="three">
            Three
          </Button>
          <Button value="four">Four</Button>
        </ButtonGroup>

        <h3>vertical orientation + looping</h3>
        <ButtonGroup orientation="vertical" dir={dir} loop>
          <Button value="one">One</Button>
          <Button value="two">Two</Button>
          <Button disabled value="three">
            Three
          </Button>
          <Button value="four">Four</Button>
        </ButtonGroup>
      </div>

      <h1>Nested</h1>
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
    </>
  );
}

const ButtonGroupContext = React.createContext<{
  value?: string;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
}>({} as any);

type ButtonGroupProps = Omit<React.ComponentPropsWithRef<'div'>, 'defaultValue'> &
  RovingFocusGroupProps & { defaultValue?: string };

const ButtonGroup = ({ defaultValue, ...props }: ButtonGroupProps) => {
  const [value, setValue] = React.useState(defaultValue);
  return (
    <ButtonGroupContext.Provider value={{ value, setValue }}>
      <RovingFocusGroup.Root
        {...props}
        style={{
          ...props.style,
          display: 'inline-flex',
          flexDirection: props.orientation === 'vertical' ? 'column' : 'row',
          gap: 10,
        }}
      />
    </ButtonGroupContext.Provider>
  );
};

type ButtonProps = Omit<React.ComponentPropsWithRef<'button'>, 'value'> & { value?: string };

const Button = (props: ButtonProps) => {
  const { value: contextValue, setValue } = React.useContext(ButtonGroupContext);
  const isSelected =
    contextValue !== undefined && props.value !== undefined && contextValue === props.value;

  return (
    <RovingFocusGroup.Item asChild active={isSelected}>
      <button
        {...props}
        style={{
          ...props.style,
          border: '1px solid',
          borderColor: '#ccc',
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
        onClick={props.disabled ? undefined : () => setValue(props.value)}
        onFocus={composeEventHandlers(props.onFocus, (event) => {
          if (contextValue !== undefined) {
            event.target.click();
          }
        })}
      />
    </RovingFocusGroup.Item>
  );
};
