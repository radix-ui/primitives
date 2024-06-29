import * as React from 'react';
import { css, keyframes } from '../../../../stitches.config';
import { Presence } from '@radix-ui/react-presence';

export default { title: 'Utilities/Presence' };

export const Basic = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <button onClick={() => setOpen((prevOpen) => !prevOpen)}>toggle</button>

      <Presence present={open}>
        <div>Content</div>
      </Presence>
    </>
  );
};

export const WithMountAnimation = () => <Animation className={mountAnimationClass()} />;
export const WithUnmountAnimation = () => <Animation className={unmountAnimationClass()} />;
export const WithMultipleMountAnimations = () => (
  <Animation className={multipleMountAnimationsClass()} />
);
export const WithOpenAndCloseAnimation = () => (
  <Animation className={openAndCloseAnimationClass()} />
);
export const WithMultipleOpenAndCloseAnimations = () => (
  <Animation className={multipleOpenAndCloseAnimationsClass()} />
);

export const WithDeferredMountAnimation = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef(0);
  const [open, setOpen] = React.useState(false);
  const [animate, setAnimate] = React.useState(false);
  const [animationEndCount, setAnimationEndCount] = React.useState(0);

  React.useEffect(() => {
    if (open) {
      timerRef.current = window.setTimeout(() => setAnimate(true), 150);
    } else {
      setAnimate(false);
      window.clearTimeout(timerRef.current);
    }
  }, [open]);

  const handleAnimationEnd = React.useCallback(() => {
    setAnimationEndCount((count) => count + 1);
  }, []);

  return (
    <>
      <p>
        Deferred animation should unmount correctly when toggled. Content will flash briefly while
        we wait for animation to be applied.
      </p>
      <Toggles
        nodeRef={ref}
        open={open}
        onOpenChange={setOpen}
        animationEndCount={animationEndCount}
      />
      <Presence present={open}>
        <div
          className={animate ? mountAnimationClass() : undefined}
          onAnimationEnd={handleAnimationEnd}
          ref={ref}
        >
          Content
        </div>
      </Presence>
    </>
  );
};

function Animation(props: React.ComponentProps<'div'>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const [animationEndCount, setAnimationEndCount] = React.useState(0);

  const handleAnimationEnd = React.useCallback(() => {
    setAnimationEndCount((count) => count + 1);
  }, []);

  return (
    <>
      <Toggles
        nodeRef={ref}
        open={open}
        onOpenChange={setOpen}
        animationEndCount={animationEndCount}
      />
      <Presence present={open}>
        <div
          {...props}
          data-state={open ? 'open' : 'closed'}
          onAnimationEnd={handleAnimationEnd}
          ref={ref}
        >
          Content
        </div>
      </Presence>
    </>
  );
}

function Toggles({ open, onOpenChange, animationEndCount, nodeRef }: any) {
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
      <fieldset>
        <legend>Animation end counter</legend>
        <output>{animationEndCount}</output>
      </fieldset>
    </form>
  );
}

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const slideUp = keyframes({
  from: { transform: 'translateY(30px)' },
  to: { transform: 'translateY(0)' },
});

const slideDown = keyframes({
  from: { transform: 'translateY(0)' },
  to: { transform: 'translateY(30px)' },
});

const mountAnimationClass = css({
  animation: `${fadeIn} 3s ease-out`,
});

const unmountAnimationClass = css({
  '&[data-state="closed"]': {
    animation: `${fadeOut} 3s ease-in`,
  },
});

const multipleMountAnimationsClass = css({
  animation: `${fadeIn} 6s cubic-bezier(0.22, 1, 0.36, 1), ${slideUp} 6s cubic-bezier(0.22, 1, 0.36, 1)`,
});

const openAndCloseAnimationClass = css({
  '&[data-state="open"]': {
    animation: `${fadeIn} 3s ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 3s ease-in`,
  },
});

const multipleOpenAndCloseAnimationsClass = css({
  '&[data-state="open"]': {
    animation: `${fadeIn} 3s cubic-bezier(0.22, 1, 0.36, 1), ${slideUp} 1s cubic-bezier(0.22, 1, 0.36, 1)`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 3s cubic-bezier(0.22, 1, 0.36, 1), ${slideDown} 1s cubic-bezier(0.22, 1, 0.36, 1)`,
  },
});
