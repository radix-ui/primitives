import * as React from 'react';
import { Switch } from './Switch';
import { Label as LabelPrimitive } from '@interop-ui/react-label';
import { styled } from '../../../../stitches.config';
import { RECOMMENDED_CSS__LABEL__ROOT } from '../../label/src/Label.stories';

export default { title: 'Components/Switch' };

export const Styled = () => (
  <>
    <p>This switch is nested inside a label. The state is uncontrolled.</p>
    <Label>
      This is the label{' '}
      <Switch as={StyledRoot}>
        <Switch.Thumb as={StyledThumb} />
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
        as={StyledRoot}
        checked={checked}
        onCheckedChange={(event: any) => setChecked(event.target.checked)}
        id="randBox"
      >
        <Switch.Thumb as={StyledThumb} />
      </Switch>
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

      <Switch as={StyledRoot}>
        <Switch.Thumb as={StyledThumb} />
      </Switch>
    </form>
  );
};

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

const StyledRoot = styled('button', {
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
});

const RECOMMENDED_CSS__SWITCH__THUMB = {
  // ensures thumb is sizeable/can receive vertical margins
  display: 'inline-block',
  // ensures thumb is vertically centered
  verticalAlign: 'middle',
};

const StyledThumb = styled('span', {
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
