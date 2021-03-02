import * as React from 'react';
import { css } from '../../../../stitches.config';
import { Collapsible, CollapsibleButton, CollapsibleContent } from './Collapsible';

export default { title: 'Components/Collapsible' };

export const Styled = () => (
  <Collapsible className={rootClass}>
    <CollapsibleButton className={buttonClass}>Button</CollapsibleButton>
    <CollapsibleContent className={contentClass}>Content 1</CollapsibleContent>
  </Collapsible>
);

export const Animated = () => (
  <Collapsible className={rootClass}>
    <CollapsibleButton className={buttonClass}>Button</CollapsibleButton>
    <CollapsibleContent className={`${contentClass} ${animatedContentClass}`}>
      Content 1
    </CollapsibleContent>
  </Collapsible>
);

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>Closed</h2>
    <Collapsible className={rootClass}>
      <CollapsibleButton className={buttonClass}>Button</CollapsibleButton>
      <CollapsibleContent className={contentClass}>Content 1</CollapsibleContent>
    </Collapsible>

    <h2>Open</h2>
    <Collapsible className={rootClass} defaultOpen>
      <CollapsibleButton className={buttonClass}>Button</CollapsibleButton>
      <CollapsibleContent className={contentClass}>Content 1</CollapsibleContent>
    </Collapsible>

    <h1>Controlled</h1>
    <h2>Closed</h2>
    <Collapsible className={rootClass} open={false}>
      <CollapsibleButton className={buttonClass}>Button</CollapsibleButton>
      <CollapsibleContent className={contentClass}>Content 1</CollapsibleContent>
    </Collapsible>

    <h2>Open</h2>
    <Collapsible className={rootClass} open>
      <CollapsibleButton className={buttonClass}>Button</CollapsibleButton>
      <CollapsibleContent className={contentClass}>Content 1</CollapsibleContent>
    </Collapsible>

    <h1>Disabled</h1>
    <Collapsible className={rootClass} disabled>
      <CollapsibleButton className={buttonClass}>Button</CollapsibleButton>
      <CollapsibleContent className={contentClass}>Content 1</CollapsibleContent>
    </Collapsible>

    <h1>State attributes</h1>
    <h2>Closed</h2>
    <Collapsible className={rootAttrClass}>
      <CollapsibleButton className={buttonAttrClass}>Button</CollapsibleButton>
      <CollapsibleContent className={contentAttrClass}>Content 1</CollapsibleContent>
    </Collapsible>

    <h2>Open</h2>
    <Collapsible className={rootAttrClass} defaultOpen>
      <CollapsibleButton className={buttonAttrClass}>Button</CollapsibleButton>
      <CollapsibleContent className={contentAttrClass}>Content 1</CollapsibleContent>
    </Collapsible>

    <h2>Disabled</h2>
    <Collapsible className={rootAttrClass} defaultOpen disabled>
      <CollapsibleButton className={buttonAttrClass}>Button</CollapsibleButton>
      <CollapsibleContent className={contentAttrClass}>Content 1</CollapsibleContent>
    </Collapsible>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

const rootClass = css({
  maxWidth: '20em',
  fontFamily: 'sans-serif',
});

const RECOMMENDED_CSS__COLLAPSIBLE__BUTTON: any = {
  // because it's a button, we want to stretch it
  width: '100%',
  // and remove center text alignment in favour of inheriting
  textAlign: 'inherit',
};

const buttonClass = css({
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

const contentClass = css({
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

const animatedContentClass = css({
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
  '&[data-disabled]': { borderStyle: 'dashed' },
  '&:disabled': { opacity: 0.5 },
};
const rootAttrClass = css(styles);
const buttonAttrClass = css(styles);
const contentAttrClass = css({
  // ensure we can see the content (because it has `hidden` attribute)
  display: 'block',
  ...styles,
});
