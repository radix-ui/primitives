/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { Accordion } from './Accordion';
import { styled } from '../../../../stitches.config';

export default { title: 'Components/Accordion' };

export const Styled = () => (
  <Accordion as={StyledRoot}>
    <Accordion.Item as={StyledItem} value="one">
      <Accordion.Header as={StyledHeader}>
        <Accordion.Button as={StyledButton}>One</Accordion.Button>
      </Accordion.Header>
      <Accordion.Panel as={StyledPanel}>
        Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
        integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
        habitant sed.
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item as={StyledItem} value="two">
      <Accordion.Header as={StyledHeader}>
        <Accordion.Button as={StyledButton}>Two</Accordion.Button>
      </Accordion.Header>
      <Accordion.Panel as={StyledPanel}>
        Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
        porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item as={StyledItem} value="three" disabled>
      <Accordion.Header as={StyledHeader}>
        <Accordion.Button as={StyledButton}>Three (disabled)</Accordion.Button>
      </Accordion.Header>
      <Accordion.Panel as={StyledPanel}>
        Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
        euismod magna, nec tempor pulvinar eu etiam mattis.
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item as={StyledItem} value="four">
      <Accordion.Header as={StyledHeader}>
        <Accordion.Button as={StyledButton}>Four</Accordion.Button>
      </Accordion.Header>
      <Accordion.Panel as={StyledPanel}>
        Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus dignissim
        vitae, enim vulputate nullam semper potenti etiam volutpat libero.
        <button>Cool</button>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>
);

export const Controlled = () => {
  const [value, setValue] = React.useState('one');

  return (
    <Accordion as={StyledRoot} value={value} onChange={setValue}>
      <Accordion.Item as={StyledItem} value="one">
        <Accordion.Header as={StyledHeader}>
          <Accordion.Button as={StyledButton}>One</Accordion.Button>
        </Accordion.Header>
        <Accordion.Panel as={StyledPanel}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item as={StyledItem} value="two">
        <Accordion.Header as={StyledHeader}>
          <Accordion.Button as={StyledButton}>Two</Accordion.Button>
        </Accordion.Header>
        <Accordion.Panel as={StyledPanel}>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </Accordion.Panel>
      </Accordion.Item>
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
      <Accordion.Item as={StyledItem} value="one">
        <Accordion.Header as={StyledHeader}>
          <Accordion.Button as={StyledButton}>One</Accordion.Button>
        </Accordion.Header>
        <Accordion.Panel as={StyledPanel}>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item as={StyledItem} value="two">
        <Accordion.Header as={StyledHeader}>
          <Accordion.Button as={StyledButton}>Two</Accordion.Button>
        </Accordion.Header>
        <Accordion.Panel as={StyledPanel}>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item as={StyledItem} value="three" disabled>
        <Accordion.Header as={StyledHeader}>
          <Accordion.Button as={StyledButton}>Three (disabled)</Accordion.Button>
        </Accordion.Header>
        <Accordion.Panel as={StyledPanel}>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item as={StyledItem} value="four">
        <Accordion.Header as={StyledHeader}>
          <Accordion.Button as={StyledButton}>Four</Accordion.Button>
        </Accordion.Header>
        <Accordion.Panel as={StyledPanel}>
          Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
          dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
    <div style={{ height: '150vh' }} />
  </>
);

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
