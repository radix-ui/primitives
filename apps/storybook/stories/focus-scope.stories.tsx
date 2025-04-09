import React from 'react';
import { FocusScope } from 'radix-ui/internal';

export default { title: 'Utilities/FocusScope' };

export const Basic = () => {
  const [trapped, setTrapped] = React.useState(false);
  const [hasDestroyButton, setHasDestroyButton] = React.useState(true);

  return (
    <>
      <div>
        <button type="button" onClick={() => setTrapped(true)}>
          Trap
        </button>{' '}
        <input /> <input />
      </div>
      {trapped ? (
        <FocusScope.Root asChild loop={trapped} trapped={trapped}>
          <form
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
            <input type="text" placeholder="First name" />
            <input type="text" placeholder="Last name" />
            <input type="number" placeholder="Age" />
            {hasDestroyButton && (
              <div>
                <button type="button" onClick={() => setHasDestroyButton(false)}>
                  Destroy me
                </button>
              </div>
            )}
            <button type="button" onClick={() => setTrapped(false)}>
              Close
            </button>
          </form>
        </FocusScope.Root>
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
        <FocusScope.Root asChild loop={trapped1} trapped={trapped1}>
          <form
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
        </FocusScope.Root>
      ) : null}

      <div>
        <button type="button" onClick={() => setTrapped2(true)}>
          Trap 2
        </button>
      </div>
      {trapped2 ? (
        <FocusScope.Root asChild loop={trapped2} trapped={trapped2}>
          <form
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
        </FocusScope.Root>
      ) : null}
      <div>
        <input />
      </div>
    </div>
  );
};

// true => default focus, false => no focus, ref => focus element
type FocusParam = boolean | React.RefObject<HTMLElement | null>;

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
        <FocusScope.Root
          key="form"
          asChild
          loop={trapFocus}
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
          <form
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
        </FocusScope.Root>
      ) : null}

      <button ref={nextButtonRef} type="button" style={{ marginLeft: 10 }}>
        next
      </button>
    </div>
  );
};
