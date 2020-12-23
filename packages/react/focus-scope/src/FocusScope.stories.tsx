import React from 'react';
import { FocusScope } from './FocusScope';
import { composeEventHandlers } from '@radix-ui/react-utils';

export default { title: 'Components/FocusScope' };

export const Basic = () => {
  const [trapped, setTrapped] = React.useState(false);
  const [highlightAction, setHighlightAction] = React.useState<'null' | 'blur' | 'focus'>('null');
  const InputWrapper =
    highlightAction === 'blur'
      ? BlurAnnouncement
      : highlightAction === 'focus'
      ? FocusAnnouncement
      : React.Fragment;

  return (
    <>
      <RadioGroup
        name="highlight"
        checked={highlightAction}
        onChange={(newValue) => {
          setHighlightAction(newValue as any);
        }}
      >
        <Legend>Highlight focus changes</Legend>
        <Radio value="null">Never</Radio>
        <Radio value="blur">On Blur</Radio>
        <Radio value="focus">On Focus</Radio>
      </RadioGroup>
      <hr />

      <div>
        <button type="button" onClick={() => setTrapped(true)}>
          Trap
        </button>{' '}
        <input /> <input />
      </div>
      {trapped ? (
        <FocusScope trapped={trapped}>
          {(props) => (
            <form
              {...props}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                gap: 20,
                padding: 20,
                margin: 50,
                maxWidth: 500,
                border: '2px solid',
              }}
            >
              <InputWrapper>
                <input type="text" placeholder="First name" />
              </InputWrapper>
              <InputWrapper>
                <input type="text" placeholder="Last name" />
              </InputWrapper>
              <InputWrapper>
                <input type="number" placeholder="Age" />
              </InputWrapper>
              <InputWrapper>
                <button type="button" onClick={() => setTrapped(false)}>
                  Close
                </button>
              </InputWrapper>
            </form>
          )}
        </FocusScope>
      ) : null}
      <div>
        <input /> <input />
      </div>
    </>
  );
};

export const Multiple = () => {
  const [trapped1, setTrapped1] = React.useState(false);
  const [trapped2, setTrapped2] = React.useState(false);

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <button type="button" onClick={() => setTrapped1(true)}>
          Trap 1
        </button>
      </div>
      {trapped1 ? (
        <FocusScope trapped={trapped1}>
          {(props) => (
            <form
              {...props}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                gap: 20,
                padding: 20,
                maxWidth: 500,
                border: '2px solid',
              }}
            >
              <h1>One</h1>
              <input type="text" placeholder="First name" />
              <input type="text" placeholder="Last name" />
              <input type="number" placeholder="Age" />
              <button type="button" onClick={() => setTrapped1(false)}>
                Close
              </button>
            </form>
          )}
        </FocusScope>
      ) : null}

      <div>
        <button type="button" onClick={() => setTrapped2(true)}>
          Trap 2
        </button>
      </div>
      {trapped2 ? (
        <FocusScope trapped={trapped2}>
          {(props) => (
            <form
              {...props}
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                gap: 20,
                padding: 20,
                maxWidth: 500,
                border: '2px solid',
              }}
            >
              <h1>Two</h1>
              <input type="text" placeholder="First name" />
              <input type="text" placeholder="Last name" />
              <input type="number" placeholder="Age" />
              <button type="button" onClick={() => setTrapped2(false)}>
                Close
              </button>
            </form>
          )}
        </FocusScope>
      ) : null}
      <div>
        <input />
      </div>
    </div>
  );
};

// true => default focus, false => no focus, ref => focus element
type FocusParam = boolean | React.RefObject<HTMLElement>;

export const WithOptions = () => {
  const [open, setOpen] = React.useState(false);
  const [isEmptyForm, setIsEmptyForm] = React.useState(false);

  const [trapFocus, setTrapFocus] = React.useState(false);
  const [focusOnMount, setFocusOnMount] = React.useState<FocusParam>(false);
  const [focusOnUnmount, setFocusOnUnmount] = React.useState<FocusParam>(false);

  const ageFieldRef = React.useRef<HTMLInputElement>(null);
  const nextButtonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>FocusScope</h1>

      <div style={{ display: 'inline-block', textAlign: 'left', marginBottom: 20 }}>
        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={trapFocus}
            onChange={(event) => setTrapFocus(event.target.checked)}
          />{' '}
          Trap focus?
        </label>
        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={focusOnMount !== false}
            onChange={(event) => {
              setFocusOnMount(event.target.checked);
              if (event.target.checked === false) {
                setIsEmptyForm(false);
              }
            }}
          />{' '}
          Focus on mount?
        </label>
        {focusOnMount !== false && !isEmptyForm && (
          <label style={{ display: 'block', marginLeft: 20 }}>
            <input
              type="checkbox"
              checked={focusOnMount !== true}
              onChange={(event) => setFocusOnMount(event.target.checked ? ageFieldRef : true)}
            />{' '}
            on "age" field?
          </label>
        )}
        {focusOnMount !== false && (
          <label style={{ display: 'block', marginLeft: 20 }}>
            <input
              type="checkbox"
              checked={isEmptyForm}
              onChange={(event) => {
                setIsEmptyForm(event.target.checked);
                setFocusOnMount(true);
              }}
            />{' '}
            empty form?
          </label>
        )}
        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={focusOnUnmount !== false}
            onChange={(event) => setFocusOnUnmount(event.target.checked)}
          />{' '}
          Focus on unmount?
        </label>
        {focusOnUnmount !== false && (
          <label style={{ display: 'block', marginLeft: 20 }}>
            <input
              type="checkbox"
              checked={focusOnUnmount !== true}
              onChange={(event) => setFocusOnUnmount(event.target.checked ? nextButtonRef : true)}
            />{' '}
            on "next" button?
          </label>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <button type="button" onClick={() => setOpen((open) => !open)}>
          {open ? 'Close' : 'Open'} form in between buttons
        </button>
      </div>

      <button type="button" style={{ marginRight: 10 }}>
        previous
      </button>

      {open ? (
        <FocusScope
          trapped={trapFocus}
          onMountAutoFocus={(event) => {
            if (focusOnMount !== true) {
              event.preventDefault();
              if (focusOnMount) focusOnMount.current?.focus();
            }
          }}
          onUnmountAutoFocus={(event) => {
            if (focusOnUnmount !== true) {
              event.preventDefault();
              if (focusOnUnmount) focusOnUnmount.current?.focus();
            }
          }}
        >
          {({ ref }) => (
            <form
              ref={ref}
              key="form"
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                gap: 20,
                padding: 20,
                margin: 50,
                maxWidth: 500,
                border: '2px solid',
              }}
            >
              {!isEmptyForm && (
                <>
                  <input type="text" placeholder="First name" />
                  <input type="text" placeholder="Last name" />
                  <input ref={ageFieldRef} type="number" placeholder="Age" />
                  <button type="button" onClick={() => setOpen(false)}>
                    Close
                  </button>
                </>
              )}
            </form>
          )}
        </FocusScope>
      ) : null}

      <button ref={nextButtonRef} type="button" style={{ marginLeft: 10 }}>
        next
      </button>
    </div>
  );
};

