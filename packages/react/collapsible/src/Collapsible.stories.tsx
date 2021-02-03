import * as React from 'react';
import { css } from '../../../../stitches.config';
import { Collapsible, CollapsibleButton, CollapsibleContent } from './Collapsible';

export default { title: 'Components/Collapsible' };

export const Styled = () => (
  <Collapsible className={root}>
    <CollapsibleButton className={button}>Button</CollapsibleButton>
    <CollapsibleContent className={content}>Content 1</CollapsibleContent>
  </Collapsible>
);

export const Animated = () => (
  <Collapsible className={root}>
    <CollapsibleButton className={button}>Button</CollapsibleButton>
    <CollapsibleContent className={`${content} ${animatedContent}`}>Content 1</CollapsibleContent>
  </Collapsible>
);

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>Closed</h2>
    <Collapsible className={root}>
      <CollapsibleButton className={button}>Button</CollapsibleButton>
      <CollapsibleContent className={content}>Content 1</CollapsibleContent>
    </Collapsible>

    <h2>Open</h2>
    <Collapsible className={root} defaultOpen>
      <CollapsibleButton className={button}>Button</CollapsibleButton>
      <CollapsibleContent className={content}>Content 1</CollapsibleContent>
    </Collapsible>

    <h1>Controlled</h1>
    <h2>Closed</h2>
    <Collapsible className={root} open={false}>
      <CollapsibleButton className={button}>Button</CollapsibleButton>
      <CollapsibleContent className={content}>Content 1</CollapsibleContent>
    </Collapsible>

    <h2>Open</h2>
    <Collapsible className={root} open>
      <CollapsibleButton className={button}>Button</CollapsibleButton>
      <CollapsibleContent className={content}>Content 1</CollapsibleContent>
    </Collapsible>

    <h1>Disabled</h1>
    <Collapsible className={root} disabled>
      <CollapsibleButton className={button}>Button</CollapsibleButton>
      <CollapsibleContent className={content}>Content 1</CollapsibleContent>
    </Collapsible>

    <h1>Data attribute selectors</h1>
    <h2>Default</h2>
    <Collapsible className={rootAttr}>
      <CollapsibleButton className={buttonAttr}>Button</CollapsibleButton>
      <CollapsibleContent className={contentAttr}>Content 1</CollapsibleContent>
    </Collapsible>
    <Collapsible className={rootAttr} defaultOpen>
      <CollapsibleButton className={buttonAttr}>Button</CollapsibleButton>
      <CollapsibleContent className={contentAttr}>Content 1</CollapsibleContent>
    </Collapsible>

    <h2>Disabled</h2>
    <Collapsible className={rootAttr} defaultOpen disabled>
      <CollapsibleButton className={buttonAttr}>Button</CollapsibleButton>
      <CollapsibleContent className={contentAttr}>Content 1</CollapsibleContent>
    </Collapsible>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

const root = css({
  maxWidth: '20em',
  fontFamily: 'sans-serif',
});

const RECOMMENDED_CSS__COLLAPSIBLE__BUTTON: any = {
  // because it's a button, we want to stretch it
  width: '100%',
  // and remove center text alignment in favour of inheriting
  textAlign: 'inherit',
};

const button = css({
  ...RECOMMENDED_CSS__COLLAPSIBLE__BUTTON,
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

const content = css({
  padding: 10,
  lineHeight: 1.5,
});

const fadeIn = css.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = css.keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const animatedContent = css({
  '&[data-state="open"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '&[data-state="closed"]': { borderColor: 'red' },
  '&[data-state="open"]': { borderColor: 'green' },
  '&:disabled': { opacity: 0.5 },
  '&[data-disabled]': { fontSize: '1.5em' },
};
const rootAttr = css({ '&[data-radix-collapsible]': styles });
const buttonAttr = css({ '&[data-radix-collapsible-button]': styles });
const contentAttr = css({
  '&[data-radix-collapsible-content]': {
    // ensure we can see the content (because it has `hidden` attribute)
    display: 'block',
    ...styles,
  },
});
