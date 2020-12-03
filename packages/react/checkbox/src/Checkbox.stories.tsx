import * as React from 'react';
import { Label as LabelPrimitive } from '@interop-ui/react-label';
import { Checkbox, CheckboxIndicator } from './Checkbox';
import { styled, css } from '../../../../stitches.config';
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
      <Checkbox as={StyledRoot}>
        <CheckboxIndicator as={Indicator} />
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
        as={StyledRoot}
        checked={checked}
        onCheckedChange={(event) => setChecked(event.target.checked)}
        id="randBox"
      >
        <CheckboxIndicator as={Indicator} />
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
          as={StyledRoot}
          checked={checked}
          onCheckedChange={(event) => setChecked(event.target.checked)}
        >
          <CheckboxIndicator as={Indicator} indeterminate={checked === 'indeterminate'} />
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

      <Checkbox as={StyledRoot}>
        <CheckboxIndicator as={Indicator} />
      </Checkbox>
    </form>
  );
};

export const Animated = () => (
  <Label>
    Label{' '}
    <Checkbox as={StyledRoot}>
      <CheckboxIndicator as={AnimatedIndicator} />
    </Checkbox>
  </Label>
);

const Label = (props: any) => <LabelPrimitive {...props} style={RECOMMENDED_CSS__LABEL__ROOT} />;

const RECOMMENDED_CSS__CHECKBOX__ROOT = {
  // better default alignment
  verticalAlign: 'middle',
};

const StyledRoot = styled('button', {
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
});

const StyledIndicator = styled('span', {
  display: 'block',
  width: 20,
  height: 20,
  backgroundColor: '$red',
});

const Indicator = ({ indeterminate, ...props }: any) => (
  <StyledIndicator {...props} css={{ height: indeterminate ? 4 : undefined }} />
);

const fadeIn = css.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const fadeOut = css.keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const AnimatedIndicator = styled(StyledIndicator, {
  '&[data-state="checked"]': {
    animation: `${fadeIn} 300ms ease-out`,
  },
  '&[data-state="unchecked"]': {
    animation: `${fadeOut} 300ms ease-in`,
  },
});
