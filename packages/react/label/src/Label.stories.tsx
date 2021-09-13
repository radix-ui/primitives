import * as React from 'react';
import { Label, useLabelContext } from './Label';
import { IdProvider } from '@radix-ui/react-id';
import * as Checkbox from '@radix-ui/react-checkbox';
import { css } from '../../../../stitches.config';

export default { title: 'Components/Label', excludeStories: ['RECOMMENDED_CSS__LABEL__ROOT'] };

export const Styled = () => <Label className={rootClass}>Label</Label>;

export const AutoGeneratedId = () => (
  <Label className={rootClass}>
    Label <Control />
  </Label>
);

export const SuppliedId = () => (
  <Label id="test" className={rootClass}>
    Label <Control />
  </Label>
);

export const WithHtmlFor = () => (
  <>
    <Label htmlFor="test" className={rootClass}>
      This should add an `aria-labelledby` to the control
    </Label>
    <Control id="test" />
  </>
);

export const WithControl = () => {
  return (
    <>
      <h1>Wrapping control</h1>
      <Label>
        <Checkbox.Root className={controlClass}>
          <Checkbox.Indicator className={indicatorClass} />
        </Checkbox.Root>{' '}
        Label
      </Label>

      <h1>Referencing control</h1>
      <Checkbox.Root id="control" className={controlClass}>
        <Checkbox.Indicator className={indicatorClass} />{' '}
      </Checkbox.Root>
      <Label htmlFor="control">Label</Label>

      <h1>Wrapping control - stopping propagation</h1>
      <Label>
        <Checkbox.Root className={controlClass}>
          <Checkbox.Indicator className={indicatorClass} />
        </Checkbox.Root>{' '}
        Label.{' '}
        <span
          aria-hidden
          style={{ color: 'royalblue' }}
          onClick={(event) => event.stopPropagation()}
        >
          Clicking me should not propagate
        </span>
      </Label>

      <h1>Referencing control - stopping propagation</h1>
      <Checkbox.Root id="control-b" className={controlClass}>
        <Checkbox.Indicator className={indicatorClass} />{' '}
      </Checkbox.Root>
      <Label htmlFor="control-b">
        Label.{' '}
        <span
          aria-hidden
          style={{ color: 'royalblue' }}
          onClick={(event) => event.stopPropagation()}
        >
          Clicking me should not propagate
        </span>
      </Label>
    </>
  );
};

export const Chromatic = () => (
  <IdProvider>
    <h1>Auto generated id</h1>
    <Label className={chromaticRootClass}>
      <Control />
    </Label>

    <h1>Supplied id</h1>
    <Label id="one" className={chromaticRootClass}>
      <Control />
    </Label>

    <h1>With htmlFor</h1>
    <Label htmlFor="two" className={chromaticRootClass}>
      {' '}
      This should add an `aria-labelledby` to the control
    </Label>
    <Control id="two" />
  </IdProvider>
);
Chromatic.parameters = { chromatic: { disable: false } };

const Control = (props: any) => {
  const id = useLabelContext();
  return (
    <span aria-labelledby={id} className={controlClass} {...props}>
      Control is labelled by:{' '}
    </span>
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

  '&::after': {
    content: 'attr(aria-labelledby)',
    marginLeft: 5,
  },
});

const indicatorClass = css({
  display: 'inline-block',
  width: 15,
  height: 15,
  background: 'black',
  marginRight: 10,
});

const chromaticRootClass = css(rootClass, {
  '&::before': {
    content: 'attr(id)',
  },
});
