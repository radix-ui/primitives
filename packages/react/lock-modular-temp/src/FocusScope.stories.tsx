import React from 'react';
import { FocusScope } from './FocusScope';
import type { FocusScopeProps } from './FocusScope';

export default { title: 'Modular Lock (temp)/FocusScope' };

type FocusParam = FocusScopeProps['focusOnMount'];

export const Basic = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isEmptyForm, setIsEmptyForm] = React.useState(false);

  const [trapFocus, setTrapFocus] = React.useState(false);
  const [focusOnMount, setFocusOnMount] = React.useState<FocusParam>('none');
  const [focusOnUnmount, setFocusOnUnmount] = React.useState<FocusParam>('none');

  const ageFieldRef = React.useRef(null);
  const nextButtonRef = React.useRef(null);

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
            checked={focusOnMount !== 'none'}
            onChange={(event) => setFocusOnMount(event.target.checked ? 'auto' : 'none')}
          />{' '}
          Focus on mount?
        </label>
        {focusOnMount !== 'none' && !isEmptyForm && (
          <label style={{ display: 'block', marginLeft: 20 }}>
            <input
              type="checkbox"
              checked={focusOnMount !== 'auto'}
              onChange={(event) => setFocusOnMount(event.target.checked ? ageFieldRef : 'auto')}
            />{' '}
            on "age" field?
          </label>
        )}
        {focusOnMount !== 'none' && (
          <label style={{ display: 'block', marginLeft: 20 }}>
            <input
              type="checkbox"
              checked={isEmptyForm}
              onChange={(event) => {
                setIsEmptyForm(event.target.checked);
                setFocusOnMount('auto');
              }}
            />{' '}
            empty form?
          </label>
        )}
        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={focusOnUnmount !== 'none'}
            onChange={(event) => setFocusOnUnmount(event.target.checked ? 'auto' : 'none')}
          />{' '}
          Focus on unmount?
        </label>
        {focusOnUnmount !== 'none' && (
          <label style={{ display: 'block', marginLeft: 20 }}>
            <input
              type="checkbox"
              checked={focusOnUnmount !== 'auto'}
              onChange={(event) => setFocusOnUnmount(event.target.checked ? nextButtonRef : 'auto')}
            />{' '}
            on "next" button?
          </label>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <button type="button" onClick={() => setIsOpen((isOpen) => !isOpen)}>
          {isOpen ? 'Close' : 'Open'} form in between buttons
        </button>
      </div>

      <button type="button" style={{ marginRight: 10 }}>
        previous
      </button>

      {isOpen ? (
        <FocusScope trapped={trapFocus} focusOnMount={focusOnMount} focusOnUnmount={focusOnUnmount}>
          <form
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
                <button type="button" onClick={() => setIsOpen(false)}>
                  Close
                </button>
              </>
            )}
          </form>
        </FocusScope>
      ) : null}

      <button ref={nextButtonRef} type="button" style={{ marginLeft: 10 }}>
        next
      </button>
    </div>
  );
};
