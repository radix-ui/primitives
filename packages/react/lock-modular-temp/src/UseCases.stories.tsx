/* eslint-disable jsx-a11y/accessible-emoji */

import React from 'react';
import { Portal } from '@interop-ui/react-portal';
import { Popper, styles as popperStyles } from '@interop-ui/react-popper';
import { RemoveScroll } from 'react-remove-scroll';
import { DismissableLayer } from './DismissableLayer';
import { FocusScope } from './FocusScope';
import { composeRefs } from '@interop-ui/react-utils';

export default { title: 'Modular Lock (temp)/Use cases' };

const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

export const DialogExample = () => (
  <div style={{ height: '300vh', fontFamily: SYSTEM_FONT }}>
    <h1>Dialog (fully modal example)</h1>
    <ul style={{ listStyle: 'none', padding: 0, marginBottom: 30 }}>
      <li>✅ focus should move inside `Dialog` when mounted</li>
      <li>✅ focus should be trapped inside `Dialog`</li>
      <li>✅ scrolling outside `Dialog` should be prevented</li>
      <li>✅ should be able to dismiss `Dialog` on pressing escape</li>
      <li style={{ marginLeft: 30 }}>✅ focus should return to the open button</li>
      <li>
        ✅ clicking outside `Dialog` should be prevented (clicking the "alert me" button shouldn't
        do anything)
      </li>
      <li>➕</li>
      <li>✅ should be able to Dismiss `Dialog` when clicking outside</li>
      <li style={{ marginLeft: 30 }}>✅ focus should return to the open button</li>
    </ul>

    <div style={{ display: 'flex', gap: 10 }}>
      <DummyDialog />
      <input type="text" defaultValue="some input" />
      <button type="button" onClick={() => window.alert('clicked!')}>
        Alert me
      </button>
    </div>
  </div>
);

export const PopoverFullyModal = () => (
  <div style={{ height: '300vh', fontFamily: SYSTEM_FONT }}>
    <h1>Popover (fully modal example)</h1>
    <ul style={{ listStyle: 'none', padding: 0, marginBottom: 30 }}>
      <li>✅ focus should move inside `Popover` when mounted</li>
      <li>✅ focus should be trapped inside `Popover`</li>
      <li>✅ scrolling outside `Popover` should be prevented</li>
      <li>✅ should be able to dismiss `Popover` on pressing escape</li>
      <li style={{ marginLeft: 30 }}>✅ focus should return to the open button</li>
      <li>
        ✅ clicking outside `Popover` should be prevented (clicking the "alert me" button shouldn't
        do anything)
      </li>
      <li>➕</li>
      <li>✅ should be able to Dismiss `Popover` when clicking outside</li>
      <li style={{ marginLeft: 30 }}>✅ focus should return to the open button</li>
    </ul>

    <div style={{ display: 'flex', gap: 10 }}>
      <DummyPopover preventOutsideClick preventScroll />
      <input type="text" defaultValue="some input" />
      <button type="button" onClick={() => window.alert('clicked!')}>
        Alert me
      </button>
    </div>
  </div>
);

export const PopoverSemiModal = () => {
  const [color, setColor] = React.useState('royalblue');
  const changeColorButtonRef = React.useRef(null);
  return (
    <div style={{ height: '300vh', fontFamily: SYSTEM_FONT }}>
      <h1>Popover (semi-modal example)</h1>
      <ul style={{ listStyle: 'none', padding: 0, marginBottom: 30 }}>
        <li>✅ focus should move inside `Popover` when mounted</li>
        <li>✅ focus should be trapped inside `Popover`</li>
        <li>✅ scrolling outside `Popover` should be allowed</li>
        <li>✅ should be able to dismiss `Popover` on pressing escape</li>
        <li style={{ marginLeft: 30 }}>✅ focus should return to the open button</li>
        <li>
          ✅ clicking outside `Popover` should work (clicking the "alert me" button should trigger)
        </li>
        <li>➕</li>
        <li>
          ✅ should be able to dismiss `Popover` when clicking outside{' '}
          <span style={{ fontWeight: 600 }}>unless specified (ie. change color button)</span>
        </li>
        <li style={{ marginLeft: 30 }}>
          ✅ focus should <span style={{ fontWeight: 600 }}>NOT</span> return to the open button
          when unmounted, natural focus should occur
          <div style={{ fontWeight: 600 }}>
            <span style={{ marginLeft: 20 }}>notes:</span>
            <ul>
              <li>this seems to work because of the order of events</li>
              <li>focus is still returned but then moved</li>
              <li>not sure if that's good enough…</li>
            </ul>
          </div>
        </li>
      </ul>

      <div style={{ display: 'flex', gap: 10 }}>
        <DummyPopover
          color={color}
          dismissOnOutsideClick={(event: any) => event.target !== changeColorButtonRef.current}
        />
        <input type="text" defaultValue="some input" />
        <button type="button" onClick={() => window.alert('clicked!')}>
          Alert me
        </button>
        <button
          ref={changeColorButtonRef}
          type="button"
          onClick={() =>
            setColor((prevColor) => (prevColor === 'royalblue' ? 'tomato' : 'royalblue'))
          }
        >
          Change color
        </button>
      </div>
    </div>
  );
};

