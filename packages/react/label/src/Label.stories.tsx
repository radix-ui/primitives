import * as React from 'react';
import { css } from '../../../../stitches.config';
import { Label } from '@radix-ui/react-label';

export default { title: 'Components/Label', excludeStories: ['RECOMMENDED_CSS__LABEL__ROOT'] };

export const Styled = () => <Label className={rootClass()}>Label</Label>;

export const WithControl = () => {
  return (
    <>
      <h1>Wrapping control</h1>
      <Label>
        <Control className={controlClass()} /> Label
      </Label>

      <h1>Referencing control</h1>
      <Control id="control" className={controlClass()} />
      <Label htmlFor="control">Label</Label>
    </>
  );
};

const Control = (props: any) => {
  return (
    <button className={controlClass()} {...props} onClick={() => window.alert('clicked')}>
      Control
    </button>
  );
};

export const RECOMMENDED_CSS__LABEL__ROOT = {
  // ensures it can receive vertical margins
  display: 'inline-block',
  // better default alignment
  verticalAlign: 'middle',
  // mimics default `label` tag (as we render a `span`)
  cursor: 'default',
};

const rootClass = css({
  ...RECOMMENDED_CSS__LABEL__ROOT,
  display: 'inline-block',
  border: '1px solid gainsboro',
  padding: 10,
});

const controlClass = css({
  display: 'inline-flex',
  border: '1px solid gainsboro',
  padding: 10,
  verticalAlign: 'middle',
  margin: '0 10px',

  '&:hover': {
    backgroundColor: 'red',
  },
});
