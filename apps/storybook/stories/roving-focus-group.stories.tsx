import * as React from 'react';
import { composeEventHandlers, RovingFocus } from 'radix-ui/internal';

type RovingFocusGroupProps = React.ComponentProps<typeof RovingFocus.Root>;

export default { title: 'Utilities/RovingFocusGroup' };

export const Basic = () => {
  const [dir, setDir] = React.useState<RovingFocusGroupProps['dir']>('ltr');

  return (
    <div dir={dir}>
      <h1>
        Direction: {dir}{' '}
        <button type="button" onClick={() => setDir((prev) => (prev === 'ltr' ? 'rtl' : 'ltr'))}>
          Toggle to {dir === 'ltr' ? 'rtl' : 'ltr'}
        </button>
      </h1>

      <h2>no orientation (both) + no looping</h2>
      <ButtonGroup dir={dir} defaultValue="two">
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h2>no orientation (both) + looping</h2>
      <ButtonGroup dir={dir} loop>
        <Button value="hidden" style={{ display: 'none' }}>
          Hidden
        </Button>
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h2>horizontal orientation + no looping</h2>
      <ButtonGroup orientation="horizontal" dir={dir}>
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h2>horizontal orientation + looping</h2>
      <ButtonGroup orientation="horizontal" dir={dir} loop>
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h2>vertical orientation + no looping</h2>
      <ButtonGroup orientation="vertical" dir={dir}>
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>

      <h2>vertical orientation + looping</h2>
      <ButtonGroup orientation="vertical" dir={dir} loop>
        <Button value="one">One</Button>
        <Button value="two">Two</Button>
        <Button disabled value="three">
          Three
        </Button>
        <Button value="four">Four</Button>
      </ButtonGroup>
    </div>
  );
};

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

export const EdgeCases = () => {
  const [extra, setExtra] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [disabled3To5, setDisabled3To5] = React.useState(false);

  return (
    <>
      <button onClick={() => setExtra((x) => !x)}>Add/remove extra</button>
      <button onClick={() => setDisabled((x) => !x)}>Disable/Enable "One"</button>
      <button onClick={() => setHidden((x) => !x)}>Hide/show "One"</button>
      <button onClick={() => setDisabled3To5((x) => !x)}>Disable/Enable "Three" to "Five"</button>
      <hr />

      <ButtonGroup>
        {extra ? <Button value="extra">Extra</Button> : null}
        <Button value="one" disabled={disabled} style={{ display: hidden ? 'none' : undefined }}>
          One
        </Button>
        <Button value="two" disabled>
          Two
        </Button>
        <Button value="three" disabled={disabled3To5}>
          Three
        </Button>
        <Button value="four" disabled={disabled3To5} style={{ display: 'none' }}>
          Four
        </Button>
        <Button value="five" disabled={disabled3To5}>
          Five
        </Button>
      </ButtonGroup>

      <hr />
      <button type="button">Focusable outside of group</button>
    </>
  );
};

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
      <RovingFocus.Root
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
    <RovingFocus.Item asChild active={isSelected} focusable={!props.disabled}>
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
};