export const PopoverNonModal = () => (
  <div style={{ height: '300vh', fontFamily: SYSTEM_FONT }}>
    <h1>Popover (non modal example)</h1>
    <ul style={{ listStyle: 'none', padding: 0, marginBottom: 30 }}>
      <li>✅ focus should move inside `Popover` when mounted</li>
      <li>
        ✅ focus should <span style={{ fontWeight: 600 }}>NOT</span> be trapped inside `Popover`
      </li>
      <li>✅ scrolling outside `Popover` should be prevented</li>
      <li>✅ should be able to dismiss `Popover` on pressing escape</li>
      <li style={{ marginLeft: 30 }}>✅ focus should return to the open button</li>
      <li>
        ✅ clicking outside `Popover` should work (clicking the "alert me" button should trigger)
      </li>
      <li>➕</li>
      <li>✅ should be able to Dismiss `Popover` when clicking outside</li>
      <li style={{ marginLeft: 30 }}>
        ✅ focus should <span style={{ fontWeight: 600 }}>NOT</span> return to the open button when
        unmounted, natural focus should occur
        <div style={{ fontWeight: 600 }}>
          <span style={{ marginLeft: 20 }}>notes:</span>
          <ul>
            <li>this seems to work because of the order of events</li>
            <li>focus is still returned but then moved</li>
            <li>not sure if that's good enough…</li>
          </ul>
        </div>
      </li>
      <li>
        ✅ should be able to Dismiss `Popover` when blurring outside (tabbing out of it)
        <div style={{ fontWeight: 600 }}>
          <span style={{ marginLeft: 20 }}>notes:</span>
          <ul>
            <li>this only works currently thanks to a hack</li>
            <li>we add an extra tabbable element in a portal after the `Popover`</li>
            <li>
              this is because otherwise, we are at the edge of the DOM and focus goes onto the
              browser chrome
            </li>
            <li>not sure if that's a viable trick…</li>
          </ul>
        </div>
      </li>
      <li style={{ marginLeft: 30 }}>
        ❌ focus should move to next tabbable element after open button when unmounted (via blur)
        <div style={{ fontWeight: 600 }}>
          <span style={{ marginLeft: 20 }}>notes:</span>
          <ul>
            <li>right now focus is still returned to the open button when `FocusScope` unmounts</li>
            <li>
              we'd have to do something to figure out how it should go on the next element on the
              actual page (in this case the input)
            </li>
          </ul>
        </div>
      </li>
    </ul>

    <div style={{ display: 'flex', gap: 10 }}>
      <DummyPopover trapped={false} dismissOnOutsideBlur />
      <input type="text" defaultValue="some input" />
      <button type="button" onClick={() => window.alert('clicked!')}>
        Alert me
      </button>
    </div>
  </div>
);

export const PopoverInDialog = () => (
  <div style={{ height: '300vh', fontFamily: SYSTEM_FONT }}>
    <h1>Popover (in Dialog)</h1>
    <ul style={{ listStyle: 'none', padding: 0, marginBottom: 30 }}>
      <li>✅ dismissing `Popover` by pressing escape should not dismiss `Dialog`</li>
      <li>✅ dismissing `Popover` by clicking outside should not dismiss `Dialog`</li>
      <li>
        ❌ there's an issue: clicking in `Popover` dismisses it
        <div style={{ fontWeight: 600 }}>
          <span style={{ marginLeft: 20 }}>notes:</span>
          <ul>
            <li>
              any `DismissableLayer` will need to know if a parent has `preventOutsideClick: true`
            </li>
            <li>
              so we can set `pointerEvents: auto` (even thought itself might not have
              `preventOutsideClick: true`)
            </li>
            <li>probably will do this via context</li>
          </ul>
        </div>
      </li>
    </ul>

    <div style={{ display: 'flex', gap: 10 }}>
      <DummyDialog>
        <DummyPopover />
      </DummyDialog>
      <input type="text" defaultValue="some input" />
      <button type="button" onClick={() => window.alert('clicked!')}>
        Alert me
      </button>
    </div>
  </div>
);

export const PopoverNested = () => (
  <div style={{ height: '300vh', fontFamily: SYSTEM_FONT }}>
    <h1>Popover (nested example)</h1>
    <ul style={{ listStyle: 'none', padding: 0, marginBottom: 30 }}>
      <li>
        ✅ dismissing a `Popover` by pressing escape should only dismiss that given `Popover`, not
        its parents
      </li>
      <li>
        ❌ dismissing a `Popover` by clicking outside should dismiss it and its parents (as long as
        click was outside of all)
        <div style={{ fontWeight: 600 }}>
          <span style={{ marginLeft: 20 }}>notes:</span>
          <ul>
            <li>
              this does not work because of our layerStack approach which doesn't account for that
            </li>
            <li>each `DismissableLayer` will prob need to be aware of its parents</li>
            <li>probably will do this via context</li>
          </ul>
        </div>
      </li>
    </ul>

    <div style={{ display: 'flex', gap: 10 }}>
      <DummyPopover>
        <DummyPopover color="tomato">
          <DummyPopover color="royalblue"></DummyPopover>
        </DummyPopover>
      </DummyPopover>
      <input type="text" defaultValue="some input" />
      <button type="button" onClick={() => window.alert('clicked!')}>
        Alert me
      </button>
    </div>
  </div>
);

