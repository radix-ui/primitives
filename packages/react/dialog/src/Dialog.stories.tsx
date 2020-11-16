import * as React from 'react';
import { Dialog } from './Dialog';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/Dialog' };

export const Styled = () => (
  <Dialog>
    <Dialog.Trigger as={StyledTrigger}>open</Dialog.Trigger>
    <Dialog.Overlay as={StyledOverlay} />
    <Dialog.Content as={StyledContent}>
      <Dialog.Close as={StyledClose}>close</Dialog.Close>
    </Dialog.Content>
  </Dialog>
);

export const Controlled = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dialog isOpen={isOpen} onIsOpenChange={setIsOpen}>
      <Dialog.Trigger>{isOpen ? 'close' : 'open'}</Dialog.Trigger>
      <Dialog.Overlay as={StyledOverlay} />
      <Dialog.Content as={StyledContent}>
        <Dialog.Close>close</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  );
};

export const FocusTrap = () => (
  <>
    <Dialog>
      <Dialog.Trigger>open</Dialog.Trigger>
      <Dialog.Overlay as={StyledOverlay} />
      <Dialog.Content as={StyledContent}>
        <Dialog.Close>close</Dialog.Close>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" placeholder="John" />

          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" placeholder="Doe" />

          <button type="submit">Send</button>
        </div>
      </Dialog.Content>
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
        <Dialog.Trigger>open</Dialog.Trigger>
        <Dialog.Overlay as={StyledOverlay} />
        <Dialog.Content
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
          <Dialog.Close>close</Dialog.Close>

          <div>
            <p>The first name input will receive the focus after opening the dialog.</p>
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" placeholder="John" ref={firstNameRef} />

            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" placeholder="Doe" />

            <button type="submit">Send</button>
          </div>
        </Dialog.Content>
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
    <Dialog.Trigger>open</Dialog.Trigger>
    <Dialog.Overlay as={StyledOverlay} />
    <Dialog.Content as={StyledContent} onEscapeKeyDown={(event) => event.preventDefault()}>
      <Dialog.Close>close</Dialog.Close>
    </Dialog.Content>
  </Dialog>
);

export const NoInteractOutsideDismiss = () => (
  <Dialog>
    <Dialog.Trigger>open</Dialog.Trigger>
    <Dialog.Overlay as={StyledOverlay} />
    <Dialog.Content as={StyledContent} onPointerDownOutside={(event) => event.preventDefault()}>
      <Dialog.Close>close</Dialog.Close>
    </Dialog.Content>
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
  backgroundColor: 'black',
  opacity: 0.2,
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
