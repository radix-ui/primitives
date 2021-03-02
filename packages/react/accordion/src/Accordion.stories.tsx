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
  <Accordion className={rootClass}>
    <AccordionItem className={itemClass} value="one">
      <AccordionHeader className={headerClass}>
        <AccordionButton className={buttonClass}>One</AccordionButton>
      </AccordionHeader>
      <AccordionPanel className={panelClass}>
        Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
        integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
        habitant sed.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem className={itemClass} value="two">
      <AccordionHeader className={headerClass}>
        <AccordionButton className={buttonClass}>Two</AccordionButton>
      </AccordionHeader>
      <AccordionPanel className={panelClass}>
        Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
        porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem className={itemClass} value="three" disabled>
      <AccordionHeader className={headerClass}>
        <AccordionButton className={buttonClass}>Three (disabled)</AccordionButton>
      </AccordionHeader>
      <AccordionPanel className={panelClass}>
        Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
        euismod magna, nec tempor pulvinar eu etiam mattis.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem className={itemClass} value="four">
      <AccordionHeader className={headerClass}>
        <AccordionButton className={buttonClass}>Four</AccordionButton>
      </AccordionHeader>
      <AccordionPanel className={panelClass}>
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
    <Accordion className={rootClass} value={value} onValueChange={(value) => setValue(value)}>
      <AccordionItem className={itemClass} value="one">
        <AccordionHeader className={headerClass}>
          <AccordionButton className={buttonClass}>One</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panelClass}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem className={itemClass} value="two">
        <AccordionHeader className={headerClass}>
          <AccordionButton className={buttonClass}>Two</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panelClass}>
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
    <Accordion className={rootClass}>
      <AccordionItem className={itemClass} value="one">
        <AccordionHeader className={headerClass}>
          <AccordionButton className={buttonClass}>One</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panelClass}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem className={itemClass} value="two">
        <AccordionHeader className={headerClass}>
          <AccordionButton className={buttonClass}>Two</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panelClass}>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem className={itemClass} value="three" disabled>
        <AccordionHeader className={headerClass}>
          <AccordionButton className={buttonClass}>Three (disabled)</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panelClass}>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem className={itemClass} value="four">
        <AccordionHeader className={headerClass}>
          <AccordionButton className={buttonClass}>Four</AccordionButton>
        </AccordionHeader>
        <AccordionPanel className={panelClass}>
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
      <Accordion className={rootClass}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>Open</h2>
      <Accordion className={rootClass} defaultValue="Two">
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Controlled</h1>
      <h2>Open</h2>
      <Accordion className={rootClass} value="Three">
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Disabled (whole)</h1>
      <Accordion className={rootClass} disabled>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Disabled (item)</h1>
      <h2>Just item</h2>
      <Accordion className={rootClass}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item} disabled={item === 'Two'}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h2>with `disabled=false` on top-level</h2>
      <Accordion className={rootClass} disabled={false}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item} disabled={item === 'Two'}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Force mounted panels</h1>
      <Accordion className={rootClass}>
        {items.map((item) => (
          <AccordionItem key={item} className={itemClass} value={item}>
            <AccordionHeader className={headerClass}>
              <AccordionButton className={buttonClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelClass} forceMount>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>State attributes</h1>
      <Accordion className={rootAttrClass} defaultValue="Two">
        {items.map((item) => (
          <AccordionItem
            key={item}
            className={itemAttrClass}
            value={item}
            disabled={item === 'Four'}
          >
            <AccordionHeader className={headerAttrClass}>
              <AccordionButton className={buttonAttrClass}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel className={panelAttrClass}>
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

const rootClass = css({
  maxWidth: '20em',
  fontFamily: 'sans-serif',
});

const itemClass = css({
  borderBottom: '1px solid white',
});

const headerClass = css({
  margin: 0,
});

const RECOMMENDED_CSS__ACCORDION__BUTTON: any = {
  // because it's a button, we want to stretch it
  width: '100%',
  // and remove center text alignment in favour of inheriting
  textAlign: 'inherit',
};

const buttonClass = css({
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

const panelClass = css({
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
const rootAttrClass = css(styles);
const itemAttrClass = css(styles);
const headerAttrClass = css(styles);
const buttonAttrClass = css(styles);
const panelAttrClass = css({
  // ensure we can see the content (because it has `hidden` attribute)
  display: 'block',
  ...styles,
});
