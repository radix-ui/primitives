import * as React from 'react';
import { Switch, SwitchThumb } from './Switch';
import { Label as LabelPrimitive } from '@radix-ui/react-label';
import { css } from '../../../../stitches.config';
import { RECOMMENDED_CSS__LABEL__ROOT } from '../../label/src/Label.stories';

export default { title: 'Components/Switch' };

export const Styled = () => (
  <>
    <p>This switch is nested inside a label. The state is uncontrolled.</p>
    <Label>
      This is the label{' '}
      <Switch className={rootClass}>
        <SwitchThumb className={thumbClass} />
      </Switch>
    </Label>
  </>
);

export const Controlled = () => {
  const [checked, setChecked] = React.useState(true);

  return (
    <>
      <p>This switch is placed adjacent to its label. The state is controlled.</p>
      <Label htmlFor="randBox">This is the label</Label>{' '}
      <Switch
        className={rootClass}
        checked={checked}
        onCheckedChange={(event: any) => setChecked(event.target.checked)}
        id="randBox"
      >
        <SwitchThumb className={thumbClass} />
      </Switch>
    </>
  );
};

export const WithinForm = () => {
  const [data, setData] = React.useState({ optional: false, required: false });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      onChange={(event) => {
        const input = event.target as HTMLInputElement;
        setData((prevData) => ({ ...prevData, [input.name]: input.checked }));
      }}
    >
      <p>optional checked: {String(data.optional)}</p>
      <Switch className={rootClass} name="optional">
        <SwitchThumb className={thumbClass} />
      </Switch>

      <p>required checked: {String(data.required)}</p>
      <Switch className={rootClass} name="required" required>
        <SwitchThumb className={thumbClass} />
      </Switch>

      <br />
      <br />

      <button>Submit</button>
    </form>
  );
};

export const Chromatic = () => (
  <>
    <h1>Uncontrolled</h1>
    <h2>Off</h2>
    <Switch className={rootClass}>
      <SwitchThumb className={thumbClass} />
    </Switch>

    <h2>On</h2>
    <Switch className={rootClass} defaultChecked>
      <SwitchThumb className={thumbClass} />
    </Switch>

    <h1>Controlled</h1>
    <h2>Off</h2>
    <Switch className={rootClass} checked={false}>
      <SwitchThumb className={thumbClass} />
    </Switch>

    <h2>On</h2>
    <Switch className={rootClass} checked>
      <SwitchThumb className={thumbClass} />
    </Switch>

    <h1>Disabled</h1>
    <Switch className={rootClass} disabled>
      <SwitchThumb className={thumbClass} />
    </Switch>

    <h1>State attributes</h1>
    <h2>Unchecked</h2>
    <Switch className={rootAttrClass}>
      <SwitchThumb className={thumbAttrClass} />
    </Switch>

    <h2>Checked</h2>
    <Switch className={rootAttrClass} defaultChecked>
      <SwitchThumb className={thumbAttrClass} />
    </Switch>

    <h2>Disabled</h2>
    <Switch className={rootAttrClass} defaultChecked disabled>
      <SwitchThumb className={thumbAttrClass} />
    </Switch>
  </>
);
Chromatic.parameters = { chromatic: { disable: false } };

const Label = (props: any) => <LabelPrimitive {...props} style={RECOMMENDED_CSS__LABEL__ROOT} />;

const WIDTH = 50;
const THUMB_WIDTH = 20;
const GAP = 4;

const RECOMMENDED_CSS__SWITCH__ROOT: any = {
  // better default alignment
  verticalAlign: 'middle',
  // ensures thumb is not horizontally centered (default in `button`)
  textAlign: 'left',
};

const rootClass = css({
  ...RECOMMENDED_CSS__SWITCH__ROOT,
  outline: 'none',
  border: 'none',
  width: WIDTH,
  padding: GAP,
  borderRadius: '9999px',
  backgroundColor: '$gray300',
  transition: 'background-color 166ms ease-out',

  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 2px $black',
  },

  '&[data-state="checked"]': {
    backgroundColor: '$red',
    borderColor: '$red',
  },

  '&[data-disabled]': { opacity: 0.5 },
});

const RECOMMENDED_CSS__SWITCH__THUMB = {
  // ensures thumb is sizeable/can receive vertical margins
  display: 'inline-block',
  // ensures thumb is vertically centered
  verticalAlign: 'middle',
};

const thumbClass = css({
  ...RECOMMENDED_CSS__SWITCH__THUMB,
  width: THUMB_WIDTH,
  height: THUMB_WIDTH,
  backgroundColor: '$white',
  borderRadius: '9999px',
  transition: 'transform 166ms ease-out',
  '&[data-state="checked"]': {
    transform: `translateX(${WIDTH - GAP * 2 - THUMB_WIDTH}px)`,
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
const thumbAttrClass = css(styles);
