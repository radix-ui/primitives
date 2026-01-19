import * as React from 'react';
import { Dialog, Toast } from 'radix-ui';
import styles from './toast.stories.module.css';

export default { title: 'Components/Toast' };

export const Styled = () => (
  <Toast.Provider>
    <ToastUpgradeAvailable />
    <Toast.Viewport className={styles.viewport} />
  </Toast.Provider>
);

export const Controlled = () => {
  const [hasUpgrade, setHasUpgrade] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [savedCount, setSavedCount] = React.useState(0);
  const [errorCount, setErrorCount] = React.useState(0);

  React.useEffect(() => {
    if (!hasUpgrade) {
      const timer = window.setTimeout(() => setHasUpgrade(true), 10000);
      return () => window.clearTimeout(timer);
    }
  }, [hasUpgrade]);

  return (
    <Toast.Provider>
      <button onClick={() => setIsSubscribed(true)}>subscribe</button>
      <button onClick={() => setErrorCount((count) => count + 1)}>error</button>
      <button onClick={() => setSavedCount((count) => count + 1)}>save</button>
      <ToastUpgradeAvailable open={hasUpgrade} onOpenChange={setHasUpgrade} />
      <ToastSubscribeSuccess open={isSubscribed} onOpenChange={setIsSubscribed} />

      {[...Array(errorCount)].map((_, index) => (
        <Toast.Root key={index} className={[styles.root, styles.errorRoot].join(' ')}>
          <Toast.Description>There was an error</Toast.Description>
          <Toast.Action
            className={styles.button}
            altText="Resubmit the form to try again."
            onClick={() => console.log('try again')}
          >
            Try again
          </Toast.Action>
        </Toast.Root>
      ))}

      {[...Array(savedCount)].map((_, index) => (
        <Toast.Root key={index} className={styles.root}>
          <Toast.Description>Successfully saved</Toast.Description>
        </Toast.Root>
      ))}

      <Toast.Viewport className={styles.viewport} />
    </Toast.Provider>
  );
};

export const FromDialog = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Toast.Provider>
      <Dialog.Root>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Overlay />
        <Dialog.Content style={{ border: '1px solid', width: 300, padding: 30 }}>
          <Dialog.Title style={{ margin: 0 }}>Title</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
          <button onClick={() => setOpen(true)}>Open toast</button>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Root>

      <Toast.Root
        open={open}
        onOpenChange={setOpen}
        className={[styles.root, styles.errorRoot].join(' ')}
      >
        <Toast.Description>There was an error</Toast.Description>
        <Toast.Action
          className={styles.button}
          altText="Resubmit the form to try again."
          onClick={() => console.log('try again')}
        >
          Try again
        </Toast.Action>
      </Toast.Root>

      <Toast.Viewport className={styles.viewport} />
    </Toast.Provider>
  );
};

export const Promise = () => {
  const [saving, setSaving] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (saving) {
      const timer = window.setTimeout(() => setSaving(false), 2000);
      return () => window.clearTimeout(timer);
    }
  }, [saving]);

  return (
    <Toast.Provider>
      <form
        onSubmit={(event) => {
          setSaving(true);
          setOpen(true);
          event.preventDefault();
        }}
      >
        <button>Save</button>
        <Toast.Root
          className={styles.root}
          duration={saving ? Infinity : 2000}
          open={open}
          onOpenChange={setOpen}
        >
          {saving ? (
            <Toast.Description>Saving&hellip;</Toast.Description>
          ) : (
            <Toast.Description>Saved!</Toast.Description>
          )}
        </Toast.Root>
      </form>

      <Toast.Viewport className={styles.viewport} />
    </Toast.Provider>
  );
};

export const KeyChange = () => {
  const [toastOneCount, setToastOneCount] = React.useState(0);
  const [toastTwoCount, setToastTwoCount] = React.useState(0);

  return (
    <Toast.Provider>
      <button onClick={() => setToastOneCount((count) => count + 1)}>Open toast one</button>
      <button onClick={() => setToastTwoCount((count) => count + 1)}>Open toast two</button>

      {toastOneCount > 0 && (
        <Toast.Root key={'one-' + String(toastOneCount)} className={styles.root}>
          <Toast.Description>Toast one</Toast.Description>
        </Toast.Root>
      )}

      {toastTwoCount > 0 && (
        <Toast.Root key={'two-' + String(toastTwoCount)} className={styles.root}>
          <Toast.Description>Toast two</Toast.Description>
        </Toast.Root>
      )}

      <Toast.Viewport className={styles.viewport} />
    </Toast.Provider>
  );
};

