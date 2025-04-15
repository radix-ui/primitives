import * as React from 'react';
import { Accordion } from 'radix-ui';

export default function Page() {
  return (
    <Accordion.Root type="multiple">
      <Accordion.Item value="one">
        <Accordion.Header>
          <Accordion.Trigger>One</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="two">
        <Accordion.Header>
          <Accordion.Trigger>Two</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="three" disabled>
        <Accordion.Header>
          <Accordion.Trigger>Three (disabled)</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="four">
        <Accordion.Header>
          <Accordion.Trigger>Four</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          Odio placerat quisque sapien sagittis non sociis ligula penatibus dignissim vitae, enim
          vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
