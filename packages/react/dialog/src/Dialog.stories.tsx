import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
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
    <DialogOverlay className={overlayClass} />
    <DialogContent className={contentClass}>
      <DialogTitle>Booking info</DialogTitle>
      <DialogDescription>Please enter the info for your booking below.</DialogDescription>
      <DialogClose className={closeClass}>close</DialogClose>
    </DialogContent>
  </Dialog>
);

export const NonModal = () => (
  <>
    <Dialog modal={false}>
      <DialogTrigger className={triggerClass}>open (non-modal)</DialogTrigger>
      <DialogOverlay className={overlayClass} />
      <DialogContent
        className={contentSheetClass}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogTitle>Booking info</DialogTitle>
        <DialogClose className={closeClass}>close</DialogClose>
      </DialogContent>
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
      <DialogOverlay className={overlayClass} />
      <DialogContent className={contentClass}>
        <DialogTitle>Title</DialogTitle>
        <DialogClose>close</DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export const FocusTrap = () => (
  <>
    <Dialog>
      <DialogTrigger>open</DialogTrigger>
      <DialogOverlay className={overlayClass} />
      <DialogContent className={contentClass}>
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
        <DialogOverlay className={overlayClass} />
        <DialogContent
          className={contentClass}
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
    <DialogOverlay className={overlayClass} />
    <DialogContent className={contentClass} onEscapeKeyDown={(event) => event.preventDefault()}>
      <DialogTitle>Title</DialogTitle>
      <DialogClose>close</DialogClose>
    </DialogContent>
  </Dialog>
);

export const NoPointerDownOutsideDismiss = () => (
  <Dialog>
    <DialogTrigger>open</DialogTrigger>
    <DialogOverlay className={overlayClass} />
    <DialogContent
      className={contentClass}
      onPointerDownOutside={(event) => event.preventDefault()}
    >
      <DialogTitle>Title</DialogTitle>
      <DialogClose>close</DialogClose>
    </DialogContent>
  </Dialog>
);

export const Animated = () => (
  <Dialog>
    <DialogTrigger>open</DialogTrigger>
    <DialogOverlay className={animatedOverlayClass} />
    <DialogContent className={animatedContentClass}>
      <DialogTitle>Title</DialogTitle>
      <DialogClose>close</DialogClose>
    </DialogContent>
  </Dialog>
);

export const ForcedMount = () => (
  <Dialog>
    <DialogTrigger>open</DialogTrigger>
    <DialogOverlay className={overlayClass} forceMount />
    <DialogContent className={contentClass} forceMount>
      <DialogTitle>Title</DialogTitle>
      <DialogClose>close</DialogClose>
    </DialogContent>
  </Dialog>
);

export const AllowPinchZoom = () => (
  <div style={{ display: 'grid', placeItems: 'center', height: '200vh' }}>
    <Dialog>
      <DialogTrigger className={triggerClass}>open</DialogTrigger>
      <DialogOverlay className={overlayClass} />
      <DialogContent className={contentClass} allowPinchZoom>
        <DialogTitle>Booking info</DialogTitle>
        <DialogDescription>Please enter the info for your booking below.</DialogDescription>
        <DialogClose className={closeClass}>close</DialogClose>
      </DialogContent>
    </Dialog>
  </div>
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
        <DialogOverlay className={overlayClass} />
        <DialogContent className={chromaticContentClass}>
          <DialogTitle>Title</DialogTitle>
          <DialogClose className={closeClass}>close</DialogClose>
        </DialogContent>
      </Dialog>

      <h2>Open</h2>
      <Dialog defaultOpen>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
        <DialogOverlay className={overlayClass} style={{ left: 0, bottom: '50%', width: '25%' }} />
        <DialogContent className={chromaticContentClass} style={{ top: '25%', left: '12%' }}>
          <DialogTitle>Title</DialogTitle>
          <DialogClose className={closeClass}>close</DialogClose>
        </DialogContent>
      </Dialog>
    </div>

    <div>
      <h1>Uncontrolled with reordered parts</h1>
      <h2>Closed</h2>
      <Dialog>
        <DialogOverlay className={overlayClass} />
        <DialogContent className={chromaticContentClass}>
          <DialogTitle>Title</DialogTitle>
          <DialogClose className={closeClass}>close</DialogClose>
        </DialogContent>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
      </Dialog>

      <h2>Open</h2>
      <Dialog defaultOpen>
        <DialogOverlay
          className={overlayClass}
          style={{ left: '25%', bottom: '50%', width: '25%' }}
        />
        <DialogContent className={chromaticContentClass} style={{ top: '25%', left: '37%' }}>
          <DialogTitle>Title</DialogTitle>
          <DialogClose className={closeClass}>close</DialogClose>
        </DialogContent>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
      </Dialog>
    </div>

    <div>
      <h1>Controlled</h1>
      <h2>Closed</h2>
      <Dialog open={false}>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
        <DialogOverlay className={overlayClass} />
        <DialogContent className={chromaticContentClass}>
          <DialogTitle>Title</DialogTitle>
          <DialogClose className={closeClass}>close</DialogClose>
        </DialogContent>
      </Dialog>

      <h2>Open</h2>
      <Dialog open>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
        <DialogOverlay
          className={overlayClass}
          style={{ left: '50%', bottom: '50%', width: '25%' }}
        />
        <DialogContent className={chromaticContentClass} style={{ top: '25%', left: '62%' }}>
          <DialogTitle>Title</DialogTitle>
          <DialogClose className={closeClass}>close</DialogClose>
        </DialogContent>
      </Dialog>
    </div>

    <div>
      <h1>Controlled with reordered parts</h1>
      <h2>Closed</h2>
      <Dialog open={false}>
        <DialogOverlay className={overlayClass} />
        <DialogContent className={chromaticContentClass}>
          <DialogTitle>Title</DialogTitle>
          <DialogClose className={closeClass}>close</DialogClose>
        </DialogContent>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
      </Dialog>

      <h2>Open</h2>
      <Dialog open>
        <DialogOverlay
          className={overlayClass}
          style={{ left: '75%', bottom: '50%', width: '25%' }}
        />
        <DialogContent className={chromaticContentClass} style={{ top: '25%', left: '88%' }}>
          <DialogTitle>Title</DialogTitle>
          <DialogClose className={closeClass}>close</DialogClose>
        </DialogContent>
        <DialogTrigger className={triggerClass}>open</DialogTrigger>
      </Dialog>
    </div>

    <div>
      <h1>State attributes</h1>
      <h2>Closed</h2>
      <Dialog>
        <DialogTrigger className={triggerAttrClass}>open</DialogTrigger>
        <DialogOverlay className={overlayAttrClass} />
        <DialogContent className={contentAttrClass}>
          <DialogTitle>Title</DialogTitle>
          <DialogClose className={closeAttrClass}>close</DialogClose>
        </DialogContent>
      </Dialog>

      <h2>Open</h2>
      <Dialog defaultOpen>
        <DialogTrigger className={triggerAttrClass}>open</DialogTrigger>
        <DialogOverlay className={overlayAttrClass} style={{ top: '50%' }} />
        <DialogContent className={contentAttrClass} style={{ top: '75%' }}>
          <DialogTitle>Title</DialogTitle>
          <DialogClose className={closeAttrClass}>close</DialogClose>
        </DialogContent>
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

const RECOMMENDED_CSS__DIALOG__CONTENT: any = {
  // ensures good default position for content
  position: 'fixed',
  top: 0,
  left: 0,
};

const contentClass = css({
  ...RECOMMENDED_CSS__DIALOG__CONTENT,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 300,
  minHeight: 150,
  padding: 50,
  borderRadius: 10,
  backgroundColor: 'white',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
});

const contentSheetClass = css({
  ...RECOMMENDED_CSS__DIALOG__CONTENT,
  left: undefined,
  right: 0,
  minWidth: 300,
  minHeight: '100vh',
  padding: 50,
  borderTopLeftRadius: 10,
  borderBottomLeftRadius: 10,
  backgroundColor: 'white',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
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

const animatedOverlayClass = css(overlayClass, {
  '&[data-state="open"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});

const animatedContentClass = css(contentClass, {
  '&[data-state="open"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});

const chromaticContentClass = css(contentClass, {
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
