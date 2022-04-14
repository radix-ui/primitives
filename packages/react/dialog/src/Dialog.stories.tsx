import * as React from 'react';
import { css, keyframes } from '../../../../stitches.config';
import * as Dialog from '@radix-ui/react-dialog';

export default { title: 'Components/Dialog' };

export const Styled = () => (
  <Dialog.Root>
    <Dialog.Trigger className={triggerClass()}>open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={overlayClass()} />
      <Dialog.Content className={contentDefaultClass()}>
        <Dialog.Title>Booking info</Dialog.Title>
        <Dialog.Description>Please enter the info for your booking below.</Dialog.Description>
        <Dialog.Close className={closeClass()}>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export const NonModal = () => (
  <>
    <Dialog.Root modal={false}>
      <Dialog.Trigger className={triggerClass()}>open (non-modal)</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={overlayClass()} />
        <Dialog.Content
          className={contentSheetClass()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <Dialog.Title>Booking info</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
          <Dialog.Close className={closeClass()}>close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>

    {Array.from({ length: 5 }, (_, i) => (
      <div key={i} style={{ marginTop: 20 }}>
        <textarea
          style={{ width: 800, height: 400 }}
          defaultValue="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat nobis at ipsa, nihil tempora debitis maxime dignissimos non amet, minima expedita alias et fugit voluptate laborum placeat odio dolore ab!"
        />
      </div>
    ))}
  </>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{open ? 'close' : 'open'}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={overlayClass()} />
        <Dialog.Content className={contentDefaultClass()}>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
          <Dialog.Close>close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const FocusTrap = () => (
  <>
    <Dialog.Root>
      <Dialog.Trigger>open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={overlayClass()} />
        <Dialog.Content className={contentDefaultClass()}>
          <Dialog.Close>close</Dialog.Close>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" placeholder="John" />

            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" placeholder="Doe" />

            <button type="submit">Send</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>

    <p>These elements can't be focused when the dialog is opened.</p>
    <button type="button">A button</button>
    <input type="text" placeholder="Another focusable element" />
  </>
);

export const CustomFocus = () => {
  const firstNameRef = React.useRef<HTMLInputElement>(null);
  const searchFieldRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger>open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={overlayClass()} />
          <Dialog.Content
            className={contentDefaultClass()}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              firstNameRef.current?.focus();
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              searchFieldRef.current?.focus();
            }}
          >
            <Dialog.Close>close</Dialog.Close>

            <div>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>
                The first name input will receive the focus after opening the dialog.
              </Dialog.Description>
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" placeholder="John" ref={firstNameRef} />

              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" placeholder="Doe" />

              <button type="submit">Send</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div>
        <p>The search input will receive the focus after closing the dialog.</p>
        <input type="text" placeholder="Search…" ref={searchFieldRef} />
      </div>
    </>
  );
};

