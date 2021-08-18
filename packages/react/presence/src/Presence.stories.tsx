import * as React from 'react';
import { Presence } from './Presence';
import { css } from '../../../../stitches.config';

export default { title: 'Components/Presence' };

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

export const WithMountAnimation = () => <Animation className={mountAnimationClass} />;
export const WithUnmountAnimation = () => <Animation className={unmountAnimationClass} />;
export const WithMultipleMountAnimations = () => (
  <Animation className={multipleMountAnimationsClass} />
);
export const WithOpenAndCloseAnimation = () => <Animation className={openAndCloseAnimationClass} />;
export const WithMultipleOpenAndCloseAnimations = () => (
  <Animation className={multipleOpenAndCloseAnimationsClass} />
);

function Animation(props: React.ComponentProps<'div'>) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Toggles nodeRef={ref} open={open} onOpenChange={setOpen} />
      <Presence present={open}>
        <div {...props} data-state={open ? 'open' : 'closed'} ref={ref}>
          Content
        </div>
      </Presence>
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

const fadeIn = css.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = css.keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const slideUp = css.keyframes({
  from: { transform: 'translateY(30px)' },
  to: { transform: 'translateY(0)' },
});

const slideDown = css.keyframes({
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
    animation: `${fadeOut} 3s cubic-bezier(0.22, 1, 0.36, 1), ${slideDown} 1s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
  },
});
