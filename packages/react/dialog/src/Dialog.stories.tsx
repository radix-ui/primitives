import * as React from 'react';
import { Dialog, styles } from './Dialog';

import type { DialogContentProps } from './Dialog';

export default { title: 'Dialog' };

export const Basic = () => (
  <Dialog>
    <Dialog.Trigger style={styles.trigger}>open</Dialog.Trigger>
    <Dialog.Overlay style={styles.overlay} />
    <Dialog.Content style={styles.content}>
      <Dialog.Close style={styles.close}>close</Dialog.Close>
    </Dialog.Content>
  </Dialog>
);

export const InlineStyle = () => (
  <Dialog>
    <Dialog.Trigger>open</Dialog.Trigger>
    <Dialog.Overlay style={{ ...styles.overlay, backgroundColor: 'black', opacity: 0.2 }} />
    <Dialog.Content
      style={{
        ...styles.content,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        minWidth: 500,
        minHeight: 300,
        padding: 50,
        borderRadius: 10,
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
      }}
    >
      <Dialog.Close>close</Dialog.Close>
    </Dialog.Content>
  </Dialog>
);

export const Controlled = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Dialog isOpen={isOpen} onIsOpenChange={setIsOpen}>
      <Dialog.Trigger>{isOpen ? 'close' : 'open'}</Dialog.Trigger>
      <Dialog.Overlay style={{ ...styles.overlay, backgroundColor: 'black', opacity: 0.2 }} />
      <Dialog.Content as={Content}>
        <Dialog.Close>close</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  );
};

export const FocusTrap = () => (
  <>
    <Dialog>
      <Dialog.Trigger>open</Dialog.Trigger>
      <Dialog.Overlay style={{ ...styles.overlay, backgroundColor: 'black', opacity: 0.2 }} />
      <Dialog.Content as={Content}>
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
        <Dialog.Overlay style={{ ...styles.overlay, backgroundColor: 'black', opacity: 0.2 }} />
        <Dialog.Content
          as={Content}
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
    <Dialog.Overlay style={{ ...styles.overlay, backgroundColor: 'black', opacity: 0.2 }} />
    <Dialog.Content as={Content} onEscapeKeyDown={(event) => event.preventDefault()}>
      <Dialog.Close>close</Dialog.Close>
    </Dialog.Content>
  </Dialog>
);

export const NoInteractOutsideDismiss = () => (
  <Dialog>
    <Dialog.Trigger>open</Dialog.Trigger>
    <Dialog.Overlay style={{ ...styles.overlay, backgroundColor: 'black', opacity: 0.2 }} />
    <Dialog.Content as={Content} onPointerDownOutside={(event) => event.preventDefault()}>
      <Dialog.Close>close</Dialog.Close>
    </Dialog.Content>
  </Dialog>
);

const Content = React.forwardRef<HTMLDivElement, DialogContentProps>(function Content(
  props,
  forwardedRef
) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      style={{
        ...styles.content,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        minWidth: 500,
        minHeight: 300,
        padding: 50,
        borderRadius: 10,
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)',
        ...props.style,
      }}
    />
  );
});