function FocusAnnouncement({ children }: { children: React.ReactElement }) {
  const [focused, setFocused] = useSelfDestructiveToggleState(false);
  return (
    <div style={{ position: 'relative' }}>
      {React.cloneElement(children, {
        onFocus: composeEventHandlers(
          (children.props as any).onFocus,
          (event: React.FocusEvent) => {
            setFocused(true);
          }
        ),
      })}
      <AnnouncementTag color="green" on={focused}>
        Focused
      </AnnouncementTag>
    </div>
  );
}

function BlurAnnouncement({ children }: { children: React.ReactElement }) {
  const [blurred, setBlurred] = useSelfDestructiveToggleState(false);
  return (
    <div style={{ position: 'relative' }}>
      {React.cloneElement(children, {
        onBlur: composeEventHandlers((children.props as any).onBlur, (event: React.FocusEvent) => {
          setBlurred(true);
        }),
      })}
      <AnnouncementTag color="crimson" on={blurred}>
        Blurred
      </AnnouncementTag>
    </div>
  );
}

function AnnouncementTag({
  children,
  on,
  color,
}: {
  children: React.ReactNode;
  on: boolean;
  color: string;
}) {
  return (
    <span
      style={{
        color: color,
        position: 'absolute',
        top: 'calc(100% + 0.25em)',
        fontSize: '12px',
        fontFamily: 'sans-serif',
        left: 0,
        opacity: on ? 1 : 0,
        transition: on ? undefined : 'opacity  1s ease-in-out',
      }}
    >
      {children}
    </span>
  );
}

function useSelfDestructiveToggleState(
  initialState: boolean,
  opts: { timeout?: number } = {}
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  const { timeout = 500 } = opts;
  const [on, setOn] = React.useState(initialState);
  const savedTimeoutValue = React.useRef(timeout);
  React.useEffect(() => {
    savedTimeoutValue.current = timeout;
  });
  React.useEffect(() => {
    const timeout = savedTimeoutValue.current;
    let mounted = true;
    if (on) {
      const timeoutId = window.setTimeout(() => {
        if (mounted) {
          setOn(false);
        }
      }, timeout);
      return () => {
        mounted = false;
        window.clearTimeout(timeoutId);
      };
    }
    return () => {
      mounted = false;
    };
  }, [on]);

  return [on, setOn];
}

const RadioGroupContext = React.createContext<{
  name?: string;
  checked?: string;
  getChangeHandler?(value: string): (event: React.ChangeEvent<HTMLInputElement>) => void;
}>({});

function RadioGroup({
  children,
  name,
  checked,
  onChange,
  ...props
}: Omit<React.ComponentProps<'fieldset'>, 'onChange'> & {
  name: string;
  checked: string;
  onChange(value: string): void;
}) {
  function getChangeHandler(value: string) {
    return function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      if (event.target.checked) {
        onChange(value);
      }
    };
  }

  return (
    <Fieldset {...props}>
      <RadioGroupContext.Provider value={{ name, checked, getChangeHandler }}>
        {children}
      </RadioGroupContext.Provider>
    </Fieldset>
  );
}

function Fieldset({ ...props }: React.ComponentProps<'fieldset'>) {
  return <fieldset {...props} />;
}

function Legend({ ...props }: React.ComponentProps<'legend'>) {
  return <legend {...props} />;
}

function Radio({ ...props }: Omit<React.ComponentProps<'input'>, 'type'> & { value: string }) {
  const { name, checked, getChangeHandler } = React.useContext(RadioGroupContext);
  const handleChange = props.onChange || getChangeHandler?.(props.value);
  return (
    <CheckedInput
      name={name}
      checked={checked != null ? checked === props.value : undefined}
      onChange={handleChange}
      {...props}
      type="radio"
    />
  );
}

function CheckedInput({ children, ...props }: React.ComponentProps<'input'>) {
  return (
    <label style={{ display: 'flex', marginTop: '0.25em' }}>
      <input {...props} />
      <span style={{ display: 'inline-block', marginLeft: '0.25em' }}>{children}</span>
    </label>
  );
}
