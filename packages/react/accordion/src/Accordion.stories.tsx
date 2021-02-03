/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { css } from '../../../../stitches.config';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionButton,
  AccordionPanel,
} from './Accordion';

export default { title: 'Components/Accordion' };

export const Styled = () => (
  <Accordion className={root}>
    <AccordionItem className={item} value="one">
      <AccordionHeader className={header}>
        <AccordionButton className={button}>One</AccordionButton>
      </AccordionHeader>
      <AccordionPanel className={panel}>
        Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
        integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
        habitant sed.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem className={item} value="two">
      <AccordionHeader className={header}>
        <AccordionButton className={button}>Two</AccordionButton>
      </AccordionHeader>
      <AccordionPanel className={panel}>
        Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
        porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem className={item} value="three" disabled>
      <AccordionHeader className={header}>
        <AccordionButton className={button}>Three (disabled)</AccordionButton>
      </AccordionHeader>
      <AccordionPanel className={panel}>
        Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
        euismod magna, nec tempor pulvinar eu etiam mattis.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem className={item} value="four">
      <AccordionHeader className={header}>
        <AccordionButton className={button}>Four</AccordionButton>
      </AccordionHeader>
      <AccordionPanel className={panel}>
        Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus dignissim
        vitae, enim vulputate nullam semper potenti etiam volutpat libero.
        <button>Cool</button>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

export const Controlled = () => {
  const [value, setValue] = React.useState('one');

  return (
    <Accordion className={root} value={value} onValueChange={(value) => setValue(value)}>
      <AccordionItem className={item} value="one">
        <AccordionHeader className={header}>
          <AccordionButton className={button}>One</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panel}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem className={item} value="two">
        <AccordionHeader className={header}>
          <AccordionButton className={button}>Two</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panel}>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export const OutsideViewport = () => (
  <>
    <p>Scroll down to see tabs</p>
    <div style={{ height: '150vh' }} />
    <p>
      When accordion buttons are focused and the user is navigating via keyboard, the page should
      not scroll unless the next tab is entering the viewport.
    </p>
    <Accordion className={root}>
      <AccordionItem className={item} value="one">
        <AccordionHeader className={header}>
          <AccordionButton className={button}>One</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panel}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem className={item} value="two">
        <AccordionHeader className={header}>
          <AccordionButton className={button}>Two</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panel}>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem className={item} value="three" disabled>
        <AccordionHeader className={header}>
          <AccordionButton className={button}>Three (disabled)</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panel}>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem className={item} value="four">
        <AccordionHeader className={header}>
          <AccordionButton className={button}>Four</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panel}>
          Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
          dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
    <div style={{ height: '150vh' }} />
  </>
);

export const Chromatic = () => {
  const items = ['One', 'Two', 'Three', 'Four'];
  return (
    <>
      <h1>Uncontrolled</h1>
      <h2>Closed</h2>
      <Accordion className={root}>
        {items.map((item) => (
          <AccordionItem key={item} className={item} value={item}>
            <AccordionHeader className={header}>
              <AccordionButton className={button}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panel}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>Open</h2>
      <Accordion className={root} defaultValue="Two">
        {items.map((item) => (
          <AccordionItem key={item} className={item} value={item}>
            <AccordionHeader className={header}>
              <AccordionButton className={button}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panel}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Controlled</h1>
      <h2>Open</h2>
      <Accordion className={root} value="Three">
        {items.map((item) => (
          <AccordionItem key={item} className={item} value={item}>
            <AccordionHeader className={header}>
              <AccordionButton className={button}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panel}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Disabled (whole)</h1>
      <Accordion className={root} disabled>
        {items.map((item) => (
          <AccordionItem key={item} className={item} value={item}>
            <AccordionHeader className={header}>
              <AccordionButton className={button}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panel}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Disabled (item)</h1>
      <h2>Just item</h2>
      <Accordion className={root}>
        {items.map((item) => (
          <AccordionItem key={item} className={item} value={item} disabled={item === 'Two'}>
            <AccordionHeader className={header}>
              <AccordionButton className={button}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panel}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>with `disabled=false` on top-level</h2>
      <Accordion className={root} disabled={false}>
        {items.map((item) => (
          <AccordionItem key={item} className={item} value={item} disabled={item === 'Two'}>
            <AccordionHeader className={header}>
              <AccordionButton className={button}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panel}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Force mounted panels</h1>
      <Accordion className={root}>
        {items.map((item) => (
          <AccordionItem key={item} className={item} value={item}>
            <AccordionHeader className={header}>
              <AccordionButton className={button}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panel} forceMount>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Data attribute selectors</h1>
      <Accordion className={rootAttr} defaultValue="Two">
        {items.map((item) => (
          <AccordionItem key={item} className={itemAttr} value={item} disabled={item === 'Four'}>
            <AccordionHeader className={headerAttr}>
              <AccordionButton className={buttonAttr}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelAttr}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};
Chromatic.parameters = { chromatic: { disable: false } };

const root = css({
  maxWidth: '20em',
  fontFamily: 'sans-serif',
});

const item = css({
  borderBottom: '1px solid white',
});

const header = css({
  margin: 0,
});

const RECOMMENDED_CSS__ACCORDION__BUTTON: any = {
  // because it's a button, we want to stretch it
  width: '100%',
  // and remove center text alignment in favour of inheriting
  textAlign: 'inherit',
};

const button = css({
  ...RECOMMENDED_CSS__ACCORDION__BUTTON,
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

const panel = css({
  padding: 10,
  lineHeight: 1.5,
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
const rootAttr = css({ '&[data-radix-accordion]': styles });
const itemAttr = css({ '&[data-radix-accordion-item]': styles });
const headerAttr = css({ '&[data-radix-accordion-header]': styles });
const buttonAttr = css({ '&[data-radix-accordion-button]': styles });
const panelAttr = css({ '&[data-radix-accordion-panel]': styles });
