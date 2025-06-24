import * as React from 'react';
import { Presence } from 'radix-ui/internal';
import styles from './presence.stories.module.css';

export default { title: 'Utilities/Presence' };

export const Basic = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <button onClick={() => setOpen((prevOpen) => !prevOpen)}>toggle</button>

      <Presence.Root present={open}>
        <div>Content</div>
      </Presence.Root>
    </>
  );
};

export const WithMountAnimation = () => <Animation className={styles.mountAnimation} />;
export const WithUnmountAnimation = () => <Animation className={styles.unmountAnimation} />;
export const WithMultipleMountAnimations = () => (
  <Animation className={styles.multipleMountAnimations} />
);
export const WithOpenAndCloseAnimation = () => (
  <Animation className={styles.openAndCloseAnimation} />
);
export const WithMultipleOpenAndCloseAnimations = () => (
  <Animation className={styles.multipleOpenAndCloseAnimations} />
);

export const WithDeferredMountAnimation = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef(0);
  const [open, setOpen] = React.useState(false);
  const [animate, setAnimate] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      timerRef.current = window.setTimeout(() => setAnimate(true), 150);
    } else {
      setAnimate(false);
      window.clearTimeout(timerRef.current);
    }
  }, [open]);

  return (
    <>
      <p>
        Deferred animation should unmount correctly when toggled. Content will flash briefly while
        we wait for animation to be applied.
      </p>
      <Toggles nodeRef={ref} open={open} onOpenChange={setOpen} />
      <Presence.Root present={open}>
        <div className={animate ? styles.mountAnimation : undefined} ref={ref}>
          Content
        </div>
      </Presence.Root>
    </>
  );
};

function Animation(props: React.ComponentProps<'div'>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Toggles nodeRef={ref} open={open} onOpenChange={setOpen} />
      <Presence.Root present={open}>
        <div {...props} data-state={open ? 'open' : 'closed'} ref={ref}>
          Content
        </div>
      </Presence.Root>
    </>
  );
}

function Toggles({ open, onOpenChange, nodeRef }: any) {
  function handleToggleVisibility() {
    const node = nodeRef.current;
    if (node) {
      if (node.style.display === 'none') {
        node.style.display = 'block';
      } else {
        node.style.display = 'none';
      }
    }
  }

  return (
    <form style={{ display: 'flex', marginBottom: 30 }}>
      <fieldset>
        <legend>Mount</legend>
        <button type="button" onClick={() => onOpenChange(!open)}>
          toggle
        </button>
      </fieldset>
      <fieldset>
        <legend>Visibility (triggers cancel event)</legend>
        <button type="button" onClick={handleToggleVisibility}>
          toggle
        </button>
      </fieldset>
    </form>
  );
}
