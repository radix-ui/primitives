import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { Portal, Slot } from 'radix-ui';
import {
  DismissableLayer as DismissableLayerPrimitive,
  FocusGuards,
  FocusScope as FocusScopePrimitive,
  Popper,
} from 'radix-ui/internal';
import { RemoveScroll } from 'react-remove-scroll';

const DismissableLayer = DismissableLayerPrimitive.Root;
const FocusScope = FocusScopePrimitive.Root;

type DismissableLayerProps = React.ComponentProps<typeof DismissableLayer>;
type FocusScopeProps = React.ComponentProps<typeof FocusScope>;

export default { title: 'Utilities/DismissableLayer' };

const SYSTEM_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

export const Basic = () => {
  const [open, setOpen] = React.useState(false);
  const openButtonRef = React.useRef(null);

  const [dismissOnEscape, setDismissOnEscape] = React.useState(false);
  const [dismissOnPointerDownOutside, setDismissOnPointerDownOutside] = React.useState(false);
  const [dismissOnFocusOutside, setDismissOnFocusOutside] = React.useState(false);
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
            checked={dismissOnPointerDownOutside}
            onChange={(event) => setDismissOnPointerDownOutside(event.target.checked)}
          />{' '}
          Dismiss on pointer down outside?
        </label>

        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={dismissOnFocusOutside}
            onChange={(event) => setDismissOnFocusOutside(event.target.checked)}
          />{' '}
          Dismiss on focus outside?
        </label>

        <hr />

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
        <button ref={openButtonRef} type="button" onClick={() => setOpen((open) => !open)}>
          {open ? 'Close' : 'Open'} layer
        </button>
      </div>

      {open ? (
        <DismissableLayer
          onEscapeKeyDown={(event) => {
            if (dismissOnEscape === false) {
              event.preventDefault();
            }
          }}
          onPointerDownOutside={(event) => {
            if (dismissOnPointerDownOutside === false || event.target === openButtonRef.current) {
              event.preventDefault();
            }
          }}
          onFocusOutside={(event) => {
            if (dismissOnFocusOutside === false) {
              event.preventDefault();
            }
          }}
          disableOutsidePointerEvents={disabledOutsidePointerEvents}
          onDismiss={() => setOpen(false)}
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
          }}
        >
          <input type="text" />
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
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>DismissableLayer (nested)</h1>
      <DismissableBox />
    </div>
  );
};

