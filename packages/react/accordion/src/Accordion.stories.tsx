/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { Accordion as AccordionPrimitive, styles } from './Accordion';

export default { title: 'Accordion' };

export const Basic = () => (
  <Accordion>
    <AccordionItem value="one">
      <AccordionButton>One</AccordionButton>
      <AccordionPanel>
        Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
        integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
        habitant sed.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem value="two">
      <AccordionButton>Two</AccordionButton>
      <AccordionPanel>
        Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
        porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem value="three" disabled>
      <AccordionButton>Three (disabled)</AccordionButton>
      <AccordionPanel>
        Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
        euismod magna, nec tempor pulvinar eu etiam mattis.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem value="four">
      <AccordionButton>Four</AccordionButton>
      <AccordionPanel>
        Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus dignissim
        vitae, enim vulputate nullam semper potenti etiam volutpat libero.
        <button>Cool</button>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

export const Controlled = () => {
  let [value, setValue] = React.useState('one');

  return (
    <Accordion value={value} onChange={setValue}>
      <AccordionItem value="one">
        <AccordionButton>One</AccordionButton>
        <AccordionPanel>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionButton>Two</AccordionButton>
        <AccordionPanel>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export const InlineStyle = () => (
  <Accordion>
    <AccordionItem value="one" style={{ background: 'ghostwhite', border: '1px solid gainsboro' }}>
      <AccordionButton style={{ background: 'gainsboro' }}>One</AccordionButton>
      <AccordionPanel>
        Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
        integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
        habitant sed.
      </AccordionPanel>
    </AccordionItem>
    <AccordionItem value="two" style={{ background: 'ghostwhite', border: '1px solid gainsboro' }}>
      <AccordionButton style={{ background: 'gainsboro' }}>Two</AccordionButton>
      <AccordionPanel>
        Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
        integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
        habitant sed.
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

export const OutsideViewport = () => (
  <>
    <p>Scroll down to see tabs</p>
    <div style={{ height: '150vh' }} />
    <p>
      When accordion buttons are focused and the user is navigating via keyboard, the page should
      not scroll unless the next tab is entering the viewport.
    </p>
    <Accordion>
      <AccordionItem value="one">
        <AccordionButton>One</AccordionButton>
        <AccordionPanel>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionButton>Two</AccordionButton>
        <AccordionPanel>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="three" disabled>
        <AccordionButton>Three (disabled)</AccordionButton>
        <AccordionPanel>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="four">
        <AccordionButton>Four</AccordionButton>
        <AccordionPanel>
          Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
          dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
    <div style={{ height: '150vh' }} />
  </>
);

const Accordion = (props: React.ComponentProps<typeof AccordionPrimitive>) => (
  <AccordionPrimitive {...props} style={{ ...styles.root, ...props.style }} />
);

const AccordionItem = (props: React.ComponentProps<typeof AccordionPrimitive.Item>) => (
  <AccordionPrimitive.Item {...props} style={{ ...styles.item, ...props.style }} />
);

const AccordionButton = (props: React.ComponentProps<typeof AccordionPrimitive.Button>) => (
  <AccordionPrimitive.Header style={styles.header}>
    <AccordionPrimitive.Button {...props} style={{ ...styles.button, ...props.style }} />
  </AccordionPrimitive.Header>
);

const AccordionPanel = (props: React.ComponentProps<typeof AccordionPrimitive.Panel>) => (
  <AccordionPrimitive.Panel {...props} style={{ ...styles.panel, ...props.style }} />
);
