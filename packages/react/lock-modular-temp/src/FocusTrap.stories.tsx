import React from 'react';
import { FocusScope } from './FocusTrap';

export default { title: 'Modular Lock (temp)/FocusScope' };

export const Basic = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isEmptyForm, setIsEmptyForm] = React.useState(false);
  const [containFocus, setContainFocus] = React.useState(false);
  const [moveFocusOnMount, setMoveFocusOnMount] = React.useState(false);
  const [moveToAgeField, setMoveToAgeField] = React.useState(false);
  const [returnFocusOnUnmount, setReturnFocusOnUnmount] = React.useState(false);
  const [returnToNextButton, setReturnToNextButton] = React.useState(false);
  const ageFieldRef = React.useRef(null);
  const nextButtonRef = React.useRef(null);

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>FocusScope</h1>

      <div>
        <div style={{ display: 'inline-block', textAlign: 'left', marginBottom: 20 }}>
          <label style={{ display: 'block' }}>
            <input
              type="checkbox"
              checked={containFocus}
              onChange={(event) => setContainFocus(event.target.checked)}
            />{' '}
            Contains focus?
          </label>
          <label style={{ display: 'block' }}>
            <input
              type="checkbox"
              checked={moveFocusOnMount}
              onChange={(event) => {
                setMoveFocusOnMount(event.target.checked);
                if (event.target.checked === false) {
                  setMoveToAgeField(false);
                  setIsEmptyForm(false);
                }
              }}
            />{' '}
            Move focus on mount?
          </label>
          {moveFocusOnMount && !isEmptyForm && (
            <label style={{ display: 'block', marginLeft: 20 }}>
              <input
                type="checkbox"
                checked={moveToAgeField}
                onChange={(event) => setMoveToAgeField(event.target.checked)}
              />{' '}
              to "age" field?
            </label>
          )}
          {moveFocusOnMount && (
            <label style={{ display: 'block', marginLeft: 20 }}>
              <input
                type="checkbox"
                checked={isEmptyForm}
                onChange={(event) => {
                  setIsEmptyForm(event.target.checked);
                  if (event.target.checked === false) {
                    setMoveToAgeField(false);
                  }
                }}
              />{' '}
              empty form?
            </label>
          )}
          <label style={{ display: 'block' }}>
            <input
              type="checkbox"
              checked={returnFocusOnUnmount}
              onChange={(event) => {
                setReturnFocusOnUnmount(event.target.checked);
                if (event.target.checked === false) {
                  setReturnToNextButton(false);
                }
              }}
            />{' '}
            Return focus on unmount?
          </label>
          {returnFocusOnUnmount && (
            <label style={{ display: 'block', marginLeft: 20 }}>
              <input
                type="checkbox"
                checked={returnToNextButton}
                onChange={(event) => setReturnToNextButton(event.target.checked)}
              />{' '}
              to "next" button?
            </label>
          )}
        </div>
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
        <FocusScope
          contain={containFocus}
          moveFocusOnMount={moveFocusOnMount}
          refToMoveFocusTo={moveToAgeField ? ageFieldRef : undefined}
          returnFocusOnUnmount={returnFocusOnUnmount}
          refToReturnFocusTo={returnToNextButton ? nextButtonRef : undefined}
        >
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