export const WithFocusScope = () => {
  const [open, setOpen] = React.useState(false);
  const openButtonRef = React.useRef(null);

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>DismissableLayer + FocusScope</h1>
      <div style={{ marginBottom: 20 }}>
        <button ref={openButtonRef} type="button" onClick={() => setOpen((open) => !open)}>
          {open ? 'Close' : 'Open'} layer
        </button>
      </div>

      {open ? (
        <DismissableLayer
          asChild
          onPointerDownOutside={(event) => {
            if (event.target === openButtonRef.current) {
              event.preventDefault();
            }
          }}
          disableOutsidePointerEvents
          onDismiss={() => setOpen(false)}
        >
          <FocusScope
            trapped
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
            }}
          >
            <input type="text" />
          </FocusScope>
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

function DismissableBox(props: DismissableBoxProps) {
  const [open, setOpen] = React.useState(false);
  const openButtonRef = React.useRef(null);

  return (
    <DismissableLayer
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
        <button ref={openButtonRef} type="button" onClick={() => setOpen((open) => !open)}>
          {open ? 'Close' : 'Open'} new layer
        </button>
      </div>

      {open ? (
        <DismissableBox
          onPointerDownOutside={(event) => {
            if (event.target === openButtonRef.current) {
              event.preventDefault();
            }
          }}
          onFocusOutside={(event) => event.preventDefault()}
          onDismiss={() => setOpen(false)}
        />
      ) : null}
    </DismissableLayer>
  );
}

export const DialogExample = () => (
  <div style={{ height: '300vh', fontFamily: SYSTEM_FONT }}>
    <h1>Dialog (fully modal example)</h1>
    <ul style={{ listStyle: 'none', padding: 0, marginBottom: 30 }}>
      <li>✅ focus should move inside `Dialog` when mounted</li>
      <li>✅ focus should be trapped inside `Dialog`</li>
      <li>✅ scrolling outside `Dialog` should be disabled</li>
      <li>✅ should be able to dismiss `Dialog` on pressing escape</li>
      <li style={{ marginLeft: 30 }}>✅ focus should return to the open button</li>
      <li>
        ✅ interacting outside `Dialog` should be disabled (clicking the "alert me" button shouldn't
        do anything)
      </li>
      <li>➕</li>
      <li>✅ should be able to dismiss `Dialog` when interacting outside</li>
      <li style={{ marginLeft: 30 }}>✅ focus should return to the open button</li>
    </ul>

    <div style={{ display: 'flex', gap: 10 }}>
      <DummyDialog openLabel="Open Dialog" closeLabel="Close Dialog" />
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
      <li>✅ scrolling outside `Popover` should be disabled</li>
      <li>✅ should be able to dismiss `Popover` on pressing escape</li>
      <li style={{ marginLeft: 30 }}>✅ focus should return to the open button</li>
      <li>
        ✅ interacting outside `Popover` should be disabled (clicking the "alert me" button
        shouldn't do anything)
      </li>
      <li>➕</li>
      <li>✅ should be able to dismiss `Popover` when interacting outside</li>
      <li style={{ marginLeft: 30 }}>✅ focus should return to the open button</li>
    </ul>

    <div style={{ display: 'flex', gap: 10 }}>
      <DummyPopover
        openLabel="Open Popover"
        closeLabel="Close Popover"
        disableOutsidePointerEvents
        preventScroll
      />
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
          ✅ interacting outside `Popover` should be allowed (clicking the "alert me" button should
          trigger)
        </li>
        <li>➕</li>
        <li>
          ✅ should be able to dismiss `Popover` when interacting outside{' '}
          <span style={{ fontWeight: 600 }}>unless specified (ie. change color button)</span>
        </li>
        <li style={{ marginLeft: 30 }}>
          ✅ focus should <span style={{ fontWeight: 600 }}>NOT</span> return to the open button
          when unmounted, natural focus should occur
        </li>
      </ul>

      <div style={{ display: 'flex', gap: 10 }}>
        <DummyPopover
          color={color}
          openLabel="Open Popover"
          closeLabel="Close Popover"
          onPointerDownOutside={(event) => {
            if (event.target === changeColorButtonRef.current) {
              event.preventDefault();
            }
          }}
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
      <li>✅ scrolling outside `Popover` should be allowed</li>
      <li>✅ should be able to dismiss `Popover` on pressing escape</li>
      <li style={{ marginLeft: 30 }}>✅ focus should return to the open button</li>
      <li>
        ✅ interacting outside `Popover` should be allowed (clicking the "alert me" button should
        trigger)
      </li>
      <li>➕</li>
      <li>✅ should be able to dismiss `Popover` when clicking outside</li>
      <li style={{ marginLeft: 30 }}>
        ✅ focus should <span style={{ fontWeight: 600 }}>NOT</span> return to the open button when
        unmounted, natural focus should occur
      </li>
      <li>✅ should be able to dismiss `Popover` when focus leaves it</li>
      <li style={{ marginLeft: 30 }}>
        ❓ focus should move to next tabbable element after open button
        <div style={{ fontWeight: 600 }}>
          <span style={{ marginLeft: 20 }}>notes:</span>
          <ul>
            <li>
              I have left this one out for now as I am still unsure in which case it should do this
            </li>
            <li>
              for the moment, focus will be returned to the open button when `FocusScope` unmounts
            </li>
            <li>Need to do some more thinking, in the meantime, I think this behavior is ok</li>
          </ul>
        </div>
      </li>
    </ul>

    <div style={{ display: 'flex', gap: 10 }}>
      <DummyPopover openLabel="Open Popover" closeLabel="Close Popover" trapped={false} />
      <input type="text" defaultValue="some input" />
      <button type="button" onClick={() => window.alert('clicked!')}>
        Alert me
      </button>
    </div>
  </div>
);

export const PopoverInDialog = () => (
  <div style={{ height: '300vh', fontFamily: SYSTEM_FONT }}>
    <h1>Popover (semi-modal) in Dialog (fully modal)</h1>
    <ul style={{ listStyle: 'none', padding: 0, marginBottom: 30 }}>
      <li>
        ✅ dismissing `Popover` by pressing escape should{' '}
        <span style={{ fontWeight: 600 }}>NOT</span> dismiss `Dialog`
      </li>
      <li>✅ dismissing `Popover` by clicking outside should also dismiss `Dialog`</li>
    </ul>

    <div style={{ display: 'flex', gap: 10 }}>
      <DummyDialog openLabel="Open Dialog" closeLabel="Close Dialog">
        <DummyPopover openLabel="Open Popover" closeLabel="Close Popover" />
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
        ✅ interacting outside the blue `Popover` should only dismiss itself and not its parents
      </li>
      <li>✅ interacting outside the red `Popover` should dismiss itself and the black one</li>
      <li>✅ unless the click wasn't outside the black one</li>
      <li>
        ✅ when the blue `Popover` is open, there should be{' '}
        <span style={{ fontWeight: 600 }}>NO</span> text cursor above the red or black inputs
      </li>
      <li>
        ✅ when the red `Popover` is open, there should be a text cursor above the black input but
        not the one on the page behind
      </li>
    </ul>

    <div style={{ display: 'flex', gap: 10 }}>
      <DummyPopover
        disableOutsidePointerEvents
        onInteractOutside={() => {
          console.log('interact outside black');
        }}
      >
        <DummyPopover
          color="tomato"
          openLabel="Open red"
          closeLabel="Close red"
          onInteractOutside={() => {
            console.log('interact outside red');
          }}
        >
          <DummyPopover
            color="royalblue"
            openLabel="Open blue"
            closeLabel="Close blue"
            disableOutsidePointerEvents
            onInteractOutside={() => {
              console.log('interact outside blue');
            }}
          ></DummyPopover>
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

type DummyDialogProps = {
  children?: React.ReactNode;
  openLabel?: string;
  closeLabel?: string;
};

function DummyDialog({ children, openLabel = 'Open', closeLabel = 'Close' }: DummyDialogProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen((prevOpen) => !prevOpen)}>
        {openLabel}
      </button>
      {open ? (
        <FocusGuards.Root>
          <Portal.Root asChild>
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
          </Portal.Root>
          <Portal.Root asChild>
            <RemoveScroll as={Slot.Root}>
              <DismissableLayer
                asChild
                disableOutsidePointerEvents
                onDismiss={() => setOpen(false)}
              >
                <FocusScope
                  trapped
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
                  }}
                >
                  {children}
                  <button type="button" onClick={() => setOpen(false)}>
                    {closeLabel}
                  </button>
                  <input type="text" defaultValue="hello world" />
                </FocusScope>
              </DismissableLayer>
            </RemoveScroll>
          </Portal.Root>
        </FocusGuards.Root>
      ) : null}
    </>
  );
}

