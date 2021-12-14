import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from './Dialog';
import { css } from '../../../../stitches.config';

export default { title: 'Components/Dialog' };

export const Styled = () => (
  <Dialog>
    <DialogTrigger className={triggerClass}>open</DialogTrigger>
    <DialogPortal>
      <DialogOverlay className={overlayClass} />
      <DialogContent className={contentDefaultClass}>
        <DialogTitle>Booking info</DialogTitle>
        <DialogDescription>Please enter the info for your booking below.</DialogDescription>
        <DialogClose className={closeClass}>close</DialogClose>
      </DialogContent>
    </DialogPortal>
  </Dialog>
);

export const NonModal = () => (
  <>
    <Dialog modal={false}>
      <DialogTrigger className={triggerClass}>open (non-modal)</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className={overlayClass} />
        <DialogContent
          className={contentSheetClass}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogTitle>Booking info</DialogTitle>
          <DialogClose className={closeClass}>close</DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{open ? 'close' : 'open'}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className={overlayClass} />
        <DialogContent className={contentDefaultClass}>
          <DialogTitle>Title</DialogTitle>
          <DialogClose>close</DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export const FocusTrap = () => (
  <>
    <Dialog>
      <DialogTrigger>open</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className={overlayClass} />
        <DialogContent className={contentDefaultClass}>
          <DialogClose>close</DialogClose>
          <DialogTitle>Title</DialogTitle>
          <div>
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" placeholder="John" />

            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" placeholder="Doe" />

            <button type="submit">Send</button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>

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
      <Dialog>
        <DialogTrigger>open</DialogTrigger>
        <DialogPortal>
          <DialogOverlay className={overlayClass} />
          <DialogContent
            className={contentDefaultClass}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              firstNameRef.current?.focus();
            }}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              searchFieldRef.current?.focus();
            }}
          >
            <DialogClose>close</DialogClose>

            <div>
              <DialogTitle>Title</DialogTitle>
              <p>The first name input will receive the focus after opening the dialog.</p>
              <label htmlFor="firstName">First Name</label>
              <input type="text" id="firstName" placeholder="John" ref={firstNameRef} />

              <label htmlFor="lastName">Last Name</label>
              <input type="text" id="lastName" placeholder="Doe" />

              <button type="submit">Send</button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <div>
        <p>The search input will receive the focus after closing the dialog.</p>
        <input type="text" placeholder="Search…" ref={searchFieldRef} />
      </div>
    </>
  );
};

export const NoEscapeDismiss = () => (
  <Dialog>
    <DialogTrigger>open</DialogTrigger>
    <DialogPortal>
      <DialogOverlay className={overlayClass} />
      <DialogContent
        className={contentDefaultClass}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogTitle>Title</DialogTitle>
        <DialogClose>close</DialogClose>
      </DialogContent>
    </DialogPortal>
  </Dialog>
);

export const NoPointerDownOutsideDismiss = () => (
  <Dialog>
    <DialogTrigger>open</DialogTrigger>
    <DialogPortal>
      <DialogOverlay className={overlayClass} />
      <DialogContent
        className={contentDefaultClass}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogTitle>Title</DialogTitle>
        <DialogClose>close</DialogClose>
      </DialogContent>
    </DialogPortal>
  </Dialog>
);

export const WithPortalContainer = () => {
  const [portalContainer, setPortalContainer] = React.useState<HTMLDivElement | null>(null);
  return (
    <>
      <Dialog>
        <DialogTrigger>open</DialogTrigger>
        <DialogPortal container={portalContainer}>
          <DialogOverlay className={overlayClass} />
          <DialogContent className={contentDefaultClass}>
            <DialogTitle>Title</DialogTitle>
            <DialogClose>close</DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <div data-portal-container="" ref={setPortalContainer} />
    </>
  );
};

export const Animated = () => (
  <Dialog>
    <DialogTrigger>open</DialogTrigger>
    <DialogPortal>
      <DialogOverlay className={animatedOverlayClass} />
      <DialogContent className={animatedContentClass}>
        <DialogTitle>Title</DialogTitle>
        <DialogClose>close</DialogClose>
      </DialogContent>
    </DialogPortal>
  </Dialog>
);

export const ForcedMount = () => (
  <Dialog>
    <DialogTrigger>open</DialogTrigger>
    <DialogPortal>
      <DialogOverlay className={overlayClass} forceMount />
      <DialogContent className={contentDefaultClass} forceMount>
        <DialogTitle>Title</DialogTitle>
        <DialogClose>close</DialogClose>
      </DialogContent>
    </DialogPortal>
  </Dialog>
);

export const AllowPinchZoom = () => (
  <div style={{ display: 'grid', placeItems: 'center', height: '200vh' }}>
    <Dialog allowPinchZoom>
      <DialogTrigger className={triggerClass}>open</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className={overlayClass} />
        <DialogContent className={contentDefaultClass}>
          <DialogTitle>Booking info</DialogTitle>
          <DialogDescription>Please enter the info for your booking below.</DialogDescription>
          <DialogClose className={closeClass}>close</DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </div>
);

export const InnerScrollable = () => (
  <Dialog>
    <DialogTrigger className={triggerClass}>open</DialogTrigger>
    <DialogPortal>
      <DialogOverlay className={overlayClass} />
      <DialogContent className={contentScrollableClass}>
        <DialogTitle>Booking info</DialogTitle>
        <DialogDescription>Please enter the info for your booking below.</DialogDescription>
        <div style={{ backgroundColor: '#eee', height: 500 }} />
        <DialogClose className={closeClass}>close</DialogClose>
      </DialogContent>
    </DialogPortal>
  </Dialog>
);

