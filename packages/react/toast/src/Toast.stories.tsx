import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { css, keyframes } from '../../../../stitches.config';
import * as Toast from '@radix-ui/react-toast';

export default { title: 'Components/Toast' };

export const Styled = () => (
  <Toast.Provider>
    <ToastUpgradeAvailable />
    <Toast.Viewport className={viewportClass()} />
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
        <Toast.Root key={index} className={errorRootClass()}>
          <Toast.Description>There was an error</Toast.Description>
          <Toast.Action
            className={buttonClass()}
            altText="Resubmit the form to try again."
            onClick={() => console.log('try again')}
          >
            Try again
          </Toast.Action>
        </Toast.Root>
      ))}

      {[...Array(savedCount)].map((_, index) => (
        <Toast.Root key={index} className={rootClass()}>
          <Toast.Description>Successfully saved</Toast.Description>
        </Toast.Root>
      ))}

      <Toast.Viewport className={viewportClass()} />
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

      <Toast.Root open={open} onOpenChange={setOpen} className={errorRootClass()}>
        <Toast.Description>There was an error</Toast.Description>
        <Toast.Action
          className={buttonClass()}
          altText="Resubmit the form to try again."
          onClick={() => console.log('try again')}
        >
          Try again
        </Toast.Action>
      </Toast.Root>

      <Toast.Viewport className={viewportClass()} />
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
          className={rootClass()}
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

      <Toast.Viewport className={viewportClass()} />
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
        <Toast.Root key={'one-' + String(toastOneCount)} className={rootClass()}>
          <Toast.Description>Toast one</Toast.Description>
        </Toast.Root>
      )}

      {toastTwoCount > 0 && (
        <Toast.Root key={'two-' + String(toastTwoCount)} className={rootClass()}>
          <Toast.Description>Toast two</Toast.Description>
        </Toast.Root>
      )}

      <Toast.Viewport className={viewportClass()} />
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

      <Toast.Viewport className={viewportClass()} />
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
      {/* eslint-disable-next-line jsx-a11y/no-onchange */}
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
      <Toast.Root className={animatedRootClass()} open={open} onOpenChange={setOpen}>
        <Toast.Description>Swipe me {swipeDirection}</Toast.Description>
        <Toast.Close className={buttonClass()}>Dismiss</Toast.Close>
      </Toast.Root>
      <Toast.Viewport className={viewportClass()} />
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
              className={rootClass()}
              data-testid={`toast-${identifier}`}
            >
              <Toast.Title className={titleClass()}>Toast {identifier} title</Toast.Title>
              <Toast.Description className={descriptionClass()}>
                Toast {identifier} description
              </Toast.Description>

              <Toast.Close className={buttonClass()} aria-label="Close">
                Toast button {identifier}.1
              </Toast.Close>
              <Toast.Action
                altText="Go and perform an action"
                className={buttonClass()}
                style={{ marginTop: 10 }}
              >
                Toast button {identifier}.2
              </Toast.Action>
            </Toast.Root>
          );
        })}
        <Toast.Viewport className={viewportClass()} />

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
        <Toast.Root className={rootClass()}>
          <div className={headerClass()}>
            <Toast.Title className={titleClass()}>Toast 1</Toast.Title>
            <Toast.Close className={closeClass()}>×</Toast.Close>
          </div>
          <Toast.Description className={descriptionClass()}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={buttonClass()} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Root className={rootClass()}>
          <div className={headerClass()}>
            <Toast.Title className={titleClass()}>Toast 2</Toast.Title>
            <Toast.Close className={closeClass()}>×</Toast.Close>
          </div>
          <Toast.Description className={descriptionClass()}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={buttonClass()} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={chromaticViewport()}></Toast.Viewport>
      </Toast.Provider>

      <h1>Uncontrolled</h1>

      <h2>Open</h2>
      <Toast.Provider>
        <Toast.Root duration={Infinity} className={rootClass()}>
          <div className={headerClass()}>
            <Toast.Title className={titleClass()}>Toast</Toast.Title>
            <Toast.Close className={closeClass()}>×</Toast.Close>
          </div>
          <Toast.Description className={descriptionClass()}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={buttonClass()} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={chromaticViewport()}></Toast.Viewport>
      </Toast.Provider>

      <h2>Closed</h2>
      <Toast.Provider>
        <Toast.Root defaultOpen={false} duration={Infinity} className={rootClass()}>
          <div className={headerClass()}>
            <Toast.Title className={titleClass()}>Title</Toast.Title>
            <Toast.Close className={closeClass()}>×</Toast.Close>
          </div>
          <Toast.Description className={descriptionClass()}>
            Uncontrolled foreground closed
          </Toast.Description>
          <Toast.Action altText="alternative" className={buttonClass()} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={chromaticViewport()}></Toast.Viewport>
      </Toast.Provider>

      <h1>Controlled</h1>

      <h2>Open</h2>
      <Toast.Provider>
        <Toast.Root open duration={Infinity} className={rootClass()}>
          <div className={headerClass()}>
            <Toast.Title className={titleClass()}>Toast</Toast.Title>
            <Toast.Close className={closeClass()}>×</Toast.Close>
          </div>
          <Toast.Description className={descriptionClass()}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={buttonClass()} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={chromaticViewport()}></Toast.Viewport>
      </Toast.Provider>

      <h2>Closed</h2>
      <Toast.Provider>
        <Toast.Root open={false} duration={Infinity} className={rootClass()}>
          <div className={headerClass()}>
            <Toast.Title className={titleClass()}>Toast</Toast.Title>
            <Toast.Close className={closeClass()}>×</Toast.Close>
          </div>
          <Toast.Description className={descriptionClass()}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={buttonClass()} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={chromaticViewport()}></Toast.Viewport>
      </Toast.Provider>

      <h1>Dismissed</h1>
      <h2>Uncontrolled</h2>
      <Toast.Provider>
        <Toast.Root duration={SNAPSHOT_DELAY - 100} className={rootClass()}>
          <div className={headerClass()}>
            <Toast.Title className={titleClass()}>Toast</Toast.Title>
            <Toast.Close className={closeClass()}>×</Toast.Close>
          </div>
          <Toast.Description className={descriptionClass()}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={buttonClass()} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={chromaticViewport()}></Toast.Viewport>
      </Toast.Provider>

      <h2>Controlled</h2>
      <Toast.Provider>
        <Toast.Root
          duration={SNAPSHOT_DELAY - 100}
          open={open}
          onOpenChange={setOpen}
          className={rootClass()}
        >
          <div className={headerClass()}>
            <Toast.Title className={titleClass()}>Toast</Toast.Title>
            <Toast.Close className={closeClass()}>×</Toast.Close>
          </div>
          <Toast.Description className={descriptionClass()}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={buttonClass()} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={chromaticViewport()}></Toast.Viewport>
      </Toast.Provider>

      <h1>Provider</h1>
      <h2>Duration</h2>
      <Toast.Provider duration={SNAPSHOT_DELAY - 100}>
        <Toast.Root className={rootClass()}>
          <div className={headerClass()}>
            <Toast.Title className={titleClass()}>Toast</Toast.Title>
            <Toast.Close className={closeClass()}>×</Toast.Close>
          </div>
          <Toast.Description className={descriptionClass()}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={buttonClass()} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={chromaticViewport()}></Toast.Viewport>
      </Toast.Provider>

      <h2>Duration overidden</h2>
      <Toast.Provider duration={Infinity}>
        <Toast.Root duration={SNAPSHOT_DELAY - 100} className={rootClass()}>
          <div className={headerClass()}>
            <Toast.Title className={titleClass()}>Toast</Toast.Title>
            <Toast.Close className={closeClass()}>×</Toast.Close>
          </div>
          <Toast.Description className={descriptionClass()}>Description</Toast.Description>
          <Toast.Action altText="alternative" className={buttonClass()} style={{ marginTop: 10 }}>
            Action
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className={chromaticViewport()}></Toast.Viewport>
      </Toast.Provider>
    </>
  );
};
Chromatic.parameters = { chromatic: { disable: false, delay: SNAPSHOT_DELAY } };