export const NoEscapeDismiss = () => (
  <Dialog.Root>
    <Dialog.Trigger>open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={overlayClass()} />
      <Dialog.Content
        className={contentDefaultClass()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description>
          The first name input will receive the focus after opening the dialog.
        </Dialog.Description>
        <Dialog.Close>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export const NoPointerDownOutsideDismiss = () => (
  <Dialog.Root>
    <Dialog.Trigger>open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={overlayClass()} />
      <Dialog.Content
        className={contentDefaultClass()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description>Description</Dialog.Description>
        <Dialog.Close>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export const WithPortalContainer = () => {
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);
  return (
    <>
      <Dialog.Root>
        <Dialog.Trigger>open</Dialog.Trigger>
        <Dialog.Portal container={portalContainer}>
          <Dialog.Overlay className={overlayClass()} />
          <Dialog.Content className={contentDefaultClass()}>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Description>Description</Dialog.Description>
            <Dialog.Close>close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div data-portal-container="" ref={setPortalContainer} />
    </>
  );
};

export const Animated = () => (
  <Dialog.Root>
    <Dialog.Trigger>open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={animatedOverlayClass()} />
      <Dialog.Content className={animatedContentClass()}>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description>Description</Dialog.Description>
        <Dialog.Close>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export const ForcedMount = () => (
  <Dialog.Root>
    <Dialog.Trigger>open</Dialog.Trigger>
    <Dialog.Portal forceMount>
      <Dialog.Overlay className={overlayClass()} />
      <Dialog.Content className={contentDefaultClass()}>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description>Description</Dialog.Description>
        <Dialog.Close>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export const AllowPinchZoom = () => (
  <div style={{ display: 'grid', placeItems: 'center', height: '200vh' }}>
    <Dialog.Root allowPinchZoom>
      <Dialog.Trigger className={triggerClass()}>open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={overlayClass()} />
        <Dialog.Content className={contentDefaultClass()}>
          <Dialog.Title>Booking info</Dialog.Title>
          <Dialog.Description>Please enter the info for your booking below.</Dialog.Description>
          <Dialog.Close className={closeClass()}>close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
);

export const InnerScrollable = () => (
  <Dialog.Root>
    <Dialog.Trigger className={triggerClass()}>open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={overlayClass()} />
      <Dialog.Content className={contentScrollableClass()}>
        <Dialog.Title>Booking info</Dialog.Title>
        <Dialog.Description>Please enter the info for your booking below.</Dialog.Description>
        <div style={{ backgroundColor: '#eee', height: 500 }} />
        <Dialog.Close className={closeClass()}>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export const OuterScrollable = () => (
  <Dialog.Root>
    <Dialog.Trigger className={triggerClass()}>open</Dialog.Trigger>
    <div style={{ backgroundColor: '#eee', width: 300, height: 1000 }} />
    <Dialog.Portal>
      <Dialog.Overlay className={scrollableOverlayClass()}>
        <Dialog.Content className={contentInScrollableOverlayClass()}>
          <Dialog.Title>Booking info</Dialog.Title>
          <Dialog.Description>Please enter the info for your booking below.</Dialog.Description>
          <div style={{ backgroundColor: '#eee', height: 500 }} />
          <Dialog.Close className={closeClass()}>close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Overlay>
    </Dialog.Portal>
  </Dialog.Root>
);

export const Chromatic = () => (
  <>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        height: '50vh',
      }}
    >
      <div>
        <h1>Uncontrolled</h1>
        <h2>Closed</h2>
        <Dialog.Root>
          <Dialog.Trigger className={triggerClass()}>open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className={overlayClass()} />
            <Dialog.Content className={chromaticContentClass()}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={closeClass()}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <h2>Open</h2>
        <Dialog.Root defaultOpen>
          <Dialog.Trigger className={triggerClass()}>open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay
              className={overlayClass()}
              style={{ left: 0, bottom: '50%', width: '25%' }}
            />
            <Dialog.Content className={chromaticContentClass()} style={{ top: '25%', left: '12%' }}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={closeClass()}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div>
        <h1>Uncontrolled with reordered parts</h1>
        <h2>Closed</h2>
        <Dialog.Root>
          <Dialog.Portal>
            <Dialog.Overlay className={overlayClass()} />
            <Dialog.Content className={chromaticContentClass()}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={closeClass()}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
          <Dialog.Trigger className={triggerClass()}>open</Dialog.Trigger>
        </Dialog.Root>

        <h2>Open</h2>
        <Dialog.Root defaultOpen>
          <Dialog.Portal>
            <Dialog.Overlay
              className={overlayClass()}
              style={{ left: '25%', bottom: '50%', width: '25%' }}
            />
            <Dialog.Content className={chromaticContentClass()} style={{ top: '25%', left: '37%' }}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={closeClass()}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
          <Dialog.Trigger className={triggerClass()}>open</Dialog.Trigger>
        </Dialog.Root>
      </div>

      <div>
        <h1>Controlled</h1>
        <h2>Closed</h2>
        <Dialog.Root open={false}>
          <Dialog.Trigger className={triggerClass()}>open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className={overlayClass()} />
            <Dialog.Content className={chromaticContentClass()}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={closeClass()}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <h2>Open</h2>
        <Dialog.Root open>
          <Dialog.Trigger className={triggerClass()}>open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay
              className={overlayClass()}
              style={{ left: '50%', bottom: '50%', width: '25%' }}
            />
            <Dialog.Content className={chromaticContentClass()} style={{ top: '25%', left: '62%' }}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={closeClass()}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div>
        <h1>Controlled with reordered parts</h1>
        <h2>Closed</h2>
        <Dialog.Root open={false}>
          <Dialog.Portal>
            <Dialog.Overlay className={overlayClass()} />
            <Dialog.Content className={chromaticContentClass()}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={closeClass()}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
          <Dialog.Trigger className={triggerClass()}>open</Dialog.Trigger>
        </Dialog.Root>

        <h2>Open</h2>
        <Dialog.Root open>
          <Dialog.Portal>
            <Dialog.Overlay
              className={overlayClass()}
              style={{ left: '75%', bottom: '50%', width: '25%' }}
            />
            <Dialog.Content className={chromaticContentClass()} style={{ top: '25%', left: '88%' }}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={closeClass()}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
          <Dialog.Trigger className={triggerClass()}>open</Dialog.Trigger>
        </Dialog.Root>
      </div>
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        height: '50vh',
      }}
    >
      <div>
        <h1>Forced mount</h1>
        <Dialog.Root>
          <Dialog.Trigger className={triggerClass()}>open</Dialog.Trigger>
          <Dialog.Portal forceMount>
            <Dialog.Overlay
              className={overlayClass()}
              style={{
                top: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
            />
            <Dialog.Content className={chromaticContentClass()} style={{ left: '25%', top: '75%' }}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={closeClass()}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div>
        <h1>State attributes</h1>
        <h2>Closed</h2>
        <Dialog.Root>
          <Dialog.Trigger className={triggerAttrClass()}>open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className={overlayAttrClass()} />
            <Dialog.Content className={contentAttrClass()}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={closeAttrClass()}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <h2>Open</h2>
        <Dialog.Root defaultOpen>
          <Dialog.Trigger className={triggerAttrClass()}>open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className={overlayAttrClass()} style={{ left: '50%', top: '50%' }} />
            <Dialog.Content className={contentAttrClass()} style={{ left: '75%', top: '75%' }}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={closeAttrClass()}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

const triggerClass = css({});

const RECOMMENDED_CSS__DIALOG__OVERLAY: any = {
  // ensures overlay is positioned correctly
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const overlayClass = css({
  ...RECOMMENDED_CSS__DIALOG__OVERLAY,
  backgroundColor: 'rgba(0,0,0,0.2)',
});

const scrollableOverlayClass = css(overlayClass, {
  overflow: 'auto',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
});

const RECOMMENDED_CSS__DIALOG__CONTENT: any = {
  // ensures good default position for content
  position: 'fixed',
  top: 0,
  left: 0,
};

const contentStyles = css({
  minWidth: 300,
  minHeight: 150,
  padding: 50,
  borderRadius: 10,
  backgroundColor: 'white',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
});

const contentDefaultClass = css(contentStyles, {
  ...RECOMMENDED_CSS__DIALOG__CONTENT,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

const contentScrollableClass = css(contentDefaultClass, {
  overflow: 'auto',
  maxHeight: 300,
});

const contentInScrollableOverlayClass = css(contentStyles, {
  marginTop: 50,
  marginBottom: 50,
});

const contentSheetClass = css(contentStyles, {
  ...RECOMMENDED_CSS__DIALOG__CONTENT,
  left: undefined,
  right: 0,
  minWidth: 300,
  minHeight: '100vh',
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
});

const closeClass = css({});

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const scaleIn = keyframes({
  from: { transform: 'translate(-50%, -50%) scale(0.75)' },
  to: { transform: 'translate(-50%, -50%) scale(1)' },
});

const animatedOverlayClass = css(overlayClass, {
  '&[data-state="open"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});

const animatedContentClass = css(contentDefaultClass, {
  '&[data-state="open"]': {
    animation: `${fadeIn} 150ms ease-out, ${scaleIn} 200ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});

const chromaticContentClass = css(contentDefaultClass, {
  padding: 10,
  minWidth: 'auto',
  minHeight: 'auto',
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '&[data-state="closed"]': { borderColor: 'red' },
  '&[data-state="open"]': { borderColor: 'green' },
};
const triggerAttrClass = css(styles);
const overlayAttrClass = css(overlayClass, styles);
const contentAttrClass = css(chromaticContentClass, styles);
const closeAttrClass = css(styles);