export const OuterScrollable = () => (
  <Dialog>
    <DialogTrigger className={triggerClass}>open</DialogTrigger>
    <div style={{ backgroundColor: '#eee', width: 300, height: 1000 }} />
    <DialogPortal>
      <DialogOverlay className={scrollableOverlayClass}>
        <DialogContent className={contentInScrollableOverlayClass}>
          <DialogTitle>Booking info</DialogTitle>
          <DialogDescription>Please enter the info for your booking below.</DialogDescription>
          <div style={{ backgroundColor: '#eee', height: 500 }} />
          <DialogClose className={closeClass}>close</DialogClose>
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </Dialog>
);

export const Chromatic = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gridTemplateRows: 'repeat(2, 1fr)',
      height: '100vh',
    }}
  >
    <div>
      <h1>Uncontrolled</h1>
      <h2>Closed</h2>
      <Dialog>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
        <DialogPortal>
          <DialogOverlay className={overlayClass} />
          <DialogContent className={chromaticContentClass}>
            <DialogTitle>Title</DialogTitle>
            <DialogClose className={closeClass}>close</DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <h2>Open</h2>
      <Dialog defaultOpen>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
        <DialogPortal>
          <DialogOverlay
            className={overlayClass}
            style={{ left: 0, bottom: '50%', width: '25%' }}
          />
          <DialogContent className={chromaticContentClass} style={{ top: '25%', left: '12%' }}>
            <DialogTitle>Title</DialogTitle>
            <DialogClose className={closeClass}>close</DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>

    <div>
      <h1>Uncontrolled with reordered parts</h1>
      <h2>Closed</h2>
      <Dialog>
        <DialogPortal>
          <DialogOverlay className={overlayClass} />
          <DialogContent className={chromaticContentClass}>
            <DialogTitle>Title</DialogTitle>
            <DialogClose className={closeClass}>close</DialogClose>
          </DialogContent>
        </DialogPortal>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
      </Dialog>

      <h2>Open</h2>
      <Dialog defaultOpen>
        <DialogPortal>
          <DialogOverlay
            className={overlayClass}
            style={{ left: '25%', bottom: '50%', width: '25%' }}
          />
          <DialogContent className={chromaticContentClass} style={{ top: '25%', left: '37%' }}>
            <DialogTitle>Title</DialogTitle>
            <DialogClose className={closeClass}>close</DialogClose>
          </DialogContent>
        </DialogPortal>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
      </Dialog>
    </div>

    <div>
      <h1>Controlled</h1>
      <h2>Closed</h2>
      <Dialog open={false}>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
        <DialogPortal>
          <DialogOverlay className={overlayClass} />
          <DialogContent className={chromaticContentClass}>
            <DialogTitle>Title</DialogTitle>
            <DialogClose className={closeClass}>close</DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <h2>Open</h2>
      <Dialog open>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
        <DialogPortal>
          <DialogOverlay
            className={overlayClass}
            style={{ left: '50%', bottom: '50%', width: '25%' }}
          />
          <DialogContent className={chromaticContentClass} style={{ top: '25%', left: '62%' }}>
            <DialogTitle>Title</DialogTitle>
            <DialogClose className={closeClass}>close</DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>

    <div>
      <h1>Controlled with reordered parts</h1>
      <h2>Closed</h2>
      <Dialog open={false}>
        <DialogPortal>
          <DialogOverlay className={overlayClass} />
          <DialogContent className={chromaticContentClass}>
            <DialogTitle>Title</DialogTitle>
            <DialogClose className={closeClass}>close</DialogClose>
          </DialogContent>
        </DialogPortal>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
      </Dialog>

      <h2>Open</h2>
      <Dialog open>
        <DialogPortal>
          <DialogOverlay
            className={overlayClass}
            style={{ left: '75%', bottom: '50%', width: '25%' }}
          />
          <DialogContent className={chromaticContentClass} style={{ top: '25%', left: '88%' }}>
            <DialogTitle>Title</DialogTitle>
            <DialogClose className={closeClass}>close</DialogClose>
          </DialogContent>
        </DialogPortal>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
      </Dialog>
    </div>

    <div>
      <h1>State attributes</h1>
      <h2>Closed</h2>
      <Dialog>
        <DialogTrigger className={triggerAttrClass}>open</DialogTrigger>
        <DialogPortal>
          <DialogOverlay className={overlayAttrClass} />
          <DialogContent className={contentAttrClass}>
            <DialogTitle>Title</DialogTitle>
            <DialogClose className={closeAttrClass}>close</DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <h2>Open</h2>
      <Dialog defaultOpen>
        <DialogTrigger className={triggerAttrClass}>open</DialogTrigger>
        <DialogPortal>
          <DialogOverlay className={overlayAttrClass} style={{ top: '50%' }} />
          <DialogContent className={contentAttrClass} style={{ top: '75%' }}>
            <DialogTitle>Title</DialogTitle>
            <DialogClose className={closeAttrClass}>close</DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  </div>
);
Chromatic.parameters = { chromatic: { disable: false } };

const triggerClass = css({});

const RECOMMENDED_CSS__DIALOG__OVERLAY: any = {
  // ensures overlay is positionned correctly
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

const fadeIn = css.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = css.keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const scaleIn = css.keyframes({
  from: { transform: 'translate(-50%, -50%) scale(0)' },
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
    animation: `${fadeIn} ${scaleIn} 300ms ease-out`,
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
