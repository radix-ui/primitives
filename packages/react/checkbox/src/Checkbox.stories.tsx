import * as React from 'react';
import { css, keyframes } from '../../../../stitches.config';
import { Label as LabelPrimitive } from '@radix-ui/react-label';
import { RECOMMENDED_CSS__LABEL__ROOT } from '../../label/src/Label.stories';
import * as Checkbox from '@radix-ui/react-checkbox';

export default { title: 'Components/Checkbox' };

export const Styled = () => (
  <>
    <p>This checkbox is nested inside a label. The state is uncontrolled.</p>

    <h1>Custom label</h1>
    <Label>
      Label{' '}
      <Checkbox.Root className={rootClass()}>
        <Checkbox.Indicator className={indicatorClass()} />
      </Checkbox.Root>
    </Label>

    <br />
    <br />

    <h1>Native label</h1>
    <label>
      Label{' '}
      <Checkbox.Root className={rootClass()}>
        <Checkbox.Indicator className={indicatorClass()} />
      </Checkbox.Root>
    </label>

    <h1>Native label + native checkbox</h1>
    <label>
      Label <input type="checkbox" />
    </label>

    <h1>Custom label + htmlFor</h1>
    <Label htmlFor="one">Label</Label>
    <Checkbox.Root className={rootClass()} id="one">
      <Checkbox.Indicator className={indicatorClass()} />
    </Checkbox.Root>

    <br />
    <br />

    <h1>Native label + htmlFor</h1>
    <label htmlFor="two">Label</label>
    <Checkbox.Root className={rootClass()} id="two">
      <Checkbox.Indicator className={indicatorClass()} />
    </Checkbox.Root>

    <h1>Native label + native checkbox</h1>
    <label htmlFor="three">Label</label>
    <input type="checkbox" id="three" />
  </>
);

export const Controlled = () => {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>(true);

  return (
    <>
      <p>This checkbox is placed adjacent to its label. The state is controlled.</p>
      <Label htmlFor="randBox">Label</Label>{' '}
      <Checkbox.Root
        className={rootClass()}
        checked={checked}
        onCheckedChange={setChecked}
        id="randBox"
      >
        <Checkbox.Indicator className={indicatorClass()} />
      </Checkbox.Root>
    </>
  );
};

export const Indeterminate = () => {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>('indeterminate');

  return (
    <>
      <p>
        <Checkbox.Root className={rootClass()} checked={checked} onCheckedChange={setChecked}>
          <Checkbox.Indicator className={indicatorClass()} />
        </Checkbox.Root>
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
  const [data, setData] = React.useState({ optional: false, required: false, stopprop: false });
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>('indeterminate');

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      onChange={(event) => {
        const input = event.target as HTMLInputElement;
        setData((prevData) => ({ ...prevData, [input.name]: input.checked }));
      }}
    >
      <fieldset>
        <legend>optional checked: {String(data.optional)}</legend>
        <label>
          <Checkbox.Root
            className={rootClass()}
            name="optional"
            checked={checked}
            onCheckedChange={setChecked}
          >
            <Checkbox.Indicator className={indicatorClass()} />
          </Checkbox.Root>{' '}
          with label
        </label>
        <br />
        <br />

        <button
          type="button"
          onClick={() => {
            setChecked((prevChecked) => {
              return prevChecked === 'indeterminate' ? false : 'indeterminate';
            });
          }}
        >
          Toggle indeterminate
        </button>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>required checked: {String(data.required)}</legend>
        <Checkbox.Root className={rootClass()} name="required" required>
          <Checkbox.Indicator className={indicatorClass()} />
        </Checkbox.Root>
      </fieldset>

      <br />
      <br />

      <fieldset>
        <legend>stop propagation checked: {String(data.stopprop)}</legend>
        <Checkbox.Root
          className={rootClass()}
          name="stopprop"
          onClick={(event) => event.stopPropagation()}
        >
          <Checkbox.Indicator className={indicatorClass()} />
        </Checkbox.Root>
      </fieldset>

      <br />
      <br />

      <button type="reset">Reset</button>
      <button>Submit</button>
    </form>
  );
};

export const Animated = () => {
  const [checked, setChecked] = React.useState<boolean | 'indeterminate'>('indeterminate');

  return (
    <>
      <p>
        <Checkbox.Root className={rootClass()} checked={checked} onCheckedChange={setChecked}>
          <Checkbox.Indicator className={animatedIndicatorClass()} />
        </Checkbox.Root>
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
    <Checkbox.Root className={rootClass()}>
      <Checkbox.Indicator className={indicatorClass()} />
    </Checkbox.Root>

    <h2>Checked</h2>
    <Checkbox.Root className={rootClass()} defaultChecked>
      <Checkbox.Indicator className={indicatorClass()} />
    </Checkbox.Root>

    <h1>Controlled</h1>
    <h2>Unchecked</h2>
    <Checkbox.Root className={rootClass()} checked={false}>
      <Checkbox.Indicator className={indicatorClass()} />
    </Checkbox.Root>

    <h2>Checked</h2>
    <Checkbox.Root className={rootClass()} checked>
      <Checkbox.Indicator className={indicatorClass()} />
    </Checkbox.Root>

    <h1>Indeterminate</h1>
    <Checkbox.Root className={rootClass()} checked="indeterminate">
      <Checkbox.Indicator className={indicatorClass()} />
    </Checkbox.Root>

    <h1>Disabled</h1>
    <Checkbox.Root className={rootClass()} defaultChecked disabled>
      <Checkbox.Indicator className={indicatorClass()} />
    </Checkbox.Root>

    <h1>Force mounted indicator</h1>
    <Checkbox.Root className={rootClass()}>
      <Checkbox.Indicator className={indicatorClass()} forceMount style={{ height: 20 }} />
    </Checkbox.Root>

    <h1>State attributes</h1>
    <h2>Unchecked</h2>
    <Checkbox.Root className={rootAttrClass()}>
      <Checkbox.Indicator className={indicatorAttrClass()} />
    </Checkbox.Root>

    <h2>Checked</h2>
    <Checkbox.Root className={rootAttrClass()} defaultChecked>
      <Checkbox.Indicator className={indicatorAttrClass()} />
    </Checkbox.Root>

    <h2>Indeterminate</h2>
    <Checkbox.Root className={rootAttrClass()} checked="indeterminate">
      <Checkbox.Indicator className={indicatorAttrClass()} />
    </Checkbox.Root>

    <h2>Disabled</h2>
    <Checkbox.Root className={rootAttrClass()} defaultChecked disabled>
      <Checkbox.Indicator className={indicatorAttrClass()} />
    </Checkbox.Root>

    <h2>Force mounted indicator</h2>
    <Checkbox.Root className={rootAttrClass()}>
      <Checkbox.Indicator className={indicatorAttrClass()} forceMount style={{ height: 20 }} />
    </Checkbox.Root>
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
    boxShadow: '0 0 0 1px $colors$red',
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

const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = keyframes({
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
