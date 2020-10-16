import React from 'react';
import { DismissableLayer } from './DismissableLayer';
import { FocusScope } from './FocusScope';
import type { DismissableLayerProps } from './DismissableLayer';
import { composeRefs } from '@interop-ui/react-utils';

export default { title: 'Modular Lock (temp)/DismissableLayer' };

export const Basic = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const openButtonRef = React.useRef(null);

  const [dismissOnEscape, setDismissOnEscape] = React.useState(false);
  const [dismissOnOutsideInteraction, setDismissOnOutsideInteraction] = React.useState(false);
  const [disabledOutsidePointerEvents, setDisableOutsidePointerEvents] = React.useState(false);

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>DismissableLayer</h1>

      <div style={{ display: 'inline-block', textAlign: 'left', marginBottom: 20 }}>
        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={dismissOnEscape}
            onChange={(event) => setDismissOnEscape(event.target.checked)}
          />{' '}
          Dismiss on escape?
        </label>

        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={dismissOnOutsideInteraction}
            onChange={(event) => setDismissOnOutsideInteraction(event.target.checked)}
          />{' '}
          Dismiss on outside interaction?
        </label>

        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={disabledOutsidePointerEvents}
            onChange={(event) => setDisableOutsidePointerEvents(event.target.checked)}
          />{' '}
          Disable outside pointer events?
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button ref={openButtonRef} type="button" onClick={() => setIsOpen((isOpen) => !isOpen)}>
          {isOpen ? 'Close' : 'Open'} layer
        </button>
      </div>

      {isOpen ? (
        <DismissableLayer
          onEscapeKeyDown={(event) => {
            if (dismissOnEscape === false) {
              event.preventDefault();
            }
          }}
          onInteractOutside={(event) => {
            if (
              dismissOnOutsideInteraction === false ||
              event.detail.relatedTarget === openButtonRef.current
            ) {
              event.preventDefault();
            }
          }}
          disableOutsidePointerEvents={disabledOutsidePointerEvents}
          onDismiss={() => setIsOpen(false)}
        >
          {(props) => (
            <div
              {...props}
              style={{
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                verticalAlign: 'middle',
                width: 400,
                height: 300,
                backgroundColor: 'black',
                borderRadius: 10,
                marginBottom: 20,
                ...props.style,
              }}
            >
              <input type="text" />
            </div>
          )}
        </DismissableLayer>
      ) : null}

      <div style={{ marginBottom: 20 }}>
        <input type="text" defaultValue="hello" style={{ marginRight: 20 }} />
        <button type="button" onMouseDown={() => alert('hey!')}>
          hey!
        </button>
      </div>
    </div>
  );
};

export const Nested = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const openButtonRef = React.useRef(null);

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>DismissableLayer (nested)</h1>

      <div>
        <button ref={openButtonRef} type="button" onClick={() => setIsOpen((isOpen) => !isOpen)}>
          {isOpen ? 'Close' : 'Open'} dismissable component
        </button>
      </div>

      {isOpen ? (
        <DismissableBox
          onInteractOutside={(event) => {
            if (event.detail.relatedTarget === openButtonRef.current) {
              event.preventDefault();
            }
          }}
          onDismiss={() => setIsOpen(false)}
        />
      ) : null}
    </div>
  );
};

export const WithFocusScope = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const openButtonRef = React.useRef(null);

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>DismissableLayer + FocusScope</h1>
      <div style={{ marginBottom: 20 }}>
        <button ref={openButtonRef} type="button" onClick={() => setIsOpen((isOpen) => !isOpen)}>
          {isOpen ? 'Close' : 'Open'} layer
        </button>
      </div>

      {isOpen ? (
        <DismissableLayer
          onInteractOutside={(event) => {
            if (event.detail.relatedTarget === openButtonRef.current) {
              event.preventDefault();
            }
          }}
          disableOutsidePointerEvents
          onDismiss={() => setIsOpen(false)}
        >
          {({ ref: dismissableLayerContainerRef, ...props }) => (
            <FocusScope trapped>
              {({ ref: focusScopeContainerRef }) => (
                <div
                  ref={composeRefs(focusScopeContainerRef, dismissableLayerContainerRef)}
                  {...props}
                  style={{
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    verticalAlign: 'middle',
                    width: 400,
                    height: 300,
                    backgroundColor: 'black',
                    borderRadius: 10,
                    marginBottom: 20,
                    ...props.style,
                  }}
                >
                  <input type="text" />
                </div>
              )}
            </FocusScope>
          )}
        </DismissableLayer>
      ) : null}

      <div style={{ marginBottom: 20 }}>
        <input type="text" defaultValue="hello" style={{ marginRight: 20 }} />
        <button type="button" onMouseDown={() => alert('hey!')}>
          hey!
        </button>
      </div>
    </div>
  );
};

type DismissableBoxProps = Omit<DismissableLayerProps, 'children'>;

function DismissableBox({ onInteractOutside, onDismiss }: DismissableBoxProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const openButtonRef = React.useRef(null);

  return (
    <DismissableLayer onInteractOutside={onInteractOutside} onDismiss={onDismiss}>
      {(props) => (
        <div
          {...props}
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            padding: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 10,
            marginTop: 20,
            ...props.style,
          }}
        >
          <div>
            <button
              ref={openButtonRef}
              type="button"
              onClick={() => setIsOpen((isOpen) => !isOpen)}
            >
              {isOpen ? 'Close' : 'Open'} dismissable component
            </button>
          </div>

          {isOpen ? (
            <DismissableBox
              onInteractOutside={(event) => {
                if (event.detail.relatedTarget === openButtonRef.current) {
                  event.preventDefault();
                }
              }}
              onDismiss={() => setIsOpen(false)}
            />
          ) : null}
        </div>
      )}
    </DismissableLayer>
  );
}