type DummyPopoverOwnProps = {
  children?: React.ReactNode;
  openLabel?: string;
  closeLabel?: string;
  color?: string;
  preventScroll?: boolean;
};
type DummyPopoverProps = DummyPopoverOwnProps &
  Omit<FocusScopeProps, 'children'> &
  Omit<DismissableLayerProps, 'children'>;

function DummyPopover({
  children,
  openLabel = 'Open',
  closeLabel = 'Close',
  color = '#333',
  trapped = true,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  disableOutsidePointerEvents = false,
  preventScroll = false,
}: DummyPopoverProps) {
  const [skipUnmountAutoFocus, setSkipUnmountAutoFocus] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const openButtonRef = React.useRef(null);
  const ScrollContainer = preventScroll ? RemoveScroll : React.Fragment;
  const scrollLockWrapperProps = preventScroll ? { as: Slot.Root } : undefined;

  return (
    <Popper.Root>
      <Popper.Anchor asChild>
        <button type="button" ref={openButtonRef} onClick={() => setOpen((prevOpen) => !prevOpen)}>
          {openLabel}
        </button>
      </Popper.Anchor>
      {open ? (
        <FocusGuards.Root>
          <ScrollContainer {...scrollLockWrapperProps}>
            <Portal.Root asChild>
              <DismissableLayer
                asChild
                disableOutsidePointerEvents={disableOutsidePointerEvents}
                onEscapeKeyDown={onEscapeKeyDown}
                onPointerDownOutside={(event) => {
                  setSkipUnmountAutoFocus(!disableOutsidePointerEvents);
                  if (event.target === openButtonRef.current) {
                    event.preventDefault();
                  } else {
                    onPointerDownOutside?.(event);
                  }
                }}
                onFocusOutside={onFocusOutside}
                onInteractOutside={onInteractOutside}
                onDismiss={() => setOpen(false)}
              >
                <FocusScope
                  asChild
                  trapped={trapped}
                  onUnmountAutoFocus={(event) => {
                    if (skipUnmountAutoFocus) {
                      event.preventDefault();
                    }
                    setSkipUnmountAutoFocus(false);
                  }}
                >
                  <Popper.Content
                    style={{
                      filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.12))',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      background: 'white',
                      minWidth: 200,
                      minHeight: 150,
                      padding: 20,
                      borderRadius: 4,
                      backgroundColor: color,
                    }}
                    side="bottom"
                    sideOffset={10}
                  >
                    {children}
                    <button type="button" onClick={() => setOpen(false)}>
                      {closeLabel}
                    </button>
                    <input type="text" defaultValue="hello world" />
                    <Popper.Arrow width={10} height={4} style={{ fill: color }} offset={20} />
                  </Popper.Content>
                </FocusScope>
              </DismissableLayer>
            </Portal.Root>
          </ScrollContainer>
        </FocusGuards.Root>
      ) : null}
    </Popper.Root>
  );
}

export const InPopupWindow = () => {
  const handlePopupClick = React.useCallback(() => {
    const popupWindow = window.open(undefined, undefined, 'width=300,height=300,top=100,left=100');
    if (!popupWindow) {
      console.error('Failed to open popup window, check your popup blocker settings');
      return;
    }

    const containerNode = popupWindow.document.createElement('div');
    popupWindow.document.body.append(containerNode);

    ReactDOM.createRoot(containerNode).render(<DismissableBox />);
  }, []);
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center' }}>
      <button onClick={handlePopupClick}>Open Popup</button>
    </div>
  );
};