/* -------------------------------------------------------------------------------------------------
 * Dummy components
 * -----------------------------------------------------------------------------------------------*/

function DummyDialog({ children, openLabel = 'Open', closeLabel = 'Close' }: any) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen((prevOpen) => !prevOpen)}>
        {openLabel}
      </button>
      {open ? (
        <>
          <Portal>
            <div
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                pointerEvents: 'none',
                backgroundColor: 'black',
                opacity: 0.2,
              }}
            />
          </Portal>
          <Portal>
            <RemoveScroll>
              <DismissableLayer
                dismissOnEscape
                dismissOnOutsideClick
                preventOutsideClick
                onDismiss={() => setOpen(false)}
              >
                {({ ref: dismissableLayerContainerRef, styles }) => (
                  <FocusScope trapped focusOnMount="auto" focusOnUnmount="auto">
                    {({ ref: focusScopeContainerRef }) => (
                      <div
                        ref={composeRefs(dismissableLayerContainerRef, focusScopeContainerRef)}
                        style={{
                          boxSizing: 'border-box',
                          display: 'flex',
                          alignItems: 'start',
                          gap: 10,
                          position: 'fixed',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          background: 'white',
                          minWidth: 300,
                          minHeight: 200,
                          padding: 40,
                          borderRadius: 10,
                          backgroundColor: 'white',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
                          ...styles,
                        }}
                      >
                        {children}
                        <button type="button" onClick={() => setOpen(false)}>
                          {closeLabel}
                        </button>
                        <input type="text" defaultValue="hello world" />
                      </div>
                    )}
                  </FocusScope>
                )}
              </DismissableLayer>
            </RemoveScroll>
          </Portal>
        </>
      ) : null}
    </>
  );
}

function DummyPopover({
  children,
  openLabel = 'Open',
  closeLabel = 'Close',
  color = '#333',
  trapped = true,
  dismissOnEscape = true,
  dismissOnOutsideClick = true,
  dismissOnOutsideBlur = false,
  preventOutsideClick = false,
  preventScroll = false,
}: any) {
  const [open, setOpen] = React.useState(false);
  const openButtonRef = React.useRef(null);
  const ScrollContainer = preventScroll ? RemoveScroll : React.Fragment;
  return (
    <>
      <button ref={openButtonRef} type="button" onClick={() => setOpen((prevOpen) => !prevOpen)}>
        {openLabel}
      </button>
      {open ? (
        <>
          <Portal>
            <ScrollContainer>
              <DismissableLayer
                dismissOnEscape={dismissOnEscape}
                dismissOnOutsideClick={(event) => {
                  if (event.target === openButtonRef.current) {
                    return false;
                  }
                  if (typeof dismissOnOutsideClick === 'function') {
                    return dismissOnOutsideClick(event);
                  } else {
                    return dismissOnOutsideClick;
                  }
                }}
                dismissOnOutsideBlur={dismissOnOutsideBlur}
                preventOutsideClick={preventOutsideClick}
                onDismiss={() => setOpen(false)}
              >
                {({ ref: dismissableLayerContainerRef, styles }) => (
                  <FocusScope trapped={trapped} focusOnMount="auto" focusOnUnmount="auto">
                    {({ ref: focusScopeContainerRef }) => (
                      <Popper
                        ref={composeRefs(dismissableLayerContainerRef, focusScopeContainerRef)}
                        anchorRef={openButtonRef}
                        style={{
                          ...popperStyles.root,
                          filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.12))',
                          ...styles,
                        }}
                        side="top"
                        sideOffset={5}
                      >
                        <Popper.Content
                          style={{
                            ...popperStyles.content,
                            display: 'flex',
                            alignItems: 'start',
                            gap: 10,
                            background: 'white',
                            minWidth: 200,
                            minHeight: 150,
                            padding: 20,
                            borderRadius: 4,
                            backgroundColor: color,
                          }}
                        >
                          {children}
                          <button type="button" onClick={() => setOpen(false)}>
                            {closeLabel}
                          </button>
                          <input type="text" defaultValue="hello world" />
                        </Popper.Content>
                        <Popper.Arrow
                          width={10}
                          height={4}
                          style={{ ...popperStyles.arrow, fill: color }}
                          offset={20}
                        />
                      </Popper>
                    )}
                  </FocusScope>
                )}
              </DismissableLayer>
            </ScrollContainer>
          </Portal>
          <Portal>
            {/* eslint-disable-next-line */}
            <span tabIndex={0} />
          </Portal>
        </>
      ) : null}
    </>
  );
}
