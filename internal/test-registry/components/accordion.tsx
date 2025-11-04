import * as React from 'react';
import { Accordion } from 'radix-ui';

export function Basic() {
  return (
    <Accordion.Root className="AccordionRoot" type="multiple">
      <Accordion.Item className="AccordionItem" value="one">
        <Accordion.Header className="AccordionHeader">
          <Accordion.Trigger className="AccordionTrigger">One</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="AccordionContent">
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className="AccordionItem" value="two">
        <Accordion.Header className="AccordionHeader">
          <Accordion.Trigger className="AccordionTrigger">Two</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="AccordionContent">
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className="AccordionItem" value="three" disabled>
        <Accordion.Header className="AccordionHeader">
          <Accordion.Trigger className="AccordionTrigger">Three (disabled)</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="AccordionContent">
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item className="AccordionItem" value="four">
        <Accordion.Header className="AccordionHeader">
          <Accordion.Trigger className="AccordionTrigger">Four</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="AccordionContent">
          Odio placerat quisque sapien sagittis non sociis ligula penatibus dignissim vitae, enim
          vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
