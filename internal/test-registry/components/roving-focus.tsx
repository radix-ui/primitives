'use client';
import * as React from 'react';
import { composeEventHandlers, RovingFocus } from 'radix-ui/internal';

export function Basic() {
  return (
    <RovingFocusProvider>
      <div>
        <RovingFocusToggle />
      </div>

      <h3>no orientation (both) + no looping</h3>

      <ButtonGroup defaultValue="two">
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h3>no orientation (both) + looping</h3>

      <ButtonGroup loop>
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h3>horizontal orientation + no looping</h3>

      <ButtonGroup orientation="horizontal">
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h3>horizontal orientation + looping</h3>

      <ButtonGroup orientation="horizontal" loop>
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h3>vertical orientation + no looping</h3>

      <ButtonGroup orientation="vertical">
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h3>vertical orientation + looping</h3>

      <ButtonGroup orientation="vertical" loop>
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>
    </RovingFocusProvider>
  );
}

export function Nested() {
  return (
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
}

type Direction = 'ltr' | 'rtl';

const RovingFocusContext = React.createContext<{
  dir: 'ltr' | 'rtl';
  setDir: React.Dispatch<React.SetStateAction<Direction>>;
}>({
  dir: 'ltr',
  setDir: () => void 0,
});
RovingFocusContext.displayName = 'RovingFocusContext';

function RovingFocusProvider({ children }: { children: React.ReactNode }) {
  const [dir, setDir] = React.useState<Direction>('ltr');
  return (
    <div dir={dir}>
      <RovingFocusContext value={{ dir, setDir }}>{children}</RovingFocusContext>
    </div>
  );
}

function RovingFocusToggle() {
  const { dir, setDir } = React.use(RovingFocusContext);
  return (
    <button type="button" onClick={() => setDir((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'))}>
      Toggle to {dir === 'ltr' ? 'rtl' : 'ltr'}
    </button>
  );
}

const ButtonGroupContext = React.createContext<{
  value: string | undefined;
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
}>({
  value: undefined,
  setValue: () => void 0,
});

type ButtonGroupProps = Omit<React.ComponentPropsWithRef<'div'>, 'defaultValue'> &
  RovingFocus.RovingFocusGroupProps & { defaultValue?: string };

function ButtonGroup({ defaultValue, ...props }: ButtonGroupProps) {
  const [value, setValue] = React.useState(defaultValue);
  const { dir } = React.use(RovingFocusContext);
  return (
    <ButtonGroupContext value={{ value, setValue }}>
      <RovingFocus.Root
        dir={dir}
        {...props}
        style={{
          ...props.style,
          display: 'inline-flex',
          flexDirection: props.orientation === 'vertical' ? 'column' : 'row',
          gap: 10,
        }}
      />
    </ButtonGroupContext>
  );
}

type ButtonProps = Omit<React.ComponentPropsWithRef<'button'>, 'value'> & { value?: string };

function Button(props: ButtonProps) {
  const { value: contextValue, setValue } = React.use(ButtonGroupContext);
  const isSelected =
    contextValue !== undefined && props.value !== undefined && contextValue === props.value;

  return (
    <RovingFocus.Item asChild active={isSelected}>
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
    </RovingFocus.Item>
  );
}