/* -----------------------------------------------------------------------------------------------*/

const ToastUpgradeAvailable = (props: React.ComponentProps<typeof Toast.Root>) => (
  <Toast.Root className={rootClass()} {...props}>
    <div className={headerClass()}>
      <Toast.Title className={titleClass()}>Upgrade available</Toast.Title>
      <Toast.Close className={closeClass()} aria-label="Close">
        <span aria-hidden>×</span>
      </Toast.Close>
    </div>
    <Toast.Description className={descriptionClass()}>
      We've just released Radix version 3.0
    </Toast.Description>
    <Toast.Action
      altText="Goto account settings to upgrade"
      className={buttonClass()}
      style={{ marginTop: 10 }}
    >
      Upgrade
    </Toast.Action>
  </Toast.Root>
);

const ToastSubscribeSuccess = (props: React.ComponentProps<typeof Toast.Root>) => (
  <Toast.Root className={rootClass()} {...props}>
    <div className={successHeaderClass()}>
      <Toast.Title className={titleClass()}>Success!</Toast.Title>
      <Toast.Close className={closeClass()} aria-label="Close">
        <span aria-hidden>×</span>
      </Toast.Close>
    </div>
    <Toast.Description className={descriptionClass()}>
      You have subscribed. We'll be in touch.
    </Toast.Description>
  </Toast.Root>
);

