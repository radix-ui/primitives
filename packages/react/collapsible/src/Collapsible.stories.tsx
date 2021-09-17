import * as React from 'react';
import { css } from '../../../../stitches.config';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';

export default { title: 'Components/Collapsible' };

export const Styled = () => (
  <Collapsible className={rootClass}>
    <CollapsibleTrigger className={triggerClass}>Trigger</CollapsibleTrigger>
    <CollapsibleContent className={contentClass}>Content 1</CollapsibleContent>
  </Collapsible>
);

export const Controlled = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className={rootClass}>
      <CollapsibleTrigger className={triggerClass}>{open ? 'close' : 'open'}</CollapsibleTrigger>
      <CollapsibleContent className={contentClass} asChild>
        <article>Content 1</article>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const Animated = () => {
  return (
    <Collapsible className={rootClass}>
      <CollapsibleTrigger className={triggerClass}>Trigger</CollapsibleTrigger>
      <CollapsibleContent className={animatedContentClass}>
        <div style={{ padding: 10 }}>Content 1</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>Closed</h2>
    <Collapsible className={rootClass}>
      <CollapsibleTrigger className={triggerClass}>Trigger</CollapsibleTrigger>
      <CollapsibleContent className={contentClass}>Content 1</CollapsibleContent>
    </Collapsible>

    <h2>Open</h2>
    <Collapsible className={rootClass} defaultOpen>
      <CollapsibleTrigger className={triggerClass}>Trigger</CollapsibleTrigger>
      <CollapsibleContent className={contentClass}>Content 1</CollapsibleContent>
    </Collapsible>

    <h1>Controlled</h1>
    <h2>Closed</h2>
    <Collapsible className={rootClass} open={false}>
      <CollapsibleTrigger className={triggerClass}>Trigger</CollapsibleTrigger>
      <CollapsibleContent className={contentClass}>Content 1</CollapsibleContent>
    </Collapsible>

    <h2>Open</h2>
    <Collapsible className={rootClass} open>
      <CollapsibleTrigger className={triggerClass}>Trigger</CollapsibleTrigger>
      <CollapsibleContent className={contentClass}>Content 1</CollapsibleContent>
    </Collapsible>

    <h1>Disabled</h1>
    <Collapsible className={rootClass} disabled>
      <CollapsibleTrigger className={triggerClass}>Trigger</CollapsibleTrigger>
      <CollapsibleContent className={contentClass}>Content 1</CollapsibleContent>
    </Collapsible>

    <h1>State attributes</h1>
    <h2>Closed</h2>
    <Collapsible className={rootAttrClass}>
      <CollapsibleTrigger className={triggerAttrClass}>Trigger</CollapsibleTrigger>
      <CollapsibleContent className={contentAttrClass}>Content 1</CollapsibleContent>
    </Collapsible>

    <h2>Open</h2>
    <Collapsible className={rootAttrClass} defaultOpen>
      <CollapsibleTrigger className={triggerAttrClass}>Trigger</CollapsibleTrigger>
      <CollapsibleContent className={contentAttrClass}>Content 1</CollapsibleContent>
    </Collapsible>

    <h2>Disabled</h2>
    <Collapsible className={rootAttrClass} defaultOpen disabled>
      <CollapsibleTrigger className={triggerAttrClass}>Trigger</CollapsibleTrigger>
      <CollapsibleContent className={contentAttrClass}>Content 1</CollapsibleContent>
    </Collapsible>
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

const slideDown = css.keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-collapsible-content-height)' },
});

const slideUp = css.keyframes({
  from: { height: 'var(--radix-collapsible-content-height)' },
  to: { height: 0 },
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
