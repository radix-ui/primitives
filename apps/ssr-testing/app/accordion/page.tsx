import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from '@radix-ui/react-accordion';

export default function Page() {
  return (
    <Accordion type="multiple">
      <AccordionItem value="one">
        <AccordionHeader>
          <AccordionTrigger>One</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionHeader>
          <AccordionTrigger>Two</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="three" disabled>
        <AccordionHeader>
          <AccordionTrigger>Three (disabled)</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="four">
        <AccordionHeader>
          <AccordionTrigger>Four</AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          Odio placerat quisque sapien sagittis non sociis ligula penatibus dignissim vitae, enim
          vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
