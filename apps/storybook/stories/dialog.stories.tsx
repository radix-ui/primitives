import * as React from 'react';
import { Dialog } from 'radix-ui';
import styles from './dialog.stories.module.css';

export default { title: 'Components/Dialog' };

export const Styled = () => (
  <Dialog.Root>
    <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={styles.contentDefault}>
        <Dialog.Title>Booking info</Dialog.Title>
        <Dialog.Description>Please enter the info for your booking below.</Dialog.Description>
        <Dialog.Close className={styles.close}>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export const NonModal = () => (
  <>
    <Dialog.Root modal={false}>
      <Dialog.Trigger className={styles.trigger}>open (non-modal)</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={[styles.contentDefault, styles.contentSheet].join(' ')}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <Dialog.Title>Booking info</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
          <Dialog.Close className={styles.close}>close</Dialog.Close>
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
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.contentDefault}>
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
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.contentDefault}>
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
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content
            className={styles.contentDefault}
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
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content
        className={styles.contentDefault}
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
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content
        className={styles.contentDefault}
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
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content className={styles.contentDefault}>
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
      <Dialog.Overlay className={[styles.overlay, styles.animatedOverlay].join(' ')} />
      <Dialog.Content className={[styles.contentDefault, styles.animatedContent].join(' ')}>
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
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={styles.contentDefault}>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description>Description</Dialog.Description>
        <Dialog.Close>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export const InnerScrollable = () => (
  <Dialog.Root>
    <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content className={[styles.contentDefault, styles.contentScrollable].join(' ')}>
        <Dialog.Title>Booking info</Dialog.Title>
        <Dialog.Description>Please enter the info for your booking below.</Dialog.Description>
        <div style={{ backgroundColor: '#eee', height: 500 }} />
        <Dialog.Close className={styles.close}>close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export const OuterScrollable = () => (
  <Dialog.Root>
    <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
    <div style={{ backgroundColor: '#eee', width: 300, height: 1000 }} />
    <Dialog.Portal>
      <Dialog.Overlay className={[styles.overlay, styles.scrollableOverlay].join(' ')}>
        <Dialog.Content
          className={[styles.contentDefault, styles.contentInScrollableOverlay].join(' ')}
        >
          <Dialog.Title>Booking info</Dialog.Title>
          <Dialog.Description>Please enter the info for your booking below.</Dialog.Description>
          <div style={{ backgroundColor: '#eee', height: 500 }} />
          <Dialog.Close className={styles.close}>close</Dialog.Close>
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
          <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className={styles.overlay} />
            <Dialog.Content className={[styles.contentDefault, styles.chromaticContent].join(' ')}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={styles.close}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <h2>Open</h2>
        <Dialog.Root defaultOpen>
          <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay
              className={styles.overlay}
              style={{ left: 0, bottom: '50%', width: '25%' }}
            />
            <Dialog.Content className={styles.chromaticContent} style={{ top: '25%', left: '12%' }}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={styles.close}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div>
        <h1>Uncontrolled with reordered parts</h1>
        <h2>Closed</h2>
        <Dialog.Root>
          <Dialog.Portal>
            <Dialog.Overlay className={styles.overlay} />
            <Dialog.Content className={styles.chromaticContent}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={styles.close}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
          <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
        </Dialog.Root>

        <h2>Open</h2>
        <Dialog.Root defaultOpen>
          <Dialog.Portal>
            <Dialog.Overlay
              className={styles.overlay}
              style={{ left: '25%', bottom: '50%', width: '25%' }}
            />
            <Dialog.Content className={styles.chromaticContent} style={{ top: '25%', left: '37%' }}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={styles.close}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
          <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
        </Dialog.Root>
      </div>

      <div>
        <h1>Controlled</h1>
        <h2>Closed</h2>
        <Dialog.Root open={false}>
          <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className={styles.overlay} />
            <Dialog.Content className={styles.chromaticContent}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={styles.close}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <h2>Open</h2>
        <Dialog.Root open>
          <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay
              className={styles.overlay}
              style={{ left: '50%', bottom: '50%', width: '25%' }}
            />
            <Dialog.Content className={styles.chromaticContent} style={{ top: '25%', left: '62%' }}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={styles.close}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div>
        <h1>Controlled with reordered parts</h1>
        <h2>Closed</h2>
        <Dialog.Root open={false}>
          <Dialog.Portal>
            <Dialog.Overlay className={styles.overlay} />
            <Dialog.Content className={styles.chromaticContent}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={styles.close}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
          <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
        </Dialog.Root>

        <h2>Open</h2>
        <Dialog.Root open>
          <Dialog.Portal>
            <Dialog.Overlay
              className={styles.overlay}
              style={{ left: '75%', bottom: '50%', width: '25%' }}
            />
            <Dialog.Content className={styles.chromaticContent} style={{ top: '25%', left: '88%' }}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={styles.close}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
          <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
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
          <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
          <Dialog.Portal forceMount>
            <Dialog.Overlay
              className={styles.overlay}
              style={{
                top: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
            />
            <Dialog.Content className={styles.chromaticContent} style={{ left: '25%', top: '75%' }}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={styles.close}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div>
        <h1>State attributes</h1>
        <h2>Closed</h2>
        <Dialog.Root>
          <Dialog.Trigger className={styles.triggerAttr}>open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className={styles.overlayAttr} />
            <Dialog.Content className={[styles.chromaticContent, styles.contentAttr].join(' ')}>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={styles.closeAttr}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <h2>Open</h2>
        <Dialog.Root defaultOpen>
          <Dialog.Trigger className={styles.triggerAttr}>open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay
              className={[styles.overlay, styles.overlayAttr].join(' ')}
              style={{ left: '50%', top: '50%' }}
            />
            <Dialog.Content
              className={[styles.chromaticContent, styles.contentAttr].join(' ')}
              style={{ left: '75%', top: '75%' }}
            >
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
              <Dialog.Close className={styles.closeAttr}>close</Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

export const Cypress = () => {
  const [modal, setModal] = React.useState(true);
  const [animated, setAnimated] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [hasDestroyButton, setHasDestroyButton] = React.useState(true);

  return (
    <>
      <Dialog.Root modal={modal}>
        <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content
            className={[
              styles.contentDefault,
              animated && styles.animatedContent,
              animated && styles.duration50,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <Dialog.Title>title</Dialog.Title>
            <Dialog.Description>description</Dialog.Description>
            <Dialog.Close className={styles.close}>close</Dialog.Close>
            {hasDestroyButton && (
              <div>
                <button type="button" onClick={() => setHasDestroyButton(false)}>
                  destroy me
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <br />
      <br />

      <label>
        <input
          type="checkbox"
          checked={modal}
          onChange={(event) => setModal(Boolean(event.target.checked))}
        />{' '}
        modal
      </label>

      <br />

      <label>
        <input
          type="checkbox"
          checked={animated}
          onChange={(event) => setAnimated(Boolean(event.target.checked))}
        />{' '}
        animated
      </label>

      <br />

      <label>
        count up{' '}
        <button type="button" onClick={() => setCount((count) => count + 1)}>
          {count}
        </button>
      </label>

      <br />

      <label>
        name: <input type="text" placeholder="name" />
      </label>
    </>
  );
};
