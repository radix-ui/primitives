/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { styled } from '../../../../stitches.config';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionButton,
  AccordionPanel,
} from './Accordion';

export default { title: 'Components/Accordion' };

export const Styled = () => (
  <Accordion as={StyledRoot}>
    <AccordionItem as={StyledItem} value="one">
      <AccordionHeader as={StyledHeader}>
        <AccordionButton as={StyledButton}>One</AccordionButton>
      </AccordionHeader>
      <AccordionPanel as={StyledPanel}>
        Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
        integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
        habitant sed.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem as={StyledItem} value="two">
      <AccordionHeader as={StyledHeader}>
        <AccordionButton as={StyledButton}>Two</AccordionButton>
      </AccordionHeader>
      <AccordionPanel as={StyledPanel}>
        Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
        porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem as={StyledItem} value="three" disabled>
      <AccordionHeader as={StyledHeader}>
        <AccordionButton as={StyledButton}>Three (disabled)</AccordionButton>
      </AccordionHeader>
      <AccordionPanel as={StyledPanel}>
        Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
        euismod magna, nec tempor pulvinar eu etiam mattis.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem as={StyledItem} value="four">
      <AccordionHeader as={StyledHeader}>
        <AccordionButton as={StyledButton}>Four</AccordionButton>
      </AccordionHeader>
      <AccordionPanel as={StyledPanel}>
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
    <Accordion as={StyledRoot} value={value} onValueChange={(value) => setValue(value)}>
      <AccordionItem as={StyledItem} value="one">
        <AccordionHeader as={StyledHeader}>
          <AccordionButton as={StyledButton}>One</AccordionButton>
        </AccordionHeader>
        <AccordionPanel as={StyledPanel}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem as={StyledItem} value="two">
        <AccordionHeader as={StyledHeader}>
          <AccordionButton as={StyledButton}>Two</AccordionButton>
        </AccordionHeader>
        <AccordionPanel as={StyledPanel}>
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
    <Accordion as={StyledRoot}>
      <AccordionItem as={StyledItem} value="one">
        <AccordionHeader as={StyledHeader}>
          <AccordionButton as={StyledButton}>One</AccordionButton>
        </AccordionHeader>
        <AccordionPanel as={StyledPanel}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem as={StyledItem} value="two">
        <AccordionHeader as={StyledHeader}>
          <AccordionButton as={StyledButton}>Two</AccordionButton>
        </AccordionHeader>
        <AccordionPanel as={StyledPanel}>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem as={StyledItem} value="three" disabled>
        <AccordionHeader as={StyledHeader}>
          <AccordionButton as={StyledButton}>Three (disabled)</AccordionButton>
        </AccordionHeader>
        <AccordionPanel as={StyledPanel}>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem as={StyledItem} value="four">
        <AccordionHeader as={StyledHeader}>
          <AccordionButton as={StyledButton}>Four</AccordionButton>
        </AccordionHeader>
        <AccordionPanel as={StyledPanel}>
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
      <Accordion as={StyledRoot}>
        {items.map((item) => (
          <AccordionItem key={item} as={StyledItem} value={item}>
            <AccordionHeader as={StyledHeader}>
              <AccordionButton as={StyledButton}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel as={StyledPanel}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Uncontrolled with `defaultValue` prop</h1>
      <Accordion as={StyledRoot} defaultValue="Two">
        {items.map((item) => (
          <AccordionItem key={item} as={StyledItem} value={item}>
            <AccordionHeader as={StyledHeader}>
              <AccordionButton as={StyledButton}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel as={StyledPanel}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>Controlled with `value` prop</h1>
      <Accordion as={StyledRoot} value="Three">
        {items.map((item) => (
          <AccordionItem key={item} as={StyledItem} value={item}>
            <AccordionHeader as={StyledHeader}>
              <AccordionButton as={StyledButton}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel as={StyledPanel}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>With `disabled` prop</h1>
      <Accordion as={StyledRoot} disabled>
        {items.map((item) => (
          <AccordionItem key={item} as={StyledItem} value={item}>
            <AccordionHeader as={StyledHeader}>
              <AccordionButton as={StyledButton}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel as={StyledPanel}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>With `disabled` prop on `AccordionItem`</h1>
      <Accordion as={StyledRoot}>
        {items.map((item) => (
          <AccordionItem key={item} as={StyledItem} value={item} disabled={item === 'Two'}>
            <AccordionHeader as={StyledHeader}>
              <AccordionButton as={StyledButton}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel as={StyledPanel}>
              {item}: Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate
              viverra integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam
              suscipit habitant sed.
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <h1>With `forceMount` prop on `AccordionPanel`</h1>
      <Accordion as={StyledRoot}>
        {items.map((item) => (
          <AccordionItem key={item} as={StyledItem} value={item}>
            <AccordionHeader as={StyledHeader}>
              <AccordionButton as={StyledButton}>{item}</AccordionButton>
            </AccordionHeader>
            <AccordionPanel as={StyledPanel} forceMount>
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

const StyledRoot = styled('div', {
  maxWidth: '20em',
  fontFamily: 'sans-serif',
});

const StyledItem = styled('div', {
  borderBottom: '1px solid white',
});

const StyledHeader = styled('h3', {
  margin: 0,
});

const RECOMMENDED_CSS__ACCORDION__BUTTON: any = {
  // because it's a button, we want to stretch it
  width: '100%',
  // and remove center text alignment in favour of inheriting
  textAlign: 'inherit',
};

const StyledButton = styled('button', {
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

  '&:disabled': {
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

const StyledPanel = styled('div', {
  padding: 10,
  lineHeight: 1.5,
});
