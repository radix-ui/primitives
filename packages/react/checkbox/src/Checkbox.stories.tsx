import * as React from 'react';
import { Label as LabelPrimitive } from '@radix-ui/react-label';
import { Checkbox, CheckboxIndicator } from './Checkbox';
import { css } from '../../../../stitches.config';
import { RECOMMENDED_CSS__LABEL__ROOT } from '../../label/src/Label.stories';

export default { title: 'Components/Checkbox' };

export const Styled = () => (
  <>
    <p>
      This checkbox is nested inside a label. The box-shadow is styled to appear when the checkbox
      is in focus regardless of the input modality. The state is uncontrolled.
    </p>
    <Label>
      Label{' '}
      <Checkbox className={rootClass}>
        <CheckboxIndicator className={indicatorClass} />
      </Checkbox>
    </Label>
  </>
);

export const Controlled = () => {
  const [checked, setChecked] = React.useState(true);

  return (
    <>
      <p>
        This checkbox is placed adjacent to its label. The box-shadow is styled to appear when the
        checkbox is in focus regardless of the input modality. The state is controlled.
      </p>
      <Label htmlFor="randBox">Label</Label>{' '}
      <Checkbox
        className={rootClass}
        checked={checked}
        onCheckedChange={(event) => setChecked(event.target.checked)}
        id="randBox"
      >
        <CheckboxIndicator className={indicatorClass} />
      </Checkbox>
    </>
  );
};

export const Indeterminate = () => {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>('indeterminate');

  return (
    <>
      <p>
        <Checkbox
          className={rootClass}
          checked={checked}
          onCheckedChange={(event) => setChecked(event.target.checked)}
        >
          <CheckboxIndicator className={indicatorClass} />
        </Checkbox>
      </p>

      <button
        type="button"
        onClick={() =>
          setChecked((prevIsChecked) =>
            prevIsChecked === 'indeterminate' ? false : 'indeterminate'
          )
        }
      >
        Toggle indeterminate
      </button>
    </>
  );
};

export const WithinForm = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <form
      onChange={(event) => {
        const input = event.target as HTMLInputElement;
        setChecked(input.checked);
      }}
    >
      <p>checked: {String(checked)}</p>

      <Checkbox className={rootClass}>
        <CheckboxIndicator className={indicatorClass} />
      </Checkbox>
    </form>
  );
};

export const Animated = () => {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>('indeterminate');

  return (
    <>
      <p>
        <Checkbox
          className={rootClass}
          checked={checked}
          onCheckedChange={(event) => setChecked(event.target.checked)}
        >
          <CheckboxIndicator className={animatedIndicatorClass} />
        </Checkbox>
      </p>

      <button
        type="button"
        onClick={() =>
          setChecked((prevIsChecked) =>
            prevIsChecked === 'indeterminate' ? false : 'indeterminate'
          )
        }
      >
        Toggle indeterminate
      </button>
    </>
  );
};

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>Unchecked</h2>
    <Checkbox className={rootClass}>
      <CheckboxIndicator className={indicatorClass} />
    </Checkbox>

    <h2>Checked</h2>
    <Checkbox className={rootClass} defaultChecked>
      <CheckboxIndicator className={indicatorClass} />
    </Checkbox>

    <h1>Controlled</h1>
    <h2>Unchecked</h2>
    <Checkbox className={rootClass} checked={false}>
      <CheckboxIndicator className={indicatorClass} />
    </Checkbox>

    <h2>Checked</h2>
    <Checkbox className={rootClass} checked>
      <CheckboxIndicator className={indicatorClass} />
    </Checkbox>

    <h1>Indeterminate</h1>
    <Checkbox className={rootClass} checked="indeterminate">
      <CheckboxIndicator className={indicatorClass} />
    </Checkbox>

    <h1>Disabled</h1>
    <Checkbox className={rootClass} defaultChecked disabled>
      <CheckboxIndicator className={indicatorClass} />
    </Checkbox>

    <h1>Force mounted indicator</h1>
    <Checkbox className={rootClass}>
      <CheckboxIndicator className={indicatorClass} forceMount style={{ height: 20 }} />
    </Checkbox>

    <h1>State attributes</h1>
    <h2>Unchecked</h2>
    <Checkbox className={rootAttrClass}>
      <CheckboxIndicator className={indicatorAttrClass} />
    </Checkbox>

    <h2>Checked</h2>
    <Checkbox className={rootAttrClass} defaultChecked>
      <CheckboxIndicator className={indicatorAttrClass} />
    </Checkbox>

    <h2>Indeterminate</h2>
    <Checkbox className={rootAttrClass} checked="indeterminate">
      <CheckboxIndicator className={indicatorAttrClass} />
    </Checkbox>

    <h2>Disabled</h2>
    <Checkbox className={rootAttrClass} defaultChecked disabled>
      <CheckboxIndicator className={indicatorAttrClass} />
    </Checkbox>

    <h2>Force mounted indicator</h2>
    <Checkbox className={rootAttrClass}>
      <CheckboxIndicator className={indicatorAttrClass} forceMount style={{ height: 20 }} />
    </Checkbox>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

const Label = (props: any) => <LabelPrimitive {...props} style={RECOMMENDED_CSS__LABEL__ROOT} />;

const RECOMMENDED_CSS__CHECKBOX__ROOT = {
  // better default alignment
  verticalAlign: 'middle',
};

const rootClass = css({
  ...RECOMMENDED_CSS__CHECKBOX__ROOT,
  border: '1px solid $gray300',
  width: 30,
  height: 30,
  padding: 4,

  '&:focus': {
    outline: 'none',
    borderColor: '$red',
    boxShadow: '0 0 0 1px $red',
  },

  '&[data-disabled]': {
    opacity: 0.3,
  },
});

const indicatorClass = css({
  backgroundColor: '$red',
  display: 'block',
  width: 20,
  height: 4,

  '&[data-state="checked"], &[data-state="unchecked"]': {
    height: 20,
  },
});

const fadeIn = css.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = css.keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const animatedIndicatorClass = css(indicatorClass, {
  transition: 'height 300ms',

  '&[data-state="checked"]': {
    animation: `${fadeIn} 1000ms ease-out`,
  },
  '&[data-state="unchecked"]': {
    animation: `${fadeOut} 1000ms ease-in`,
  },
});

const styles = {
  backgroundColor: 'rgba(0, 0, 255, 0.3)',
  border: '2px solid blue',
  padding: 10,

  '&[data-state="unchecked"]': { borderColor: 'red' },
  '&[data-state="checked"]': { borderColor: 'green' },
  '&[data-state="indeterminate"]': { borderColor: 'purple' },
  '&[data-disabled]': { borderStyle: 'dashed' },
  '&:disabled': { opacity: 0.5 },
};
const rootAttrClass = css(styles);
const indicatorAttrClass = css(styles);
