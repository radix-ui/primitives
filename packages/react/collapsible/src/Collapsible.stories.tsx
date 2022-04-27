import * as React from 'react';
import { css, keyframes } from '../../../../stitches.config';
import * as Collapsible from '@radix-ui/react-collapsible';

export default { title: 'Components/Collapsible' };

export const Styled = () => (
  <Collapsible.Root className={rootClass()}>
    <Collapsible.Trigger className={triggerClass()}>Trigger</Collapsible.Trigger>
    <Collapsible.Content className={contentClass()}>Content 1</Collapsible.Content>
  </Collapsible.Root>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className={rootClass()}>
      <Collapsible.Trigger className={triggerClass()}>
        {open ? 'close' : 'open'}
      </Collapsible.Trigger>
      <Collapsible.Content className={contentClass()} asChild>
        <article>Content 1</article>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export const Animated = () => {
  return (
    <>
      <h1>Closed by default</h1>
      <Collapsible.Root className={rootClass()}>
        <Collapsible.Trigger className={triggerClass()}>Trigger</Collapsible.Trigger>
        <Collapsible.Content className={animatedContentClass()}>
          <div style={{ padding: 10 }}>Content 1</div>
        </Collapsible.Content>
      </Collapsible.Root>

      <h1>Open by default</h1>
      <Collapsible.Root defaultOpen className={rootClass()}>
        <Collapsible.Trigger className={triggerClass()}>Trigger</Collapsible.Trigger>
        <Collapsible.Content className={animatedContentClass()}>
          <div style={{ padding: 10 }}>Content 1</div>
        </Collapsible.Content>
      </Collapsible.Root>
    </>
  );
};

export const AnimatedHorizontal = () => {
  return (
    <Collapsible.Root className={rootClass()}>
      <Collapsible.Trigger className={triggerClass()}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={animatedWidthContentClass()}>
        <div style={{ padding: 10 }}>Content</div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>Closed</h2>
    <Collapsible.Root className={rootClass()}>
      <Collapsible.Trigger className={triggerClass()}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={contentClass()}>Content 1</Collapsible.Content>
    </Collapsible.Root>

    <h2>Open</h2>
    <Collapsible.Root className={rootClass()} defaultOpen>
      <Collapsible.Trigger className={triggerClass()}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={contentClass()}>Content 1</Collapsible.Content>
    </Collapsible.Root>

    <h1>Controlled</h1>
    <h2>Closed</h2>
    <Collapsible.Root className={rootClass()} open={false}>
      <Collapsible.Trigger className={triggerClass()}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={contentClass()}>Content 1</Collapsible.Content>
    </Collapsible.Root>

    <h2>Open</h2>
    <Collapsible.Root className={rootClass()} open>
      <Collapsible.Trigger className={triggerClass()}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={contentClass()}>Content 1</Collapsible.Content>
    </Collapsible.Root>

    <h1>Disabled</h1>
    <Collapsible.Root className={rootClass()} disabled>
      <Collapsible.Trigger className={triggerClass()}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={contentClass()}>Content 1</Collapsible.Content>
    </Collapsible.Root>

    <h1>State attributes</h1>
    <h2>Closed</h2>
    <Collapsible.Root className={rootAttrClass()}>
      <Collapsible.Trigger className={triggerAttrClass()}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={contentAttrClass()}>Content 1</Collapsible.Content>
    </Collapsible.Root>

    <h2>Open</h2>
    <Collapsible.Root className={rootAttrClass()} defaultOpen>
      <Collapsible.Trigger className={triggerAttrClass()}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={contentAttrClass()}>Content 1</Collapsible.Content>
    </Collapsible.Root>

    <h2>Disabled</h2>
    <Collapsible.Root className={rootAttrClass()} defaultOpen disabled>
      <Collapsible.Trigger className={triggerAttrClass()}>Trigger</Collapsible.Trigger>
      <Collapsible.Content className={contentAttrClass()}>Content 1</Collapsible.Content>
    </Collapsible.Root>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

const rootClass = css({
  maxWidth: '20em',
  fontFamily: 'sans-serif',
});

const RECOMMENDED_CSS__COLLAPSIBLE__TRIGGER: any = {
  // because it's a button, we want to stretch it
  width: '100%',
  // and remove center text alignment in favour of inheriting
  textAlign: 'inherit',
};

const triggerClass = css({
  ...RECOMMENDED_CSS__COLLAPSIBLE__TRIGGER,
  boxSizing: 'border-box',
  appearance: 'none',
  border: 'none',
  padding: 10,
  backgroundColor: '$black',
  color: 'white',
  fontFamily: 'inherit',
  fontSize: '1.2em',

  '--shadow-color': 'crimson',

  '&:focus': {
    outline: 'none',
    boxShadow: 'inset 0 -5px 0 0 var(--shadow-color)',
    color: '$red',
  },

  '&[data-disabled]': {
    color: '$gray300',
  },

  '&[data-state="open"]': {
    backgroundColor: '$red',
    color: '$white',

    '&:focus': {
      '--shadow-color': '#111',
      color: '$black',
    },
  },
});

const contentClass = css({
  padding: 10,
  lineHeight: 1.5,
});

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-collapsible-content-height)' },
});

const slideUp = keyframes({
  from: { height: 'var(--radix-collapsible-content-height)' },
  to: { height: 0 },
});

const openRight = keyframes({
  from: { width: 0 },
  to: { width: 'var(--radix-collapsible-content-width)' },
});

const closeRight = keyframes({
  from: { width: 'var(--radix-collapsible-content-width)' },
  to: { width: 0 },
});

const animatedContentClass = css({
  overflow: 'hidden',
  '&[data-state="open"]': {
    animation: `${slideDown} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms ease-in`,
  },
});

const animatedWidthContentClass = css({
  overflow: 'hidden',
  '&[data-state="open"]': {
    animation: `${openRight} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${closeRight} 300ms ease-in`,
  },
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '&[data-state="closed"]': { borderColor: 'red' },
  '&[data-state="open"]': { borderColor: 'green' },
  '&[data-disabled]': { borderStyle: 'dashed' },
  '&:disabled': { opacity: 0.5 },
};
const rootAttrClass = css(styles);
const triggerAttrClass = css(styles);
const contentAttrClass = css({
  // ensure we can see the content (because it has `hidden` attribute)
  display: 'block',
  ...styles,
});
