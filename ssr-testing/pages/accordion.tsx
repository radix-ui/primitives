import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionButton,
  AccordionPanel,
} from '@radix-ui/react-accordion';

export default function AccordionPage() {
  return (
    <Accordion>
      <AccordionItem value="one">
        <AccordionHeader>
          <AccordionButton>One</AccordionButton>
        </AccordionHeader>
        <AccordionPanel>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionHeader>
          <AccordionButton>Two</AccordionButton>
        </AccordionHeader>
        <AccordionPanel>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="three" disabled>
        <AccordionHeader>
          <AccordionButton>Three (disabled)</AccordionButton>
        </AccordionHeader>
        <AccordionPanel>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="four">
        <AccordionHeader>
          <AccordionButton>Four</AccordionButton>
        </AccordionHeader>
        <AccordionPanel>
          Odio placerat quisque sapien sagittis non sociis ligula penatibus dignissim vitae, enim
          vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