export const PauseResumeProps = () => {
  const [toastCount, setToastCount] = React.useState(0);

  return (
    <Toast.Provider>
      <button onClick={() => setToastCount((count) => count + 1)}>Add toast</button>

      {[...Array(toastCount)].map((_, index) => (
        <ToastWithProgress key={index} />
      ))}

      <Toast.Viewport className={styles.viewport} />
    </Toast.Provider>
  );
};

type Direction = React.ComponentProps<typeof Toast.Provider>['swipeDirection'];

export const Animated = () => {
  const [open, setOpen] = React.useState(false);
  const [swipeDirection, setSwipeDirection] = React.useState<Direction>('right');
  const timerRef = React.useRef(0);
  return (
    <Toast.Provider
      swipeDirection={swipeDirection}
      swipeThreshold={(['up', 'down'] as Direction[]).includes(swipeDirection) ? 25 : undefined}
    >
      <button
        onClick={() => {
          setOpen(false);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => setOpen(true), 150);
        }}
      >
        Open
      </button>
      <select
        value={swipeDirection}
        onChange={(event) => {
          setSwipeDirection(event.currentTarget.value as Direction);
        }}
      >
        <option value="right">Slide right</option>
        <option value="left">Slide left</option>
        <option value="up">Slide up</option>
        <option value="down">Slide down</option>
      </select>
      <Toast.Root
        className={[styles.root, styles.animatedRoot].join(' ')}
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Description>Swipe me {swipeDirection}</Toast.Description>
        <Toast.Close className={styles.button}>Dismiss</Toast.Close>
      </Toast.Root>
      <Toast.Viewport className={styles.viewport} />
    </Toast.Provider>
  );
};

export const Cypress = () => {
  const [count, setCount] = React.useState(0);

  return (
    <Toast.Provider>
      <button onClick={() => setCount((count) => count + 1)}>Add toast</button>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 700, margin: 'auto' }}
      >
        <button>Focusable before viewport</button>

        {[...Array(count)].map((_, index) => {
          const identifier = index + 1;
          return (
            <Toast.Root
              key={index}
              open
              className={styles.root}
              data-testid={`toast-${identifier}`}
            >
              <Toast.Title className={styles.title}>Toast {identifier} title</Toast.Title>
              <Toast.Description className={styles.description}>
                Toast {identifier} description
              </Toast.Description>

              <Toast.Close className={styles.button} aria-label="Close">
                Toast button {identifier}.1
              </Toast.Close>
              <Toast.Action
                altText="Go and perform an action"
                className={styles.button}
                style={{ marginTop: 10 }}
              >
                Toast button {identifier}.2
              </Toast.Action>
            </Toast.Root>
          );
        })}
        <Toast.Viewport className={styles.viewport} />

        <button>Focusable after viewport</button>
      </div>
    </Toast.Provider>
  );
};

const SNAPSHOT_DELAY = 300;