const ToastWithProgress = (props: React.ComponentProps<typeof Toast.Root>) => {
  const [paused, setPaused] = React.useState(false);
  const duration = 3000;

  return (
    <Toast.Root
      className={rootClass()}
      duration={duration}
      onPause={() => setPaused(true)}
      onResume={() => setPaused(false)}
      {...props}
    >
      <Toast.Description>Successfully saved</Toast.Description>
      <div className={progressBarClass()}>
        <div
          className={progressBarInnerClass()}
          style={{
            animationDuration: duration - 100 + 'ms',
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      </div>
    </Toast.Root>
  );
};

const VIEWPORT_PADDING = 10;

const viewportClass = css({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  border: '1px solid',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  padding: VIEWPORT_PADDING,
  gap: VIEWPORT_PADDING,
  listStyle: 'none',
});

const rootClass = css({
  position: 'relative',
  overflow: 'hidden',
  listStyle: 'none',
  width: 230,
  borderRadius: 4,
  border: '1px solid black',
  boxShadow: '0 0 5px rgba(0,0,0,0.5)',
  padding: 10,
  fontSize: 12,
});

const headerClass = css({
  padding: '5px 10px',
  margin: '-10px -10px 10px',
  background: 'black',
  color: 'white',
  position: 'relative',
  height: 22,
  display: 'flex',
  alignItems: 'center',
});

const successHeaderClass = css(headerClass, {
  background: 'green',
});

const titleClass = css({
  fontSize: 'inherit',
  fontWeight: 'normal',
});

const descriptionClass = css({
  margin: 0,
});

const buttonClass = css({
  border: '1px solid black',
  borderRadius: 4,
  background: 'gainsboro',
  fontFamily: 'inherit',
  padding: '2px 5px',
  '&:hover, &:focus': {
    background: 'royalblue',
    borderColor: 'darkblue',
    color: 'white',
  },
});

const closeClass = css(buttonClass, {
  position: 'absolute',
  top: '50%',
  right: 5,
  transform: 'translateY(-50%)',
  width: 18,
  height: 18,
  padding: 0,
});

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const slideRight = keyframes({
  from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
  to: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
});

const slideLeft = keyframes({
  from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
  to: { transform: `translateX(calc(-100% - ${VIEWPORT_PADDING}px))` },
});

const slideUp = keyframes({
  from: { transform: 'translateY(var(--radix-toast-swipe-end-y))' },
  to: { transform: `translateY(calc(-100% - ${VIEWPORT_PADDING}px))` },
});

const slideDown = keyframes({
  from: { transform: 'translateY(var(--radix-toast-swipe-end-y))' },
  to: { transform: `translateY(calc(100% + ${VIEWPORT_PADDING}px))` },
});

const errorRootClass = css(rootClass, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const animatedRootClass = css(rootClass, {
  '&[data-state="open"]': {
    animation: `${fadeIn} 200ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 200ms ease-out`,
  },
  '&[data-swipe="move"]': {
    transform: 'translate(var(--radix-toast-swipe-move-x), var(--radix-toast-swipe-move-y))',
  },
  '&[data-swipe="cancel"]': {
    transform: 'translate(0, 0)',
    transition: 'transform 200ms ease-out',
  },
  '&[data-swipe="end"]': {
    animationDuration: '300ms',
    animationTimingFunction: 'ease-out',
    '&[data-swipe-direction="right"]': {
      animationName: slideRight,
    },
    '&[data-swipe-direction="left"]': {
      animationName: slideLeft,
    },
    '&[data-swipe-direction="up"]': {
      animationName: slideUp,
    },
    '&[data-swipe-direction="down"]': {
      animationName: slideDown,
    },
  },
});

const loading = keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(0%)' },
});

const progressBarClass = css({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 2,
  overflow: 'hidden',
  backgroundColor: '$gray100',
});

const progressBarInnerClass = css({
  height: '100%',
  backgroundColor: '$green',
  animationName: `${loading}`,
  animationTimingFunction: 'linear',
});

const chromaticViewport = css({
  display: 'inline-flex',
  border: '5px solid royalblue',
  flexDirection: 'column',
  padding: VIEWPORT_PADDING,
  gap: VIEWPORT_PADDING,
});
