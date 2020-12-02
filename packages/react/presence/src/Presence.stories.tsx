import * as React from 'react';
import { Presence } from './Presence';
import { styled, css } from '../../../../stitches.config';

export default { title: 'Components/Presence' };

export const Basic = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <>
      <button onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}>toggle</button>

      <Presence present={isOpen}>
        <div>Content</div>
      </Presence>
    </>
  );
};

export const WithSuspendedUnmountAnimation = () => {
  const ref = React.useRef<React.ElementRef<typeof Animated>>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Toggles nodeRef={ref} open={isOpen} onOpenChange={setIsOpen} />
      <Presence present={isOpen}>
        <Animated data-state={isOpen ? 'open' : 'closed'} ref={ref}>
          Content
        </Animated>
      </Presence>
    </>
  );
};

export const WithSuspendedUnmountTransition = () => {
  const ref = React.useRef<React.ElementRef<typeof Transitioned>>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Toggles nodeRef={ref} open={isOpen} onOpenChange={setIsOpen} />
      <Presence present={isOpen}>
        <Transitioned data-state={isOpen ? 'open' : 'closed'} ref={ref}>
          Content
        </Transitioned>
      </Presence>
    </>
  );
};

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

const Animated = styled('div', {
  '&[data-state="open"]': {
    animation: `${fadeIn} 3s ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 3s ease-in`,
  },
});

const Transitioned = styled('div', {
  opacity: 1,
  transition: 'opacity 3s ease-out',
  '&[data-state="closed"]': {
    opacity: 0,
  },
});
