import * as React from 'react';
import { Dialog, DialogTrigger, DialogOverlay, DialogContent, DialogClose } from './Dialog';
import { styled, css } from '../../../../stitches.config';

export default { title: 'Components/Dialog' };

export const Styled = () => (
  <Dialog>
    <DialogTrigger as={StyledTrigger}>open</DialogTrigger>
    <DialogOverlay as={StyledOverlay} />
    <DialogContent as={StyledContent}>
      <DialogClose as={StyledClose}>close</DialogClose>
    </DialogContent>
  </Dialog>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{open ? 'close' : 'open'}</DialogTrigger>
      <DialogOverlay as={StyledOverlay} />
      <DialogContent as={StyledContent}>
        <DialogClose>close</DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export const FocusTrap = () => (
  <>
    <Dialog>
      <DialogTrigger>open</DialogTrigger>
      <DialogOverlay as={StyledOverlay} />
      <DialogContent as={StyledContent}>
        <DialogClose>close</DialogClose>
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
        <DialogOverlay as={StyledOverlay} />
        <DialogContent
          as={StyledContent}
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
    <DialogOverlay as={StyledOverlay} />
    <DialogContent as={StyledContent} onEscapeKeyDown={(event) => event.preventDefault()}>
      <DialogClose>close</DialogClose>
    </DialogContent>
  </Dialog>
);

export const NoInteractOutsideDismiss = () => (
  <Dialog>
    <DialogTrigger>open</DialogTrigger>
    <DialogOverlay as={StyledOverlay} />
    <DialogContent as={StyledContent} onPointerDownOutside={(event) => event.preventDefault()}>
      <DialogClose>close</DialogClose>
    </DialogContent>
  </Dialog>
);

export const Animated = () => (
  <Dialog>
    <DialogTrigger>open</DialogTrigger>
    <DialogOverlay as={AnimatedOverlay} />
    <DialogContent as={AnimatedContent}>
      <DialogClose>close</DialogClose>
    </DialogContent>
  </Dialog>
);

export const ForcedMount = () => (
  <Dialog>
    <DialogTrigger>open</DialogTrigger>
    <DialogOverlay as={StyledOverlay} forceMount />
    <DialogContent as={StyledContent} forceMount>
      <DialogClose>close</DialogClose>
    </DialogContent>
  </Dialog>
);

const StyledTrigger = styled('button', {});

const RECOMMENDED_CSS__DIALOG__OVERLAY: any = {
  // ensures overlay is positionned correctly
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const StyledOverlay = styled('div', {
  ...RECOMMENDED_CSS__DIALOG__OVERLAY,
  backgroundColor: 'rgba(0,0,0,0.2)',
});

const RECOMMENDED_CSS__DIALOG__CONTENT: any = {
  // ensures good default position for content
  position: 'fixed',
  top: 0,
  left: 0,
};

const StyledContent = styled('div', {
  ...RECOMMENDED_CSS__DIALOG__CONTENT,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'white',
  minWidth: 300,
  minHeight: 150,
  padding: 50,
  borderRadius: 10,
  backgroundColor: 'white',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
});

const StyledClose = styled('button', {});

const fadeIn = css.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = css.keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const AnimatedOverlay = styled(StyledOverlay, {
  '&[data-state="open"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});

const AnimatedContent = styled(StyledContent, {
  '&[data-state="open"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});