export const Chromatic = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <h1>Order</h1>
      <Toast.Provider duration={Infinity}>
        <Toast.Root className={styles.root}>
          <div className={styles.header}>
            <Toast.Title className={styles.title}>Toast 1</Toast.Title>
            <Toast.Close className={styles.close}>×</Toast.Close>
          </div>
          <Toast.Description className={styles.description}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={styles.button} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Root className={styles.root}>
          <div className={styles.header}>
            <Toast.Title className={styles.title}>Toast 2</Toast.Title>
            <Toast.Close className={styles.close}>×</Toast.Close>
          </div>
          <Toast.Description className={styles.description}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={styles.button} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={styles.chromaticViewport}></Toast.Viewport>
      </Toast.Provider>

      <h1>Uncontrolled</h1>

      <h2>Open</h2>
      <Toast.Provider>
        <Toast.Root duration={Infinity} className={styles.root}>
          <div className={styles.header}>
            <Toast.Title className={styles.title}>Toast</Toast.Title>
            <Toast.Close className={styles.close}>×</Toast.Close>
          </div>
          <Toast.Description className={styles.description}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={styles.button} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={styles.chromaticViewport}></Toast.Viewport>
      </Toast.Provider>

      <h2>Closed</h2>
      <Toast.Provider>
        <Toast.Root defaultOpen={false} duration={Infinity} className={styles.root}>
          <div className={styles.header}>
            <Toast.Title className={styles.title}>Title</Toast.Title>
            <Toast.Close className={styles.close}>×</Toast.Close>
          </div>
          <Toast.Description className={styles.description}>
            Uncontrolled foreground closed
          </Toast.Description>
          <Toast.Action altText="alternative" className={styles.button} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={styles.chromaticViewport}></Toast.Viewport>
      </Toast.Provider>

      <h1>Controlled</h1>

      <h2>Open</h2>
      <Toast.Provider>
        <Toast.Root open duration={Infinity} className={styles.root}>
          <div className={styles.header}>
            <Toast.Title className={styles.title}>Toast</Toast.Title>
            <Toast.Close className={styles.close}>×</Toast.Close>
          </div>
          <Toast.Description className={styles.description}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={styles.button} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={styles.chromaticViewport}></Toast.Viewport>
      </Toast.Provider>

      <h2>Closed</h2>
      <Toast.Provider>
        <Toast.Root open={false} duration={Infinity} className={styles.root}>
          <div className={styles.header}>
            <Toast.Title className={styles.title}>Toast</Toast.Title>
            <Toast.Close className={styles.close}>×</Toast.Close>
          </div>
          <Toast.Description className={styles.description}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={styles.button} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={styles.chromaticViewport}></Toast.Viewport>
      </Toast.Provider>

      <h1>Dismissed</h1>
      <h2>Uncontrolled</h2>
      <Toast.Provider>
        <Toast.Root duration={SNAPSHOT_DELAY - 100} className={styles.root}>
          <div className={styles.header}>
            <Toast.Title className={styles.title}>Toast</Toast.Title>
            <Toast.Close className={styles.close}>×</Toast.Close>
          </div>
          <Toast.Description className={styles.description}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={styles.button} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={styles.chromaticViewport}></Toast.Viewport>
      </Toast.Provider>

      <h2>Controlled</h2>
      <Toast.Provider>
        <Toast.Root
          duration={SNAPSHOT_DELAY - 100}
          open={open}
          onOpenChange={setOpen}
          className={styles.root}
        >
          <div className={styles.header}>
            <Toast.Title className={styles.title}>Toast</Toast.Title>
            <Toast.Close className={styles.close}>×</Toast.Close>
          </div>
          <Toast.Description className={styles.description}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={styles.button} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={styles.chromaticViewport}></Toast.Viewport>
      </Toast.Provider>

      <h1>Provider</h1>
      <h2>Duration</h2>
      <Toast.Provider duration={SNAPSHOT_DELAY - 100}>
        <Toast.Root className={styles.root}>
          <div className={styles.header}>
            <Toast.Title className={styles.title}>Toast</Toast.Title>
            <Toast.Close className={styles.close}>×</Toast.Close>
          </div>
          <Toast.Description className={styles.description}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={styles.button} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={styles.chromaticViewport}></Toast.Viewport>
      </Toast.Provider>

      <h2>Duration overridden</h2>
      <Toast.Provider duration={Infinity}>
        <Toast.Root duration={SNAPSHOT_DELAY - 100} className={styles.root}>
          <div className={styles.header}>
            <Toast.Title className={styles.title}>Toast</Toast.Title>
            <Toast.Close className={styles.close}>×</Toast.Close>
          </div>
          <Toast.Description className={styles.description}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={styles.button} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={styles.chromaticViewport}></Toast.Viewport>
      </Toast.Provider>
    </>
  );
};
Chromatic.parameters = { chromatic: { disable: false, delay: SNAPSHOT_DELAY } };

/* -----------------------------------------------------------------------------------------------*/

const ToastUpgradeAvailable = (props: React.ComponentProps<typeof Toast.Root>) => (
  <Toast.Root className={styles.root} {...props}>
    <div className={styles.header}>
      <Toast.Title className={styles.title}>Upgrade available</Toast.Title>
      <Toast.Close className={styles.close} aria-label="Close">
        <span aria-hidden>×</span>
      </Toast.Close>
    </div>
    <Toast.Description className={styles.description}>
      We've just released Radix version 3.0
    </Toast.Description>
    <Toast.Action
      altText="Goto account settings to upgrade"
      className={styles.button}
      style={{ marginTop: 10 }}
    >
      Upgrade
    </Toast.Action>
  </Toast.Root>
);

const ToastSubscribeSuccess = (props: React.ComponentProps<typeof Toast.Root>) => (
  <Toast.Root className={styles.root} {...props}>
    <div className={[styles.header, styles.successHeader].join(' ')}>
      <Toast.Title className={styles.title}>Success!</Toast.Title>
      <Toast.Close className={styles.close} aria-label="Close">
        <span aria-hidden>×</span>
      </Toast.Close>
    </div>
    <Toast.Description className={styles.description}>
      You have subscribed. We'll be in touch.
    </Toast.Description>
  </Toast.Root>
);

const ToastWithProgress = (props: React.ComponentProps<typeof Toast.Root>) => {
  const [paused, setPaused] = React.useState(false);
  const duration = 3000;

  return (
    <Toast.Root
      className={styles.root}
      duration={duration}
      onPause={() => setPaused(true)}
      onResume={() => setPaused(false)}
      {...props}
    >
      <Toast.Description>Successfully saved</Toast.Description>
      <div className={styles.progressBar}>
        <div
          className={styles.progressBarInner}
          style={{
            animationDuration: duration - 100 + 'ms',
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      </div>
    </Toast.Root>
  );
};
