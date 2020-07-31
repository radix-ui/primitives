/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { Accordion } from './Accordion';

export default { title: 'Accordion' };

export function Basic() {
  return (
    <Accordion>
      <Accordion.Item value="one">
        <Accordion.Button>One</Accordion.Button>
        <Accordion.Panel>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="two">
        <Accordion.Button>Two</Accordion.Button>
        <Accordion.Panel>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="three" disabled>
        <Accordion.Button>Three</Accordion.Button>
        <Accordion.Panel>
          Sociis hac sapien turpis conubia sagittis justo dui, inceptos penatibus feugiat himenaeos
          euismod magna, nec tempor pulvinar eu etiam mattis.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="four">
        <Accordion.Button>Four</Accordion.Button>
        <Accordion.Panel>
          Odio placerat <a href="#">quisque</a> sapien sagittis non sociis ligula penatibus
          dignissim vitae, enim vulputate nullam semper potenti etiam volutpat libero.
          <button>Cool</button>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export function Controlled() {
  let [value, setValue] = React.useState('one');
  return (
    <Accordion value={value} onChange={setValue}>
      <Accordion.Item value="one">
        <Accordion.Button>One</Accordion.Button>
        <Accordion.Panel>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit vulputate viverra
          integer ullamcorper congue curabitur sociis, nisi malesuada scelerisque quam suscipit
          habitant sed.
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="two">
        <Accordion.Button>Two</Accordion.Button>
        <Accordion.Panel>
          Cursus sed mattis commodo fermentum conubia ipsum pulvinar sagittis, diam eget bibendum
          porta nascetur ac dictum, leo tellus dis integer platea ultrices mi.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
