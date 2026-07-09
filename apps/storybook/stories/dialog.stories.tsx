import * as React from 'react';
import { Dialog } from 'radix-ui';
import * as DismissableLayer from 'radix-ui/unstable/dismissable-layer';
import Plot from 'react-plotly.js';
import styles from './dialog.stories.module.css';
import { ExternalOverlayTrigger } from './external-overlay';

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

export const EventPropagation = () => {
  const count = React.useRef(0);
  const [stopPropagation, setStopPropagation] = React.useState(true);
  return (
    <>
      <div
        style={{ padding: '2rem', border: '1px solid black' }}
        onClick={() => {
          count.current++;
          console.log(`clicked the card ${count.current} time${count.current === 1 ? '' : 's'}!`);
        }}
      >
        <Dialog.Root>
          <Dialog.Trigger onClick={(event) => event.stopPropagation()}>open</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay
              className={styles.overlay}
              onClick={(event) => {
                if (stopPropagation) {
                  event.stopPropagation();
                }
                console.log('clicked the dialog overlay!');
              }}
            />
            <Dialog.Content
              className={styles.contentDefault}
              onClick={(event) => {
                if (stopPropagation) {
                  event.stopPropagation();
                }
                console.log('clicked the dialog content!');
              }}
            >
              <ExternalOverlayTrigger />
              <Dialog.Close className={styles.close}>close</Dialog.Close>
              <InsideShadowSuggestion />
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>You can close me now!</Dialog.Description>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <button type="button" onClick={() => setStopPropagation(!stopPropagation)}>
        Stop propagation: {stopPropagation ? 'on' : 'off'}
      </button>
    </>
  );
};

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

const PLOTLY_DATA = (() => {
  const input =
    '2.50369 91.71 2.51547 91.63 2.527 91.52 2.53878 91.43 2.55057 91.35 2.562 91.26 2.57326 91.17 2.58504 91.08 2.59658 90.92 2.60804 90.6 2.61866 90.08 2.62966 89.23 2.63993 88.1 2.64733 86.95 2.65494 85.21 2.66066 83.2 2.66518 80.99 2.66876 78.7 2.67174 76.39 2.67428 74.04 2.67677 71.69 2.67934 69.34 2.68191 66.99 2.68423 64.63 2.68658 62.29 2.68912 59.97 2.69192 57.64 2.69461 55.29 2.69714 52.94 2.69954 50.58 2.70205 48.23 2.70433 45.86 2.70722 43.53 2.7118 41.37 2.71915 39.91 2.73023 40.8 2.73696 42.76 2.74244 44.9 2.74747 47.07 2.75272 49.23 2.75794 51.39 2.76318 53.53 2.76853 55.67 2.77407 57.75 2.77977 59.86 2.78543 61.97 2.79111 64.07 2.79665 66.2 2.80176 68.3 2.80694 70.44 2.81296 72.48 2.81979 74.43 2.82736 76.27 2.83561 77.88 2.84501 79.15 2.85567 80.13 2.86585 80.72 2.87725 81.06 2.889 81.23 2.90002 81.36 ';
  const values = input.split(' ');
  const x = [];
  const y = [];
  for (let i = 0; i < values.length; i += 2) {
    x.push(Number.parseFloat(values[i] ?? '0'));
    y.push(Number.parseFloat(values[i + 1] ?? '0'));
  }
  return [
    {
      x: x,
      y: y,
      mode: 'lines',
      type: 'scatter',
    },
  ];
})();

export const WithPlotly = () => {
  const layout = {
    xaxis: {
      rangeslider: {},
    },
    yaxis: {
      fixedrange: true,
    },
  };

  return (
    <DismissableLayer.Provider
      // A modal `Dialog` sets `pointer-events: none` on the `body`, which is
      // inherited by the full-viewport "drag cover" Plotly appends to the `body`
      // when a range slider drag starts. That renders the cover inert and breaks
      // the drag. Opt those elements back into pointer interactions via the
      // provider.
      //
      // See: https://github.com/radix-ui/primitives/issues/3222
      onInertElementsAdded={(nodes: Set<Element>) => {
        for (const node of nodes) {
          if (node instanceof HTMLElement) {
            node.style.pointerEvents = 'auto';
          }
        }
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
        <Plot
          style={{ width: '100%', maxWidth: 800 }}
          data={PLOTLY_DATA}
          layout={layout}
          debug={true}
          useResizeHandler={true}
        />
        <div>
          <Dialog.Root>
            <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className={styles.overlay} />
              <Dialog.Content className={styles.contentDefault} style={{ width: 800 }}>
                <Dialog.Title className={styles.title}>Plotly in Dialog</Dialog.Title>
                <Plot
                  style={{ width: '100%', height: '100%' }}
                  data={PLOTLY_DATA}
                  layout={layout}
                  debug={true}
                  useResizeHandler={true}
                />
                <Dialog.Close className={styles.close}>close</Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </DismissableLayer.Provider>
  );
};

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

export const WithExtensionOverlay = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger className={styles.trigger}>open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />
          <Dialog.Content className={styles.contentDefault}>
            <Dialog.Title>title</Dialog.Title>
            <Dialog.Description>
              Simulates extension UI interacting with a dialog.
            </Dialog.Description>
            <ExternalOverlayTrigger />
            <Dialog.Close className={styles.close}>close</Dialog.Close>
            <InsideShadowSuggestion />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div data-testid="dialog-state">{open ? 'open' : 'closed'}</div>
    </>
  );
};

function InsideShadowSuggestion() {
  const hostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host || host.shadowRoot) return;

    const shadowRoot = host.attachShadow({ mode: 'open' });
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'inside shadow suggestion';
    button.style.marginTop = '16px';
    shadowRoot.append(button);
  }, []);

  return <div data-testid="inside-shadow-host" ref={hostRef} />;
}
